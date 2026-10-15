import React, { Suspense } from 'react';
import DestinationsExplorer from '../../components/DestinationsExplorer';
import { API_BASE_URL } from '../../config';

// This page's content comes from DestinationsExplorer, a client component that
// reads useSearchParams() to decide which destination row to show. Without
// force-dynamic, Next prerenders this route once at build time with no real
// request URL - the Suspense fallback (null) gets baked into the static HTML
// permanently, and the actual headings/links only ever appear after client-side
// hydration. That left every page crawler-visible as a blank shell.
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: "Group Tour Packages - Twin Brothers Holidays",
    description: "Explore our best group tour packages across India, destination by destination.",
  };
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

export default async function GroupToursPage() {
  const packages = await getPackages();

  return (
    <Suspense fallback={null}>
      <DestinationsExplorer
        packages={packages}
        categoryFilter="Group"
        heroTitle="Group Tour Packages"
        heroSubtitle="Travel together, save more — explore our best group holiday packages across destinations."
        rowHeadingSuffix="Group Tour Packages"
        singleHeadingSuffix="Group Tour Packages"
        viewAllLinkPattern="/group-tours/{slug}-group-tour-packages/"
        showGroupInfoSections
      />
    </Suspense>
  );
}
