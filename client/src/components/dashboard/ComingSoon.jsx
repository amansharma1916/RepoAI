import React, { memo } from 'react';

const ComingSoon = memo(function ComingSoon({ title, description }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">{title}</h2>
      <p className="text-gray-400 text-center max-w-md text-sm sm:text-base">{description}</p>
      <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700/80 border border-accent/20">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-sm text-gray-300 font-medium">Coming Soon</span>
      </div>
    </div>
  );
});

export default ComingSoon;
