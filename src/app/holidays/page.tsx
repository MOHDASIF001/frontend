import React from 'react';
import Link from 'next/link';
import HolidaysSearchBar from '../../components/HolidaysSearchBar';
import HolidaysPromoSlider from '../../components/HolidaysPromoSlider';
import HolidaysHandpicked from '../../components/HolidaysHandpicked';
import { API_BASE_URL, resolveAssetUrl } from '../../config';
import { Category, slugifyCategory, getCategoryImage } from '../../lib/categories';
import { getRegionSlug } from '../../lib/destinationRegions';

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=tour-packages.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "Holidays - Twin Brothers Holidays",
      description: "Best Holiday Packages for Kashmir",
    };
  }
}

async function getPackages() {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php`, { next: { revalidate: 60 } });
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

interface Destination {
  id: number;
  name: string;
  slug: string;
  country: string;
  image: string;
}

async function getPopularDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations.php?popular=1`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch destinations');
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching popular destinations:', err);
    return [];
  }
}

// Admin-controlled destinations can share a region (e.g. Srinagar & Gulmarg both
// belong to Kashmir) — collapse them down to one trending card per region.
function dedupeByRegion(destinations: Destination[]) {
  const seen = new Set<string>();
  const result: { name: string; image: string; href: string }[] = [];
  for (const dest of destinations) {
    const regionSlug = getRegionSlug(dest.slug);
    const key = regionSlug || dest.slug;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      name: regionSlug ? regionSlug.charAt(0).toUpperCase() + regionSlug.slice(1) : dest.name,
      image: dest.image ? resolveAssetUrl(dest.image) : '/images/destination-1.jpg',
      href: regionSlug ? `/holidays/${regionSlug}` : '/destinations',
    });
  }
  return result;
}

const dealCards = [
  { name: 'LADAKH', duration: '5 Nights / 6 Days', image: '/images/destinetion-ladhak.jpg', area: 'a' },
  { name: 'DUBAI', duration: '4 Nights / 5 Days', image: '/images/dest_dubai.png', area: 'b' },
  { name: 'GOA', duration: '3 Nights / 4 Days', image: '/images/dest_goa.png', area: 'c' },
  { name: 'KASHMIR', duration: '4 Nights / 5 Days', image: '/images/gulmarg_main.png', area: 'd' },
  { name: 'KERALA', duration: '4 Nights / 5 Days', image: '/images/Kerala_image.jpg', area: 'e' },
  { name: 'RAJASTHAN', duration: '5 Nights / 6 Days', image: '/images/rajisthan.jpg', area: 'f' },
];

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

const benefits = [
  { icon: 'fa-solid fa-umbrella-beach', title: 'Customised Itineraries', desc: 'Enjoy bespoke holiday packages tailored according to your preferences for a personalised experience.' },
  { icon: 'fa-solid fa-indian-rupee-sign', title: 'Wallet-Friendly Prices', desc: 'Every traveller can embark on unforgettable journeys with our unbeatable holiday package prices.' },
  { icon: 'fa-solid fa-fire', title: 'Exciting Deals', desc: 'Our platform brings you the best deals and discounts on all exclusive holiday packages.' },
  { icon: 'fa-solid fa-headset', title: '24/7 Support', desc: 'Our customer support team is always available to assist you and resolve travel-related queries.' },
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HolidaysPage({ searchParams }: PageProps) {
  const [packages, packageCategories, popularDestinations] = await Promise.all([getPackages(), getCategories(), getPopularDestinations()]);
  const params = await searchParams;
  const activeCategory = typeof params.category === 'string' ? params.category : '';
  const trendingDestinations = dedupeByRegion(popularDestinations.filter((d) => d.country === 'India'));

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '65px', paddingBottom: '60px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="flex justify-start sm:justify-center gap-[10px] sm:gap-5 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {packageCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/holidays/${slugifyCategory(cat.name)}-packages`}
                className="flex flex-col items-center flex-shrink-0"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="flex items-center justify-center rounded-full w-[64px] h-[64px] sm:w-[58px] sm:h-[58px]"
                  style={{
                    padding: '2.5px',
                    background: 'linear-gradient(135deg, #ff8126, #1d91f2)',
                  }}
                >
                  <div
                    className="rounded-full w-full h-full overflow-hidden"
                    style={{ border: '2px solid #16213e' }}
                  >
                    <img src={getCategoryImage(cat.name)} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="font-semibold mt-2 whitespace-nowrap" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          <h1 className="font-black text-white mb-4 whitespace-nowrap sm:whitespace-normal text-[18px] sm:text-[38px]" style={{ lineHeight: '1.15' }}>
            Where Every Holiday Counts!
          </h1>
          <HolidaysSearchBar />
        </div>
      </div>

      {/* Promo Slider */}
      <HolidaysPromoSlider />

      {/* Top Trending Destinations */}
      {trendingDestinations.length > 0 && (
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '48px', paddingBottom: '20px' }}>
          <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>Top Trending Destinations</h2>
          <p className="text-slate-500 font-semibold mb-6" style={{ fontSize: '14px' }}>
            Explore the hottest travel spots across India.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {trendingDestinations.map((dest) => (
              <Link
                key={dest.name}
                href={dest.href}
                className="flex-shrink-0 w-[180px] text-center"
                style={{ textDecoration: 'none' }}
              >
                <div className="w-full h-[180px] rounded-2xl overflow-hidden mb-2">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-black text-slate-900" style={{ fontSize: '15px' }}>{dest.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Deals You Can't Miss */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '20px', paddingBottom: '20px' }}>
        <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>Deals You Can&apos;t Miss</h2>
        <p className="text-slate-500 font-semibold mb-6" style={{ fontSize: '14px' }}>
          Exclusive getaways crafted for you.
        </p>
        {/* Mobile: 2-column grid */}
        <div className="sm:hidden grid grid-cols-2 gap-3">
          {dealCards.map((deal) => (
            <Link
              key={deal.name}
              href={`/destinations?dest=${deal.name.toLowerCase()}`}
              className="relative rounded-2xl overflow-hidden h-[140px]"
              style={{ textDecoration: 'none' }}
            >
              <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)' }}></div>
              <div className="absolute bottom-3 left-3">
                <span className="block text-white font-black" style={{ fontSize: '15px', letterSpacing: '0.5px' }}>{deal.name}</span>
                <span className="block text-white font-semibold" style={{ fontSize: '11px', opacity: 0.9 }}>{deal.duration}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: mosaic grid */}
        <div
          className="hidden sm:grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 180px)',
            gridTemplateAreas: `"a a b c" "d e b f"`,
          }}
        >
          {dealCards.map((deal) => (
            <Link
              key={deal.name}
              href={`/destinations?dest=${deal.name.toLowerCase()}`}
              className="relative rounded-2xl overflow-hidden"
              style={{ gridArea: deal.area, textDecoration: 'none' }}
            >
              <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)' }}></div>
              <div className="absolute bottom-4 left-4">
                <span className="block text-white font-black" style={{ fontSize: '20px', letterSpacing: '0.5px' }}>{deal.name}</span>
                <span className="block text-white font-semibold" style={{ fontSize: '13px', opacity: 0.9 }}>{deal.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Handpicked Holiday Packages (real data, Domestic/International toggle) */}
      <HolidaysHandpicked packages={packages} activeCategory={activeCategory} />

      {/* Benefits of Booking With Us */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '60px' }}>
        <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>Benefits of Booking With Us</h2>
        <p className="text-slate-500 font-semibold mb-6" style={{ fontSize: '14px' }}>
          Discover the unrivalled benefits that promise memorable journeys all along.
        </p>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {benefits.map((b) => (
            <div key={b.title} className="flex-shrink-0 w-[85%] sm:w-auto rounded-2xl border border-slate-150 bg-white text-center" style={{ padding: '28px 20px' }}>
              <div
                className="flex items-center justify-center rounded-full mx-auto mb-4"
                style={{ width: '56px', height: '56px', background: '#fff3eb' }}
              >
                <i className={b.icon} style={{ fontSize: '22px', color: '#ff8126' }}></i>
              </div>
              <h3 className="font-black text-slate-900 mb-2" style={{ fontSize: '16px' }}>{b.title}</h3>
              <p className="text-slate-500 font-semibold" style={{ fontSize: '13px', lineHeight: '1.6' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support / assistance banner */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '60px' }}>
        <div
          className="rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: '#094074', padding: '28px 32px' }}
        >
          <div>
            <h3 className="font-black text-white mb-1" style={{ fontSize: '18px' }}>
              <i className="fa-solid fa-headset mr-2" style={{ color: '#ff8126' }}></i>
              Hassle Free. 24x7 On-Trip Assistance
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <a href="tel:+916005242675" className="flex items-center gap-2 font-bold text-white" style={{ fontSize: '15px', textDecoration: 'none' }}>
              <i className="fa-solid fa-phone" style={{ color: '#ff8126' }}></i>
              +91 6005242675
            </a>
            <a href="mailto:info@twinbholidays.com" className="flex items-center gap-2 font-bold text-white" style={{ fontSize: '15px', textDecoration: 'none' }}>
              <i className="fa-solid fa-envelope" style={{ color: '#ff8126' }}></i>
              info@twinbholidays.com
            </a>
          </div>
        </div>
      </div>

      {/* Book Your Holiday With Twin Brothers Holidays */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '60px' }}>
        <h2 className="font-black text-slate-900 mb-4" style={{ fontSize: '24px' }}>
          Book Your Holiday With Twin Brothers Holidays
        </h2>
        <p className="text-slate-600 leading-relaxed mb-8" style={{ fontSize: '15px' }}>
          Book your holiday packages with Twin Brothers Holidays and discover a world of meticulously curated, affordable itineraries designed to meet the unique needs and budgets of every traveller. Each getaway is crafted with precision, ensuring that every aspect of your journey across Kashmir is seamless and memorable. Whether you&apos;re seeking adventure, relaxation, or a blend of both, our packages promise an unforgettable getaway tailored just for you. Start planning your dream vacation today and experience the perfect escape with our exceptional itineraries.
        </p>

        <h3 className="font-black text-slate-900 mb-3" style={{ fontSize: '18px' }}>
          Enjoy Seamless Booking At Budget-Friendly Prices!
        </h3>
        <p className="text-slate-600 leading-relaxed mb-8" style={{ fontSize: '15px' }}>
          Our platform&apos;s user-friendly interface simplifies the navigation of diverse holiday packages, catering to various destinations, preferences, and budgets across Kashmir. With just a few clicks, travellers can book their ideal vacation. Whether you&apos;re dreaming of a valley escape or a mountain retreat, finding and booking your perfect getaway is straightforward and hassle-free with us, ensuring a smooth start to your travel adventure.
        </p>

        <h3 className="font-black text-slate-900 mb-3" style={{ fontSize: '18px' }}>
          Create Memories That Last A Lifetime!
        </h3>
        <p className="text-slate-600 leading-relaxed" style={{ fontSize: '15px' }}>
          Book and explore your dream destinations with our exclusive itineraries. Each of our packages is carefully designed to ensure that every traveller enjoys a promising getaway. Whether you&apos;re a solo traveller, part of a group, or travelling with family, we have tailored itineraries to suit everyone. Choose from a variety of splendid holiday packages and let us handle the details, guaranteeing a seamless and memorable experience with Twin Brothers Holidays.
        </p>
      </div>
    </div>
  );
}
