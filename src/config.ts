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

// Admin-uploaded images (packages, hotels, destinations, activities, cabs)
// are stored on the PHP backend and referenced in the DB as root-relative
// paths like "uploads/xyz.jpg". Before the frontend moved to its own domain
// (Netlify) separate from the backend (Hostinger), a plain "/uploads/xyz.jpg"
// happened to work because both were served from the same origin. Now it
// must be resolved against the backend's own origin instead.
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const LOCAL_IMAGES = new Set<string>(JSON.parse(process.env.NEXT_PUBLIC_LOCAL_IMAGES || '[]'));

export function resolveAssetUrl(path: string | null | undefined, fallback = ''): string {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  const clean = path.replace(/^\.?\.?\//, '');
  if (LOCAL_IMAGES.has(clean)) return `/${clean}`;
  return `${ASSET_BASE_URL}/${clean}`;
}
