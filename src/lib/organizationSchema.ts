import type { SiteSettings } from './siteSettings';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

// Sitewide Organization structured data, built entirely from Admin Panel -> Settings
// (Site Information + Social Media Links) - editing those there updates this schema
// on every page with no code change or redeploy needed.
export function buildOrganizationSchema(settings: SiteSettings) {
  const sameAs = [settings.facebook_url, settings.instagram_url, settings.twitter_url, settings.linkedin_url].filter(Boolean);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: settings.site_title || 'Twin Brothers Holidays',
    url: siteUrl,
    logo: `${siteUrl}/images/twinb-logo-final.png`,
  };
  if (settings.site_phone) schema.telephone = settings.site_phone;
  if (settings.site_email) schema.email = settings.site_email;
  if (settings.site_address) schema.address = { '@type': 'PostalAddress', streetAddress: settings.site_address };
  if (sameAs.length) schema.sameAs = sameAs;
  return schema;
}
