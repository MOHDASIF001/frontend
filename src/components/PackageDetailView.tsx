'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useModals } from '../context/ModalContext';

interface ItineraryDay {
  title?: string;
  description?: string;
}

interface PackageData {
  id: number;
  title: string;
  slug: string;
  location_name?: string;
  category?: string;
  price: string;
  discounted_price: string;
  duration_days: string;
  duration_nights: string;
  short_description?: string;
  description?: string;
  what_to_expect?: string;
  inclusions?: string;
  exclusions?: string;
  cancellation_policy?: string;
  itinerary?: ItineraryDay[] | string;
  featured_image: string;
  gallery?: string[];
}

const navSections = [
  { id: 'pkg-overview', label: 'Overview' },
  { id: 'pkg-itinerary', label: 'Day wise Itinerary' },
  { id: 'pkg-inclusion', label: 'Inclusion/Exclusions' },
  { id: 'pkg-additional', label: 'Additional Info' },
];

export default function PackageDetailView({ pkg }: { pkg: PackageData }) {
  const { openModal } = useModals();
  const [activeImage, setActiveImage] = useState(0);
  const [activeSection, setActiveSection] = useState(navSections[0].id);
  const [navbarHeight, setNavbarHeight] = useState(80);

  useEffect(() => {
    const el = document.querySelector('.navbar-contener');
    if (el) setNavbarHeight(el.getBoundingClientRect().height);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 66;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const price = Number(pkg.price) || 0;
  const discountedPrice = Number(pkg.discounted_price) || 0;
  const hasDiscount = discountedPrice > 0 && discountedPrice < price;
  const finalPrice = hasDiscount ? discountedPrice : price;

  const images = pkg.gallery && pkg.gallery.length > 0
    ? pkg.gallery.map((g) => (g.startsWith('http') ? g : `/${g.replace(/^\//, '')}`))
    : [pkg.featured_image ? `/${pkg.featured_image.replace(/^\.\.\//, '')}` : '/images/default-package.jpg'];

  const inclusions = pkg.inclusions ? pkg.inclusions.split('\n').map((s) => s.trim()).filter(Boolean) : [];
  const exclusions = pkg.exclusions ? pkg.exclusions.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  let itineraryDays: ItineraryDay[] = [];
  if (Array.isArray(pkg.itinerary)) {
    itineraryDays = pkg.itinerary;
  } else if (typeof pkg.itinerary === 'string' && pkg.itinerary.trim()) {
    itineraryDays = [{ title: 'Itinerary', description: pkg.itinerary }];
  }

  const handleEnquire = () => {
    openModal('tour_booking', {
      id: pkg.id,
      title: pkg.title,
      price: finalPrice.toString(),
      duration_days: pkg.duration_days,
      duration_nights: pkg.duration_nights,
    });
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${navbarHeight + 10}px`, paddingBottom: '60px' }}>
        {/* Breadcrumb */}
        <p className="text-sm font-semibold text-slate-500 mb-[6px]">
          <Link href="/" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Home</Link>
          <span className="mx-1.5">&gt;</span>
          <Link href="/holidays" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Holidays</Link>
          <span className="mx-1.5">&gt;</span>
          <span className="font-bold" style={{ color: '#094074' }}>{pkg.title}</span>
        </p>

        {/* Title row */}
        <div className="flex flex-wrap items-center gap-3 mb-[2px]">
          <h1 className="font-black text-slate-900" style={{ fontSize: '26px' }}>{pkg.title}</h1>
          {(pkg.duration_nights || pkg.duration_days) && (
            <span className="font-bold text-slate-700" style={{ fontSize: '15px' }}>
              {pkg.duration_nights}N / {pkg.duration_days}D
            </span>
          )}
        </div>
        {pkg.location_name && (
          <p className="flex items-center gap-1.5 text-slate-500 font-semibold mb-[10px]" style={{ fontSize: '13px' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#ff8126' }}></i>
            {pkg.location_name}
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: '360px' }}>
              <img src={images[activeImage]} alt={pkg.title} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
                    style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', background: 'rgba(255,255,255,0.9)', color: '#094074' }}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                    className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
                    style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', background: 'rgba(255,255,255,0.9)', color: '#094074' }}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>

            {/* Sticky section nav */}
            <div className="mb-6" style={{ position: 'sticky', top: `${navbarHeight}px`, zIndex: 30 }}>
              <div
                className="flex flex-nowrap items-center gap-2 bg-white rounded-full overflow-x-auto"
                style={{
                  border: '1px solid #eef1f5',
                  padding: '6px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className="font-bold cursor-pointer border-none flex-shrink-0 whitespace-nowrap"
                    style={{
                      fontSize: '13px',
                      borderRadius: '999px',
                      padding: '10px 20px',
                      background: activeSection === section.id ? 'linear-gradient(135deg, #094074, #1a5ba8)' : 'transparent',
                      color: activeSection === section.id ? '#fff' : '#64748b',
                    }}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-slate-150 rounded-xl p-5">
              <h3 id="pkg-overview" className="font-black text-slate-900 mb-3" style={{ fontSize: '17px', scrollMarginTop: `${navbarHeight + 66}px` }}>Package Overview</h3>
              <p className="text-slate-600" style={{ fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {pkg.description || pkg.short_description || `Discover ${pkg.title} with Twin Brothers Holidays.`}
              </p>
              {pkg.what_to_expect && (
                <>
                  <h3 className="font-black text-slate-900 mt-6 mb-3" style={{ fontSize: '17px' }}>What to Expect</h3>
                  <p className="text-slate-600" style={{ fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                    {pkg.what_to_expect}
                  </p>
                </>
              )}

              {/* Day Wise Itinerary */}
              <h3
                id="pkg-itinerary"
                className="font-black text-slate-900 mt-6 mb-4"
                style={{ fontSize: '17px', borderLeft: '4px solid #094074', paddingLeft: '12px', scrollMarginTop: `${navbarHeight + 66}px` }}
              >
                Day Wise Itinerary
              </h3>
              {itineraryDays.length === 0 ? (
                <p className="text-slate-400 font-semibold" style={{ fontSize: '14px' }}>Itinerary details will be shared upon enquiry.</p>
              ) : (
                <div className="relative">
                  {itineraryDays.map((day, idx) => (
                    <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <span
                          className="flex items-center justify-center rounded-full text-white font-black text-center"
                          style={{ width: '46px', height: '46px', background: 'linear-gradient(135deg, #094074, #1a5ba8)', fontSize: '12px', lineHeight: '1.2' }}
                        >
                          Day<br />{idx + 1}
                        </span>
                        {idx < itineraryDays.length - 1 && <span style={{ width: '2px', flex: 1, background: '#e2e8f0', marginTop: '4px' }}></span>}
                      </div>
                      <div className="flex-1 min-w-0 pb-1 rounded-xl overflow-hidden border border-slate-150">
                        <h4
                          className="font-black text-slate-900"
                          style={{ fontSize: '14px', background: '#eaf1f8', padding: '10px 14px' }}
                        >
                          {day.title || `Day ${idx + 1}`}
                        </h4>
                        <div style={{ padding: '12px 14px' }}>
                          {(day.description || '').split('\n').map((line) => line.trim()).filter(Boolean).map((line, lIdx) => (
                            <p key={lIdx} className="flex items-start gap-2 text-slate-600 mb-1.5 last:mb-0" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                              <span className="rounded-full flex-shrink-0" style={{ width: '5px', height: '5px', background: '#94a3b8', marginTop: '7px' }}></span>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inclusion/Exclusions */}
              <h3
                id="pkg-inclusion"
                className="font-black text-slate-900 mt-6 mb-4"
                style={{ fontSize: '17px', borderLeft: '4px solid #094074', paddingLeft: '12px', scrollMarginTop: `${navbarHeight + 66}px` }}
              >
                Inclusion/Exclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ background: '#eafaf0', borderLeft: '4px solid #1fae5c' }}>
                  <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Inclusions</h4>
                  {inclusions.length > 0 ? (
                    <ul className="space-y-2.5">
                      {inclusions.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                          <i className="fa-solid fa-check mt-0.5" style={{ color: '#1fae5c' }}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 font-semibold" style={{ fontSize: '13px' }}>Contact us for inclusion details.</p>
                  )}
                </div>
                <div className="rounded-xl p-4" style={{ background: '#fdecec', borderLeft: '4px solid #e23a3a' }}>
                  <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Exclusions</h4>
                  {exclusions.length > 0 ? (
                    <ul className="space-y-2.5">
                      {exclusions.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                          <i className="fa-solid fa-xmark mt-0.5" style={{ color: '#e23a3a' }}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 font-semibold" style={{ fontSize: '13px' }}>Contact us for exclusion details.</p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <h3
                id="pkg-additional"
                className="font-black text-slate-900 mt-6 mb-4"
                style={{ fontSize: '17px', borderLeft: '4px solid #094074', paddingLeft: '12px', scrollMarginTop: `${navbarHeight + 66}px` }}
              >
                Additional Info
              </h3>
              <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Cancellation Policy</h4>
              <p className="text-slate-600 mb-2" style={{ fontSize: '13px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {pkg.cancellation_policy || 'Please contact our team for detailed booking and cancellation terms for this package.'}
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="lg:sticky" style={{ top: '96px' }}>
              <div className="rounded-xl overflow-hidden mb-4" style={{ background: '#eaf1f8' }}>
                <div className="p-4">
                  <p className="text-slate-500 font-semibold mb-1" style={{ fontSize: '13px' }}>Starting from</p>
                  {hasDiscount && (
                    <span className="text-slate-400 font-semibold block" style={{ fontSize: '14px', textDecoration: 'line-through' }}>
                      &#8377;{price.toLocaleString('en-IN')}
                    </span>
                  )}
                  <p className="mb-4">
                    <span className="font-black text-slate-900" style={{ fontSize: '26px' }}>&#8377;{finalPrice.toLocaleString('en-IN')}</span>{' '}
                    <span className="text-slate-500 font-semibold" style={{ fontSize: '13px' }}>Per Person</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleEnquire}
                    className="w-full text-white font-black uppercase tracking-wider border-none cursor-pointer"
                    style={{ background: '#ff8126', fontSize: '14px', borderRadius: '999px', padding: '13px 0' }}
                  >
                    Enquire Now
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-150 rounded-xl p-4 mb-4">
                {(pkg.duration_nights || pkg.duration_days) && (
                  <p className="flex items-center gap-2 font-semibold text-slate-700 mb-2" style={{ fontSize: '13px' }}>
                    <i className="fa-regular fa-clock" style={{ color: '#ff8126' }}></i>
                    Duration: {pkg.duration_nights}N / {pkg.duration_days}D
                  </p>
                )}
                {pkg.location_name && (
                  <p className="flex items-center gap-2 font-semibold text-slate-700" style={{ fontSize: '13px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#ff8126' }}></i>
                    Places to Visit: {pkg.location_name}
                  </p>
                )}
              </div>

              <div className="bg-white border border-slate-150 rounded-xl p-4">
                <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Need Help?</h4>
                <a href="tel:+916005242675" className="flex items-center gap-2 font-semibold mb-2" style={{ fontSize: '13px', color: '#334155', textDecoration: 'none' }}>
                  <i className="fa-solid fa-phone" style={{ color: '#ff8126' }}></i>
                  Call Us: +91 6005242675
                </a>
                <a href="mailto:info@twinbholidays.com" className="flex items-center gap-2 font-semibold" style={{ fontSize: '13px', color: '#334155', textDecoration: 'none' }}>
                  <i className="fa-solid fa-envelope" style={{ color: '#ff8126' }}></i>
                  info@twinbholidays.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Enquire Now button */}
      <button
        type="button"
        onClick={handleEnquire}
        className="fixed flex items-center gap-3 cursor-pointer border-none"
        style={{
          right: '24px',
          bottom: '24px',
          zIndex: 40,
          background: '#ffffff',
          borderRadius: '14px',
          padding: '10px 18px 10px 10px',
          boxShadow: '0 8px 24px rgba(9,64,116,0.25)',
        }}
      >
        <span
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #ff8126, #ff9f4d)' }}
        >
          <i className="fa-solid fa-envelope-open-text text-white" style={{ fontSize: '17px' }}></i>
        </span>
        <span className="font-black text-left" style={{ fontSize: '13px', color: '#094074', lineHeight: '1.3' }}>
          Enquire<br />Now
        </span>
      </button>
    </div>
  );
}
