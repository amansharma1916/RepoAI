import React, { memo } from 'react';
import { getRepositoryDisplayName } from '../../services/dashboardService';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

const RepositoryList = memo(function RepositoryList({
  repositories,
  loading,
  activeRepositoryId,
  onSelect,
  onAddNew,
}) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Loading repositories...
        </div>
      </div>
    );
  }

  if (!repositories.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">No Repositories Yet</h2>
        <p className="text-gray-400 text-center max-w-md text-sm sm:text-base mb-8">
          Analyze a GitHub repository from the Chat tab to start exploring and chatting with your code.
        </p>
        <button
          type="button"
          onClick={onAddNew}
          className="px-5 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
        >
          Analyze a Repository
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
      <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-dark-600/50 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Your Repositories</h2>
          <p className="text-sm text-gray-500 mt-0.5">{repositories.length} total</p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="shrink-0 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
        >
          Add New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 theme-scrollbar">
        {repositories.map((repo) => {
          const isActive = activeRepositoryId === repo.id;
          const displayName = getRepositoryDisplayName(repo.github_url);

          return (
            <button
              key={repo.id}
              type="button"
              onClick={() => onSelect(repo.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                isActive
                  ? 'bg-accent/10 border-accent/40 shadow-[0_0_20px_rgba(0,212,255,0.08)]'
                  : 'bg-dark-800/70 border-dark-600 hover:border-accent/30 hover:bg-dark-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="text-sm font-semibold text-white truncate">{displayName}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-1">{repo.github_url}</p>
                  {repo.last_message && (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{repo.last_message}</p>
                  )}
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                      repo.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {repo.status || 'pending'}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {formatRelativeTime(repo.last_message_at || repo.added_at)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default RepositoryList;
