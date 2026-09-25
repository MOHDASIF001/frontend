import type { Metadata } from 'next';
import { resolveAssetUrl } from '../config';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export interface PackageSeoSource {
  title: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  featured_image?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
}

// Older admin saves HTML-encoded text into these columns (and re-encoded it on
// every save), so decode before handing it to React, which escapes on output.
function decodeEntities(input: string): string {
  let out = input;
  for (let i = 0; i < 6; i++) {
    const next = out
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;|&#x27;/g, "'");
    if (next === out) break;
    out = next;
  }
  return out;
}

function clean(input?: string | null): string {
  return decodeEntities((input || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function buildPackageMetadata(pkg: PackageSeoSource): Metadata {
  const name = clean(pkg.title);
  const title = clean(pkg.meta_title) || `${name} - Twin Brothers Holidays`;

  let description = clean(pkg.meta_description) || clean(pkg.short_description);
  if (!description) {
    const body = clean(pkg.description);
    description = body.length > 158 ? `${body.slice(0, 155).trimEnd()}...` : body;
  }
  if (!description) description = `${name} - book with Twin Brothers Holidays.`;

  const keywords = clean(pkg.meta_keywords) || undefined;
  const canonical = pkg.slug ? `${siteUrl}/holidays/${pkg.slug}` : undefined;
  const image = pkg.featured_image ? resolveAssetUrl(pkg.featured_image.replace(/^\.\.\//, '')) : undefined;

  return {
    title,
    description,
    keywords,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Twin Brothers Holidays',
      type: 'website',
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
