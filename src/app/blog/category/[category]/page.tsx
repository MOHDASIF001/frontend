import React from 'react';
import { notFound } from 'next/navigation';
import BlogListing, { blogCategorySlug, getBlogData } from '../../BlogListing';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

// Category names are admin-defined (e.g. "Kashmir Tour Package"); map the URL slug back to one.
async function resolveCategory(slug: string): Promise<string | undefined> {
  const { categories } = await getBlogData();
  return categories.find((c) => blogCategorySlug(c) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await resolveCategory(slug);
  if (!category) return {};
  return {
    title: `${category} - Travel Blog | Twin Brothers Holidays`,
    description: `Read ${category} travel guides and tips from Twin Brothers Holidays.`,
    alternates: { canonical: `${siteUrl}/blog/category/${slug}` },
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await resolveCategory(slug);
  if (!category) notFound();
  return <BlogListing category={category} />;
}
