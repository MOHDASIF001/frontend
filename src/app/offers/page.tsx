import React from 'react';
import SeoContentSection from "../../components/SeoContentSection";
import { offersHubContent } from "../../lib/seoContent";
import Link from 'next/link';
import { API_BASE_URL, resolveAssetUrl } from '../../config';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Exclusive Offers - Twin Brothers Holidays',
    description: 'Browse all current deals and discounts on holiday packages, hotels, cabs and bus bookings with Twin Brothers Holidays.',
  };
}

interface OfferCard {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  tag?: string;
  code?: string;
  valid_until?: string;
  image?: string;
  image_alt?: string | null;
}

async function getOffers(): Promise<OfferCard[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/offers.php`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching offers:', err);
    return [];
  }
}

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="bg-gradient-to-br from-[#094074] to-[#05213d] text-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
          <span
            className="inline-block font-bold rounded-full mb-4"
            style={{ fontSize: '11px', color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 16px', letterSpacing: '1px' }}
          >
            EXCLUSIVE OFFERS
          </span>
          <h1 className="font-black" style={{ fontSize: '28px', lineHeight: '1.3', maxWidth: '620px' }}>
            Current Deals &amp; Discounts
          </h1>
          <p className="text-white/75 font-semibold mt-3" style={{ fontSize: '14px', lineHeight: '1.8', maxWidth: '580px' }}>
            Save on holiday packages, hotels, cabs and bus bookings with Twin Brothers Holidays.
          </p>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px', paddingBottom: '56px' }}>
        {offers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
            <p className="text-slate-500 font-semibold">No active offers right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => {
              const img = o.image ? resolveAssetUrl(o.image) : '/images/default-dest.jpg';
              const validity = o.valid_until
                ? `Valid Till: ${new Date(o.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : '';
              return (
                <Link
                  key={o.id}
                  href={`/offers/${o.slug}`}
                  className="block bg-white rounded-lg border border-slate-150 shadow-sm overflow-hidden hover:shadow-md transition duration-300"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative h-[160px] w-full overflow-hidden">
                    <img src={img} alt={o.image_alt || o.title} className="w-full h-full object-cover" />
                    {o.code && (
                      <div
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white py-1 rounded text-[10px] font-black uppercase tracking-wider"
                        style={{ paddingLeft: '8px', paddingRight: '8px' }}
                      >
                        {o.code}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 flex flex-col justify-end p-4">
                      {o.tag && (
                        <span className="text-[9px] uppercase font-black text-slate-300 tracking-wider block">
                          {o.tag}
                        </span>
                      )}
                      <h3 className="font-extrabold text-white mt-1 leading-snug" style={{ fontSize: '15px' }}>
                        {o.title}
                      </h3>
                    </div>
                  </div>
                  <div className="py-3 px-4">
                    <p className="font-normal text-[13px] text-slate-600 leading-snug line-clamp-2 min-h-[36px] mb-2">
                      {o.subtitle}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{validity}</span>
                      <span className="text-[#ff8126] font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                        View Offer <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <SeoContentSection content={offersHubContent} eyebrow="Exclusive Offers" />
    </div>
  );
}
