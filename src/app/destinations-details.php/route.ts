import { legacyRedirect } from '../../lib/legacyRedirect';

// Only these destinations have a page at /holidays/{slug} (see destinationMeta there).
const DESTINATION_PAGES = ['kashmir', 'ladakh', 'kerala', 'himachal', 'goa', 'dubai', 'rajasthan'];

export const GET = legacyRedirect('destinations.php', '/destinations', (d) => {
  const slug = String(d.slug || '').toLowerCase();
  return DESTINATION_PAGES.includes(slug) ? `/holidays/${slug}` : null;
});
