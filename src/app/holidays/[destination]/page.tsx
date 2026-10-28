import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import DestinationPackagesGrid from '../../../components/DestinationPackagesGrid';
import PackageDetailView from '../../../components/PackageDetailView';
import DestinationsExplorer from '../../../components/DestinationsExplorer';
import DestinationSeoSection from '../../../components/DestinationSeoSection';
import DestinationGuide from '../../../components/DestinationGuide';
import FaqSection from '../../../components/FaqSection';
import { API_BASE_URL } from '../../../config';
import { Category, slugifyCategory } from '../../../lib/categories';
import { getDestinationGuide } from '../../../lib/destinationGuides';
import { buildPackageMetadata } from '../../../lib/packageSeo';
import { fetchPackageFaqs } from '../../../lib/faqs';
import PageSeoContent from '../../../components/PageSeoContent';
import { applyPageSeoMeta, getPageSeo } from '../../../lib/pageSeo';
import { categoryContent } from '../../../lib/seoContent';
import { GROUP_TOUR_SLUGS, groupTourLinkLabel, groupTourSlugForPackage } from '../../../lib/groupTourSeo';
import { holidayDestinationSeo, fillSeoTokens, type DestinationStats } from '../../../lib/holidayDestinationSeo';
import { buildBreadcrumbSchema } from '../../../lib/schema';
import IntroReadMore from '../../../components/IntroReadMore';
import type { PageSeo } from '../../../lib/pageSeo';

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

function matchesDestination(pkg: Package, slug: string): boolean {
  const loc = (pkg.location_name || '').toLowerCase();
  const matchCities = destinationMeta[slug]?.matchCities;
  return matchCities ? matchCities.some((city) => loc.includes(city)) : loc.includes(slug);
}

const packagePrice = (pkg: Package) => (Number(pkg.discounted_price) > 0 ? Number(pkg.discounted_price) : Number(pkg.price));

function destinationStats(packages: Package[]): DestinationStats {
  const prices = packages.map(packagePrice).filter((p) => p > 0);
  const nights = packages.map((p) => Number(p.duration_nights)).filter((n) => n > 0);
  return {
    count: packages.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    minNights: nights.length ? Math.min(...nights) : 0,
    maxNights: nights.length ? Math.max(...nights) : 0,
  };
}

// Admin text (Page SEO Content) may use the same {year}/{min_price}/... placeholders.
function fillPageSeo(pageSeo: PageSeo | null, stats: DestinationStats): PageSeo | null {
  if (!pageSeo) return null;
  const fill = (v?: string | null) => (v ? fillSeoTokens(v, stats) : v);
  return {
    ...pageSeo,
    meta_title: fill(pageSeo.meta_title),
    meta_description: fill(pageSeo.meta_description),
    h1: fill(pageSeo.h1),
    intro: fill(pageSeo.intro),
    content_heading: fill(pageSeo.content_heading),
    content: fill(pageSeo.content),
    faqs: pageSeo.faqs.map((f) => ({ question: fillSeoTokens(f.question, stats), answer: fillSeoTokens(f.answer, stats) })),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ destination: string }> }) {
  const { destination } = await params;
  const destSlug = resolveDestinationSlug(destination);
  const guide = getDestinationGuide(destSlug);
  if (!guide) {
    const meta = destinationMeta[destSlug];
    if (!meta) {
      // Category pages (/holidays/{category}-packages, e.g. honeymoon-packages) had no
      // metadata branch of their own, so they silently inherited the root layout's generic
      // title/description - every one of them showed up as duplicate title/meta in SEO audits.
      const categorySlugMatch = destination.match(/^(.+)-packages$/);
      const category = categorySlugMatch
        ? (await getCategories()).find((c) => slugifyCategory(c.name) === categorySlugMatch[1])
        : undefined;
      if (category) {
        const url = `${siteUrl}/holidays/${destination}`;
        const title = `${category.name} Packages | Twin Brothers Holidays`;
        const description = `Browse handpicked ${category.name.toLowerCase()} holiday packages across every destination, with transparent pricing and no surprises - Twin Brothers Holidays.`;
        return applyPageSeoMeta({
          title,
          description,
          alternates: { canonical: url },
          openGraph: { title, description, url, siteName: 'Twin Brothers Holidays', type: 'website' },
          twitter: { card: 'summary', title, description },
        }, await getPageSeo(`/holidays/${destination}`));
      }
      // Individual package pages (/holidays/{package-slug}) get their own SEO from the admin panel.
      const pkg = await getPackageBySlug(destination);
      if (pkg) return buildPackageMetadata(pkg);
      return {};
    }
    // A known destination with no full write-up yet (e.g. Kashmir, Goa) still needs its
    // own title/description/canonical - without this every one of these pages fell back
    // to the homepage's generic metadata, which is what Search Console was flagging as
    // duplicate content with no canonical chosen.
    const url = `${siteUrl}/holidays/${destSlug}`;
    const seo = holidayDestinationSeo[destSlug];
    const [packages, pageSeo] = await Promise.all([getPackages(), getPageSeo(`/holidays/${destSlug}`)]);
    const stats = destinationStats(packages.filter((pkg) => matchesDestination(pkg, destSlug)));
    const title = seo ? fillSeoTokens(seo.title, stats) : `${meta.label} Holiday Packages | Twin Brothers Holidays`;
    const description = seo
      ? fillSeoTokens(seo.description, stats)
      : `Explore ${meta.label} holiday packages with Twin Brothers Holidays - handpicked stays, local transport and sightseeing in one itinerary, with transparent pricing and no surprises.`;
    return applyPageSeoMeta({
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: 'Twin Brothers Holidays', type: 'website' },
      twitter: { card: 'summary', title, description },
    }, fillPageSeo(pageSeo, stats));
  }
  const url = `${siteUrl}/holidays/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
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
      const [packages, pageSeo] = await Promise.all([getPackages(), getPageSeo(`/holidays/${rawSegment}`)]);
      return (
        <>
          <Suspense fallback={null}>
            <DestinationsExplorer
              packages={packages}
              categoryFilter={category.name}
              heroTitle={`${category.name} Packages`}
              titleOverride={pageSeo?.h1 || undefined}
              heroSubtitle={`Handpicked ${category.name.toLowerCase()} holiday packages across every destination, curated by Twin Brothers Holidays.`}
              rowHeadingSuffix={`${category.name} Packages`}
              singleHeadingSuffix={`${category.name} Packages`}
            />
          </Suspense>
          <PageSeoContent pageSeo={pageSeo} fallback={categoryContent(category.name)} />
        </>
      );
    }
  }

  // Not a known destination or category — try matching an individual package by its own slug.
  if (!meta) {
    const pkg = await getPackageBySlug(rawSegment);
    if (pkg) {
      const packageFaqs = await fetchPackageFaqs(pkg.id);
      const groupSlug = groupTourSlugForPackage(pkg);
      const groupTourLink = groupSlug ? { label: groupTourLinkLabel(groupSlug, 'package'), url: `/group-tours/${groupSlug}` } : undefined;
      return (
        <>
          <PackageDetailView pkg={pkg} extraLinks={groupTourLink ? [groupTourLink] : undefined} />
          <FaqSection faqs={packageFaqs} />
        </>
      );
    }
    // A genuinely unknown destination/category/package slug - respond with a real
    // 404 status (Google was flagging this as a "soft 404": a 200 response whose
    // body just says "not found", which search engines penalize and won't index).
    notFound();
  }

  // /holidays/{slug}-tours-packages/ and the leh/manali aliases served this same page
  // under extra URLs, splitting ranking signals - send them to the one canonical URL.
  if (rawSegment !== slug) permanentRedirect(`/holidays/${slug}`);

  const destinationName = meta.label;
  const guide = getDestinationGuide(slug);
  const seo = holidayDestinationSeo[slug];

  const [packages, allCategories, rawPageSeo] = await Promise.all([getPackages(), getCategories(), getPageSeo(`/holidays/${slug}`)]);

  const filteredPackages = packages.filter((pkg) => matchesDestination(pkg, slug));
  const stats = destinationStats(filteredPackages);
  const pageSeo = fillPageSeo(rawPageSeo, stats);
  const pageName = pageSeo?.h1 || (seo ? fillSeoTokens(seo.h1, stats) : `${destinationName} Tour Packages`);
  const intro = pageSeo?.intro || (seo ? fillSeoTokens(seo.intro, stats) : '');

  // DestinationGuide already emits its own BreadcrumbList.
  const breadcrumbSchema = !guide && buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Holidays', path: '/holidays' },
    { name: `${destinationName} Tour Packages`, path: `/holidays/${slug}` },
  ]);
  const packageListSchema = filteredPackages.length > 0 && {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageName,
    numberOfItems: filteredPackages.length,
    itemListElement: filteredPackages.map((pkg, i) => {
      const price = packagePrice(pkg);
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristTrip',
          name: pkg.title,
          url: `${siteUrl}/holidays/${pkg.slug}`,
          ...(price > 0 && { offers: { '@type': 'Offer', price, priceCurrency: 'INR', url: `${siteUrl}/holidays/${pkg.slug}` } }),
        },
      };
    }),
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />}
      {packageListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packageListSchema) }} />}
      {/* Hero */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '110px', paddingBottom: '40px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="font-black text-white text-[22px] sm:text-[36px]" style={{ lineHeight: '1.2' }}>
            {pageName}
          </h1>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
        <p className="text-sm font-semibold text-slate-500 mb-3">
          <Link href="/" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Home</Link>
          <span className="mx-1.5">&gt;</span>
          <Link href="/holidays" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Holidays</Link>
          <span className="mx-1.5">&gt;</span>
          <span className="font-bold" style={{ color: '#094074' }}>{destinationName}</span>
        </p>
        {intro && <IntroReadMore text={intro} />}
        {filteredPackages.length > 0 && (
          <p className="text-slate-700 font-bold" style={{ fontSize: '14px', margin: '16px 0 0' }}>
            {filteredPackages.length} {destinationName} tour package{filteredPackages.length === 1 ? '' : 's'} found
          </p>
        )}
        <div style={{ marginTop: '16px' }}>
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
        {GROUP_TOUR_SLUGS.includes(slug) && (
          <p className="text-slate-600 font-semibold mt-6" style={{ fontSize: '14px' }}>
            Travelling with friends or family? Explore our{' '}
            <Link href={`/group-tours/${slug}`} className="hover:underline" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>
              {groupTourLinkLabel(slug, 'destination')}
            </Link>
            {' '}with fixed departures.
          </p>
        )}
      </div>

      {guide && <DestinationGuide guide={guide} />}

      <PageSeoContent
        pageSeo={pageSeo}
        eyebrow={seo ? `${destinationName} Travel Guide` : undefined}
        fallback={seo && {
          heading: fillSeoTokens(seo.content.heading, stats),
          paragraphs: seo.content.paragraphs.map((p) => fillSeoTokens(p, stats)),
          subsections: seo.content.subsections,
        }}
        fallbackFaqs={seo?.faqs.map((f) => ({ question: fillSeoTokens(f.question, stats), answer: fillSeoTokens(f.answer, stats) }))}
        faqTitle={`${destinationName} Tour Packages: FAQs`}
      />

      {/* SEO content + Why Choose Us (shown just above the footer) */}
      <DestinationSeoSection destinationName={destinationName} />
    </div>
  );
}
