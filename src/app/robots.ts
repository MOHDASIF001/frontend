import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/cabs/checkout', '/thank-you'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
