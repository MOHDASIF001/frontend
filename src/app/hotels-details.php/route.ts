import { legacyRedirect } from '../../lib/legacyRedirect';

export const GET = legacyRedirect('hotels.php', '/hotel', (h) => (h.slug ? `/hotels-details/${h.slug}` : null));
