import React, { Suspense } from 'react';
import CabCheckoutContent from './CabCheckoutContent';

export default function CabCheckoutPage() {
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
