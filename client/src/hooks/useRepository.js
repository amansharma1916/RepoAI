import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  analyzeRepository,
  askRepositoryQuestion,
  getApiErrorMessage,
  getChatMessages,
  getRepositoryArchitecture,
  getRepositorySummary,
  getUserRepositories,
  mapOverviewFromSummary,
} from '../services/dashboardService';

export const DASHBOARD_STATUS = {
  EMPTY: 'empty',
  ANALYZING: 'analyzing',
  LOADING: 'loading',
  LOADED: 'loaded',
};

export const DASHBOARD_TABS = {
  CHAT: 'chat',
  REPOSITORY: 'repository',
  PLANS: 'plans',
};

export function useRepository() {
  const { repositoryId: routeRepoId } = useParams();
  const navigate = useNavigate();
  const loadRequestRef = useRef(0);

  const [status, setStatus] = useState(DASHBOARD_STATUS.EMPTY);
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [repositoryId, setRepositoryId] = useState(null);
  const [overview, setOverview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [repositoriesLoading, setRepositoriesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.CHAT);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [overviewOpen, setOverviewOpen] = useState(false);

  const refreshRepositories = useCallback(async () => {
    try {
      const result = await getUserRepositories();
      setRepositories(result.repositories ?? []);
    } catch (err) {
      console.error('Failed to load repositories', err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setRepositoriesLoading(true);
      try {
        const result = await getUserRepositories();
        if (!cancelled) {
          setRepositories(result.repositories ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load repositories', err);
        }
      } finally {
        if (!cancelled) {
          setRepositoriesLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadRepository = useCallback(
    async (repoId, { analyzing = false } = {}) => {
      const requestId = ++loadRequestRef.current;

      setError('');
      setRepositoryId(repoId);
      setStatus(analyzing ? DASHBOARD_STATUS.ANALYZING : DASHBOARD_STATUS.LOADING);
      setMessages([]);
      setOverview(null);

      try {
        const [summary, architecture, chatData] = await Promise.all([
          getRepositorySummary(repoId),
          getRepositoryArchitecture(repoId),
          getChatMessages(repoId),
        ]);

        if (requestId !== loadRequestRef.current) return;

        const overviewData = mapOverviewFromSummary(summary, architecture);

        setRepositoryUrl(summary.repository.github_url);
        setOverview(overviewData);
        setMessages(chatData.messages ?? []);
        setStatus(DASHBOARD_STATUS.LOADED);
      } catch (err) {
        if (requestId !== loadRequestRef.current) return;

        setError(getApiErrorMessage(err, 'Failed to load repository.'));
        setStatus(DASHBOARD_STATUS.EMPTY);
        setRepositoryId(null);
        setRepositoryUrl('');
        navigate('/dashboard', { replace: true });
      }
    },
    [navigate],
  );

  useEffect(() => {
    if (!routeRepoId) {
      if (status === DASHBOARD_STATUS.ANALYZING) {
        return;
      }

      setStatus(DASHBOARD_STATUS.EMPTY);
      setRepositoryId(null);
      setRepositoryUrl('');
      setOverview(null);
      setMessages([]);
      return;
    }

    const parsedId = Number(routeRepoId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (repositoryId === parsedId && status === DASHBOARD_STATUS.LOADED) {
      return;
    }

    loadRepository(parsedId, { analyzing: status === DASHBOARD_STATUS.ANALYZING });
  }, [routeRepoId, loadRepository, navigate, repositoryId, status]);

  const selectRepository = useCallback(
    (repoId) => {
      setActiveTab(DASHBOARD_TABS.CHAT);
      navigate(`/dashboard/chat/${repoId}`);
    },
    [navigate],
  );

  const submitRepository = useCallback(
    async (url) => {
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        setError('Please enter a GitHub repository URL');
        return;
      }

      const githubPattern = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/;
      if (!githubPattern.test(trimmedUrl)) {
        setError('Please enter a valid GitHub repository URL');
        return;
      }

      setError('');
      setRepositoryUrl(trimmedUrl);
      setRepositoryId(null);
      setStatus(DASHBOARD_STATUS.ANALYZING);
      setOverview(null);
      setMessages([]);
      setActiveTab(DASHBOARD_TABS.CHAT);

      try {
        const analyzeResult = await analyzeRepository(trimmedUrl);

        if (!analyzeResult?.success || !analyzeResult?.repository?.id) {
          throw new Error('Invalid analyze response');
        }

        const repoId = analyzeResult.repository.id;

        await refreshRepositories();
        navigate(`/dashboard/chat/${repoId}`, { replace: true });
      } catch (err) {
        const message = getApiErrorMessage(err, 'Failed to analyze repository. Please try again.');
        setError(message);
        setStatus(DASHBOARD_STATUS.EMPTY);
        setRepositoryUrl('');
        setRepositoryId(null);
        navigate('/dashboard', { replace: true });
      }
    },
    [navigate, refreshRepositories],
  );

  const sendMessage = useCallback(
    async (content) => {
      const trimmedContent = content.trim();
      if (!trimmedContent || status !== DASHBOARD_STATUS.LOADED || !repositoryId) return;

      const optimisticUserMessage = {
        id: `temp_${Date.now()}_user`,
        role: 'user',
        content: trimmedContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticUserMessage]);
      setIsSending(true);

      try {
        const response = await askRepositoryQuestion(repositoryId, trimmedContent);

        setMessages((prev) => {
          const withoutOptimistic = prev.filter((msg) => msg.id !== optimisticUserMessage.id);
          const next = [...withoutOptimistic];

          if (response.userMessage) {
            next.push(response.userMessage);
          } else {
            next.push(optimisticUserMessage);
          }

          if (response.assistantMessage) {
            next.push(response.assistantMessage);
          } else {
            next.push({
              id: `msg_${Date.now()}`,
              role: 'assistant',
              content: String(response.answer ?? ''),
              timestamp: new Date().toISOString(),
            });
          }

          return next;
        });

        refreshRepositories();
      } catch (err) {
        const limitMessage = getApiErrorMessage(
          err,
          'Sorry, something went wrong. Please try again.',
        );

        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== optimisticUserMessage.id),
          optimisticUserMessage,
          {
            id: `msg_${Date.now()}_error`,
            role: 'assistant',
            content: limitMessage,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [repositoryId, status, refreshRepositories],
  );

  return {
    status,
    repositoryUrl,
    repositoryId,
    overview,
    messages,
    repositories,
    repositoriesLoading,
    activeTab,
    isSending,
    error,
    overviewOpen,
    setActiveTab,
    setOverviewOpen,
    submitRepository,
    sendMessage,
    selectRepository,
    setError,
  };
}
