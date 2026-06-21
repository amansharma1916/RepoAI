import React, { memo, useCallback, useState } from 'react';

const RepositoryInput = memo(function RepositoryInput({
  onSubmit,
  error,
  onClearError,
  large = false,
}) {
  const [url, setUrl] = useState('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(url);
    },
    [onSubmit, url],
  );

  const handleChange = useCallback(
    (e) => {
      setUrl(e.target.value);
      onClearError?.();
    },
    [onClearError],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${large ? 'max-w-2xl' : 'max-w-full'}`}
    >
      <div
        className={`
          relative group
          ${large ? 'glow-border rounded-2xl p-1' : ''}
        `}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="https://github.com/username/repository"
            className={`
              w-full pl-12 sm:pl-14 pr-14 sm:pr-16
              bg-dark-800 border border-dark-600 rounded-xl text-white
              placeholder-gray-500 focus:outline-none focus:border-accent/50
              focus:ring-1 focus:ring-accent/30 transition-all duration-200
              ${large ? 'py-4 sm:py-5 text-base sm:text-lg rounded-2xl' : 'py-3 text-sm'}
            `}
          />
          <button
            type="submit"
            className={`
              absolute right-2 top-1/2 -translate-y-1/2
              flex items-center justify-center
              bg-accent text-dark-900 font-semibold rounded-lg
              hover:bg-accent-light transition-colors duration-200
              ${large ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-9 h-9'}
            `}
            aria-label="Analyze repository"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
      )}
    </form>
  );
});

export default RepositoryInput;
