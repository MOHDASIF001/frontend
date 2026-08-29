// Server-rendered pages (the majority of this site) have no `window`, so the
// API base URL can't be derived from the current page's origin there — it must
// be known ahead of time. Set NEXT_PUBLIC_API_BASE_URL in production so the
// server knows where the PHP API actually lives; without it, server-rendered
// pages would silently try to reach `localhost` on the production machine and
// every data fetch would fail. Falls back to the known production domain so
// the site still works if that env var is forgotten, and to the local XAMPP
// path in dev.
function resolveApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost/twin-project-3-new/api';
    }
    // The frontend (Vercel) and the PHP API (Hostinger) live on different
    // subdomains, so it's never just `origin + '/api'` in production -
    // always set NEXT_PUBLIC_API_BASE_URL. This is only a last-resort fallback.
    return 'https://backend.twinbholidays.com/api';
  }

  // Server-side fallback (no window, no env var set).
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost/twin-project-3-new/api';
  }
  return 'https://backend.twinbholidays.com/api';
}

export const API_BASE_URL = resolveApiBaseUrl();
