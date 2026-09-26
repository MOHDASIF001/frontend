import React from 'react';
import Link from 'next/link';

// Shown (inside the normal Navbar/Footer layout) for any route Next.js can't
// match, and for every notFound() call in a dynamic page (unknown package,
// destination, offer, blog post, etc.) so a broken/old link always gets a
// real 404 status *and* a properly branded page, not the bare default one.
export default function NotFound() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
        <p className="font-black" style={{ fontSize: '64px', color: '#094074', lineHeight: 1 }}>404</p>
        <h1 className="font-black text-slate-900 mt-3" style={{ fontSize: '22px' }}>
          This page could not be found
        </h1>
        <p className="text-slate-500 font-medium mt-2" style={{ fontSize: '14px' }}>
          The page you&apos;re looking for may have been moved, renamed or never existed.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link
            href="/"
            className="font-bold"
            style={{ background: '#ff8126', color: '#fff', padding: '12px 26px', borderRadius: '999px', fontSize: '14px', textDecoration: 'none' }}
          >
            Back to Home
          </Link>
          <Link
            href="/holidays"
            className="font-bold"
            style={{ border: '1.5px solid #094074', color: '#094074', padding: '12px 26px', borderRadius: '999px', fontSize: '14px', textDecoration: 'none' }}
          >
            Browse Holiday Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
