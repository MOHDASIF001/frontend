import React from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveAssetUrl } from '../../../config';
import BlogShareBar from '../../../components/BlogShareBar';
import PackageCard, { PackageCardData } from '../../../components/PackageCard';

export const revalidate = 3600;

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image: string;
  featured_image_alt?: string;
  category?: string;
  tags?: string;
  publish_date: string;
  views: number;
  meta_title?: string;
  meta_description?: string;
  author_name?: string;
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  featured_image_alt?: string;
  category?: string;
  publish_date: string;
}

async function getBlogPost(slug: string): Promise<{ post: BlogPost | null; related: RelatedPost[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs.php?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { post: null, related: [] };
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      return { post: data.data, related: data.related || [] };
    }
    return { post: null, related: [] };
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return { post: null, related: [] };
  }
}

// Packages don't have a formal link to a blog post — matched loosely by
// checking whether the package's destination name appears in (or shares a
// word with) the post's category, e.g. category "Kashmir" matches a package
// whose location_name is "Srinagar, Kashmir". Falls back to the newest
// active packages if nothing matches, so this section is never empty.
async function getRelatedPackages(category?: string): Promise<PackageCardData[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success' || !Array.isArray(data.data)) return [];
    const all: (PackageCardData & { location_name?: string })[] = data.data;

    let matched: typeof all = [];
    if (category) {
      const needle = category.trim().toLowerCase();
      matched = all.filter((p) => (p.location_name || '').toLowerCase().includes(needle));
    }
    const pool = matched.length > 0 ? matched : all;
    return pool.slice(0, 4);
  } catch (err) {
    console.error('Error fetching related packages:', err);
    return [];
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr.replace(' ', 'T'));
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Rough reading time from plain-text word count (~200 wpm) — good enough for
// a "X min read" label without pulling in a whole library for it.
function readingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { post } = await getBlogPost(slug);
  if (!post) {
    return { title: 'Article Not Found - Twin Brothers Holidays' };
  }
  return {
    title: post.meta_title || `${post.title} - Twin Brothers Holidays Blog`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [resolveAssetUrl(post.featured_image)] : undefined,
      type: 'article',
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { post, related } = await getBlogPost(slug);
  const relatedPackages = post ? await getRelatedPackages(post.category) : [];

  if (!post) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '140px', paddingBottom: '80px' }}>
          <i className="fa-regular fa-newspaper" style={{ fontSize: '40px', color: '#cbd5e1' }}></i>
          <p className="text-slate-500 font-semibold mt-4">This article could not be found — it may have been unpublished.</p>
          <Link href="/blog" className="mt-3 inline-block font-bold hover:underline" style={{ color: '#094074', textDecoration: 'none' }}>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const img = post.featured_image ? resolveAssetUrl(post.featured_image) : '/images/default-package.jpg';
  const tags = (post.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="overflow-x-hidden bg-white min-h-screen">
      {/* Hero */}
      <div className="relative w-full">
        <div className="relative w-full h-[280px] sm:h-[420px] overflow-hidden">
          <img src={img} alt={post.featured_image_alt || post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(9,11,26,0.35) 0%, rgba(9,11,26,0.8) 100%)' }} />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
              <p className="text-white font-semibold mb-3" style={{ fontSize: '13px' }}>
                <Link href="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Home</Link>
                <span className="mx-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
                <Link href="/blog" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Blog</Link>
              </p>
              {post.category && (
                <span
                  className="inline-block font-black uppercase tracking-wide mb-3"
                  style={{ fontSize: '11px', color: '#fff', background: 'rgba(255,129,38,0.9)', padding: '6px 14px', borderRadius: '999px' }}
                >
                  {post.category}
                </span>
              )}
              <h1 className="font-black text-white text-[24px] sm:text-[38px]" style={{ lineHeight: '1.25' }}>
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
                <span className="flex items-center gap-2 text-white font-semibold" style={{ fontSize: '13px' }}>
                  <span
                    className="flex items-center justify-center rounded-full font-black"
                    style={{ width: '26px', height: '26px', background: '#ff8126', fontSize: '11px' }}
                  >
                    {(post.author_name || 'T')[0]}
                  </span>
                  {post.author_name || 'Twin Brothers Holidays'}
                </span>
                <span className="text-white font-semibold flex items-center gap-1.5" style={{ fontSize: '13px' }}>
                  <i className="fa-regular fa-calendar"></i>
                  {formatDate(post.publish_date)}
                </span>
                <span className="text-white font-semibold flex items-center gap-1.5" style={{ fontSize: '13px' }}>
                  <i className="fa-regular fa-clock"></i>
                  {readingTime(post.content)} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        {post.excerpt && (
          <p
            className="font-semibold text-slate-600"
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              borderLeft: '3px solid #ff8126',
              paddingLeft: '18px',
              marginBottom: '32px',
            }}
          >
            {post.excerpt}
          </p>
        )}
        <article
          className="blog-content text-slate-700"
          style={{ fontSize: '17px', lineHeight: '1.9' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-6" style={{ borderTop: '1px solid #eef1f5' }}>
            <span className="font-black text-slate-400 uppercase mr-1" style={{ fontSize: '11px' }}>Tags</span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-bold"
                style={{ fontSize: '12px', color: '#094074', background: '#eaf1f8', padding: '6px 12px', borderRadius: '999px' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <BlogShareBar title={post.title} />

        {/* CTA */}
        <div
          className="mt-10 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, #094074, #1a5ba8)', padding: '32px 24px' }}
        >
          <h3 className="font-black text-white" style={{ fontSize: '20px' }}>Ready to plan your own trip?</h3>
          <p className="font-semibold mt-2" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            Talk to our travel experts and get a customised itinerary, free of cost.
          </p>
          <Link
            href="/contact-us"
            className="inline-block font-black uppercase tracking-wider text-white mt-5"
            style={{ background: '#ff8126', fontSize: '13px', borderRadius: '999px', padding: '13px 32px', textDecoration: 'none' }}
          >
            Get In Touch
          </Link>
        </div>
      </div>

      {/* Related Tour Packages */}
      {relatedPackages.length > 0 && (
        <div style={{ background: '#eaf1f8', padding: '48px 0 56px' }}>
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 font-black uppercase tracking-wider" style={{ fontSize: '12px', color: '#ff8126' }}>
                  <i className="fa-solid fa-suitcase-rolling"></i>
                  Plan Your Trip
                </span>
                <h2 className="font-black text-slate-900 mt-2" style={{ fontSize: '24px' }}>
                  {post.category ? `Related ${post.category} Tour Packages` : 'Related Tour Packages'}
                </h2>
              </div>
              <Link href="/holidays" className="font-black flex items-center gap-2" style={{ fontSize: '14px', color: '#094074', textDecoration: 'none' }}>
                View All Packages
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="popular-pkgs-grid">
              {relatedPackages.map((pkg) => (
                <div key={pkg.id} className="package-wow-card">
                  <PackageCard pkg={pkg} layout="grid" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related posts */}
      {related.length > 0 && (
        <div style={{ background: '#fbfaf8', padding: '48px 0 64px' }}>
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-black text-slate-900 mb-6" style={{ fontSize: '22px' }}>You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden"
                  style={{ textDecoration: 'none', border: '1px solid #eef1f5', boxShadow: '0 2px 10px rgba(15,23,42,0.04)' }}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={r.featured_image ? resolveAssetUrl(r.featured_image) : '/images/default-package.jpg'}
                      alt={r.featured_image_alt || r.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-slate-400 mb-2" style={{ fontSize: '12px' }}>{formatDate(r.publish_date)}</p>
                    <h3 className="font-black text-slate-900 group-hover:text-[#ff8126] transition-colors" style={{ fontSize: '15px', lineHeight: '1.4' }}>
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
