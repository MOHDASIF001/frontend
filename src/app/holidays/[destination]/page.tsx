import React, { Suspense } from 'react';
import Link from 'next/link';
import DestinationPackagesGrid from '../../../components/DestinationPackagesGrid';
import PackageDetailView from '../../../components/PackageDetailView';
import DestinationsExplorer from '../../../components/DestinationsExplorer';
import DestinationSeoSection from '../../../components/DestinationSeoSection';
import DestinationGuide from '../../../components/DestinationGuide';
import { API_BASE_URL } from '../../../config';
import { Category, slugifyCategory } from '../../../lib/categories';
import { getDestinationGuide } from '../../../lib/destinationGuides';

export const revalidate = 60;

interface Package {
  id: number;
  title: string;
  slug: string;
  destination_id: number;
  location_name?: string;
  category?: string;
  price: string;
  discounted_price: string;
  duration_days: string;
  duration_nights: string;
  short_description?: string;
  featured_image: string;
  popular?: string | number;
  featured?: string | number;
  city_breakdown?: string;
}

const destinationMeta: Record<string, { label: string; image: string; matchCities?: string[] }> = {
  kashmir: { label: 'Kashmir', image: '/images/pahalgam_main.png', matchCities: ['srinagar', 'gulmarg', 'pahalgam', 'sonmarg', 'kashmir'] },
  ladakh: { label: 'Ladakh', image: '/images/destinetion-ladhak.jpg', matchCities: ['leh', 'ladakh'] },
  kerala: { label: 'Kerala', image: '/images/Kerala_image.jpg', matchCities: ['munnar', 'kerala', 'alleppey'] },
  himachal: { label: 'Himachal', image: '/images/Himachal.webp', matchCities: ['manali', 'himachal', 'shimla', 'kasol'] },
  goa: { label: 'Goa', image: '/images/dest_goa.png', matchCities: ['goa'] },
  dubai: { label: 'Dubai', image: '/images/dest_dubai.png', matchCities: ['dubai'] },
  rajasthan: { label: 'Rajasthan', image: '/images/default-dest.jpg', matchCities: ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'pushkar', 'ajmer', 'bikaner', 'mount abu', 'ranthambore'] },
};

const aliases: Record<string, string> = { leh: 'ladakh', manali: 'himachal' };

function resolveDestinationSlug(rawSegment: string): string {
  const rawSlug = rawSegment.replace(/-tours-packages$/, '').toLowerCase();
  return aliases[rawSlug] ?? rawSlug;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export async function generateMetadata({ params }: { params: Promise<{ destination: string }> }) {
  const { destination } = await params;
  const guide = getDestinationGuide(resolveDestinationSlug(destination));
  if (!guide) return {};
  const url = `${siteUrl}/holidays/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      siteName: 'Twin Brothers Holidays',
      type: 'website',
    },
    twitter: { card: 'summary', title: guide.metaTitle, description: guide.metaDescription },
  };
}

// Hero category chips on /holidays link here as /holidays/{category}-packages —
// e.g. /holidays/honeymoon-packages — row-wise by destination, filtered to that
// category. Categories themselves are admin-controlled (admin/packages/categories.php),
// so the slug is derived from whatever names exist in the DB rather than a fixed list.
async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

async function getPackages(): Promise<Package[]> {
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

async function getPackageBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      return data.data;
    }
    return null;
  } catch (err) {
    console.error('Error fetching package:', err);
    return null;
  }
}

interface PageProps {
  params: Promise<{ destination: string }>;
}

export default async function DestinationPackagesPage({ params }: PageProps) {
  const { destination: rawSegment } = await params;
  const slug = resolveDestinationSlug(rawSegment);
  const meta = destinationMeta[slug];

  // Not a known destination — check if it's a category page (e.g. honeymoon-packages).
  if (!meta) {
    const categorySlugMatch = rawSegment.match(/^(.+)-packages$/);
    const category = categorySlugMatch
      ? (await getCategories()).find((c) => slugifyCategory(c.name) === categorySlugMatch[1])
      : undefined;
    if (category) {
      const packages = await getPackages();
      return (
        <Suspense fallback={null}>
          <DestinationsExplorer
            packages={packages}
            categoryFilter={category.name}
            heroTitle={`${category.name} Packages`}
            heroSubtitle={`Handpicked ${category.name.toLowerCase()} holiday packages across every destination, curated by Twin Brothers Holidays.`}
            rowHeadingSuffix={`${category.name} Packages`}
            singleHeadingSuffix={`${category.name} Packages`}
          />
        </Suspense>
      );
    }
  }

  // Not a known destination or category — try matching an individual package by its own slug.
  if (!meta) {
    const pkg = await getPackageBySlug(rawSegment);
    if (pkg) {
      return <PackageDetailView pkg={pkg} />;
    }
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <p className="text-slate-500 font-semibold">This page could not be found.</p>
          <Link href="/holidays" className="mt-3 inline-block font-bold hover:underline" style={{ color: '#094074', textDecoration: 'none' }}>
            Browse all holiday packages
          </Link>
        </div>
      </div>
    );
  }

  const destinationName = meta.label;
  const guide = getDestinationGuide(slug);

  const [packages, allCategories] = await Promise.all([getPackages(), getCategories()]);

  const filteredPackages = packages.filter((pkg) => {
    const loc = (pkg.location_name || '').toLowerCase();
    if (meta?.matchCities) {
      return meta.matchCities.some((city) => loc.includes(city));
    }
    return loc.includes(slug);
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '110px', paddingBottom: '40px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="font-black text-white text-[22px] sm:text-[36px]" style={{ lineHeight: '1.2' }}>
            {destinationName} Tour Packages
          </h1>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
            {guide ? (
              <>
                <p className="text-slate-700 font-bold">Ready-made {destinationName} packages are coming soon.</p>
                <p className="text-slate-500 font-medium mt-1" style={{ fontSize: '14px' }}>
                  Tell us your dates and budget and we&apos;ll plan a custom {destinationName} itinerary for you.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-3">
                  <Link href="/contact-us" className="inline-block font-bold hover:underline" style={{ color: '#ff8126', textDecoration: 'none' }}>
                    Request a custom itinerary
                  </Link>
                  <Link href="/holidays" className="inline-block font-bold hover:underline" style={{ color: '#094074', textDecoration: 'none' }}>
                    Browse all holiday packages
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-500 font-semibold">No {destinationName} packages available right now.</p>
                <Link href="/holidays" className="mt-3 inline-block font-bold hover:underline" style={{ color: '#094074', textDecoration: 'none' }}>
                  Browse all holiday packages
                </Link>
              </>
            )}
          </div>
        ) : (
          <DestinationPackagesGrid packages={filteredPackages} destinationName={destinationName} categories={allCategories.map((c) => c.name)} />
        )}
      </div>

      {guide && <DestinationGuide guide={guide} />}

      {/* SEO content + Why Choose Us (shown just above the footer) */}
      <DestinationSeoSection destinationName={destinationName} />
    </div>
  );
}
