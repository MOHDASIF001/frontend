import React from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveAssetUrl } from '../../config';

export const revalidate = 3600;

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  featured_image_alt?: string;
  category?: string;
  publish_date: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr.replace(' ', 'T'));
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function getBlogData(category?: string) {
  try {
    const url = category
      ? `${API_BASE_URL}/blogs.php?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/blogs.php`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    const data = await res.json();
    if (data.status === 'success') {
      return { posts: data.data as BlogPost[], categories: (data.categories as string[]) || [] };
    }
    return { posts: [], categories: [] };
  } catch (err) {
    console.error('Error fetching blog list:', err);
    return { posts: [], categories: [] };
  }
}

export async function generateMetadata() {
  return {
    title: 'Travel Blog - Guides, Tips & Stories | Twin Brothers Holidays',
    description:
      'Read travel guides, destination tips and inspiration from Twin Brothers Holidays — Kashmir, Kerala, Manali, Goa and more.',
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { posts, categories } = await getBlogData(category);

  return (
    <div className="overflow-x-hidden bg-[#fbfaf8] min-h-screen">
      {/* Hero */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '96px', paddingBottom: '48px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        {/* Soft accent glows, matching the rest of the site's brand colors */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ top: '-60px', right: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,129,38,0.18) 0%, rgba(255,129,38,0) 70%)' }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ bottom: '-80px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,145,242,0.18) 0%, rgba(29,145,242,0) 70%)' }}
        />

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span
            className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider"
            style={{ fontSize: '11px', color: '#ff8126' }}
          >
            <i className="fa-solid fa-feather-pointed"></i>
            Twin Brothers Holidays Blog
          </span>
          <h1 className="font-black text-white mt-2" style={{ fontSize: '28px', lineHeight: '1.2' }}>
            Travel Stories, Guides &amp; Insider Tips
          </h1>
          <p className="font-semibold mt-2 mx-auto" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.75)', maxWidth: '520px' }}>
            Destination guides, itineraries, and real travel advice — straight from our team.
          </p>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 5, marginTop: '-40px', paddingBottom: '64px' }}>
        {/* Category filter */}
        {categories.length > 0 && (
          <div
            className="flex flex-nowrap items-center gap-2 bg-white overflow-x-auto"
            style={{
              borderRadius: '16px',
              border: '1px solid #eef1f5',
              padding: '10px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              marginBottom: '32px',
            }}
          >
            <Link
              href="/blog"
              className="font-bold flex-shrink-0 whitespace-nowrap"
              style={{
                fontSize: '13px',
                borderRadius: '999px',
                padding: '9px 18px',
                textDecoration: 'none',
                background: !category ? 'linear-gradient(135deg, #094074, #1a5ba8)' : 'transparent',
                color: !category ? '#fff' : '#64748b',
              }}
            >
              All Articles
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className="font-bold flex-shrink-0 whitespace-nowrap"
                style={{
                  fontSize: '13px',
                  borderRadius: '999px',
                  padding: '9px 18px',
                  textDecoration: 'none',
                  background: category === cat ? 'linear-gradient(135deg, #094074, #1a5ba8)' : 'transparent',
                  color: category === cat ? '#fff' : '#64748b',
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <i className="fa-regular fa-newspaper" style={{ fontSize: '40px', color: '#cbd5e1' }}></i>
            <p className="font-bold text-slate-500 mt-4" style={{ fontSize: '15px' }}>
              {category ? `No articles in "${category}" yet.` : 'No articles published yet — check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white overflow-hidden"
                style={{ textDecoration: 'none', border: '1px solid #eef1f5', boxShadow: '0 2px 10px rgba(15,23,42,0.04)', borderRadius: '11px' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={post.featured_image ? resolveAssetUrl(post.featured_image) : '/images/default-package.jpg'}
                    alt={post.featured_image_alt || post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.category && (
                    <span
                      className="absolute top-2.5 left-2.5 font-black uppercase tracking-wide"
                      style={{
                        fontSize: '9px',
                        color: '#fff',
                        background: 'rgba(9,64,116,0.85)',
                        padding: '4px 9px',
                        borderRadius: '999px',
                      }}
                    >
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="font-semibold text-slate-400 mb-[3px] flex items-center gap-1.5" style={{ fontSize: '11px' }}>
                    <i className="fa-regular fa-calendar"></i>
                    {formatDate(post.publish_date)}
                  </p>
                  <h3
                    className="font-black text-slate-900 mb-[3px] group-hover:text-[#ff8126] transition-colors"
                    style={{
                      fontSize: '14.5px',
                      lineHeight: '1.35',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-slate-500 font-medium"
                    style={{
                      fontSize: '12px',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 font-black mt-[6px]"
                    style={{ fontSize: '12px', color: '#094074' }}
                  >
                    Read Article
                    <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
