# RepoAI — Repository Analysis with RAG

> Detailed technical overview of this project: what it does, how it does it, architecture flow, technologies, and how to run it.

## 1. What Does This Project Do?

**RepoAI converts any Git repository into an AI-powered knowledge base.**

Understanding large codebases is time-consuming — searching files, tracing dependencies, learning architecture, onboarding. RepoAI solves this by letting developers ask natural-language questions about a codebase and get accurate, code-grounded answers.

### Core capabilities

- **Repository ingestion:** Paste a GitHub URL (`https://github.com/<owner>/<repo>`) and RepoAI clones, scans, and indexes it. Re-adding an existing URL reuses the cached analysis and just links it to the user.
- **Automatic code analysis:** Extracts functions, classes, methods, routes, components, imports using Tree-sitter; builds dependency graphs, reverse-dependency graphs, trace trees, and architecture overviews.
- **Semantic code search:** Finds relevant code chunks by meaning (cosine similarity), not just keyword match.
- **AI repository chat:** Asks e.g. “Where is auth defined?”, “How does payment flow work?” — answers are grounded only in retrieved repo context, with file/path citations. Short lookup questions are answered directly from the symbol index.
- **Repository explorer:** File tree (`repository_files` → `buildTree`), file list, per-file content, per-file dependencies/dependents, stats (file counts, sizes, languages), detected frameworks/technologies.
- **Multi-user + production concerns:** JWT auth (local email/password with bcrypt + Google OAuth), per-user repository list with last-chat preview, chat history (`chat_sessions` / `chat_messages`), Razorpay billing with free-plan repository/message limits and expired-data cleanup.

### User-facing routes

- Public: `/`, `/login`, `/signup`, `/legal`, `/about`
- Protected: `/dashboard`, `/dashboard/chat/:repositoryId`

## 2. How It Does It

Three cooperating services share one PostgreSQL database:

```
React Frontend (client/)
  ↓ REST /api/* (JWT in Authorization header)
Express Backend (server/ :5000)
  ↓ axios workerClient (baseURL = $Worker)
FastAPI Worker (worker/ :8000) — heavy lifting
  ↓ SQL via psycopg2
PostgreSQL + pgvector (single shared DB)
  + Google Gemini for final answer generation
```

### A. Ingestion pipeline (`POST /api/repository` → worker)

1. **Validate + quota:** `server/src/repository/repository.controller.js:analyzeRepository` validates GitHub URL regex, calls `cleanupExpiredFreeUserData`, `checkRepositoryLimit`, `userAlreadyLinkedToRepository`. If URL already in `repositories`, just `linkUserToRepository` + `getOrCreateChatSession` and return `existing: true`.
2. **Clone + scan:** `INSERT INTO repositories (github_url)` → `POST /repository/clone {githubUrl, repositoryId}` → `worker/services/initializeRepo/service.py`:
   - `git_service.clone_repository(url, id)` → `repositories/<id>/`
   - `scanner.scan_repository(path)` → file list (path, name, extension, size)
   - `framework_detector.detect_frameworks(path)` → e.g. React, Express, FastAPI
   - Saves via `file_repository.save_repository_files`, `stats.generate_stats` → `stats_repository.save_repository_stats`, `technology_repository.save_technologies`.
3. **Deep analysis:** `POST /repo-analysis/analyze/{id}` → `worker/services/analysis/analysis_router.py` → `AnalysisService.analyze_repository(id, repo_path)` (`worker/services/analysis/tree_sitter/analysis_service.py`):
   - `RepositorySymbolIndexer.index_repository` — Tree-sitter parse per language (`language_registry`, `parser_service`, `symbol_extractor`) → symbols: `function, class, method, component, route, import`.
   - `DependencyExtractor.extract` → `DependencyResolver.resolve` → `DependencyGraph.build` + `ReverseDependencyGraph.build`.
   - Persist: `SymbolRepository.save_symbols`, `DependencyRepository.save_dependencies`.
   - `RepositoryChunkGenerator.generate(id, path, symbols)` → semantic chunks (function/class-level with surrounding context) → `ChunkRepository.save_chunks`.
   - `EmbeddingGenerator.generate_repository_embeddings(id)` — encodes each chunk with `BAAI/bge-base-en-v1.5` (`normalize_embeddings=True` in `services/embedding/embedding_service.py`) and stores vectors for pgvector search.
4. **Mark complete:** Server sets `repositories.status='completed'`, links user ↔ repo (`user_repositories`), creates chat session.

### B. Question-answering pipeline / RAG (`POST /api/ai/:repository_id` → worker `/ai/ask/{id}`)

1. **Auth + quota + history:** `server/src/ai/ai.controller.js:askQuestion` checks `question` non-empty, `cleanupExpiredFreeUserData`, `checkMessageLimit`, `getOrCreateChatSession`, inserts `user` row in `chat_messages`.
2. **Worker `AskService.ask()`** (`worker/ai/chat/ask_service.py`):
   - **Fast path — symbol lookup:** if question contains `where/find/locate/defined/definition/path`, `_try_symbol_lookup` strips stop-words, searches `SymbolRepository.search_symbols` per word, returns `"<name> is a <kind> defined in <path> (language: <lang>)"`.
   - **Full RAG path otherwise:**
     - `RetrievalService.semantic_search(id, question, limit=5)` (`services/retrieval/retrieval_service.py`): embed query with same BGE model → `EmbeddingRepository.semantic_search` → pgvector cosine-similarity top-5 chunks (`chunk_id, chunk_type, chunk_name, file_path, content, score`).
     - Build context: `File: … / Name: … / Type: … / <content[:1000]>` joined with `\n\n`.
     - Prompt Gemini: `You are RepoAI… Use only the provided repository context… If not present say "I could not find enough information…" Keep under 10 sentences. Be concise and focus only on code flow.`
     - `LLMService.generate(prompt)` (`worker/ai/llm/llm_service.py`) calls `genai.Client(models.generate_content(model="gemini-2.5-flash"))`.
3. **Persist + return:** Server inserts `assistant` row, updates `chat_sessions.updated_at`, returns `{answer, userMessage, assistantMessage}`. Chat history fetched via `GET /api/chat/:repository_id` (`chat.controller.js:getChatMessages`).

### C. Supporting flows

- **Auth:** `POST /api/auth/signup|login|google` → `auth.controller.js` (bcrypt + `jsonwebtoken.sign({userId,email}, JWT_SECRET, 7d)`; Google via `auth.service.js:verifyGoogleToken`) → `auth.middleware.js` guards all `/api/repository|ai|chat`.
- **Billing:** `billing.controller.js` + `razorpay.service.js` + `subscription.service.js` (`plans.config.js`) enforce repo/message limits; `GET /api/repository` also prunes expired free-user data.
- **Explorer APIs:** `GET /api/repository/:id/overview|tree|files|architecture` — overview/tree/files read Postgres directly; architecture proxies `GET /repo-analysis/architecture/{id}` (`ArchitectureService`).

## 3. Flow of Overall Architecture

### High-level diagram

```text
                +-----------------+
                | React Frontend  |
                | Vite :5173      |
                +--------+--------+
                         | axios VITE_SERVER_BASE_URL=http://localhost:5000/api
                         | JWT Bearer
                +--------v--------+
                | Express Backend |
                | Node :5000      |
                | /api/repository |
                | /api/auth       |
                | /api/ai         |
                | /api/chat       |
                | /api (billing)  |
                +--------+--------+
                         | axios Worker=http://localhost:8000
                +--------v--------+
                | FastAPI Worker  |
                | Python :8000    |
                | /repository     |
                | /repo-analysis  |
                | /semantic-search|
                | /ai             |
                +--------+--------+
                         |
            +------------v------------+
            | PostgreSQL + pgvector   |
            | repos, files, stats,    |
            | symbols, deps, chunks,  |
            | embeddings, users,      |
            | chat_sessions/messages  |
            +-------------------------+
                         +
                         | top-5 chunks + prompt
                +--------v--------+
                | Gemini 2.5 Flash|
                | final answer    |
                +-----------------+
```

### Sequence: ingest a repository

```text
User (Dashboard) → POST /api/repository {githubUrl}
  → Express: validate, quota, INSERT repositories
  → POST worker /repository/clone → clone → scan → save files/stats/techs
  → POST worker /repo-analysis/analyze/{id} → symbols → deps → graphs → chunks → embeddings
  → UPDATE repositories status=completed → link user → create chat session
  → 201 {repository, existing:false}
```

### Sequence: ask a question

```text
User (Chat) → POST /api/ai/:repoId {question}
  → Express: quota, getOrCreateChatSession, save user msg
  → POST worker /ai/ask/{repoId} {question}
    → lookup-keyword? → symbol search → direct answer
    → else: embed query → pgvector top-5 → build context → Gemini 2.5 Flash → answer
  → save assistant msg → 200 {answer, userMessage, assistantMessage}
```

### Key directories

- `server/src/repository/` — ingest + overview/tree/files/architecture proxy
- `server/src/ai/`, `server/src/chat/` — ask + history
- `server/src/auth/`, `server/src/middleware/`, `server/src/billing/` — users, JWT guard, Razorpay/plans
- `server/src/database/db.js` (`pg.Pool`), `server/src/workerClient/workerClient.js`
- `worker/services/initializeRepo/` — `repoClone/git_service`, `repoStats/scanner|stats|framework_detector|file_repository`
- `worker/services/analysis/tree_sitter/` — `repository_symbol_indexer|symbol_extractor|dependency_extractor|dependency_resolver|dependency_graph|reverse_dependency_graph|analysis_service`
- `worker/services/analysis/` — `analysis_router|architecture_service|graph_service|trace_service|chunk/*|*_repository`
- `worker/services/embedding/` — `embedding_service (BGE)` + `embedding_generator|embedding_repository`
- `worker/services/retrieval/`, `worker/services/semantic_search/` — vector search
- `worker/ai/` — `ask_ai_router|chat/ask_service|llm/llm_service`
- `client/src/` — `pages/DashboardPage`, `components/*`, `apiClient/`, `services/`, `hooks/`, `layouts/`, `protection/`

## 4. Technologies Used

| Layer | Technology | Purpose / where |
|---|---|---|
| Frontend | React 19, React DOM, react-router-dom 7 | SPA, public + protected routes (`client/src/App.jsx`) |
| Frontend | TypeScript 5.9, Vite 8, @vitejs/plugin-react | Build/dev server (`:5173`), `tsc -b && vite build` |
| Frontend | Tailwind CSS 3.4, PostCSS, autoprefixer | Styling (`tailwind.config.js`, `index.css`) |
| Frontend | axios, framer-motion, react-icons, @react-oauth/google | API calls, animations, icons, Google login |
| Frontend | ESLint + react-hooks/refresh plugins | Lint (`npm run lint`) |
| Backend | Node.js + Express 5 | REST API (`server/server.js` `:5000`, `express.json()` + `cors({origin: CLIENT_URL})`) |
| Backend | pg 8 (node-postgres) | `Pool` to Postgres (`src/database/db.js`) |
| Backend | jsonwebtoken 9, bcrypt 6, google-auth-library 10 | JWT 7d sessions, password hashing, Google token verify |
| Backend | axios, dotenv, Razorpay 2.9, nodemon 3 | Worker proxy, env, payments, dev reload (`npm start`) |
| Worker | Python + FastAPI + Uvicorn | Analysis API (`worker/app.py` `:8000`, 4 routers) |
| Worker | Tree-sitter 0.25 + tree-sitter-language-pack 1.8 | Multi-language parsing, symbol/dependency extraction |
| Worker | Sentence-Transformers 5.6, torch 2.12, transformers 5.12 | `BAAI/bge-base-en-v1.5` embeddings, normalized |
| Worker | GitPython 3.1, networkx 3.6, scikit-learn, numpy/scipy | Clone, graph building, similarity helpers |
| Worker | psycopg2-binary, python-dotenv, pydantic | Postgres access (`database/postgres.py`), env, request models |
| Worker | google-genai 2.9 (`google.genai`) | `LLMService` → `gemini-2.5-flash` generation |
| Data | PostgreSQL + pgvector | Shared store: repos/files/symbols/deps/chunks/embeddings/users/chats; vector cosine search |
| Auth/Billing | JWT, Google OAuth, Razorpay | Login/signup, plan limits (`plans.config.js`, `subscription.service.js`) |
| Other | Vercel (`client/vercel.json`), demo videos (`demo/*.mp4`), screenshots (`public/*.png`) | Frontend deploy, product demo assets |

## 5. How to Run

### Prerequisites

- Node.js 18+ + npm
- Python 3.10+ + pip (worker uses torch/sentence-transformers — allow extra install time/disk)
- PostgreSQL 14+ with **pgvector extension** enabled + a database (default name `repoai`)
- API keys: `GEMINI_API_KEY`, Google OAuth Client ID/Secret, Razorpay Key ID/Secret (test keys OK), any `JWT_SECRET`

### 1) Database

```sql
CREATE DATABASE repoai;
\c repoai
CREATE EXTENSION IF NOT EXISTS vector;
```

Create tables expected by the code (`repositories`, `repository_files`, `repository_stats`, `repository_technologies`, `symbols`, `dependencies`, `chunks`/`embeddings`, `users`, `user_repositories`, `chat_sessions`, `chat_messages`, plus billing/subscription tables). The server health check queries a `test` table — create it or adjust `server.js:/health` if you just need a smoke test.

### 2) Worker (FastAPI :8000)

```bash
cd worker
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# create .env (keys only — never commit real values):
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=repoai
# DB_USER=<db-user>
# DB_PASSWORD=<db-password>
# GEMINI_API_KEY=<your-gemini-key>
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
# smoke: GET http://localhost:8000/ → {"message":"Repository Worker Running"}
#        GET http://localhost:8000/health → {"status":"healthy"}
```

### 3) Server (Express :5000)

```bash
cd server
npm install
# create .env:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=repoai
# DB_USER=<db-user>
# DB_PASSWORD=<db-password>
# CLIENT_URL=http://localhost:5173
# Worker=http://localhost:8000
# JWT_SECRET=<long-random-string>
# GOOGLE_CLIENT_ID=<id>.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=<secret>
# RAZORPAY_KEY_ID=<rzp_test_...>
# RAZORPAY_KEY_SECRET=<secret>
# RAZORPAY_PRO_AMOUNT=9900
npm start   # nodemon server.js → http://localhost:5000
# smoke: GET / → {"message":"Repository Server Running"}
#        GET /health → {"status":"healthy","database":"connected"}
```

### 4) Client (Vite :5173)

```bash
cd client
npm install
# create .env:
# VITE_SERVER_BASE_URL=http://localhost:5000/api
# VITE_GOOGLE_CLIENT_ID=<same-as-server>.apps.googleusercontent.com
# VITE_GOOGLE_CLIENT_SECRET=<secret>
# VITE_RAZORPAY_KEY_ID=<rzp_test_...>
npm run dev      # → http://localhost:5173
npm run build    # production build (tsc -b && vite build)
npm run preview  # preview dist/
npm run lint     # eslint .
```

### 5) End-to-end check

1. Open `http://localhost:5173` → Sign up / Login (or Google).
2. Dashboard → paste `https://github.com/<owner>/<repo>` → Analyze → wait for `completed` (clone + `analyze/{id}` can take minutes on large repos — embeddings run on CPU/GPU).
3. Open chat ` /dashboard/chat/:repositoryId` → ask “Where is X defined?” (symbol fast-path) and “How does Y work?” (full RAG).
4. If `403 REPOSITORY_LIMIT_REACHED` / `MESSAGE_LIMIT_REACHED`, upgrade plan or clean expired free data (automatic via `cleanupExpiredFreeUserData`).

### Ports / env summary

| Service | Default URL | Key env |
|---|---|---|
| Client | `http://localhost:5173` | `VITE_SERVER_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_RAZORPAY_KEY_ID` |
| Server | `http://localhost:5000` | `DB_*`, `CLIENT_URL`, `Worker`, `JWT_SECRET`, `GOOGLE_*`, `RAZORPAY_*` |
| Worker | `http://localhost:8000` | `DB_*`, `GEMINI_API_KEY` |
| DB | `localhost:5432 / repoai` | `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD` + pgvector |

> Note: existing `.env` files in this checkout contain local dev secrets — rotate them and use placeholders above for any shared/staged environment.

psql -h localhost -U aman -d repoai
# password: developer
Useful commands once inside
\dt                          -- list all 14 tables
\d users                     -- describe one table
SELECT * FROM test LIMIT 1;  -- same query server.js /health runs
SELECT id, email, plan FROM users;
SELECT id, github_url, status FROM repositories;
\q           