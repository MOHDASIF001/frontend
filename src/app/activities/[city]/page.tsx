import CityActivitiesClient, { type Activity } from './CityActivitiesClient';
import { API_BASE_URL } from '../../../config';
import { toTitleCase } from '../utils';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

// Every city page here was falling back to the parent layout's single static
// "Activities - Twin Brothers Holidays" / "Adventure activities in Kashmir" -
// SEO audits flagged all city pages as duplicate title/meta description.
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const citySlug = city.replace(/^activity-in-/, '');
  const cityName = toTitleCase(citySlug);
  const url = `${siteUrl}/activities/${city}`;
  const title = `${cityName} Activities & Things To Do | Twin Brothers Holidays`;
  const description = `Explore top-rated ${cityName} activities and experiences - book adventure tours, sightseeing and local experiences with Twin Brothers Holidays.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Twin Brothers Holidays', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

// Fetches the full activities list on the server so this page's results (and
// their links to every /activities/{city}/{activity} page) are present in the
// first HTML response instead of only appearing after client-side hydration
// (CityActivitiesClient still fetches it itself as a fallback).
async function getActivities(): Promise<Activity[] | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/activities.php`, { next: { revalidate: 60 } });
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.status === 'success' ? data.data : undefined;
  } catch (err) {
    console.error('Error fetching activities:', err);
    return undefined;
  }
}

export default async function CityActivitiesPage() {
  const activities = await getActivities();
  return <CityActivitiesClient initialActivities={activities} />;
}
