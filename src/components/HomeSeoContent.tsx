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
          Plan Your Next Trip With Twin Brothers Holidays
        </h2>

        <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9' }}>
          Twin Brothers Holidays helps travellers plan trips across India and beyond — with some of our
          most detailed, ground-level coverage in Jammu &amp; Kashmir, from Dal Lake and the Mughal Gardens
          in Srinagar to the snow-covered slopes of Gulmarg, the meadows of Pahalgam, and the glacier views
          of Sonamarg. Whether you&apos;re booking a{' '}
          <Link href="/holidays" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>holiday package</Link>,
          {' '}looking for a{' '}
          <Link href="/hotel" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>hotel</Link>,
          {' '}need a{' '}
          <Link href="/cabs" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>cab for local sightseeing or an airport transfer</Link>,
          {' '}or want to add a{' '}
          <Link href="/activities" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>local activity or experience</Link>,
          {' '}we put it all together in one place.
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
            Kashmir&apos;s tourist season runs almost all year — spring for Tulip Garden and blossoms,
            summer for cool valley weather, autumn for the Chinar trees turning gold, and winter for
            snowfall in Gulmarg and Pahalgam. Popular experiences include a houseboat stay and Shikara
            ride on Dal Lake in Srinagar, the Gulmarg Gondola cable car ride to Kongdoori and Apharwat,
            pony rides and river-side walks in Pahalgam, and the glacier trek near Thajiwas in Sonamarg.
            Beyond Kashmir, we also plan trips to Leh Ladakh, Manali, Munnar, Goa and Dubai for travellers
            looking to explore further afield.
          </p>
          <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9', marginTop: '14px' }}>
            Every{' '}
            <Link href="/holidays" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>holiday package</Link>
            {' '}on our site can be filtered by destination, duration and category — honeymoon,
            family, luxury, adventure, trekking, pilgrimage and more — and each package clearly lists
            what&apos;s included, so there are no surprises at checkout. For a trip that doesn&apos;t
            fit a ready-made package, use the{' '}
            <span className="font-bold text-slate-800">Customize Package</span> button in the menu and
            our team will build an itinerary around your dates, budget and group size. You can also{' '}
            <Link href="/group-tours" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>join a fixed-departure group tour</Link>
            {' '}if you&apos;d rather travel with a small group than plan everything yourself.
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
