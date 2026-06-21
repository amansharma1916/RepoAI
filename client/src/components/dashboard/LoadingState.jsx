import React, { memo } from 'react';

const SkeletonLine = memo(function SkeletonLine({ width = 'w-full', height = 'h-3' }) {
  return (
    <div
      className={`${width} ${height} rounded-lg bg-dark-600/80 animate-pulse`}
      aria-hidden="true"
    />
  );
});

const LoadingState = memo(function LoadingState() {
  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <h2 className="text-lg font-semibold text-white">Analyzing Repository...</h2>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full space-y-6">
        {/* Repository URL skeleton */}
        <div className="rounded-xl bg-dark-800/70 border border-dark-600 p-4">
          <SkeletonLine width="w-3/4" height="h-4" />
        </div>

        {/* Chat skeleton placeholders — ready for future animation */}
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="w-2/3 space-y-2">
              <SkeletonLine width="w-16" height="h-2" />
              <div className="rounded-2xl rounded-tr-sm bg-dark-700/60 border border-dark-600 p-4 space-y-2">
                <SkeletonLine />
                <SkeletonLine width="w-4/5" />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="w-3/4 space-y-2">
              <SkeletonLine width="w-20" height="h-2" />
              <div className="rounded-2xl rounded-tl-sm bg-dark-800/70 border border-dark-600 p-4 space-y-2">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine width="w-2/3" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-1/2 space-y-2">
              <SkeletonLine width="w-16" height="h-2" />
              <div className="rounded-2xl rounded-tr-sm bg-dark-700/60 border border-dark-600 p-4">
                <SkeletonLine width="w-3/4" />
              </div>
            </div>
          </div>
        </div>

        {/* Input skeleton */}
        <div className="mt-auto pt-4">
          <div className="rounded-xl bg-dark-800/70 border border-dark-600 p-4">
            <SkeletonLine height="h-10" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoadingState;
