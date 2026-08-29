'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface DestinationSeoSectionProps {
  destinationName: string;
}

const whyChooseUs = [
  {
    icon: 'fa-map-location-dot',
    title: 'Curated Packages',
    text: 'Every package is built around real, bookable hotels, cabs and activities — not a generic template.',
  },
  {
    icon: 'fa-tags',
    title: 'Transparent Pricing',
    text: 'Inclusions, exclusions and the final price are listed upfront on every package — no surprises at checkout.',
  },
  {
    icon: 'fa-user-shield',
    title: 'Local Expertise',
    text: 'Our team plans each itinerary with on-ground knowledge of hotels, drivers and seasonal conditions.',
  },
  {
    icon: 'fa-headset',
    title: 'Support When You Need It',
    text: 'From the first enquiry to the day you travel, our team is a call or message away.',
  },
];

export default function DestinationSeoSection({ destinationName }: DestinationSeoSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO paragraph */}
        <span className="font-bold uppercase" style={{ fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' }}>
          Travel Guide
        </span>
        <h2 className="font-black text-slate-900 mt-2 mb-4" style={{ fontSize: '22px', lineHeight: '1.35' }}>
          {destinationName} Holiday Packages With Twin Brothers Holidays
        </h2>

        <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9' }}>
          Planning a trip to {destinationName}? Twin Brothers Holidays puts together{' '}
          <Link href="/holidays" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>holiday packages</Link>
          {' '}for {destinationName} that combine stays, local transport and sightseeing into one clear
          itinerary — so you spend less time planning and more time travelling. Packages here can be
          filtered by duration, price and category, including honeymoon, family, luxury, adventure and
          group tour options, and each one lists exactly what&apos;s included before you book.
        </p>

        <div
          style={{
            maxHeight: expanded ? '600px' : '0px',
            opacity: expanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.6s ease, opacity 0.4s ease',
          }}
        >
          <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9', marginTop: '18px' }}>
            If none of the ready-made {destinationName} packages match what you have in mind, use the{' '}
            <span className="font-bold text-slate-800">Customize Package</span> button in the menu and
            our team will build an itinerary around your travel dates, budget and group size. You can also
            book a{' '}
            <Link href="/hotel" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>hotel</Link>,
            {' '}a{' '}
            <Link href="/cabs" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>cab</Link>,
            {' '}or a local{' '}
            <Link href="/activities" style={{ color: '#094074', fontWeight: 700, textDecoration: 'none' }}>activity</Link>
            {' '}on its own if you&apos;re only looking for one part of the trip, or{' '}
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

        {/* Why Choose Us */}
        <div style={{ marginTop: '40px' }}>
          <h3 className="font-black text-slate-900 mb-5" style={{ fontSize: '18px' }}>
            Why Book {destinationName} With Us
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.map((c) => (
              <div
                key={c.title}
                className="bg-[#f8fafc] border border-slate-150"
                style={{ borderRadius: '16px', padding: '20px' }}
              >
                <span
                  className="flex items-center justify-center mb-3"
                  style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff3eb' }}
                >
                  <i className={`fa-solid ${c.icon}`} style={{ color: '#ff8126', fontSize: '15px' }}></i>
                </span>
                <h4 className="font-black text-slate-900 mb-1.5" style={{ fontSize: '13.5px' }}>{c.title}</h4>
                <p className="text-slate-500 font-medium" style={{ fontSize: '12px', lineHeight: '1.7' }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
