import React from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveAssetUrl } from '../../../config';
import CopyCodeButton from '../../../components/CopyCodeButton';

export const revalidate = 60;

interface OfferData {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  terms_conditions?: string;
  tag?: string;
  code?: string;
  page?: string;
  valid_until?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
}

async function getOffer(slug: string): Promise<OfferData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/offers.php?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      return data.data;
    }
    return null;
  } catch (err) {
    console.error('Error fetching offer:', err);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const offer = await getOffer(slug);
  if (!offer) {
    return { title: 'Offer Not Found - Twin Brothers Holidays' };
  }
  return {
    title: offer.meta_title || `${offer.title} - Twin Brothers Holidays`,
    description: offer.meta_description || offer.subtitle,
  };
}

const servicePageLabels: Record<string, string> = {
  hotel: 'Hotels',
  cabs: 'Cabs',
  bus: 'Bus',
  flights: 'Flights',
  holidays: 'Holidays',
  all: 'All Services',
};

const servicePageHrefs: Record<string, string> = {
  hotel: '/hotel',
  cabs: '/cabs',
  bus: '/bus',
  flights: '/flights',
  holidays: '/holidays',
  all: '/',
};

export default async function OfferDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const offer = await getOffer(slug);

  if (!offer) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <p className="text-slate-500 font-semibold">This offer could not be found — it may have expired or been removed.</p>
          <Link href="/" className="mt-3 inline-block font-bold hover:underline" style={{ color: '#094074', textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const img = offer.image ? resolveAssetUrl(offer.image) : '/images/default-dest.jpg';
  const terms = (offer.terms_conditions || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const serviceLabel = servicePageLabels[offer.page || 'hotel'] || 'Services';
  const serviceHref = servicePageHrefs[offer.page || 'hotel'] || '/';

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <div className="relative w-full">
        <div className="relative w-full h-[260px] sm:h-[340px] overflow-hidden">
          <img src={img} alt={offer.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(9,11,26,0.35) 0%, rgba(9,11,26,0.75) 100%)' }} />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
              {offer.tag && (
                <span
                  className="inline-block font-bold rounded-full mb-3"
                  style={{ fontSize: '11px', color: '#fff', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)', padding: '5px 14px', letterSpacing: '0.5px' }}
                >
                  {offer.tag.toUpperCase()}
                </span>
              )}
              <h1 className="font-black text-white text-[24px] sm:text-[38px]" style={{ lineHeight: '1.2' }}>
                {offer.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {offer.subtitle && (
              <p className="text-slate-700 font-semibold mb-6" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                {offer.subtitle}
              </p>
            )}

            {offer.description && (
              <div className="mb-8">
                <h2 className="font-black text-slate-900 mb-3" style={{ fontSize: '18px' }}>About This Offer</h2>
                <p className="text-slate-600 whitespace-pre-line" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  {offer.description}
                </p>
              </div>
            )}

            {terms.length > 0 && (
              <div>
                <h2 className="font-black text-slate-900 mb-3" style={{ fontSize: '18px' }}>Terms &amp; Conditions</h2>
                <ul className="space-y-2">
                  {terms.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-slate-600 font-semibold" style={{ fontSize: '13px' }}>
                      <span className="rounded-full flex-shrink-0" style={{ width: '5px', height: '5px', background: '#94a3b8', marginTop: '7px' }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white border border-slate-150 rounded-2xl p-5 sticky" style={{ top: '96px' }}>
              {offer.code && (
                <div className="mb-4">
                  <span className="text-slate-400 font-bold uppercase block mb-2" style={{ fontSize: '11px' }}>Coupon Code</span>
                  <CopyCodeButton code={offer.code} />
                </div>
              )}

              {offer.valid_until && (
                <p className="text-slate-500 font-semibold mb-4" style={{ fontSize: '13px' }}>
                  <i className="fa-regular fa-calendar mr-2" style={{ color: '#ff8126' }}></i>
                  Valid till {new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}

              <Link
                href={serviceHref}
                className="w-full text-center block font-black uppercase tracking-wider text-white"
                style={{ background: '#ff8126', fontSize: '13px', borderRadius: '999px', padding: '13px 0', textDecoration: 'none' }}
              >
                Browse {serviceLabel}
              </Link>

              <Link
                href="/contact-us"
                className="w-full text-center block font-bold mt-3"
                style={{ color: '#094074', fontSize: '13px', textDecoration: 'none' }}
              >
                Or talk to us to claim this offer <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
