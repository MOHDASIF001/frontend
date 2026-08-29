import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { CabListContent } from '../../../components/CabListContent';

export const revalidate = 3600;

interface CabLocation {
  id: number;
  name: string;
  type: string;
  subtitle: string;
  value: string;
}

async function getLocation(value: string): Promise<CabLocation | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cab_locations.php`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data.find((loc: CabLocation) => loc.value === value) || null;
    }
    return null;
  } catch (err) {
    console.error('Error fetching cab location:', err);
    return null;
  }
}

interface PageProps {
  params: Promise<{ location: string }>;
  searchParams: Promise<{ drop?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { location } = await params;
  const { drop } = await searchParams;
  const loc = await getLocation(location);
  if (!loc) {
    return { title: 'Cab Service Not Found - Twin Brothers Holidays' };
  }
  const dropLoc = drop ? await getLocation(drop) : null;

  if (dropLoc) {
    return {
      title: `${loc.name} to ${dropLoc.name} Cab Booking | Twin Brothers Holidays`,
      description: `Book a reliable cab from ${loc.name} to ${dropLoc.name}. Compare hatchbacks, sedans and SUVs, and get instant confirmation with Twin Brothers Holidays.`,
    };
  }
  return {
    title: `${loc.name} Cab Booking - Book Taxi Service in ${loc.name} | Twin Brothers Holidays`,
    description: `Book a reliable cab in ${loc.name}, ${loc.subtitle}. Compare hatchbacks, sedans and SUVs, and get instant confirmation with Twin Brothers Holidays.`,
  };
}

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

export default async function CabLocationPage({ params, searchParams }: PageProps) {
  const { location } = await params;
  const { drop } = await searchParams;
  const loc = await getLocation(location);

  if (!loc) {
    notFound();
  }

  const dropLoc = drop ? await getLocation(drop) : null;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-4">
      <div className="max-w-[1140px] mx-auto px-4" style={{ paddingTop: '20px' }}>
        <h1 className="font-black text-slate-900" style={{ fontSize: '22px', lineHeight: '1.3' }}>
          {dropLoc ? `Book a Cab from ${loc.name} to ${dropLoc.name}` : `Book a Cab in ${loc.name}`}
        </h1>
        <p className="text-slate-500 font-semibold" style={{ fontSize: '13px', marginTop: '4px' }}>
          {dropLoc
            ? `${loc.name} to ${dropLoc.name} — Compare hatchbacks, sedans and SUVs, and book online with instant confirmation.`
            : `${loc.subtitle} — Compare hatchbacks, sedans and SUVs, and book your ${loc.name} taxi online with instant confirmation.`}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="max-w-[1140px] mx-auto px-4 mt-6">
            <CabCardSkeleton />
            <CabCardSkeleton />
          </div>
        }
      >
        <CabListContent initialPickup={loc.value} />
      </Suspense>
    </div>
  );
}
