import serverClient from '../apiClient/serverClient';

/**
 * POST /api/repository/analyze
 */
export async function analyzeRepository(githubUrl) {
  const response = await serverClient.post('/repository/analyze', { githubUrl });
  return response.data;
}

/**
 * GET /api/repository/mine
 */
export async function getUserRepositories() {
  const response = await serverClient.get('/repository/mine');
  return response.data;
}

/**
 * GET /api/repository/summary/:id
 */
export async function getRepositorySummary(repositoryId) {
  const response = await serverClient.get(`/repository/summary/${repositoryId}`);
  return response.data;
}

/**
 * GET /api/repository/architecture/:id
 */
export async function getRepositoryArchitecture(repositoryId) {
  const response = await serverClient.get(`/repository/architecture/${repositoryId}`);
  return response.data;
}

/**
 * GET /api/chat/:repositoryId/messages
 */
export async function getChatMessages(repositoryId) {
  const response = await serverClient.get(`/chat/${repositoryId}/messages`);
  return response.data;
}

export function mapArchitectureOverview(analyzeResult, architecture) {
  const { repository, worker } = analyzeResult;
  const repoName = repository.github_url?.split('/').pop() || 'repository';
  const workerStats = worker?.stats ?? {};

  return {
    repositoryId: repository.id,
    githubUrl: repository.github_url,
    status: repository.status,
    name: repoName,
    frameworks: workerStats.frameworks ?? worker?.frameworks ?? [],
    languages: workerStats.languages ?? {},
    totalFiles: worker?.total_files ?? workerStats.total_files,
    statistics: architecture.statistics ?? {},
    entryPoints: architecture.entry_points ?? [],
    frontend: architecture.frontend ?? {},
    backend: architecture.backend ?? {},
  };
}

export function mapOverviewFromSummary(summary, architecture) {
  const { repository, stats, technologies } = summary;
  const repoName = repository.github_url?.split('/').pop() || 'repository';

  return {
    repositoryId: repository.id,
    githubUrl: repository.github_url,
    status: repository.status,
    name: repoName,
    frameworks: technologies ?? [],
    languages: stats?.languages ?? {},
    totalFiles: stats?.total_files,
    statistics: architecture.statistics ?? {},
    entryPoints: architecture.entry_points ?? [],
    frontend: architecture.frontend ?? {},
    backend: architecture.backend ?? {},
  };
}

export async function askRepositoryQuestion(repositoryId, question) {
  const response = await serverClient.post(`/ai/ask/${repositoryId}`, { question });
  return response.data;
}

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export function getRepositoryDisplayName(githubUrl) {
  if (!githubUrl) return 'Repository';
  const parts = githubUrl.replace(/\/$/, '').split('/');
  const name = parts[parts.length - 1];
  const owner = parts[parts.length - 2];
  return owner && name ? `${owner}/${name}` : name || githubUrl;
}
