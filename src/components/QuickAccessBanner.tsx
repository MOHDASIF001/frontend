'use client';

import React from 'react';
import Link from 'next/link';

export default function QuickAccessBanner() {
  return (
    <div className="container-fluid mobile-hero-desktop-embed d-block">
      <div className="container">
        <div className="mobile-hero-banner">
          <div className="mobile-hero-top">
            <Link href="/flights" className="mh-card border-0 w-100 text-start p-0" style={{ background: 'transparent', textDecoration: 'none' }}>
              <span className="mh-card d-block">
                <div className="mh-icon"><img src="/images/airplane-icon.png" alt="Flights" /></div>
                <h6>Flights</h6>
              </span>
            </Link>
            <Link href="/hotel" className="mh-card text-decoration-none">
              <div className="mh-icon"><img src="/images/hotel-icon.png" alt="Hotels" /></div>
              <h6>Hotels</h6>
              <p className="mh-badge">Up to 60% Off*</p>
            </Link>
            {/* Holidays Icon -> Redirects to /holidays */}
            <Link href="/holidays" className="mh-card text-decoration-none">
              <div className="mh-icon"><img src="/images/hilodays-icon.png" alt="Holidays" style={{ width: '60%' }} /></div>
              <h6>Holidays</h6>
            </Link>
          </div>
          <div className="mobile-hero-grid">
            <div className="mh-grid">
              <Link href="/activities" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/activites-icon.png" alt="Activities" />
                </div>
                <p>Activities</p>
              </Link>

              <Link href="/bus" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/bus-icon.png" alt="Bus" />
                </div>
                <p>Bus</p>
              </Link>
              
              <Link href="/visa" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/visa-icon.png" alt="Visa" />
                </div>
                <p>Visa</p>
              </Link>

              <Link href="/cabs" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/cab-icon.png" alt="Cabs" />
                </div>
                <p>Cabs</p>
              </Link>

              {/* Airport Service Icon -> Redirects to /cabs */}
              <Link href="/cabs" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/airport-services-icon.png" alt="Airport Service" />
                </div>
                <p>Airport Service</p>
              </Link>

              <Link href="/group-tours" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/group-tours-icon.png" alt="Group Tours" />
                </div>
                <p>Group Tours</p>
              </Link>
              
              <Link href="/destinations" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/explore-world-icon.png" alt="Explore World" />
                </div>
                <p>Explore World</p>
              </Link>
              
              <Link href="/gift-cards" className="mh-item text-decoration-none">
                <div className="mh-icon-sm">
                  <img src="/images/gift-cards-icon.png" alt="Gift Cards" />
                </div>
                <p>Gift Cards</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
