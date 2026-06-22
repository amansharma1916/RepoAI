import React, { memo } from 'react';

const StatItem = memo(function StatItem({ label, value, badge }) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-dark-700/40 border border-dark-600/50">
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
      {badge ? (
        <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-accent/10 border border-accent/20 text-accent capitalize w-fit">
          {value}
        </span>
      ) : (
        <span className="text-[15px] font-semibold text-white truncate">{value}</span>
      )}
    </div>
  );
});

const BadgeList = memo(function BadgeList({ items }) {
  if (!items?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="px-2.5 py-1 rounded-md text-xs bg-accent/10 border border-accent/20 text-accent"
        >
          {item}
        </span>
      ))}
    </div>
  );
});

const SectionTitle = memo(function SectionTitle({ children }) {
  return (
    <h3 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2 first:mt-0">
      {children}
    </h3>
  );
});

const PathList = memo(function PathList({ items, emptyLabel = 'None', maxVisible = 4 }) {
  if (!items?.length) {
    return <p className="text-sm text-gray-500 italic">{emptyLabel}</p>;
  }

  const visible = items.slice(0, maxVisible);
  const remaining = items.length - maxVisible;

  return (
    <ul className="space-y-1">
      {visible.map((item) => {
        const label = typeof item === 'string' ? item : item.name || item.file_path;
        const key = typeof item === 'string' ? item : `${item.name}-${item.file_path}`;

        return (
          <li
            key={key}
            className="text-xs text-gray-300 font-mono bg-dark-700/50 border border-dark-600 rounded-md px-2 py-1.5 truncate"
            title={typeof item === 'string' ? item : item.file_path}
          >
            {label}
          </li>
        );
      })}
      {remaining > 0 && (
        <li className="text-xs text-gray-500 pl-1">+{remaining} more</li>
      )}
    </ul>
  );
});

const OverviewPanel = memo(function OverviewPanel({ overview, isEmpty }) {
  const stats = overview?.statistics ?? {};
  const languages = overview?.languages ? Object.keys(overview.languages) : [];
  const primaryLanguage = languages[0];

  return (
    <aside className="h-full min-h-0 w-full flex flex-col">
      <div className="bg-dark-800/70 backdrop-blur-xl border border-dark-600 rounded-2xl overflow-hidden h-full min-h-0 flex flex-col glow-border">
        <div className="shrink-0 px-5 py-4 border-b border-dark-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h2 className="text-base font-semibold text-white uppercase tracking-wider">
              Overview
            </h2>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 theme-scrollbar">
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
              <p className="text-base text-gray-400 font-medium">No Repository Selected</p>
              <p className="text-sm text-gray-500 mt-1.5 max-w-[240px]">
                Enter a GitHub URL to view repository details
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-2">
                <StatItem label="Name" value={overview?.name} />
                <StatItem label="ID" value={overview?.repositoryId} />
                <StatItem label="Language" value={primaryLanguage} badge />
                <StatItem label="Status" value={overview?.status} badge />
              </div>

              {overview?.frameworks?.length > 0 && (
                <div className="mt-4 pb-3 border-b border-dark-600/50">
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider">Frameworks</span>
                  <div className="mt-2">
                    <BadgeList items={overview.frameworks} />
                  </div>
                </div>
              )}

              <SectionTitle>Statistics</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                <StatItem label="Files" value={stats.files?.toLocaleString()} />
                <StatItem label="Symbols" value={stats.symbols?.toLocaleString()} />
                <StatItem label="Dependencies" value={stats.dependencies?.toLocaleString()} />
                <StatItem label="Entry Points" value={stats.total_entry_points?.toLocaleString()} />
              </div>

              <SectionTitle>Backend</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                <StatItem label="Routes" value={stats.backend_routes?.toLocaleString()} />
                <StatItem label="Models" value={stats.backend_models?.toLocaleString()} />
                <StatItem label="Controllers" value={stats.backend_controllers?.toLocaleString()} />
              </div>

              {overview?.backend?.routes?.length > 0 && (
                <div className="mt-2">
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider">Route Files</span>
                  <div className="mt-1.5">
                    <PathList items={overview.backend.routes} />
                  </div>
                </div>
              )}

              <SectionTitle>Frontend</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                <StatItem label="Components" value={stats.frontend_components?.toLocaleString()} />
                <StatItem label="Contexts" value={stats.frontend_contexts?.toLocaleString()} />
                <StatItem label="Services" value={stats.frontend_services?.toLocaleString()} />
                <StatItem label="Providers" value={stats.frontend_providers?.toLocaleString()} />
              </div>

              {overview?.frontend?.components?.length > 0 && (
                <div className="mt-2">
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider">Components</span>
                  <div className="mt-1.5">
                    <PathList items={overview.frontend.components} />
                  </div>
                </div>
              )}

              {overview?.entryPoints?.length > 0 && (
                <>
                  <SectionTitle>Entry Points</SectionTitle>
                  <PathList items={overview.entryPoints} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
});

export default OverviewPanel;
