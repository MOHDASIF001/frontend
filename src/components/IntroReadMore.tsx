'use client';

import React, { useState } from 'react';

// Intro paragraph clamped to two lines with a Read more toggle. The full text is always in
// the HTML (only visually clamped), so search engines read all of it.
export default function IntroReadMore({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-150" style={{ borderRadius: '11px', padding: '12px 16px' }}>
      <p
        className={`text-slate-600 font-medium ${expanded ? '' : 'line-clamp-2'}`}
        style={{ fontSize: '14px', lineHeight: '1.8', margin: 0 }}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="font-semibold border-none bg-transparent cursor-pointer inline-flex items-center gap-1"
        style={{ color: '#ff8126', fontSize: '13.5px', padding: 0, marginTop: '4px' }}
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
  );
}
