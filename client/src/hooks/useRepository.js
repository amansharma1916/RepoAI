import { useCallback, useState } from 'react';
import {
  analyzeRepository,
  askRepositoryQuestion,
  getChatHistory,
  getRepositoryOverview,
} from '../services/dashboardService';

export const DASHBOARD_STATUS = {
  EMPTY: 'empty',
  ANALYZING: 'analyzing',
  LOADED: 'loaded',
};

export const DASHBOARD_TABS = {
  CHAT: 'chat',
  REPOSITORY: 'repository',
  PLANS: 'plans',
};

export function useRepository() {
  const [status, setStatus] = useState(DASHBOARD_STATUS.EMPTY);
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [overview, setOverview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.CHAT);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [overviewOpen, setOverviewOpen] = useState(false);

  const submitRepository = useCallback(async (url) => {
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
    setStatus(DASHBOARD_STATUS.ANALYZING);
    setOverview(null);
    setMessages([]);
    setActiveTab(DASHBOARD_TABS.CHAT);

    try {
      await analyzeRepository(trimmedUrl);
      const [overviewData, chatHistory] = await Promise.all([
        getRepositoryOverview(trimmedUrl),
        getChatHistory(trimmedUrl),
      ]);
      setOverview(overviewData);
      setMessages(chatHistory);
      setStatus(DASHBOARD_STATUS.LOADED);
    } catch {
      setError('Failed to analyze repository. Please try again.');
      setStatus(DASHBOARD_STATUS.EMPTY);
      setRepositoryUrl('');
    }
  }, []);

  const sendMessage = useCallback(
    async (content) => {
      const trimmedContent = content.trim();
      if (!trimmedContent || status !== DASHBOARD_STATUS.LOADED) return;

      const userMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content: trimmedContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);

      try {
        const response = await askRepositoryQuestion(repositoryUrl, trimmedContent);
        setMessages((prev) => [...prev, response]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_${Date.now()}_error`,
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [repositoryUrl, status],
  );

  return {
    status,
    repositoryUrl,
    overview,
    messages,
    activeTab,
    isSending,
    error,
    overviewOpen,
    setActiveTab,
    setOverviewOpen,
    submitRepository,
    sendMessage,
    setError,
  };
}
