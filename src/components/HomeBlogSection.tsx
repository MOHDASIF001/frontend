import React from 'react';
import Link from 'next/link';
import { resolveAssetUrl } from '../config';

export interface BlogCardData {
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

export default function HomeBlogSection({ posts }: { posts: BlogCardData[] }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div style={{ background: 'linear-gradient(180deg, #fbfaf8 0%, #fff 100%)', padding: '48px 0 56px' }}>
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span
              className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider"
              style={{ fontSize: '12px', color: '#ff8126' }}
            >
              <i className="fa-solid fa-feather-pointed"></i>
              From The Blog
            </span>
            <h2 className="font-black text-slate-900 mt-2" style={{ fontSize: '28px' }}>
              Travel Stories &amp; Guides
            </h2>
            <p className="text-slate-500 font-semibold mt-1" style={{ fontSize: '14px' }}>
              Insider tips, itineraries and inspiration for your next trip.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 font-black"
            style={{ fontSize: '14px', color: '#094074', textDecoration: 'none' }}
          >
            View All Articles
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

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

        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-black"
            style={{ fontSize: '14px', color: '#094074', textDecoration: 'none' }}
          >
            View All Articles
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
