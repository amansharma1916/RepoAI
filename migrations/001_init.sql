-- RepoAI initial schema — reverse-engineered from server/src + worker/services queries.
-- No migration files shipped with the repo, so this file is the source of truth.
-- Run: PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_init.sql
-- Safe to re-run: all statements use IF NOT EXISTS / ON CONFLICT-proof DDL.

CREATE EXTENSION IF NOT EXISTS vector;

-- Users (auth.addUser.js, subscription.service.js)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(20) NOT NULL DEFAULT 'local',
  provider_id VARCHAR(255),
  password_hash TEXT,
  plan VARCHAR(20) NOT NULL DEFAULT 'free',
  free_plan_started_at TIMESTAMPTZ DEFAULT NOW(),
  pro_upgraded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users (plan);

-- Repositories (repository.controller.js)
CREATE TABLE IF NOT EXISTS repositories (
  id SERIAL PRIMARY KEY,
  github_url TEXT UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User <-> repository links (repository.access.js, subscription.service.js)
CREATE TABLE IF NOT EXISTS user_repositories (
  user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, repository_id)
);
CREATE INDEX IF NOT EXISTS idx_user_repos_user ON user_repositories (user_id);
CREATE INDEX IF NOT EXISTS idx_user_repos_repo ON user_repositories (repository_id);

-- Chat sessions (repository.access.js getOrCreateChatSession)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, repository_id)
);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_repo ON chat_sessions (repository_id);

-- Chat messages (ai.controller.js, chat.controller.js, subscription.service.js)
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INT NOT NULL REFERENCES chat_sessions (id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages (session_id, role);

-- Repository files (worker file_repository.py, repository.controller.js)
CREATE TABLE IF NOT EXISTS repository_files (
  id SERIAL PRIMARY KEY,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  file_name TEXT,
  file_path TEXT NOT NULL,
  extension VARCHAR(20),
  size BIGINT
);
CREATE INDEX IF NOT EXISTS idx_repo_files_repo ON repository_files (repository_id);
CREATE INDEX IF NOT EXISTS idx_repo_files_path ON repository_files (repository_id, file_path);

-- Repository stats (worker stats_repository.py, UPSERT on repository_id)
CREATE TABLE IF NOT EXISTS repository_stats (
  repository_id INT PRIMARY KEY REFERENCES repositories (id) ON DELETE CASCADE,
  total_files INT,
  total_folders INT,
  total_size BIGINT,
  languages JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repository technologies (worker technology_repository.py)
CREATE TABLE IF NOT EXISTS repository_technologies (
  id SERIAL PRIMARY KEY,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  technology_name TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_repo_tech_repo ON repository_technologies (repository_id);

-- Symbols (worker symbol_repository.py)
CREATE TABLE IF NOT EXISTS repository_symbols (
  id SERIAL PRIMARY KEY,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  symbol_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  language VARCHAR(50),
  parent_symbol TEXT,
  start_line INT,
  end_line INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_symbols_repo ON repository_symbols (repository_id);
CREATE INDEX IF NOT EXISTS idx_symbols_repo_type ON repository_symbols (repository_id, symbol_type);
CREATE INDEX IF NOT EXISTS idx_symbols_repo_name ON repository_symbols (repository_id, lower(name));

-- Dependencies (worker dependency_repository.py)
CREATE TABLE IF NOT EXISTS repository_dependencies (
  id SERIAL PRIMARY KEY,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  source_file TEXT NOT NULL,
  target TEXT,
  resolved_path TEXT,
  dependency_type VARCHAR(50),
  is_internal BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deps_repo ON repository_dependencies (repository_id);
CREATE INDEX IF NOT EXISTS idx_deps_source ON repository_dependencies (repository_id, source_file);
CREATE INDEX IF NOT EXISTS idx_deps_resolved ON repository_dependencies (repository_id, resolved_path);

-- Chunks (worker chunk_repository.py, metadata stored as JSON text in code)
CREATE TABLE IF NOT EXISTS repository_chunks (
  id SERIAL PRIMARY KEY,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  symbol_id INT,
  chunk_type TEXT,
  chunk_name TEXT,
  file_path TEXT,
  content TEXT,
  start_line INT,
  end_line INT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chunks_repo ON repository_chunks (repository_id);
CREATE INDEX IF NOT EXISTS idx_chunks_name ON repository_chunks (repository_id, lower(chunk_name));

-- Embeddings (worker embedding_repository.py)
-- BAAI/bge-base-en-v1.5 outputs 768 dimensions, normalized (normalize_embeddings=True).
CREATE TABLE IF NOT EXISTS repository_embeddings (
  id SERIAL PRIMARY KEY,
  repository_id INT NOT NULL REFERENCES repositories (id) ON DELETE CASCADE,
  chunk_id INT NOT NULL REFERENCES repository_chunks (id) ON DELETE CASCADE,
  model_name TEXT NOT NULL DEFAULT 'BAAI/bge-base-en-v1.5',
  embedding vector(768) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_embeddings_repo ON repository_embeddings (repository_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_chunk ON repository_embeddings (chunk_id);
-- Cosine-similarity ANN index for semantic_search (e.embedding <=> $1::vector).
-- HNSW works with empty tables and grows with data.
CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw
  ON repository_embeddings USING hnsw (embedding vector_cosine_ops);

-- Payments (billing.controller.js)
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  amount INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'created',
  razorpay_payment_id TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments (razorpay_order_id);

-- Health-check table used by server.js GET /health (SELECT * FROM test).
-- Kept minimal and preserved if it already exists.
CREATE TABLE IF NOT EXISTS test (
  id SERIAL PRIMARY KEY
);
