'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../config';

interface Destination {
  id: number;
  name: string;
  slug: string;
  country: string;
}

const offerings = [
  { label: 'Holiday Packages', href: '/holidays' },
  { label: 'Hotels', href: '/hotel' },
  { label: 'Cabs', href: '/cabs' },
  { label: 'Activities', href: '/activities' },
  { label: 'Group Tours', href: '/group-tours' },
  { label: 'Flights', href: '/flights' },
  { label: 'Bus Booking', href: '/bus' },
  { label: 'Visa Services', href: '/visa' },
  { label: 'Gift Cards', href: '/gift-cards' },
];

const quickLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Working With Us', href: '/working-with-us' },
  { label: 'Customer Support', href: '/customer-support' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
];

export default function Footer() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/destinations.php`);
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setDestinations(data.data);
        }
      } catch (err) {
        console.error('Error fetching footer destinations:', err);
      }
    };
    fetchDestinations();
  }, []);

  const domesticDestinations = destinations.filter((d) => d.country === 'India');
  const internationalDestinations = destinations.filter((d) => d.country !== 'India');

  const linkStyle: React.CSSProperties = { fontSize: '13px', textDecoration: 'none', color: 'rgba(255,255,255,0.72)' };

  return (
    <div style={{ background: 'linear-gradient(180deg, #05213d, #041627)' }}>
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '24px' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <img src="/images/twin-b-white-logo.png" alt="Twin Brothers Holidays Logo" style={{ width: '150px' }} />
            <p className="mt-4" style={{ fontSize: '13px', lineHeight: '1.8', color: 'rgba(255,255,255,0.6)' }}>
              Discover India and beyond with Twin Brothers Holidays — tailored holiday packages, hotels,
              cabs and real local activities across every destination we serve.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              {[
                { icon: 'fa-square-facebook', label: 'Facebook' },
                { icon: 'fa-square-instagram', label: 'Instagram' },
                { icon: 'fa-youtube', label: 'YouTube' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex items-center justify-center"
                  style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#ff8126', textDecoration: 'none' }}
                >
                  <i className={`fa-brands ${s.icon}`} style={{ fontSize: '14px' }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Our Offerings */}
          <div>
            <h6 className="font-black text-white mb-4" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>OUR OFFERINGS</h6>
            <div className="flex flex-col gap-3">
              {offerings.map((o) => (
                <Link key={o.href} href={o.href} style={linkStyle}>{o.label}</Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="font-black text-white mb-4" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>QUICK LINKS</h6>
            <div className="flex flex-col gap-3">
              {quickLinks.map((q) => (
                <Link key={q.href} href={q.href} style={linkStyle}>{q.label}</Link>
              ))}
            </div>
          </div>

          {/* Popular Destinations */}
          {domesticDestinations.length > 0 && (
            <div>
              <h6 className="font-black text-white mb-4" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>POPULAR DESTINATIONS</h6>
              <div className="flex flex-col gap-3">
                {domesticDestinations.map((d) => (
                  <Link key={d.id} href={`/holidays/${d.slug}-tours-packages/`} style={linkStyle}>{d.name}</Link>
                ))}
              </div>
            </div>
          )}

          {/* International Destinations */}
          {internationalDestinations.length > 0 && (
            <div>
              <h6 className="font-black text-white mb-4" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>INTERNATIONAL DESTINATIONS</h6>
              <div className="flex flex-col gap-3">
                {internationalDestinations.map((d) => (
                  <Link key={d.id} href={`/holidays/${d.slug}-tours-packages/`} style={linkStyle}>{d.name}</Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pay safely strip */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ marginTop: '40px', paddingTop: '20px', paddingBottom: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-shield-halved" style={{ color: '#ff8126', fontSize: '16px' }}></i>
            <span className="font-bold text-white" style={{ fontSize: '12.5px' }}>Pay Safely With Us</span>
          </div>
          <p className="text-center sm:text-right" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
            All payments are encrypted and transmitted securely over SSL.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center mt-5" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          Copyright © 2026 Twin Brothers Holidays. All Rights Reserved. Developed by{' '}
          <a href="https://deenxconsultancy.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#ff8126', textDecoration: 'none' }}>
            Deenx Consultancy
          </a>
        </p>
      </div>
    </div>
  );
}
