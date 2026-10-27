import { API_BASE_URL } from '../config';
import type { Faq } from './faqs';

// Admin-managed overrides for a page (Admin Panel -> Page SEO Content). Every field is
// optional: anything left empty there keeps the page's built-in default.
export interface PageSeo {
  path: string;
  meta_title?: string | null;
  meta_description?: string | null;
  h1?: string | null;
  intro?: string | null;
  content_heading?: string | null;
  content?: string | null;
  faqs: Faq[];
}

export async function getPageSeo(path: string): Promise<PageSeo | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/page_seo.php?path=${encodeURIComponent(path)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 'success' && data.data ? { ...data.data, faqs: Array.isArray(data.data.faqs) ? data.data.faqs : [] } : null;
  } catch {
    return null;
  }
}

type Meta = {
  title?: unknown;
  description?: unknown;
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
  [key: string]: unknown;
};

/** Applies the admin meta title/description (when set) on top of a page's default metadata. */
export function applyPageSeoMeta<T extends Meta>(meta: T, pageSeo: PageSeo | null): T {
  const title = pageSeo?.meta_title?.trim();
  const description = pageSeo?.meta_description?.trim();
  if (!title && !description) return meta;
  const override = { ...(title && { title }), ...(description && { description }) };
  return {
    ...meta,
    ...override,
    ...(meta.openGraph && { openGraph: { ...meta.openGraph, ...override } }),
    ...(meta.twitter && { twitter: { ...meta.twitter, ...override } }),
  };
}
