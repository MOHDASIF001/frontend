import { legacyRedirect } from '../../lib/legacyRedirect';

export const GET = legacyRedirect('packages.php', '/holidays', (p) => (p.slug ? `/holidays/${p.slug}` : null));
