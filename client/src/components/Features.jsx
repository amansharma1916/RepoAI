import React from 'react';
import HeroBackground from './HeroBackground';


const features = [
  {
    title: 'Natural Language Queries',
    description: 'Ask questions in plain English and get instant answers.',
    position: 'top-left',
  },
  {
    title: 'Deep Code Understanding',
    description: 'Analyzes functions, classes and dependencies.',
    position: 'top-right',
  },
  {
    title: 'Repository Search',
    description: 'Find symbols, files and implementations instantly.',
    position: 'middle-left',
  },
  {
    title: 'Architecture Analysis',
    description: 'Understand how the entire codebase is structured.',
    position: 'middle-right',
  },
  {
    title: 'Smart References',
    description: 'Every answer includes source files and line numbers.',
    position: 'bottom-left',
  },
  {
    title: 'Private & Secure',
    description: 'Repository data remains protected and isolated.',
    position: 'bottom-right',
  },
];

const FeatureNode = ({ title, description }) => (
  <div className="group relative">
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]">
      <h3 className="text-white font-semibold text-lg mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const Features = () => {
  return (
    
    <section
      id="features"
      className="relative py-32 overflow-hidden"
    >

      <HeroBackground />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-blue-400 uppercase tracking-widest text-sm font-semibold">
            Features
          </span>

          <h2 className="mt-4 text-5xl font-bold text-white">
            Explore Your Repository
            <br />
            Like a Knowledge Graph
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-gray-400 text-lg">
            Every capability is connected through RepoAI's intelligent
            understanding engine.
          </p>
        </div>

        {/* Graph Layout */}
        <div className="relative max-w-6xl mx-auto h-[900px]">

          {/* Connection Lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="25%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="2"
            />

            <line
              x1="75%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="2"
            />

            <line
              x1="20%"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="2"
            />

            <line
              x1="80%"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="2"
            />

            <line
              x1="25%"
              y1="80%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="2"
            />

            <line
              x1="75%"
              y1="80%"
              x2="50%"
              y2="50%"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="2"
            />
          </svg>

          {/* Center Node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-64 h-64 rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 backdrop-blur-xl flex flex-col justify-center items-center text-center shadow-[0_0_100px_rgba(59,130,246,0.3)]">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">
                  AI
                </span>
              </div>

              <h3 className="text-white text-2xl font-bold">
                RepoAI
              </h3>

              <p className="text-gray-300 text-sm mt-2 px-6">
                Repository Intelligence Engine
              </p>
            </div>
          </div>

          {/* Top Left */}
          <div className="absolute left-0 top-0 w-80">
            <FeatureNode {...features[0]} />
          </div>

          {/* Top Right */}
          <div className="absolute right-0 top-0 w-80">
            <FeatureNode {...features[1]} />
          </div>

          {/* Middle Left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80">
            <FeatureNode {...features[2]} />
          </div>

          {/* Middle Right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80">
            <FeatureNode {...features[3]} />
          </div>

          {/* Bottom Left */}
          <div className="absolute left-0 bottom-0 w-80">
            <FeatureNode {...features[4]} />
          </div>

          {/* Bottom Right */}
          <div className="absolute right-0 bottom-0 w-80">
            <FeatureNode {...features[5]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;