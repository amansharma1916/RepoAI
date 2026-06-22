import React, { memo, useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getRepositoryDisplayName } from '../../services/dashboardService';

const RepositorySwitcher = memo(function RepositorySwitcher({
  repositories,
  activeRepositoryId,
  repositoryUrl,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const displayName = getRepositoryDisplayName(repositoryUrl);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (repoId) => {
    setOpen(false);
    if (repoId !== activeRepositoryId) {
      onSelect(repoId);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-dark-800/70 border border-dark-600 hover:border-accent/30 transition-colors max-w-full w-full sm:w-auto"
      >
        <svg className="w-4 h-4 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <span className="text-sm text-gray-300 truncate">{displayName}</span>
        {repositories.length > 1 && (
          <svg
            className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {open && repositories.length > 1 && (
        <div className="absolute left-0 right-0 sm:right-auto sm:min-w-[320px] top-full mt-2 py-2 rounded-xl bg-dark-800/95 backdrop-blur-xl border border-dark-600 shadow-2xl z-20 max-h-64 overflow-y-auto theme-scrollbar">
          {repositories.map((repo) => {
            const name = getRepositoryDisplayName(repo.github_url);
            const isActive = repo.id === activeRepositoryId;

            return (
              <button
                key={repo.id}
                type="button"
                onClick={() => handleSelect(repo.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                <span className="block truncate font-medium">{name}</span>
                {repo.last_message && (
                  <span className="block truncate text-xs text-gray-500 mt-0.5">{repo.last_message}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

const ChatContainer = memo(function ChatContainer({
  repositoryUrl,
  repositoryId,
  repositories,
  messages,
  onSendMessage,
  onSelectRepository,
  isSending,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
      <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-dark-600/50">
        <RepositorySwitcher
          repositories={repositories}
          activeRepositoryId={repositoryId}
          repositoryUrl={repositoryUrl}
          onSelect={onSelectRepository}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 theme-scrollbar">
        {messages.length === 0 && !isSending && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-400 text-sm max-w-sm">
              Ask anything about this repository — architecture, dependencies, where things are defined, and more.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isSending && (
          <div className="flex justify-start animate-fade-in">
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-dark-800/70 border border-dark-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-dark-600/50 bg-dark-900/50 backdrop-blur-sm">
        <ChatInput onSend={onSendMessage} isSending={isSending} />
      </div>
    </div>
  );
});

export default ChatContainer;
