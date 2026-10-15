import { API_BASE_URL } from '../../config';
import CabsPageClient from './CabsPageClient';

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

// Fetches the data that drives /cabs' "Popular Cab Services", "Flexible Hourly
// Car Rentals", "All Cities We Serve" and "Exclusive Offers" sections on the
// server, so they (and their links to every /cabs/{city} page) are present in
// the first HTML response instead of only appearing after client-side
// hydration (CabsPageClient still fetches everything itself as a fallback).
export default async function CabsPage() {
  const [locations, offers, hourlyRentalCities, popularCities] = await Promise.all([
    safeFetch(`${API_BASE_URL}/cab_locations.php`),
    safeFetch(`${API_BASE_URL}/offers.php?page=cabs`),
    safeFetch(`${API_BASE_URL}/cab_service_cities.php?section=hourly`),
    safeFetch(`${API_BASE_URL}/cab_service_cities.php?section=popular&tab=airport`),
  ]);

  return (
    <CabsPageClient
      initialLocations={locations}
      initialOffers={offers}
      initialHourlyRentalCities={hourlyRentalCities}
      initialPopularCities={popularCities}
    />
  );
}
