'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PackageCard, { PackageCardData } from './PackageCard';
import { majorDestinations } from '../lib/majorDestinations';

interface Package extends PackageCardData {
  destination_id: number;
  location_name?: string;
  category?: string;
}

export default function DestinationsExplorer({
  packages,
  categoryFilter,
  heroTitle = 'Explore All Destinations',
  heroSubtitle = 'Discover breathtaking places across India, handpicked for unforgettable holidays with Twin Brothers Holidays.',
  rowHeadingSuffix,
  singleHeadingSuffix,
  viewAllLinkPattern,
  showGroupInfoSections = false,
}: {
  packages: Package[];
  /** Only include packages whose category matches this (case-insensitive). */
  categoryFilter?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  /** Appended after the destination label for each row heading, e.g. "Group Tour Packages" -> "Kashmir Group Tour Packages". Defaults to just the label. */
  rowHeadingSuffix?: string;
  /** Appended after the destination label for the single-destination heading. Defaults to "Tours in {label}". */
  singleHeadingSuffix?: string;
  /** Href pattern for the "View All" link, with `{slug}` as a placeholder, e.g. "/holidays/{slug}-tours-packages/". When omitted, "View All" just switches to the in-page filtered view. */
  viewAllLinkPattern?: string;
  /** Show "Why Choose Us" + "About Our Group Tours" trust-building sections at the bottom of the page. */
  showGroupInfoSections?: boolean;
}) {
  const searchParams = useSearchParams();
  const [navbarHeight, setNavbarHeight] = useState(80);
  const [activeDest, setActiveDest] = useState<string>(() => searchParams.get('dest') || 'explore');
  const pillRowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = document.querySelector('.navbar-contener');
    if (el) setNavbarHeight(el.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    const d = searchParams.get('dest');
    setActiveDest(d || 'explore');
    window.scrollTo({ top: 0 });
  }, [searchParams]);

  const updatePillScrollState = () => {
    const el = pillRowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updatePillScrollState();
    const el = pillRowRef.current;
    if (!el) return;
    el.addEventListener('scroll', updatePillScrollState);
    window.addEventListener('resize', updatePillScrollState);
    return () => {
      el.removeEventListener('scroll', updatePillScrollState);
      window.removeEventListener('resize', updatePillScrollState);
    };
  }, []);

  const scrollPillRow = (dir: 'left' | 'right') => {
    const el = pillRowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
  };

  const grouped = useMemo(() => {
    const source = categoryFilter
      ? packages.filter((p) => (p.category || '').toLowerCase() === categoryFilter.toLowerCase())
      : packages;
    return majorDestinations
      .map((dest) => ({
        dest,
        pkgs: source.filter((p) => {
          const loc = (p.location_name || '').toLowerCase();
          return dest.matchCities.some((city) => loc.includes(city));
        }),
      }))
      .filter((g) => g.pkgs.length > 0);
  }, [packages, categoryFilter]);

  const selectFilter = (slug: string) => {
    setActiveDest(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCategoryFilter = activeDest === 'domestic' || activeDest === 'international';
  const activeGroup = !isCategoryFilter && activeDest !== 'explore' ? grouped.find((g) => g.dest.slug === activeDest) : undefined;

  // "Domestic" / "International" cards on the homepage link here with
  // ?dest=domestic or ?dest=international — show only the matching rows
  // instead of a single destination's grid.
  const visibleGrouped = useMemo(() => {
    if (activeDest === 'domestic') return grouped.filter((g) => !g.dest.isInternational);
    if (activeDest === 'international') return grouped.filter((g) => g.dest.isInternational);
    return grouped;
  }, [grouped, activeDest]);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: `${navbarHeight + 40}px`, paddingBottom: '40px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="font-black text-white mb-3 text-[24px] sm:text-[38px]" style={{ lineHeight: '1.2' }}>
            {activeDest === 'domestic' ? 'Domestic Destinations' : activeDest === 'international' ? 'International Destinations' : heroTitle}
          </h1>
          <p className="font-semibold max-w-[560px] mx-auto text-[13px] sm:text-[15px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Sticky pill nav */}
      <div style={{ position: 'sticky', top: `${navbarHeight}px`, zIndex: 30 }}>
        <div className="bg-white relative" style={{ borderBottom: '1px solid #eef1f5', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative">
            {canScrollLeft && (
              <button
                onClick={() => scrollPillRow('left')}
                className="hidden sm:flex items-center justify-center rounded-full absolute cursor-pointer border-0"
                style={{
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '21px',
                  height: '21px',
                  background: '#fff',
                  zIndex: 5,
                  color: '#094074',
                }}
              >
                <i className="fa-solid fa-chevron-left" style={{ fontSize: '12px' }}></i>
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollPillRow('right')}
                className="hidden sm:flex items-center justify-center rounded-full absolute cursor-pointer border-0"
                style={{
                  right: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '21px',
                  height: '21px',
                  background: '#fff',
                  zIndex: 5,
                  color: '#094074',
                }}
              >
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
              </button>
            )}
            <div
              ref={pillRowRef}
              className="flex flex-nowrap items-center gap-6 overflow-x-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '7px 16px' }}
            >
              <button
                onClick={() => selectFilter('explore')}
                className="flex flex-col items-center flex-shrink-0 border-0 bg-transparent cursor-pointer"
                style={{ color: activeDest === 'explore' ? '#ff8126' : '#334155' }}
              >
                <i className="fa-solid fa-fire mb-1" style={{ fontSize: '18px' }}></i>
                <span className="font-normal whitespace-nowrap" style={{ fontSize: '12px' }}>Explore</span>
              </button>
              {grouped.map(({ dest }) => (
                <button
                  key={dest.slug}
                  onClick={() => selectFilter(dest.slug)}
                  className="flex flex-col items-center flex-shrink-0 border-0 bg-transparent cursor-pointer"
                >
                  <span
                    className="rounded-full flex items-center justify-center mb-1"
                    style={{
                      width: '34px',
                      height: '34px',
                      padding: activeDest === dest.slug ? '2px' : '0',
                      background: activeDest === dest.slug ? 'linear-gradient(135deg, #094074, #ff8126)' : 'transparent',
                    }}
                  >
                    <span className="rounded-full overflow-hidden w-full h-full" style={{ border: activeDest === dest.slug ? '2px solid #fff' : 'none' }}>
                      <img src={dest.image} alt={dest.label} className="w-full h-full object-cover" />
                    </span>
                  </span>
                  <span
                    className="font-normal whitespace-nowrap"
                    style={{ fontSize: '12px', color: activeDest === dest.slug ? '#ff8126' : '#334155' }}
                  >
                    {dest.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
        {grouped.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
            <p className="text-slate-500 font-semibold">No destinations available at the moment.</p>
          </div>
        ) : isCategoryFilter && visibleGrouped.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
            <p className="text-slate-500 font-semibold">
              No {activeDest === 'domestic' ? 'domestic' : 'international'} destinations available at the moment.
            </p>
          </div>
        ) : activeGroup ? (
          // Single destination selected — full grid, like "Tours in Dubai"
          <div>
            <h2 className="font-black text-slate-900 mb-6" style={{ fontSize: '22px' }}>
              {singleHeadingSuffix ? `${activeGroup.dest.label} ${singleHeadingSuffix}` : `Tours in ${activeGroup.dest.label}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGroup.pkgs.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} layout="grid" />
              ))}
            </div>
          </div>
        ) : (
          // Explore (or Domestic/International filter) — horizontal-scroll rows
          visibleGrouped.map(({ dest, pkgs }) => (
            <div key={dest.slug} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-slate-900" style={{ fontSize: '22px' }}>
                  {rowHeadingSuffix ? `${dest.label} ${rowHeadingSuffix}` : dest.label}
                </h2>
                {viewAllLinkPattern ? (
                  <Link
                    href={viewAllLinkPattern.replace('{slug}', dest.slug)}
                    className="flex items-center gap-2 font-bold"
                    style={{ fontSize: '13px', color: '#ff8126', textDecoration: 'none' }}
                  >
                    View All
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #ff8126, #fd661e)' }}
                    >
                      <i className="fa-solid fa-arrow-right text-white" style={{ fontSize: '11px' }}></i>
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => selectFilter(dest.slug)}
                    className="flex items-center gap-2 font-bold border-0 bg-transparent cursor-pointer"
                    style={{ fontSize: '13px', color: '#ff8126' }}
                  >
                    View All
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #ff8126, #fd661e)' }}
                    >
                      <i className="fa-solid fa-arrow-right text-white" style={{ fontSize: '11px' }}></i>
                    </span>
                  </button>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {pkgs.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </div>
          ))
        )}

        {showGroupInfoSections && (
          <>
            {/* Why Choose Us */}
            <div style={{ marginTop: '24px', marginBottom: '56px' }}>
              <h2 className="font-black text-slate-900 text-center mb-2" style={{ fontSize: '22px' }}>
                Why Choose Us
              </h2>
              <p className="text-center font-semibold mx-auto mb-8" style={{ fontSize: '13px', color: '#64748b', maxWidth: '560px' }}>
                Trusted by thousands of travellers for safe, well-planned and affordable group holidays.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: 'fa-tags', title: 'Best Price Guarantee', desc: 'Group rates that beat individual bookings, with no hidden costs.' },
                  { icon: 'fa-user-tie', title: 'Expert Local Guides', desc: 'Experienced guides who know every destination inside out.' },
                  { icon: 'fa-people-group', title: 'Handpicked Group Sizes', desc: 'Small, well-managed groups for a comfortable travel experience.' },
                  { icon: 'fa-headset', title: '24/7 Support', desc: 'Round-the-clock assistance before, during and after your trip.' },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="bg-white rounded-2xl text-center"
                    style={{ padding: '20px 14px', border: '1px solid #eef1f5' }}
                  >
                    <span
                      className="rounded-full flex items-center justify-center mx-auto mb-3"
                      style={{ width: '46px', height: '46px', background: 'linear-gradient(135deg, #094074, #ff8126)' }}
                    >
                      <i className={`fa-solid ${f.icon} text-white`} style={{ fontSize: '17px' }}></i>
                    </span>
                    <h3 className="font-black text-slate-900 mb-1" style={{ fontSize: '13px' }}>{f.title}</h3>
                    <p className="font-semibold" style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About Our Group Tours */}
            <div
              className="rounded-2xl"
              style={{ padding: '28px 24px', background: 'linear-gradient(135deg, #094074, #16213e)' }}
            >
              <h2 className="font-black text-white mb-3" style={{ fontSize: '20px' }}>
                About Our Group Tours
              </h2>
              <p className="font-semibold mb-4" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', maxWidth: '760px' }}>
                Twin Brothers Holidays' group tours are designed for travellers who love exploring in good company.
                Every itinerary is carefully planned by our destination experts — covering the best sightseeing spots,
                comfortable stays and smooth logistics — so you can simply relax and enjoy the journey with fellow travellers.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {[
                  'Fixed departure dates',
                  'Comfortable stays & transport',
                  'All sightseeing included',
                  'Dedicated tour manager',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <i className="fa-solid fa-circle-check" style={{ fontSize: '13px', color: '#ff8126' }}></i>
                    <span className="font-semibold text-white" style={{ fontSize: '12px' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
