'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Package {
  id: string;
  title: string;
  slug: string;
  location_name?: string;
  category?: string;
  price: string;
  discounted_price: string;
  featured_image: string;
}

const internationalKeywords = ['dubai', 'uae', 'thailand', 'bangkok', 'phuket', 'singapore', 'malaysia', 'vietnam', 'bali', 'indonesia', 'europe', 'maldives'];

const illustrativeInternational = [
  { name: 'Dubai Desert & City Tour', location: 'Dubai, UAE', image: '/images/dest_dubai.png' },
  { name: 'Thailand Island Getaway', location: 'Phuket, Thailand', image: '/images/default-dest.jpg' },
  { name: 'Bali Beach Retreat', location: 'Bali, Indonesia', image: '/images/default-dest.jpg' },
];

export default function HolidaysHandpicked({ packages, activeCategory = '' }: { packages: Package[]; activeCategory?: string }) {
  const [tab, setTab] = useState<'domestic' | 'international'>('domestic');

  const categoryFiltered = useMemo(() => {
    if (!activeCategory) return packages;
    return packages.filter((pkg) => (pkg.category || '').trim().toLowerCase() === activeCategory.trim().toLowerCase());
  }, [packages, activeCategory]);

  const { domestic, international } = useMemo(() => {
    const domestic: Package[] = [];
    const international: Package[] = [];
    categoryFiltered.forEach((pkg) => {
      const loc = (pkg.location_name || '').toLowerCase();
      if (internationalKeywords.some((k) => loc.includes(k))) {
        international.push(pkg);
      } else {
        domestic.push(pkg);
      }
    });
    return { domestic, international };
  }, [categoryFiltered]);

  const list = tab === 'domestic' ? domestic : international;

  return (
    <div id="holiday-packages" className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '10px', paddingBottom: '60px' }}>
      <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>Handpicked Holiday Packages</h2>
      <p className="text-slate-500 font-semibold mb-6" style={{ fontSize: '14px' }}>
        Indulge in unforgettable adventure with special tour plans.
      </p>

      {activeCategory && (
        <div className="flex items-center gap-2 mb-4">
          <span
            className="font-bold rounded-full"
            style={{ fontSize: '12px', color: '#ff8126', background: '#fff3eb', padding: '6px 14px' }}
          >
            Showing: {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Packages
          </span>
          <Link
            href="/holidays#holiday-packages"
            className="font-bold hover:underline"
            style={{ fontSize: '12px', color: '#1d91f2', textDecoration: 'none' }}
          >
            Clear filter
          </Link>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setTab('domestic')}
          className="font-bold border cursor-pointer transition"
          style={{
            fontSize: '13px',
            borderRadius: '999px',
            padding: '9px 22px',
            borderColor: tab === 'domestic' ? '#1d91f2' : '#e2e8f0',
            color: tab === 'domestic' ? '#1d91f2' : '#64748b',
            background: tab === 'domestic' ? '#eef6ff' : '#ffffff',
          }}
        >
          Domestic
        </button>
        <button
          type="button"
          onClick={() => setTab('international')}
          className="font-bold border cursor-pointer transition"
          style={{
            fontSize: '13px',
            borderRadius: '999px',
            padding: '9px 22px',
            borderColor: tab === 'international' ? '#1d91f2' : '#e2e8f0',
            color: tab === 'international' ? '#1d91f2' : '#64748b',
            background: tab === 'international' ? '#eef6ff' : '#ffffff',
          }}
        >
          International
        </button>
      </div>

      {list.length === 0 && tab === 'international' ? (
        <>
          <p className="text-slate-400 font-semibold text-sm mb-4">
            Coming soon — here&apos;s a preview of what we&apos;re planning:
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {illustrativeInternational.map((item) => (
              <div
                key={item.name}
                className="flex-shrink-0 w-[240px] rounded-2xl overflow-hidden bg-white border border-slate-150 relative"
                style={{ opacity: 0.75 }}
              >
                <span
                  className="absolute top-2 right-2 font-bold rounded-full z-10"
                  style={{ fontSize: '10px', color: '#fff', background: '#0f172a', padding: '3px 10px' }}
                >
                  Preview
                </span>
                <div className="relative w-full h-[150px] bg-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-black text-slate-900 truncate" style={{ fontSize: '15px' }}>{item.name}</h3>
                  <p className="flex items-center gap-1.5 text-slate-500 font-semibold mt-1" style={{ fontSize: '12px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#ff8126' }}></i>
                    {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : list.length === 0 ? (
        <p className="text-slate-400 font-semibold text-sm">
          No {tab} {activeCategory ? `${activeCategory} ` : ''}packages available right now.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {list.map((pkg) => {
            const img = pkg.featured_image ? `/${pkg.featured_image.replace('../', '')}` : '/images/default-package.jpg';
            const price = pkg.discounted_price ? parseFloat(pkg.discounted_price) : parseFloat(pkg.price);
            return (
              <Link
                key={pkg.id}
                href={`/holidays/${pkg.slug}/`}
                className="flex-shrink-0 w-[240px] rounded-2xl overflow-hidden bg-white border border-slate-150"
                style={{ textDecoration: 'none' }}
              >
                <div className="relative w-full h-[150px] bg-slate-100">
                  <img src={img} alt={pkg.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-black text-slate-900 truncate flex items-center gap-1.5" style={{ fontSize: '15px' }}>
                    {pkg.title}
                  </h3>
                  <p className="flex items-center gap-1.5 text-slate-500 font-semibold mt-1" style={{ fontSize: '12px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#ff8126' }}></i>
                    {pkg.location_name || 'Kashmir'}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-semibold" style={{ fontSize: '11px' }}>
                      From <span className="font-black text-slate-900" style={{ fontSize: '14px' }}>&#8377;{price.toLocaleString('en-IN')}</span>
                    </span>
                    <span className="font-bold flex items-center gap-1" style={{ color: '#ff8126', fontSize: '12px' }}>
                      Explore <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
