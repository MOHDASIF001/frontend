import React from 'react';
import { notFound } from 'next/navigation';
import ActivityDetailContent, { type Activity } from '../../../../components/ActivityDetailContent';
import { API_BASE_URL, resolveAssetUrl } from '../../../../config';
import { toTitleCase, slugifyActivityName } from '../../utils';
import { buildActivitySchema, buildBreadcrumbSchema } from '../../../../lib/schema';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

async function getActivity(rawCitySegment: string, activitySlug: string): Promise<Activity | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/activities.php`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success' || !Array.isArray(data.data)) return null;
    const match = (data.data as Activity[]).find((a) => slugifyActivityName(a.name) === activitySlug);
    return match || null;
  } catch (err) {
    console.error('Error fetching activity:', err);
    return null;
  }
}

interface PageProps {
  params: Promise<{ city: string; activity: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { city, activity: activitySlug } = await params;
  const citySlug = city.replace(/^activity-in-/, '');
  const cityName = toTitleCase(citySlug);
  const activity = await getActivity(city, activitySlug);

  if (!activity) {
    return { title: 'Activity Not Found - Twin Brothers Holidays' };
  }

  // The admin panel's Meta Title / Meta Description were being ignored here in favour of a
  // generated "{name} | {City} Activities - Twin Brothers Holidays" that ran 73-96 chars.
  const title = activity.meta_title?.trim() || `${activity.name} | Twin B Holidays`;
  const description =
    activity.meta_description?.trim() ||
    activity.description?.trim().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160) ||
    `Book ${activity.name} in ${cityName} with Twin Brothers Holidays. Easy booking, instant confirmation and great prices.`;
  const image = activity.featured_image ? resolveAssetUrl(activity.featured_image) : undefined;
  const canonical = `${siteUrl}/activities/${city}/${activitySlug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: activity.featured_image_alt || activity.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { city, activity: activitySlug } = await params;
  const citySlug = city.replace(/^activity-in-/, '');
  const cityName = toTitleCase(citySlug);
  const activity = await getActivity(city, activitySlug);

  if (!activity) {
    notFound();
  }

  const image = activity.featured_image ? resolveAssetUrl(activity.featured_image) : undefined;
  const activityUrl = `${siteUrl}/activities/${city}/${activitySlug}`;
  const activitySchema = buildActivitySchema({
    name: activity.name,
    city: cityName,
    description: activity.description,
    price: activity.price,
    offerPrice: activity.offer_price,
    duration: activity.duration,
    image,
    url: activityUrl,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Activities', path: '/activities' },
    { name: `Activities in ${cityName}`, path: `/activities/${city}` },
    { name: activity.name, path: `/activities/${city}/${activitySlug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(activitySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ActivityDetailContent activity={activity} cityName={cityName} rawCitySegment={city} />
    </>
  );
}
