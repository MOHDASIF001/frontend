import { fetchSiteSettings } from '../../lib/siteSettings';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /checkout
Disallow: /cabs/checkout
Disallow: /thank-you

Sitemap: ${siteUrl}/sitemap.xml
`;

// Admin Panel -> Settings -> "SEO & Integrations" -> robots.txt content lets the client
// edit this without a code change; served as a real Route Handler (not the next.js
// robots.ts metadata convention) so their raw text goes out exactly as typed.
export async function GET() {
  const settings = await fetchSiteSettings();
  const body = settings.robots_txt.trim() || DEFAULT_ROBOTS;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
