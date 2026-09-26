import type { MetadataRoute } from 'next';
import { API_BASE_URL } from '../config';

// Without this, Next.js has no revalidate window of its own for this route and can
// end up serving a single build-time snapshot indefinitely - if the backend was
// briefly slow/unresponsive for even one of the several fetches below during that
// one build, whole categories of URLs silently vanish from the sitemap until the
// next deploy. Revalidating hourly means a transient backend hiccup self-heals.
export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

// Mirrors the region slugs defined in src/app/holidays/[destination]/page.tsx.
const REGION_SLUGS = [
  'kashmir',
  'ladakh',
  'kerala',
  'himachal',
  'goa',
  'dubai',
  'delhi',
  'rajasthan',
  'uttarakhand',
  'meghalaya',
];

// Only the destinations that actually have group packages today (matches
// src/lib/majorDestinations.ts's non-placeholder entries) - listing every
// placeholder city there would sitemap pages with no real content.
const GROUP_TOUR_SLUGS = ['kashmir', 'ladakh', 'himachal', 'kerala', 'goa', 'rajasthan', 'dubai'];

async function safeJson(url: string) {
  // One retry: a single slow/failed request to the PHP backend shouldn't silently
  // drop an entire content type (hotels, activities, ...) from the sitemap.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) return await res.json();
    } catch (err) {
      if (attempt === 1) console.error('sitemap: fetch failed for', url, err);
    }
  }
  return null;
}

function slugifyCity(location?: string | null): string {
  return String(location || '').split(',')[0].trim().toLowerCase().replace(/\s+/g, '-');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/holidays`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/destinations`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/group-tours`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/hotel`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/cabs`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/activities`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${siteUrl}/flights`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/bus`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/gift-cards`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/visa`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/about-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/working-with-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/customer-support`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/terms-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const regionRoutes: MetadataRoute.Sitemap = REGION_SLUGS.map((slug) => ({
    url: `${siteUrl}/holidays/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const groupTourRoutes: MetadataRoute.Sitemap = GROUP_TOUR_SLUGS.map((slug) => ({
    url: `${siteUrl}/group-tours/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const [packagesRes, hotelsRes, activitiesRes, cabLocationsRes, offersRes, blogRes] = await Promise.all([
    safeJson(`${API_BASE_URL}/packages.php`),
    safeJson(`${API_BASE_URL}/hotels.php`),
    safeJson(`${API_BASE_URL}/activities.php`),
    safeJson(`${API_BASE_URL}/cab_locations.php`),
    safeJson(`${API_BASE_URL}/offers.php`),
    safeJson(`${API_BASE_URL}/blogs.php?limit=200`),
  ]);

  const packageRoutes: MetadataRoute.Sitemap = (packagesRes?.data || [])
    .filter((p: { slug?: string }) => p.slug)
    .map((p: { slug: string; updated_at?: string }) => ({
      url: `${siteUrl}/holidays/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const hotelRoutes: MetadataRoute.Sitemap = (hotelsRes?.data || [])
    .filter((h: { slug?: string }) => h.slug)
    .map((h: { slug: string }) => ({
      url: `${siteUrl}/hotels-details/${h.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  const activityRoutes: MetadataRoute.Sitemap = (activitiesRes?.data || [])
    .filter((a: { slug?: string; location?: string }) => a.slug && slugifyCity(a.location))
    .map((a: { slug: string; location: string }) => ({
      url: `${siteUrl}/activities/${slugifyCity(a.location)}/${a.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  const cabRoutes: MetadataRoute.Sitemap = (cabLocationsRes?.data || [])
    .filter((c: { value?: string }) => c.value)
    .map((c: { value: string }) => ({
      url: `${siteUrl}/cabs/${c.value}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  const offerRoutes: MetadataRoute.Sitemap = (offersRes?.data || [])
    .filter((o: { slug?: string }) => o.slug)
    .map((o: { slug: string }) => ({
      url: `${siteUrl}/offers/${o.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

  const blogRoutes: MetadataRoute.Sitemap = (blogRes?.data || [])
    .filter((b: { slug?: string }) => b.slug)
    .map((b: { slug: string; publish_date?: string }) => ({
      url: `${siteUrl}/blog/${b.slug}`,
      lastModified: b.publish_date ? new Date(b.publish_date) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

  return [
    ...staticRoutes,
    ...regionRoutes,
    ...groupTourRoutes,
    ...packageRoutes,
    ...hotelRoutes,
    ...activityRoutes,
    ...cabRoutes,
    ...offerRoutes,
    ...blogRoutes,
  ];
}
