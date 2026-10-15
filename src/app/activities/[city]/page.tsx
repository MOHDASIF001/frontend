import CityActivitiesClient, { type Activity } from './CityActivitiesClient';
import { API_BASE_URL } from '../../../config';

export const revalidate = 60;

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
