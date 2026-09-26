import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { API_BASE_URL, resolveAssetUrl } from '../../../config';
import { HotelDetailsContent } from '../../../components/HotelDetailsContent';
import { buildHotelSchema } from '../../../lib/schema';

export const revalidate = 60;

interface HotelSeo {
  id: number;
  name: string;
  slug: string;
  location: string;
  short_description?: string;
  meta_title?: string;
  meta_description?: string;
  // Present in the API response (it's a `SELECT *`) even though only the fields
  // above were previously typed here - used for the Hotel schema below.
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  price_per_night?: string | number;
  star_rating?: string | number;
  featured_image?: string;
  featured_image_alt?: string;
  contact_phone?: string;
}

async function getHotel(slug: string): Promise<HotelSeo | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/hotels.php?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hotel = await getHotel(slug);
  if (!hotel) {
    return { title: 'Hotel Not Found - Twin Brothers Holidays' };
  }
  const title = hotel.meta_title || `${hotel.name}, ${hotel.location} - Book Now | Twin Brothers Holidays`;
  const description = hotel.meta_description || hotel.short_description || `Book ${hotel.name} in ${hotel.location} with Twin Brothers Holidays. Compare rooms, amenities and prices, and get instant confirmation.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/hotels-details/${slug}` },
  };
}

export default async function HotelDetailsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = await getHotel(slug);

  if (!hotel) {
    notFound();
  }

  const hotelSchema = buildHotelSchema({
    ...hotel,
    phone: hotel.contact_phone,
    image: hotel.featured_image ? resolveAssetUrl(hotel.featured_image.replace(/^\.\.\//, '')) : undefined,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }} />
      <Suspense fallback={
        <div className="max-w-[1140px] mx-auto px-4 w-full py-16 text-center flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff8126]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }>
        <HotelDetailsContent initialId={String(hotel.id)} />
      </Suspense>
    </>
  );
}
