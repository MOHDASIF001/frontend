import BusPageContent from './BusPageContent';

// Accepting (and awaiting) `searchParams` here is what actually forces Next.js
// to skip build-time static generation for this route - the earlier
// `export const dynamic = 'force-dynamic'` had no effect on a page with no
// server-rendered dynamic data, and generating a static shell for this page
// was what hung Vercel's build machine.
export default async function BusPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  return <BusPageContent />;
}
