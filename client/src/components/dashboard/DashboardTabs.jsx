import React, { memo } from 'react';
import { DASHBOARD_TABS } from '../../hooks/useRepository';

const TABS = [
  { id: DASHBOARD_TABS.CHAT, label: 'Chat' },
  { id: DASHBOARD_TABS.REPOSITORY, label: 'Repository' },
  { id: DASHBOARD_TABS.PLANS, label: 'Plans' },
];

const DashboardTabs = memo(function DashboardTabs({ activeTab, onTabChange }) {
  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-dark-800/70 backdrop-blur-sm border border-dark-600">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200
              ${isActive
                ? 'bg-accent text-dark-900 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

export default DashboardTabs;
