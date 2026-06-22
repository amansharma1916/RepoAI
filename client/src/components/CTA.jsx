import React from 'react';

const CTA = () => {
  return (
    <section id="cta" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
          Get Started
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Understand<br />
          <span className="gradient-text">Any Codebase?</span>
        </h2>
        <p className="max-w-xl mx-auto text-lg text-gray-400 mb-10">
          Start chatting with repositories for free. No credit card required. Upgrade when you need more power.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 max-w-2xl mx-auto">
          {/* Free Plan */}
          <div className="relative p-6 lg:p-8 rounded-2xl bg-dark-800/50 border border-white/5 text-left">
            <div className="mb-4">
              <span className="text-sm text-gray-400 font-medium">Free</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">$0</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                5 repositories per month
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                100 questions per day
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Basic code understanding
              </li>
            </ul>
            <a
              href="#"
              className="block w-full text-center px-5 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors duration-200"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro Plan */}
          <div className="relative p-6 lg:p-8 rounded-2xl bg-dark-800 border border-accent/30 glow-border text-left">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-accent text-dark-900 text-xs font-bold">
                MOST POPULAR
              </span>
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-400 font-medium">Pro</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">$19</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Unlimited repositories
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Unlimited questions
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Advanced ML models
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
            </ul>
            <a
              href="#"
              className="block w-full text-center px-5 py-3 rounded-xl bg-accent text-dark-900 font-semibold hover:bg-accent-light transition-colors duration-200"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Setup in 30 seconds
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
};

export default CTA;
