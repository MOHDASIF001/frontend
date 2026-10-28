import React, { Suspense } from 'react';
import { permanentRedirect } from 'next/navigation';
import DestinationsExplorer from '../../components/DestinationsExplorer';
import { API_BASE_URL } from '../../config';

// See the same comment in app/group-tours/page.tsx - DestinationsExplorer reads
// useSearchParams(), so without force-dynamic this route gets frozen at build
// time with an empty Suspense fallback and no real content for crawlers.
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export async function generateMetadata() {
  const canonical = { alternates: { canonical: `${siteUrl}/destinations` } };
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=destinations.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      ...canonical,
    };
  } catch (err) {
    return {
      title: "Destinations - Twin Brothers Holidays",
      description: "Top Destinations in Kashmir",
      ...canonical,
    };
  }
}

async function getPackages() {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch packages');
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching packages:', err);
    return [];
  }
}

export default async function DestinationsPage({ searchParams }: { searchParams: Promise<{ dest?: string }> }) {
  const { dest } = await searchParams;
  // Filters now live at /destinations/{dest}; old ?dest= links (already crawled, and
  // flagged by SEO audits as dynamic URLs) redirect there permanently.
  if (dest) permanentRedirect(dest === 'explore' ? '/destinations' : `/destinations/${encodeURIComponent(dest)}`);

  const packages = await getPackages();

  return (
    <Suspense fallback={null}>
      <DestinationsExplorer packages={packages} viewAllLinkPattern="/holidays/{slug}" />
    </Suspense>
  );
}
