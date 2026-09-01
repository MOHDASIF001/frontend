'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { API_BASE_URL, resolveAssetUrl } from '../config';
import 'swiper/css';
import 'swiper/css/pagination';

interface PromoSlide {
  title: string;
  image: string;
  imageMobile?: string | null;
  link?: string | null;
}

interface HolidaysPromoSliderProps {
  // Matches the "Slider Position" dropdown in Admin Panel → Sliders / Offers
  // (e.g. "home", "packages", "hotels", "destinations").
  position?: string;
}

// No hardcoded fallback images here on purpose — the old placeholders
// (fake "SKYLINE AIR" / "MyFlights.com" banners, square-shaped and never
// meant for a wide slider) were fabricated content that could show to real
// visitors whenever the admin hadn't added a slide for a given position yet.
// Simply rendering nothing until a real slide exists is safer than showing
// fake offers or a badly-cropped image.
export default function HolidaysPromoSlider({ position = 'packages' }: HolidaysPromoSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [promos, setPromos] = useState<PromoSlide[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/sliders.php?position=${position}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
          setPromos(
            data.data.map((s: { title?: string; image: string; image_mobile?: string; button_link?: string }) => ({
              title: s.title || 'Special Offer',
              image: resolveAssetUrl(s.image),
              imageMobile: s.image_mobile ? resolveAssetUrl(s.image_mobile) : null,
              link: s.button_link || null,
            }))
          );
        }
      })
      .catch((err) => console.error('Error fetching holidays promo slider:', err));
  }, [position]);

  if (promos.length === 0) return null;

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
          {promos.map((promo, idx) => {
            const picture = (
              <picture className="block w-full h-full">
                {promo.imageMobile && <source media="(max-width: 639px)" srcSet={promo.imageMobile} />}
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
              </picture>
            );
            return (
              <SwiperSlide key={`${promo.title}-${idx}`}>
                {promo.link ? (
                  <a href={promo.link} className="relative w-full aspect-[3/1] sm:aspect-[8.82/1] block">
                    {picture}
                  </a>
                ) : (
                  <div className="relative w-full aspect-[3/1] sm:aspect-[8.82/1]">
                    {picture}
                  </div>
                )}
              </SwiperSlide>
            );
          })}
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
