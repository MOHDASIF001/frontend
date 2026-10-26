import React from 'react';
import { permanentRedirect } from 'next/navigation';
import BlogListing, { blogCategorySlug } from './BlogListing';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export async function generateMetadata() {
  return {
    title: 'Travel Blog - Guides, Tips & Stories | Twin Brothers Holidays',
    description:
      'Read travel guides, destination tips and inspiration from Twin Brothers Holidays — Kashmir, Kerala, Manali, Goa and more.',
    alternates: { canonical: `${siteUrl}/blog` },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  // Category filters now live at /blog/category/{slug}; old ?category= links (already
  // crawled, and flagged by SEO audits as dynamic URLs) redirect there permanently.
  if (category) permanentRedirect(`/blog/category/${blogCategorySlug(category)}`);
  return <BlogListing />;
}
