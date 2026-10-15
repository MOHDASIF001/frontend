import React, { Suspense } from 'react';
import DestinationsExplorer from '../../components/DestinationsExplorer';
import { API_BASE_URL } from '../../config';

// See the same comment in app/group-tours/page.tsx - DestinationsExplorer reads
// useSearchParams(), so without force-dynamic this route gets frozen at build
// time with an empty Suspense fallback and no real content for crawlers.
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ dest?: string }> }) {
  const { dest } = await searchParams;
  // Every ?dest= filter variant (domestic, international, kashmir, goa, ...) was sharing
  // this same admin-set description - give each a distinct one instead of duplicating it.
  if (dest && dest !== 'explore') {
    const isCategory = dest === 'domestic' || dest === 'international';
    const label = isCategory ? (dest === 'domestic' ? 'Domestic' : 'International') : dest.charAt(0).toUpperCase() + dest.slice(1);
    const title = `${label} Destinations | Twin Brothers Holidays`;
    const description = `Explore ${isCategory ? label.toLowerCase() : label} travel destinations and holiday packages with Twin Brothers Holidays - handpicked itineraries, transparent pricing and no surprises.`;
    const url = `${siteUrl}/destinations?dest=${dest}`;
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'Twin Brothers Holidays', type: 'website' },
      twitter: { card: 'summary', title, description },
    };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=destinations.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
    };
  } catch (err) {
    return {
      title: "Destinations - Twin Brothers Holidays",
      description: "Top Destinations in Kashmir",
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

export default async function DestinationsPage() {
  const packages = await getPackages();

  return (
    <Suspense fallback={null}>
      <DestinationsExplorer packages={packages} viewAllLinkPattern="/holidays/{slug}-tours-packages/" />
    </Suspense>
  );
}
