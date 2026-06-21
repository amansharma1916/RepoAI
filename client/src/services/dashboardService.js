// TODO: Replace mock data with real API integration

const MOCK_OVERVIEW = {
  name: 'react',
  id: 'repo_8f3a2b1c',
  primaryLanguage: 'JavaScript',
  framework: 'React',
  filesCount: 1842,
  symbolsCount: 12450,
  dependenciesCount: 87,
  analysisStatus: 'Complete',
};

const MOCK_CHAT_HISTORY = [
  {
    id: 'msg_1',
    role: 'user',
    content: 'What authentication system does this repository use?',
    timestamp: '2026-06-21T10:00:00Z',
  },
  {
    id: 'msg_2',
    role: 'assistant',
    content:
      'This repository uses JWT-based authentication with middleware validation. Token generation happens in the auth service layer, and protected routes are guarded via Express middleware in auth.middleware.ts.',
    timestamp: '2026-06-21T10:00:05Z',
  },
  {
    id: 'msg_3',
    role: 'user',
    content: 'How is state management handled in the frontend?',
    timestamp: '2026-06-21T10:01:00Z',
  },
  {
    id: 'msg_4',
    role: 'assistant',
    content:
      'The frontend uses a combination of React Context and custom hooks for state management. Global app state is managed through providers, while component-level state uses useState and useReducer patterns.',
    timestamp: '2026-06-21T10:01:08Z',
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * TODO: Connect to Repository Analysis API
 * POST /api/repositories/analyze
 */
export async function analyzeRepository(repositoryUrl) {
  await delay(2500);
  return {
    success: true,
    repositoryUrl,
    status: 'analyzed',
  };
}

/**
 * TODO: Replace with Repository Overview API
 * GET /api/repositories/:id/overview
 */
export async function getRepositoryOverview(repositoryUrl) {
  await delay(300);
  const repoName = repositoryUrl.split('/').pop() || 'repository';
  return {
    ...MOCK_OVERVIEW,
    name: repoName,
    repositoryUrl,
  };
}

/**
 * TODO: Connect Ask Repository API
 * POST /api/repositories/:id/ask
 */
export async function askRepositoryQuestion(repositoryUrl, question) {
  await delay(800);
  return {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    content: `Based on my analysis of ${repositoryUrl.split('/').pop()}, here's what I found regarding your question: "${question}". The codebase follows modern patterns with well-structured modules and clear separation of concerns.`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * TODO: Replace with Chat History API
 * GET /api/repositories/:id/chat
 */
export async function getChatHistory(repositoryUrl) {
  await delay(200);
  return MOCK_CHAT_HISTORY.map((msg) => ({
    ...msg,
    repositoryUrl,
  }));
}
