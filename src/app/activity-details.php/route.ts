import { legacyRedirect } from '../../lib/legacyRedirect';
import { slugifyActivityName } from '../activities/utils';

// Same URL shape the sitemap builds for /activities/{city}/{activity}.
export const GET = legacyRedirect('activities.php', '/activities', (a) => {
  const city = String(a.location || '').split(',')[0].trim().toLowerCase().replace(/\s+/g, '-');
  const slug = slugifyActivityName(String(a.name || ''));
  return city && slug ? `/activities/${city}/${slug}` : null;
});
