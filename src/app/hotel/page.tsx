import { API_BASE_URL, resolveAssetUrl } from '../../config';
import HotelPageClient from './HotelPageClient';
import type { Destination } from './hotel-data';

export const revalidate = 60;

async function safeFetch(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.status === 'success' ? data.data : undefined;
  } catch (err) {
    console.error('Error fetching', url, err);
    return undefined;
  }
}

// Fetches the data that drives /hotel's "Exclusive Offers", "Hotels Of
// Choice", "All Our Hotels" and "Popular Destinations" sections on the
// server, so they (and their links to every /hotels-details/{slug} page) are
// present in the first HTML response instead of only appearing after
// client-side hydration (HotelPageClient still fetches everything itself as
// a fallback).
export default async function HotelPage() {
  const [hotels, offers, choiceHotels, rawCities] = await Promise.all([
    safeFetch(`${API_BASE_URL}/hotels.php`),
    safeFetch(`${API_BASE_URL}/offers.php?page=hotel`),
    safeFetch(`${API_BASE_URL}/hotels.php?featured=1`),
    safeFetch(`${API_BASE_URL}/hotels.php?cities=1`),
  ]);

  const popularCities: Destination[] | undefined = Array.isArray(rawCities)
    ? rawCities.map((c: { city: string; hotel_count: string; sample_image?: string }) => ({
        name: c.city,
        count: `${c.hotel_count} ${Number(c.hotel_count) === 1 ? 'Hotel' : 'Hotels'}`,
        img: c.sample_image ? resolveAssetUrl(c.sample_image) : '/images/default-dest.jpg',
      }))
    : undefined;

  return (
    <HotelPageClient
      initialHotels={hotels}
      initialOffers={offers}
      initialChoiceHotels={choiceHotels}
      initialPopularCities={popularCities}
    />
  );
}
