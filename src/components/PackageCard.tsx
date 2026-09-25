'use client';

import React from 'react';
import Link from 'next/link';
import { useModals } from '../context/ModalContext';
import { resolveAssetUrl } from '../config';

export interface PackageCardData {
  id: number;
  title: string;
  slug: string;
  price: string;
  discounted_price: string;
  duration_days: string;
  duration_nights: string;
  featured_image: string;
  featured_image_alt?: string;
  popular?: string | number;
  featured?: string | number;
  city_breakdown?: string;
}

export default function PackageCard({ pkg, layout = 'row' }: { pkg: PackageCardData; layout?: 'row' | 'grid' }) {
  const isDemo = pkg.id >= 900000;
  const { openModal } = useModals();
  const price = Number(pkg.price) || 0;
  const discountedPrice = Number(pkg.discounted_price) || 0;
  const hasDiscount = discountedPrice > 0 && discountedPrice < price;
  const finalPrice = hasDiscount ? discountedPrice : price;
  const savings = hasDiscount ? price - discountedPrice : 0;
  const img = pkg.featured_image ? resolveAssetUrl(pkg.featured_image) : '/images/default-package.jpg';

  const handleEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal('tour_booking', {
      id: pkg.id,
      title: pkg.title,
      price: finalPrice.toString(),
      duration_days: pkg.duration_days,
      duration_nights: pkg.duration_nights,
    });
  };

  return (
    <div
      className={`${layout === 'row' ? 'flex-shrink-0' : 'w-full'} overflow-hidden flex flex-col`}
      style={{
        width: layout === 'row' ? '270px' : '100%',
        borderRadius: '8px',
        border: '1px solid transparent',
        backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #094074, #ff8126)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <Link href={`/holidays/${pkg.slug}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1.875 / 1', borderRadius: '8px' }}>
          <img src={img} alt={pkg.featured_image_alt || pkg.title} className="w-full h-full object-cover" />
          {hasDiscount && (
            <span
              className="absolute top-3 left-3 font-normal text-white rounded-md flex items-center gap-1.5"
              style={{ fontSize: '11px', padding: '3.5px 10px', background: 'linear-gradient(135deg, #094074, #1a5ba8)' }}
            >
              <i className="fa-solid fa-tag" style={{ fontSize: '9px' }}></i>
              Save &#8377;{savings.toLocaleString('en-IN')}
            </span>
          )}
          {!hasDiscount && (Number(pkg.popular) === 1 || Number(pkg.featured) === 1) && (
            <span
              className="absolute top-3 left-3 font-bold text-white rounded-md"
              style={{ fontSize: '11px', padding: '5px 10px', background: '#ff8126' }}
            >
              Popular
            </span>
          )}
          {isDemo && (
            <span
              className="absolute top-3 right-3 font-bold text-white rounded-md"
              style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(0,0,0,0.55)', letterSpacing: '0.5px' }}
            >
              PREVIEW
            </span>
          )}
        </div>

        <div style={{ padding: '16px 4px 0' }}>
          <span className="text-slate-500 font-semibold mb-1 block" style={{ fontSize: '10px' }}>
            {pkg.duration_days} Days &amp; {pkg.duration_nights} Nights
          </span>
          <h3
            className="font-black text-slate-900 mb-2"
            style={{
              fontSize: '13px',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {pkg.title}
          </h3>

          {pkg.city_breakdown && pkg.city_breakdown.trim() && (
            <div
              className="rounded-md mb-3 flex items-center"
              style={{ background: '#f8f5f0', padding: '7px 10px', fontSize: '10px' }}
            >
              {(() => {
                const segments = pkg.city_breakdown!.split(',').map((s) => s.trim()).filter(Boolean);
                const shown = segments.slice(0, 3);
                const extra = segments.length - shown.length;
                return (
                  <>
                    <span
                      className="text-slate-700 font-semibold overflow-hidden whitespace-nowrap"
                      style={{ letterSpacing: '0.2px', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}
                    >
                      {shown.map((seg, i) => {
                        const match = seg.match(/^(\d+\s*[A-Za-z]*)\s+(.*)$/);
                        return (
                          <React.Fragment key={i}>
                            {i > 0 && <span className="text-slate-300"> &bull; </span>}
                            {match ? (
                              <>
                                <span className="font-black" style={{ color: '#0f172a' }}>{match[1]}</span> {match[2]}
                              </>
                            ) : (
                              seg
                            )}
                          </React.Fragment>
                        );
                      })}
                    </span>
                    {extra > 0 && (
                      <span className="font-black flex-shrink-0" style={{ color: '#ff8126', marginLeft: '4px' }}>
                        +{extra}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1" style={{ padding: '0 4px 8px' }}>
        <div className="mt-auto">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            {hasDiscount && (
              <>
                <span className="text-slate-400 font-semibold line-through" style={{ fontSize: '10px' }}>
                  INR {price.toLocaleString('en-IN')}
                </span>
                <span
                  className="font-bold rounded"
                  style={{ fontSize: '9px', padding: '2px 8px', background: '#e6f6ec', color: '#1fae5c' }}
                >
                  SAVE &#8377;{savings.toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>
          <div className="mb-3">
            <span className="font-black text-slate-900" style={{ fontSize: '15px' }}>
              INR {finalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-slate-400 font-semibold" style={{ fontSize: '10px' }}> / Adult</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:+916005242675"
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: '48px', height: '42px', borderRadius: '7px', border: '1.5px solid #ff8126', color: '#ff8126', textDecoration: 'none' }}
            >
              <i className="fa-solid fa-phone" style={{ fontSize: '14px' }}></i>
            </a>
            <button
              onClick={handleEnquire}
              className="flex-1 font-bold text-white border-0 cursor-pointer"
              style={{ fontSize: '11px', height: '42px', borderRadius: '7px', letterSpacing: '1px', background: 'linear-gradient(to right, #ff8126, #fd661e)' }}
            >
              Request Callback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
