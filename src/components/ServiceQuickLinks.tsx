'use client';

import React from 'react';
import Link from 'next/link';

export type ServiceKey =
  | 'flights'
  | 'hotels'
  | 'holidays'
  | 'activities'
  | 'bus'
  | 'visa'
  | 'cabs'
  | 'airport'
  | 'group-tours'
  | 'explore-world'
  | 'gift-cards';

const SERVICES: { key: ServiceKey; href: string; icon: string; label: string; iconStyle?: React.CSSProperties }[] = [
  { key: 'flights', href: '/flights', icon: '/images/airplane-icon.png', label: 'Flights' },
  { key: 'hotels', href: '/hotel', icon: '/images/hotel-icon.png', label: 'Hotels' },
  { key: 'holidays', href: '/holidays', icon: '/images/hilodays-icon.png', label: 'Holidays', iconStyle: { width: '60%' } },
  { key: 'activities', href: '/activities', icon: '/images/activites-icon.png', label: 'Activities' },
  { key: 'bus', href: '/bus', icon: '/images/bus-icon.png', label: 'Bus' },
  { key: 'visa', href: '/visa', icon: '/images/visa-icon.png', label: 'Visa' },
  { key: 'cabs', href: '/cabs', icon: '/images/cab-icon.png', label: 'Cabs' },
  { key: 'airport', href: '/cabs', icon: '/images/airport-services-icon.png', label: 'Airport Service' },
  { key: 'group-tours', href: '/group-tours', icon: '/images/group-tours-icon.png', label: 'Group Tours' },
  { key: 'explore-world', href: '/destinations', icon: '/images/explore-world-icon.png', label: 'Explore World' },
  { key: 'gift-cards', href: '/gift-cards', icon: '/images/gift-cards-icon.png', label: 'Gift Cards' },
];

interface ServiceQuickLinksProps {
  /** Which service tile to highlight as the current page. */
  active?: ServiceKey;
}

/**
 * The row of service tiles (Flights, Hotels, Holidays, ...) shown in the hero
 * of every booking page. Kept as one shared component so every page shows the
 * exact same set of services in the exact same order as the homepage —
 * previously each page (hotel, cabs, activities, bus) had its own hand-copied
 * version that had drifted out of sync with each other and with the homepage.
 */
export default function ServiceQuickLinks({ active }: ServiceQuickLinksProps) {
  return (
    <div
      className="w-full pb-4 mb-5 overflow-x-auto lg:overflow-x-visible whitespace-nowrap lg:whitespace-normal"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="flex lg:justify-center gap-2 sm:gap-3 px-1 lg:px-0">
        {SERVICES.map((service) => {
          const isActive = service.key === active;
          return (
            <Link
              key={service.key}
              href={service.href}
              className={`flex flex-col items-center justify-center text-center flex-shrink-0 border shadow-sm no-underline hover:no-underline rounded-lg w-16 h-16 transition duration-200 ${
                isActive ? 'bg-[#ff8126] border-[#ff8126] shadow-md' : 'bg-white border-slate-200'
              }`}
              style={{ textDecoration: 'none', borderRadius: '8px' }}
            >
              <img
                src={service.icon}
                alt={service.label}
                className={`w-7 h-7 object-contain ${isActive ? 'filter brightness-0 invert' : ''}`}
                style={service.iconStyle}
              />
              <span
                className={`text-[8px] mt-1 uppercase block ${isActive ? 'font-bold text-white' : 'font-normal text-slate-800'}`}
                style={{ textDecoration: 'none' }}
              >
                {service.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
