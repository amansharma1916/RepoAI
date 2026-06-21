import React, { memo } from 'react';
import RepositoryInput from './RepositoryInput';

const EmptyState = memo(function EmptyState({ onSubmit, error, onClearError }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700/80 border border-accent/20 mb-8">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-sm text-gray-300 font-medium">Start Analyzing a Repository</span>
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-3">
        Paste a <span className="gradient-text">GitHub Repository</span>
      </h2>
      <p className="text-gray-400 text-center max-w-md mb-10 text-sm sm:text-base">
        Enter any public GitHub repository URL to analyze its structure, dependencies, and
        architecture — then chat with it using AI.
      </p>

      <RepositoryInput onSubmit={onSubmit} error={error} onClearError={onClearError} large />
    </div>
  );
});

export default EmptyState;
