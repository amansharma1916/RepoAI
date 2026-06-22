import React, { useState } from 'react';
import HeroBackground from './HeroBackground';

const Hero = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const githubPattern = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/;
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    if (!githubPattern.test(repoUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    setError('');
    window.location.href = `/chat?repo=${encodeURIComponent(repoUrl)}`;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Animated Canvas Background */}
      <HeroBackground />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ zIndex: 2, backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 10 }}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700/80 border border-accent/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm text-gray-300 font-medium">Powered by Advanced Machine Learning</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
          <span className="text-white">Chat with Any</span>
          <br />
          <span className="gradient-text animate-gradient-x">GitHub Repository</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          RepoAI uses machine learning to understand your codebase. Paste a GitHub link and ask questions in natural language — get instant, intelligent answers about any repository.
        </p>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mb-12 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
                setError('');
              }}
              placeholder="https://github.com/username/repository"
              className="w-full pl-12 pr-36 py-4 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-accent text-dark-900 font-semibold rounded-lg hover:bg-accent-light transition-colors duration-200 text-sm"
            >
              Chat Now
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400 text-left">{error}</p>
          )}
        </form>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">100+</div>
            <div className="text-sm text-gray-500 mt-1">Repos Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">50+</div>
            <div className="text-sm text-gray-500 mt-1">Questions Answered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">99%</div>
            <div className="text-sm text-gray-500 mt-1">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
