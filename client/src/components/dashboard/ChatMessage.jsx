import React, { memo } from 'react';

const ChatMessage = memo(function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${isUser ? 'order-1' : ''}`}>
        <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-xs font-medium ${isUser ? 'text-gray-500' : 'text-accent'}`}>
            {isUser ? 'You' : 'RepoAI'}
          </span>
        </div>
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser
              ? 'bg-accent/10 border border-accent/20 text-white rounded-tr-sm'
              : 'bg-dark-800/70 border border-dark-600 text-gray-300 rounded-tl-sm'
            }
          `}
        >
          {/* TODO: Add markdown rendering support */}
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
