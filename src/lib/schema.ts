// Small, focused schema.org JSON-LD builders. Every one of these is generated
// straight from data the admin already fills in (title, price, images, address,
// meta fields...) - there is no separate "write your own schema" admin field,
// since a hand-typed JSON-LD box is one typo away from silently breaking a page's
// structured data. Render the result with:
//   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

// resolveAssetUrl() returns a site-relative path ("/images/...") for the handful
// of images that are actually bundled with the frontend rather than hosted on the
// backend - schema.org/Google expect every "image" value to be an absolute URL.
function absoluteImage(url?: string): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export interface BreadcrumbItem {
  name: string;
  path: string; // site-relative, e.g. "/holidays" or "/holidays/kashmir-tour"
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export interface PackageSchemaSource {
  title: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  price?: string | number | null;
  discounted_price?: string | number | null;
  duration_days?: string | number | null;
  duration_nights?: string | number | null;
  location_name?: string | null;
  image?: string; // already-resolved absolute URL
}

export function buildPackageSchema(pkg: PackageSchemaSource) {
  const price = Number(pkg.discounted_price) > 0 ? Number(pkg.discounted_price) : Number(pkg.price) || undefined;
  const description = (pkg.short_description || pkg.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: description || undefined,
    image: pkg.image ? [absoluteImage(pkg.image)] : undefined,
    brand: { '@type': 'Brand', name: 'Twin Brothers Holidays' },
  };
  if (pkg.slug) schema.url = `${siteUrl}/holidays/${pkg.slug}`;
  if (price) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price,
      availability: 'https://schema.org/InStock',
      url: pkg.slug ? `${siteUrl}/holidays/${pkg.slug}` : undefined,
    };
  }
  return schema;
}

export interface HotelSchemaSource {
  name: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  price_per_night?: string | number | null;
  star_rating?: string | number | null;
  image?: string;
  phone?: string | null;
}

export function buildHotelSchema(hotel: HotelSchemaSource) {
  const description = (hotel.short_description || hotel.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: description || undefined,
    image: hotel.image ? [absoluteImage(hotel.image)] : undefined,
    telephone: hotel.phone || undefined,
  };
  if (hotel.slug) schema.url = `${siteUrl}/hotels-details/${hotel.slug}`;
  if (hotel.address || hotel.city) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: hotel.address || undefined,
      addressLocality: hotel.city || undefined,
      addressRegion: hotel.state || undefined,
      addressCountry: hotel.country || 'IN',
    };
  }
  if (hotel.star_rating) schema.starRating = { '@type': 'Rating', ratingValue: hotel.star_rating };
  if (hotel.price_per_night) {
    schema.priceRange = `INR ${hotel.price_per_night}+`;
  }
  return schema;
}

export interface BlogSchemaSource {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string;
  imageAlt?: string | null;
  authorName?: string | null;
  publishDate?: string | null;
  updatedDate?: string | null;
}

export function buildBlogPostingSchema(post: BlogSchemaSource) {
  const description = (post.excerpt || post.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: description || undefined,
    image: post.image ? [absoluteImage(post.image)] : undefined,
    author: { '@type': 'Organization', name: post.authorName || 'Twin Brothers Holidays' },
    publisher: {
      '@type': 'Organization',
      name: 'Twin Brothers Holidays',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/images/twinb-logo-final.png` },
    },
    datePublished: post.publishDate || undefined,
    dateModified: post.updatedDate || post.publishDate || undefined,
  };
  if (post.slug) {
    schema.mainEntityOfPage = { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` };
  }
  return schema;
}
