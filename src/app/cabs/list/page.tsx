import React, { Suspense } from 'react';
import { CabListContent } from '../../../components/CabListContent';

function CabCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 flex flex-col md:flex-row gap-4 animate-pulse shadow-sm">
      <div className="w-full md:w-[220px] h-[140px] bg-slate-200 rounded-xl flex-shrink-0"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="w-full md:w-40 space-y-2">
        <div className="h-6 bg-slate-200 rounded w-full"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
  );
}

export default function CabListPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#f8fafc] min-h-screen pb-16">
          <div className="bg-gradient-to-r from-[#094074] to-[#05213d] py-6 px-4">
            <div className="max-w-[1140px] mx-auto h-24 bg-white/10 rounded-2xl animate-pulse"></div>
          </div>
          <div className="max-w-[1140px] mx-auto px-4 mt-6">
            <CabCardSkeleton />
            <CabCardSkeleton />
          </div>
        </div>
      }
    >
      <CabListContent />
    </Suspense>
  );
}
