// Maintenance / production popup flag.
//
// Local dev: popup OFF so real backend errors (wrong password, etc.) show normally.
// Production (backend/worker not running): set VITE_ENABLE_SERVICE_POPUP=true
// to mount the "Service Temporarily Unavailable" demo-video popup back.
//
// Remount in 10 seconds:
//   1. Vercel / prod .env: VITE_ENABLE_SERVICE_POPUP=true + redeploy, OR
//   2. Flip the fallback below from `false` to `true`.
//
// File is intentionally kept: ServiceUnavailablePopup.jsx is NOT deleted.

export const SHOW_SERVICE_UNAVAILABLE_POPUP =
  import.meta.env.VITE_ENABLE_SERVICE_POPUP === "true";
