import React from 'react';
import Link from 'next/link';
import DestinationPackagesGrid from '../../../components/DestinationPackagesGrid';
import { majorDestinations } from '../../../lib/majorDestinations';
import { API_BASE_URL } from '../../../config';

export const revalidate = 3600;

interface Package {
  id: number;
  title: string;
  slug: string;
  location_name?: string;
  category?: string;
  price: string;
  discounted_price: string;
  duration_days: string;
  duration_nights: string;
  short_description?: string;
  featured_image: string;
  popular?: string | number;
  featured?: string | number;
  city_breakdown?: string;
}

async function getPackages(): Promise<Package[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch packages');
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching packages:', err);
    return [];
  }
}

interface PageProps {
  params: Promise<{ destination: string }>;
}

export default async function GroupTourDestinationPage({ params }: PageProps) {
  const { destination: rawSegment } = await params;
  const slug = rawSegment.replace(/-group-tour-packages$/, '');
  const meta = majorDestinations.find((d) => d.slug === slug);

  if (!meta) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <p className="text-slate-500 font-semibold">This page could not be found.</p>
          <Link href="/group-tours" className="mt-3 inline-block font-bold hover:underline" style={{ color: '#094074', textDecoration: 'none' }}>
            Browse all group tour packages
          </Link>
        </div>
      </div>
    );
  }

  const destinationName = meta.label;
  const packages = await getPackages();

  const filteredPackages = packages.filter((pkg) => {
    if ((pkg.category || '').toLowerCase() !== 'group') return false;
    const loc = (pkg.location_name || '').toLowerCase();
    return meta.matchCities.some((city) => loc.includes(city));
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '110px', paddingBottom: '40px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative flex justify-center w-full">
          <h1 className="font-black text-white text-[16px] sm:text-[36px]" style={{ lineHeight: '1.2', whiteSpace: 'nowrap' }}>
            {destinationName} Group Tour Packages
          </h1>
        </div>
      </div>

      {/* About + conversion strip */}
      <div className="max-w-[1140px] mx-auto px-[5px] sm:px-6 lg:px-8" style={{ paddingTop: '0px', marginTop: '5px' }}>
        <div
          className="overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #094074, #16213e)', borderRadius: '11px' }}
        >
          <div className="flex flex-col lg:flex-row items-stretch">
            <div style={{ padding: '24px 26px', flex: 1 }}>
              <h2 className="font-black text-white mb-2" style={{ fontSize: '19px' }}>
                Travel to {destinationName} With a Group That Feels Like Family
              </h2>
              <p className="font-semibold mb-4" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', lineHeight: '1.7', maxWidth: '640px' }}>
                Our {destinationName} group tours are handpicked and fully managed — fixed departures, comfortable
                stays, all sightseeing covered and a dedicated tour manager throughout, so you just show up and enjoy.
                Perfect for friends, families and solo travellers looking to explore {destinationName} together at a
                budget-friendly group price.
              </p>
              <a
                href="tel:+916005242675"
                className="inline-flex items-center gap-2 font-bold"
                style={{
                  fontSize: '13px',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #ff8126, #fd661e)',
                  padding: '11px 22px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                }}
              >
                <i className="fa-solid fa-phone" style={{ fontSize: '13px' }}></i>
                Talk to a Travel Expert
              </a>
            </div>
            <div
              className="grid grid-cols-2 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              {[
                { icon: 'fa-calendar-check', label: 'Fixed Departures' },
                { icon: 'fa-people-group', label: 'Handpicked Groups' },
                { icon: 'fa-tags', label: 'Best Group Price' },
                { icon: 'fa-headset', label: '24/7 Support' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center text-center"
                  style={{
                    padding: '20px 18px',
                    borderLeft: i % 2 === 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    borderTop: i >= 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    minWidth: '140px',
                  }}
                >
                  <i className={`fa-solid ${item.icon}`} style={{ fontSize: '18px', color: '#ff8126', marginBottom: '8px' }}></i>
                  <span className="font-bold text-white" style={{ fontSize: '11.5px' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
            <p className="text-slate-500 font-semibold">No {destinationName} group tour packages available right now.</p>
            <Link href="/group-tours" className="mt-3 inline-block font-bold hover:underline" style={{ color: '#094074', textDecoration: 'none' }}>
              Browse all group tour packages
            </Link>
          </div>
        ) : (
          <DestinationPackagesGrid packages={filteredPackages} destinationName={destinationName} />
        )}
      </div>
    </div>
  );
}
