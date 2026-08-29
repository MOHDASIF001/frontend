import type { MetadataRoute } from 'next';

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

  return [...staticRoutes, ...regionRoutes];
}
