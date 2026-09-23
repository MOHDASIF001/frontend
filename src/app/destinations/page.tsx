import React, { Suspense } from 'react';
import DestinationsExplorer from '../../components/DestinationsExplorer';
import { API_BASE_URL } from '../../config';

export const revalidate = 3600;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=destinations.php`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "Destinations - Twin Brothers Holidays",
      description: "Top Destinations in Kashmir",
    };
  }
}

async function getPackages() {
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

export default async function DestinationsPage() {
  const packages = await getPackages();

  return (
    <Suspense fallback={null}>
      <DestinationsExplorer packages={packages} viewAllLinkPattern="/holidays/{slug}-tours-packages/" />
    </Suspense>
  );
}
