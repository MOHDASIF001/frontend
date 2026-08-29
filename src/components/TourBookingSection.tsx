'use client';

import React from 'react';
import { useModals } from '../context/ModalContext';

interface PackageData {
  id: string;
  title: string;
  price: string;
  discounted_price: string;
  duration_days: string;
  duration_nights: string;
}

interface TourBookingSectionProps {
  packageData: PackageData;
}

export default function TourBookingSection({ packageData }: TourBookingSectionProps) {
  const { openModal } = useModals();

  const price = parseFloat(packageData.price);
  const discountedPrice = parseFloat(packageData.discounted_price || '0');
  const hasDiscount = discountedPrice > 0;
  const activePrice = hasDiscount ? discountedPrice : price;

  const handleBookClick = () => {
    openModal('tour_booking', {
      id: packageData.id,
      title: packageData.title,
      price: activePrice.toString(),
      duration_days: packageData.duration_days,
      duration_nights: packageData.duration_nights,
    });
  };

  return (
    <>
      {/* Desktop Inline Booking Block */}
      <div className="container-fluid py-3">
        <div className="container">
          <div className="tour-dtls-price-book-main-section">
            <div className="row align-items-center">
              <div className="col-md-6 price-div">
                {hasDiscount ? (
                  <>
                    <p className="m-0 text-orange fw-bold">Special Offer</p>
                    <h3 className="m-0">
                      Price: ₹{discountedPrice.toLocaleString('en-IN')}{' '}
                      <span className="fs-6 text-muted">INR</span>{' '}
                      <small style={{ textDecoration: 'line-through', fontSize: '16px', color: '#888', marginLeft: 8 }}>
                        ₹{price.toLocaleString('en-IN')}
                      </small>
                    </h3>
                  </>
                ) : (
                  <>
                    <p className="m-0 text-orange fw-bold">Best Price</p>
                    <h3 className="m-0">
                      Price: ₹{price.toLocaleString('en-IN')} <span className="fs-6 text-muted">INR</span>
                    </h3>
                  </>
                )}
              </div>
              <div className="col-md-6 book-div text-md-end mt-3 mt-md-0">
                <button className="nav-custom-package-btn px-5 py-3 fs-5" onClick={handleBookClick}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Action Bar */}
      <div className="mobile-fixed-book-bar">
        <div className="price-info">
          {hasDiscount ? (
            <>
              <small>Special Offer</small>
              <br />
              <span>₹{discountedPrice.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <>
              <small>Best Price</small>
              <br />
              <span>₹{price.toLocaleString('en-IN')}</span>
            </>
          )}
        </div>
        <div>
          <button className="book-btn" onClick={handleBookClick}>
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
