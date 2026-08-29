'use client';

import React, { Suspense } from 'react';
import { HotelDetailsContent } from '../../components/HotelDetailsContent';

export default function HotelsDetailsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1140px] mx-auto px-4 w-full py-16 text-center flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff8126]" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    }>
      <HotelDetailsContent />
    </Suspense>
  );
}
