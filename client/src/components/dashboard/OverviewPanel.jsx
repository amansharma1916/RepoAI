import React, { memo } from 'react';

const StatItem = memo(function StatItem({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-dark-600/50 last:border-0">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      {badge ? (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/20 text-accent">
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-white text-right max-w-[60%] truncate">
          {value}
        </span>
      )}
    </div>
  );
});

const OverviewPanel = memo(function OverviewPanel({ overview, isEmpty }) {
  return (
    <aside className="h-full flex flex-col">
      <div className="bg-dark-800/70 backdrop-blur-xl border border-dark-600 rounded-2xl overflow-hidden h-full flex flex-col glow-border">
        <div className="px-5 py-4 border-b border-dark-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Overview
            </h2>
          </div>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-dark-700/80 border border-dark-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-400 font-medium">No Repository Selected</p>
              <p className="text-xs text-gray-500 mt-1.5 max-w-[200px]">
                Enter a GitHub URL to view repository details
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* TODO: Replace with Repository Overview API */}
              <StatItem label="Repository Name" value={overview?.name} />
              <StatItem label="Repository ID" value={overview?.id} />
              <StatItem label="Primary Language" value={overview?.primaryLanguage} badge />
              <StatItem label="Framework" value={overview?.framework} badge />
              <StatItem
                label="Files Count"
                value={overview?.filesCount?.toLocaleString()}
              />
              <StatItem
                label="Symbols Count"
                value={overview?.symbolsCount?.toLocaleString()}
              />
              <StatItem
                label="Dependencies"
                value={overview?.dependenciesCount?.toLocaleString()}
              />
              <StatItem label="Analysis Status" value={overview?.analysisStatus} badge />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
});

export default OverviewPanel;
