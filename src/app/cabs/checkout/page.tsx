import React, { Suspense } from 'react';
import CabCheckoutContent from './CabCheckoutContent';

// Accepting (and awaiting) `searchParams` here is what actually forces Next.js
// to skip build-time static generation for this route - the earlier
// `export const dynamic = 'force-dynamic'` had no effect on a page with no
// server-rendered dynamic data, and generating a static shell for this page
// was what hung Vercel's build machine.
export default async function CabCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  return (
    <Suspense fallback={
      <div className="max-w-[1140px] mx-auto px-4 w-full py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8126] mx-auto mb-4"></div>
        <p className="text-slate-500 font-bold">Loading booking summary...</p>
      </div>
    }>
      <CabCheckoutContent />
    </Suspense>
  );
}
