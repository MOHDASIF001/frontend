import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import DestinationsExplorer from '../../../components/DestinationsExplorer';
import { API_BASE_URL } from '../../../config';
import { majorDestinations } from '../../../lib/majorDestinations';
import PageSeoContent from '../../../components/PageSeoContent';
import { applyPageSeoMeta, getPageSeo } from '../../../lib/pageSeo';
import { destinationContent } from '../../../lib/seoContent';

// DestinationsExplorer reads useSearchParams(); see app/destinations/page.tsx.
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

function resolveLabel(dest: string): { label: string; isCategory: boolean } | undefined {
  if (dest === 'domestic') return { label: 'Domestic', isCategory: true };
  if (dest === 'international') return { label: 'International', isCategory: true };
  const match = majorDestinations.find((d) => d.slug === dest);
  return match ? { label: match.label, isCategory: false } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ dest: string }> }) {
  const { dest } = await params;
  const resolved = resolveLabel(dest);
  if (!resolved) return {};
  const { label, isCategory } = resolved;
  const title = `${label} Destinations | Twin Brothers Holidays`;
  const description = `Explore ${isCategory ? label.toLowerCase() : label} travel destinations and holiday packages with Twin Brothers Holidays - handpicked itineraries, transparent pricing and no surprises.`;
  const url = `${siteUrl}/destinations/${dest}`;
  return applyPageSeoMeta({
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Twin Brothers Holidays', type: 'website' },
    twitter: { card: 'summary', title, description },
  }, await getPageSeo(`/destinations/${dest}`));
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

export default async function DestinationFilterPage({ params }: { params: Promise<{ dest: string }> }) {
  const { dest } = await params;
  if (!resolveLabel(dest)) notFound();

  const [packages, pageSeo] = await Promise.all([getPackages(), getPageSeo(`/destinations/${dest}`)]);

  return (
    <>
      <Suspense fallback={null}>
        <DestinationsExplorer packages={packages} viewAllLinkPattern="/holidays/{slug}-tours-packages/" initialDest={dest} titleOverride={pageSeo?.h1 || undefined} />
      </Suspense>
      <PageSeoContent pageSeo={pageSeo} fallback={destinationContent(dest)} />
    </>
  );
}
