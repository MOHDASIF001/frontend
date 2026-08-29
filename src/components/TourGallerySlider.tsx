'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface TourGallerySliderProps {
  gallery: string[];
  title: string;
}

export default function TourGallerySlider({ gallery, title }: TourGallerySliderProps) {
  if (gallery.length === 0) return null;

  return (
    <div className="tour-dtls-hero-img-div">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        loop={gallery.length > 1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={gallery.length > 1}
        breakpoints={{
          650: { slidesPerView: 1, spaceBetween: 20 },
          920: { slidesPerView: 2, spaceBetween: 15 },
          1224: { slidesPerView: 2, spaceBetween: 20 },
        }}
        className="heroSwiperTourDetailsPage"
      >
        {gallery.map((img, index) => {
          const imgSrc = img.startsWith('http') ? img : `/${img.replace(/^\//, '')}`;
          return (
            <SwiperSlide key={index}>
              <div className="tour-dtls-hero-card-div">
                <img src={imgSrc} alt={`${title} - Gallery ${index + 1}`} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
