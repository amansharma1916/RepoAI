import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import OverviewPanel from '../components/dashboard/OverviewPanel';
import EmptyState from '../components/dashboard/EmptyState';
import LoadingState from '../components/dashboard/LoadingState';
import ChatContainer from '../components/dashboard/ChatContainer';
import RepositoryList from '../components/dashboard/RepositoryList';
import PlansPanel from '../components/dashboard/PlansPanel';
import {
  DASHBOARD_STATUS,
  DASHBOARD_TABS,
  useRepository,
} from '../hooks/useRepository';
import { useBilling } from '../hooks/useBilling';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
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
  } = useRepository();

  const {
    planStatus,
    loading: planLoading,
    checkoutLoading,
    error: billingError,
    successMessage,
    setError: setBillingError,
    startCheckout,
  } = useBilling();

  const handleClearBillingError = useCallback(() => setBillingError(''), [setBillingError]);
  const handleClearError = useCallback(() => setError(''), [setError]);

  const handleToggleOverview = useCallback(() => {
    setOverviewOpen((prev) => !prev);
  }, [setOverviewOpen]);

  const handleAddNewRepository = useCallback(() => {
    setActiveTab(DASHBOARD_TABS.CHAT);
    navigate('/dashboard');
  }, [navigate, setActiveTab]);

  const showOverviewToggle = status !== DASHBOARD_STATUS.EMPTY;
  const isOverviewEmpty =
    status === DASHBOARD_STATUS.EMPTY ||
    status === DASHBOARD_STATUS.ANALYZING ||
    status === DASHBOARD_STATUS.LOADING;

  const workspaceContent = useMemo(() => {
    if (activeTab === DASHBOARD_TABS.REPOSITORY) {
      return (
        <RepositoryList
          repositories={repositories}
          loading={repositoriesLoading}
          activeRepositoryId={repositoryId}
          onSelect={selectRepository}
          onAddNew={handleAddNewRepository}
        />
      );
    }

    if (activeTab === DASHBOARD_TABS.PLANS) {
      return (
        <PlansPanel
          planStatus={planStatus}
          loading={planLoading}
          checkoutLoading={checkoutLoading}
          error={billingError}
          successMessage={successMessage}
          onCheckout={startCheckout}
          onClearError={handleClearBillingError}
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

    if (status === DASHBOARD_STATUS.LOADING) {
      return (
        <div className="flex-1 flex items-center justify-center animate-fade-in">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Loading chat...
          </div>
        </div>
      );
    }

    return (
      <ChatContainer
        repositoryUrl={repositoryUrl}
        repositoryId={repositoryId}
        repositories={repositories}
        messages={messages}
        onSendMessage={sendMessage}
        onSelectRepository={selectRepository}
        isSending={isSending}
      />
    );
  }, [
    activeTab,
    status,
    repositories,
    repositoriesLoading,
    repositoryId,
    selectRepository,
    handleAddNewRepository,
    submitRepository,
    error,
    handleClearError,
    repositoryUrl,
    messages,
    sendMessage,
    isSending,
    planLoading,
    planStatus,
    billingError,
    successMessage,
    checkoutLoading,
    startCheckout,
    handleClearBillingError,
  ]);

  // Handler for close on mobile overview close button
  const handleOverviewClose = useCallback(() => {
    setOverviewOpen(false);
  }, [setOverviewOpen]);

  return (
    <DashboardLayout>
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleOverview={handleToggleOverview}
        showOverviewToggle={showOverviewToggle}
        planStatus={planStatus}
      />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden h-full">
        {overviewOpen && (
          <div className="lg:hidden fixed inset-0 z-30">
            {/* Background overlay remains for blur and dismiss if needed */}
            <button
              type="button"
              className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm"
              onClick={handleOverviewClose}
              aria-label="Close overview"
              tabIndex={-1}
            />
            <div className="absolute top-16 left-0 right-0 bottom-0 p-4 animate-slide-up flex flex-col min-h-0 z-40">
              <div className="bg-dark-800/70 backdrop-blur-xl border border-dark-600 rounded-2xl overflow-hidden h-full min-h-0 flex flex-col glow-border relative">
                <div className="shrink-0 px-5 py-4 border-b border-dark-600 relative flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 cursor-pointer select-none"
                    style={{ userSelect: 'none' }}
                    onClick={handleOverviewClose}
                  >
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <h2 className="text-sm font-small text-white tracking-wider">
                      {repositoryUrl.toLowerCase()}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="ml-4 p-1.5 rounded hover:bg-dark-600 focus:bg-dark-700 border border-transparent hover:border-dark-500 focus:outline-none transition-colors"
                    aria-label="Close overview panel"
                    onClick={handleOverviewClose}
                    style={{ marginRight: -8 }}
                  >
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* OverviewPanel body */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 theme-scrollbar">
                  <OverviewPanel overview={overview} isEmpty={isOverviewEmpty} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="hidden lg:flex shrink-0 w-[400px] xl:w-[500px] p-4 lg:p-5 lg:pr-0 min-h-0 self-stretch">
          <OverviewPanel overview={overview} isEmpty={isOverviewEmpty} />
        </div>
   

        <div className="lg:hidden shrink-0 px-4 pt-3">
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

        <main className="flex-1 flex flex-col min-h-0 min-w-0 p-4 lg:p-5 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 bg-dark-800/40 backdrop-blur-sm border border-dark-600 rounded-2xl overflow-hidden">
            {workspaceContent}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
