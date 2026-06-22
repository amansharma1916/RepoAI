import React, { memo } from 'react';

const BenefitList = memo(function BenefitList({ items, accent = false }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
          <svg
            className={`w-5 h-5 shrink-0 mt-0.5 ${accent ? 'text-accent' : 'text-gray-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
});

const UsageMeter = memo(function UsageMeter({ label, used, limit }) {
  const percentage = limit ? Math.min((used / limit) * 100, 100) : 0;

  return (
    <div className="rounded-xl bg-dark-700/40 border border-dark-600/50 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-medium text-white">
          {used}
          {limit !== null ? ` / ${limit}` : ' / Unlimited'}
        </span>
      </div>
      {limit !== null && (
        <div className="h-2 rounded-full bg-dark-600 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
});

const PlansPanel = memo(function PlansPanel({
  planStatus,
  loading,
  checkoutLoading,
  error,
  successMessage,
  onCheckout,
  onClearError,
}) {
  if (loading || !planStatus) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Loading plans...
        </div>
      </div>
    );
  }

  const isPro = planStatus.plan === 'pro';
  const freeBenefits = planStatus.benefits?.free ?? [];
  const proBenefits = planStatus.benefits?.pro ?? [];

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
      <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-dark-600/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Plans & Pricing</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              You are currently on the{' '}
              <span className={isPro ? 'text-accent font-medium' : 'text-white font-medium'}>
                {planStatus.planName}
              </span>{' '}
              plan
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
              isPro
                ? 'bg-accent/10 text-accent border border-accent/30'
                : 'bg-dark-700 text-gray-300 border border-dark-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isPro ? 'bg-accent' : 'bg-gray-500'}`} />
            {isPro ? 'Pro Active' : 'Free Plan'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 theme-scrollbar">
        {!isPro && planStatus.freePlanExpiresAt && (
          <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
            <p className="text-sm text-amber-200">
              Free plan data resets after 24 hours. Your current data expires on{' '}
              {new Date(planStatus.freePlanExpiresAt).toLocaleString()}.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-start justify-between gap-3">
            <p className="text-sm text-red-200">{error}</p>
            <button
              type="button"
              onClick={onClearError}
              className="text-red-300 hover:text-white text-sm shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
            <p className="text-sm text-emerald-200">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <UsageMeter
            label="Repositories used"
            used={planStatus.usage?.repositories ?? 0}
            limit={planStatus.limits?.maxRepositories ?? null}
          />
          <div className="rounded-xl bg-dark-700/40 border border-dark-600/50 p-4">
            <span className="text-sm text-gray-400">Messages per repository</span>
            <p className="text-sm font-medium text-white mt-2">
              {isPro
                ? 'Unlimited'
                : `Up to ${planStatus.limits?.maxMessagesPerRepo ?? 20} messages per repository`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-dark-800/70 border border-dark-600 p-6">
            <div className="mb-4">
              <span className="text-sm text-gray-400 font-medium">Free</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">₹0</span>
              </div>
            </div>
            <BenefitList items={freeBenefits} />
            {!isPro && (
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-700 border border-dark-600 text-xs text-gray-300">
                Current plan
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-dark-800 border border-accent/30 glow-border p-6 relative">
            <div className="absolute -top-3 left-6">
              <span className="px-3 py-1 rounded-full bg-accent text-dark-900 text-xs font-bold">
                REPOAI PRO
              </span>
            </div>
            <div className="mb-4 mt-2">
              <span className="text-sm text-gray-400 font-medium">RepoAI Pro</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">
                  {planStatus.proAmountDisplay || '—'}
                </span>
                <span className="text-gray-500 text-sm">one-time</span>
              </div>
            </div>
            <BenefitList items={proBenefits} accent />
            <div className="mt-6">
              {isPro ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-medium">
                  You are on RepoAI Pro
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onCheckout}
                  disabled={checkoutLoading || !planStatus.proAmountPaise}
                  className="w-full px-5 py-3 rounded-xl bg-accent text-dark-900 font-semibold hover:bg-accent-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? 'Opening checkout...' : 'Upgrade to RepoAI Pro'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PlansPanel;
