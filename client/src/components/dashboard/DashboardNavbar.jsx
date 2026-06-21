import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardTabs from './DashboardTabs';
import { img } from 'framer-motion/client';

const DashboardNavbar = memo(function DashboardNavbar({
  activeTab,
  onTabChange,
  onToggleOverview,
  showOverviewToggle,
}) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const displayName = user?.name || user?.username || user?.email?.split('@')[0] || 'User';
  const initials = user?.name?.split(' ').map(name => name[0]).join('');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem] gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            {showOverviewToggle && (
              <button
                type="button"
                onClick={onToggleOverview}
                className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700/50"
                aria-label="Toggle overview panel"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
            )}
            <a href="/dashboard" className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-bold tracking-tight">
                Repo<span className="text-accent">AI</span>
              </span>
            </a>
          </div>

          {/* Tabs - center on desktop */}
          <div className="flex-1 flex justify-center min-w-0">
            <DashboardTabs activeTab={activeTab} onTabChange={onTabChange} />
          </div>

          {/* Profile */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-dark-700/50 transition-colors duration-200"
              aria-label="Profile menu"
            >
              <span className="hidden sm:block text-sm text-gray-300 font-medium truncate max-w-[120px]">
                {displayName}
              </span>
              <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                {user?.avatar_url ? <img src={user?.avatar_url} alt={initials} className="w-full h-full rounded-full" /> : <span className="text-xs font-bold text-accent">{initials}</span>}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl bg-dark-800/95 backdrop-blur-xl border border-dark-600 shadow-2xl animate-fade-in">
                <div className="px-4 py-2 border-b border-dark-600">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  {user?.email && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                >
                  Profile Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default DashboardNavbar;
