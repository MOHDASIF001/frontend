import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { API_BASE_URL, resolveAssetUrl } from '../../../config';
import { HotelDetailsContent, type HotelDetails } from '../../../components/HotelDetailsContent';
import { buildHotelSchema } from '../../../lib/schema';

export const revalidate = 60;

interface HotelSeo extends HotelDetails {
  // Present in the API response (it's a `SELECT *`) even though only the fields
  // in HotelDetails were previously typed here - used for the Hotel schema below.
  meta_title?: string;
  meta_description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
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
  // `location` is sometimes left empty in the admin (only `city` filled in) - fall
  // back so the title/description never end up with a literal "null" in them.
  const placeName = hotel.location || hotel.city || '';
  const nameHasPlace = placeName && hotel.name.toLowerCase().includes(placeName.toLowerCase());
  const title = hotel.meta_title || (placeName && !nameHasPlace ? `${hotel.name}, ${placeName} | Twin B Holidays` : `${hotel.name} | Twin B Holidays`);
  const description = hotel.meta_description || hotel.short_description || (placeName ? `Book ${hotel.name} in ${placeName} with Twin Brothers Holidays. Compare rooms, amenities and prices, and get instant confirmation.` : `Book ${hotel.name} with Twin Brothers Holidays. Compare rooms, amenities and prices, and get instant confirmation.`);
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
        <HotelDetailsContent initialId={String(hotel.id)} initialHotel={hotel} />
      </Suspense>
    </>
  );
}
