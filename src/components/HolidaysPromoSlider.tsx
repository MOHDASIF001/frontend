'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const promos = [
  { title: 'Flat 15% Off on First Booking', image: '/images/offer_first_booking.png' },
  { title: 'Kashmir Flights from ₹2,999', image: '/images/offer_kashmir_flights.png' },
  { title: 'International Combo Deals', image: '/images/offer_intl_combo.png' },
  { title: 'Honeymoon Special Packages', image: '/images/offer_honeymoon_special.png' },
  { title: 'Group Booking Discounts', image: '/images/offer_group_discounts.png' },
];

export default function HolidaysPromoSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '30px' }}>
      <div className="relative">
        <style jsx global>{`
          .promoSwiper .swiper-pagination-bullet {
            background: #cbd5e1;
            opacity: 1;
            width: 7px;
            height: 7px;
          }
          .promoSwiper .swiper-pagination-bullet-active {
            background: #ff8126;
            width: 18px;
            border-radius: 4px;
          }
        `}</style>
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          onSwiper={(s) => { swiperRef.current = s; }}
          className="promoSwiper overflow-hidden"
          style={{ borderRadius: '11px' }}
        >
          {promos.map((promo) => (
            <SwiperSlide key={promo.title}>
              <div className="relative w-full aspect-[3/1] sm:aspect-[8.82/1]">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous"
          className="hidden sm:flex absolute items-center justify-center cursor-pointer z-10"
          style={{
            left: '-21px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
        >
          <span
            className="flex items-center justify-center"
            style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #1d91f2', color: '#1d91f2' }}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: '12px' }}></i>
          </span>
        </button>
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next"
          className="hidden sm:flex absolute items-center justify-center cursor-pointer z-10"
          style={{
            right: '-21px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
        >
          <span
            className="flex items-center justify-center"
            style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #1d91f2', color: '#1d91f2' }}
          >
            <i className="fa-solid fa-arrow-right" style={{ fontSize: '12px' }}></i>
          </span>
        </button>
      </div>
    </div>
  );
}
