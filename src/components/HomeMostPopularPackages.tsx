import React from 'react';
import Link from 'next/link';
import PackageCard, { PackageCardData } from './PackageCard';

export default function HomeMostPopularPackages({ packages }: { packages: PackageCardData[] }) {
  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #fbfaf8 0%, #fff 100%)',
        padding: '40px 0 48px',
      }}
    >
      {/* Decorative blurred accents */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-60px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,129,38,0.14) 0%, rgba(255,129,38,0) 70%)',
          pointerEvents: 'none',
        }}
      ></div>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(9,64,116,0.10) 0%, rgba(9,64,116,0) 70%)',
          pointerEvents: 'none',
        }}
      ></div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 16px', position: 'relative' }}>
        <div className="popular-pkgs-header">
          <div className="title-block" style={{ minWidth: 0 }}>
            <span className="popular-pkgs-eyebrow">
              <i className="fa-solid fa-fire"></i>
              Trending Now
            </span>
            <h2 className="popular-pkgs-heading font-black text-slate-900">
              Most Popular{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #ff8126, #fd661e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Packages
              </span>
            </h2>
            <p className="popular-pkgs-subtitle text-slate-500 font-semibold">
              Hand-picked by our travel experts — the getaways our travellers love the most.
            </p>
          </div>
          <Link href="/holidays" className="popular-pkgs-cta">
            View All
            <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
          </Link>
        </div>

        <div className="popular-pkgs-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-wow-card">
              <PackageCard pkg={pkg} layout="grid" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
