import React from 'react';

const words = [
  'AI',
  'RepoAI',
  'Machine Learning',
  'Chat with Repository',
  'Code Intelligence',
  'Natural Language',
  'GitHub',
  'Deep Understanding',
  'Instant Answers',
  'Code Explorer',
  'Neural Networks',
  'Smart Search',
  'Developer Tools',
  'Open Source',
];

const WordMarquee = () => {
  // Duplicate words for seamless infinite scroll
  const allWords = [...words, ...words, ...words];

  return (
    <section className="relative py-8 overflow-hidden border-y border-white/5 bg-dark-800/30">
      {/* First row - scrolling left */}
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee-left whitespace-nowrap">
          {allWords.map((word, index) => (
            <div
              key={`left-${index}`}
              className="flex items-center mx-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/10 hover:text-accent/40 transition-colors duration-300 cursor-default select-none">
                {word}
              </span>
              <span className="ml-6 text-accent/20">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
        <div className="flex animate-marquee-left whitespace-nowrap" aria-hidden="true">
          {allWords.map((word, index) => (
            <div
              key={`left-dup-${index}`}
              className="flex items-center mx-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/10 hover:text-accent/40 transition-colors duration-300 cursor-default select-none">
                {word}
              </span>
              <span className="ml-6 text-accent/20">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Second row - scrolling right */}
      <div className="relative flex overflow-hidden mt-4">
        <div className="flex animate-marquee-right whitespace-nowrap">
          {[...allWords].reverse().map((word, index) => (
            <div
              key={`right-${index}`}
              className="flex items-center mx-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/10 hover:text-accent/40 transition-colors duration-300 cursor-default select-none">
                {word}
              </span>
              <span className="ml-6 text-accent/20">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-1.036.259a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
        <div className="flex animate-marquee-right whitespace-nowrap" aria-hidden="true">
          {[...allWords].reverse().map((word, index) => (
            <div
              key={`right-dup-${index}`}
              className="flex items-center mx-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white/10 hover:text-accent/40 transition-colors duration-300 cursor-default select-none">
                {word}
              </span>
              <span className="ml-6 text-accent/20">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-1.036.259a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WordMarquee;
