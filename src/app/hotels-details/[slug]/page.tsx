import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { HotelDetailsContent } from '../../../components/HotelDetailsContent';

export const revalidate = 3600;

interface HotelSeo {
  id: number;
  name: string;
  slug: string;
  location: string;
  short_description?: string;
  meta_title?: string;
  meta_description?: string;
}

async function getHotel(slug: string): Promise<HotelSeo | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels.php?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      return data.data;
    }
    return null;
  } catch (err) {
    console.error('Error fetching hotel:', err);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  if (!hotel) {
    return { title: 'Hotel Not Found - Twin Brothers Holidays' };
  }
  return {
    title: hotel.meta_title || `${hotel.name}, ${hotel.location} - Book Now | Twin Brothers Holidays`,
    description: hotel.meta_description || hotel.short_description || `Book ${hotel.name} in ${hotel.location} with Twin Brothers Holidays. Compare rooms, amenities and prices, and get instant confirmation.`,
  };
}

export default async function HotelDetailsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = await getHotel(slug);

  if (!hotel) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="max-w-[1140px] mx-auto px-4 w-full py-16 text-center flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff8126]" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    }>
      <HotelDetailsContent initialId={String(hotel.id)} />
    </Suspense>
  );
}
