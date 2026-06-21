import React, { useCallback, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import OverviewPanel from '../components/dashboard/OverviewPanel';
import EmptyState from '../components/dashboard/EmptyState';
import LoadingState from '../components/dashboard/LoadingState';
import ChatContainer from '../components/dashboard/ChatContainer';
import ComingSoon from '../components/dashboard/ComingSoon';
import {
  DASHBOARD_STATUS,
  DASHBOARD_TABS,
  useRepository,
} from '../hooks/useRepository';

const DashboardPage = () => {
  const {
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
  } = useRepository();

  const handleClearError = useCallback(() => setError(''), [setError]);

  const handleToggleOverview = useCallback(() => {
    setOverviewOpen((prev) => !prev);
  }, [setOverviewOpen]);

  const showOverviewToggle = status !== DASHBOARD_STATUS.EMPTY;
  const isOverviewEmpty = status === DASHBOARD_STATUS.EMPTY || status === DASHBOARD_STATUS.ANALYZING;

  const workspaceContent = useMemo(() => {
    if (activeTab === DASHBOARD_TABS.REPOSITORY) {
      return (
        <ComingSoon
          title="Repository Explorer"
          description="Browse files, trace dependencies, and visualize architecture — all from one place. This feature is under development."
        />
      );
    }

    if (activeTab === DASHBOARD_TABS.PLANS) {
      return (
        <ComingSoon
          title="Plans & Pricing"
          description="Flexible plans for individuals and teams. Manage your subscription and usage limits here."
        />
      );
    }

    if (status === DASHBOARD_STATUS.EMPTY) {
      return (
        <EmptyState
          onSubmit={submitRepository}
          error={error}
          onClearError={handleClearError}
        />
      );
    }

    if (status === DASHBOARD_STATUS.ANALYZING) {
      return <LoadingState />;
    }

    return (
      <ChatContainer
        repositoryUrl={repositoryUrl}
        messages={messages}
        onSendMessage={sendMessage}
        isSending={isSending}
      />
    );
  }, [
    activeTab,
    status,
    submitRepository,
    error,
    handleClearError,
    repositoryUrl,
    messages,
    sendMessage,
    isSending,
  ]);

  return (
    <DashboardLayout>
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleOverview={handleToggleOverview}
        showOverviewToggle={showOverviewToggle}
      />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Mobile overview drawer */}
        {overviewOpen && (
          <div className="lg:hidden fixed inset-0 z-30">
            <button
              type="button"
              className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm"
              onClick={() => setOverviewOpen(false)}
              aria-label="Close overview"
            />
            <div className="absolute top-16 left-0 right-0 bottom-0 p-4 animate-slide-up">
              <OverviewPanel overview={overview} isEmpty={isOverviewEmpty} />
            </div>
          </div>
        )}

        {/* Desktop / tablet overview sidebar */}
        <div className="hidden lg:block shrink-0 w-64 xl:w-72 p-4 lg:p-5 lg:pr-0">
          <OverviewPanel overview={overview} isEmpty={isOverviewEmpty} />
        </div>

        {/* Mobile overview collapsed card */}
        <div className="lg:hidden px-4 pt-3">
          {!overviewOpen && showOverviewToggle && (
            <button
              type="button"
              onClick={() => setOverviewOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-dark-800/70 border border-dark-600 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm font-medium text-white">Overview</span>
              </div>
              <span className="text-xs text-gray-500">
                {isOverviewEmpty ? 'No repository' : overview?.name}
              </span>
            </button>
          )}
        </div>

        {/* Main workspace */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 p-4 lg:p-5">
          <div className="flex-1 flex flex-col min-h-0 bg-dark-800/40 backdrop-blur-sm border border-dark-600 rounded-2xl overflow-hidden">
            {workspaceContent}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
