'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomeSeoContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <span className="font-bold uppercase" style={{ fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' }}>
          Travel Guide
        </span>
        <h2 className="font-black text-slate-900 mt-2 mb-4" style={{ fontSize: '22px', lineHeight: '1.35' }}>
          Plan Your Next Holiday Packages With Twin Brothers Holidays
        </h2>

        <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9' }}>
          Twin Brothers Holidays plans trips across India and beyond, with deep, ground-level expertise in
          destinations like Dal Lake and the Mughal Gardens in Srinagar, Gulmarg&apos;s snow slopes,
          Pahalgam&apos;s river valleys, and Sonamarg&apos;s glacier views. Book a{' '}
          <Link href="/holidays" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>holiday package</Link>,
          {' '}a{' '}
          <Link href="/hotel" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>hotel</Link>,
          {' '}a{' '}
          <Link href="/cabs" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>cab for local sightseeing or an airport transfer</Link>,
          {' '}or a{' '}
          <Link href="/activities" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>local activity or experience</Link>
          {' '}— all in one place.
        </p>

        <div
          style={{
            maxHeight: expanded ? '1200px' : '0px',
            opacity: expanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.6s ease, opacity 0.4s ease',
          }}
        >
          <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9', marginTop: '18px' }}>
            Each destination has its own season: spring for the Tulip Garden, summer for cool valley
            weather, autumn for Chinar trees turning gold, and winter for snowfall in the hills. Popular
            experiences include a houseboat stay and Shikara ride on Dal Lake, the Gulmarg Gondola to
            Kongdoori and Apharwat, pony rides in Pahalgam, and the glacier trek near Thajiwas in
            Sonamarg. We also plan trips to Leh Ladakh, Manali, Munnar, Goa and Dubai.
          </p>
          <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9', marginTop: '14px' }}>
            Every{' '}
            <Link href="/holidays" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>holiday package</Link>
            {' '}can be filtered by destination, duration and category — honeymoon, family, budget
            group, luxury, adventure, trekking and pilgrimage tours — with inclusions listed upfront.
            Need something different? Use the{' '}
            <span className="font-bold text-slate-800">Customize Package</span> button to build your own
            itinerary, or{' '}
            <Link href="/group-tours" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>join a fixed-departure group tour</Link>
            {' '}to travel with a small group instead of planning it yourself.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="font-semibold border-none bg-transparent cursor-pointer inline-flex items-center gap-1"
          style={{ color: '#ff8126', fontSize: '13.5px', padding: 0, marginTop: '14px' }}
        >
          {expanded ? 'Read Less' : 'Read More'}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
