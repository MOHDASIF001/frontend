// Shared slug/formatting helpers for the Activities section pages.
//
// These used to live inside various page.tsx files and get imported by
// sibling/child pages from there. Next.js's App Router only allows a fixed
// set of named exports (default, metadata, generateStaticParams, etc.) from
// a page.tsx file - anything else fails the route type-check (only enforced
// by the stricter `next build --webpack`, not by the default Turbopack
// build, which is why this went unnoticed until switching build engines).
// Keeping them here instead avoids that entirely.

// Builds SEO-friendly URLs like /activities/activity-in-goa/
export function slugifyDestination(value: string) {
  return value
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

export function slugifyActivityTitle(name: string) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

export function toTitleCase(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function slugifyActivityName(name: string) {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}
