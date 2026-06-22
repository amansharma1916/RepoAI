import React, { memo, useCallback, useRef, useState } from 'react';

const ChatInput = memo(function ChatInput({ onSend, disabled = false, isSending = false }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!message.trim() || disabled || isSending) return;
      onSend(message);
      setMessage('');
      requestAnimationFrame(() => textareaRef.current?.focus());
    },
    [message, onSend, disabled, isSending],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const isEmpty = !message.trim();

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 bg-dark-800/70 backdrop-blur-xl border border-dark-600 rounded-xl p-2 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/30 transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about this repository..."
          disabled={disabled}
          rows={1}
          className="
            flex-1 resize-none bg-transparent text-white placeholder-gray-500
            focus:outline-none text-sm py-2.5 px-3 max-h-32 theme-scrollbar
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        <button
          type="submit"
          disabled={isEmpty || disabled || isSending}
          onMouseDown={(e) => e.preventDefault()}
          className="
            shrink-0 w-10 h-10 flex items-center justify-center
            rounded-lg bg-accent text-dark-900 font-semibold
            hover:bg-accent-light transition-colors duration-200
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent
          "
          aria-label="Send message"
        >
          {isSending ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
});

export default ChatInput;
