'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
import { REGION_SLUG_MAP } from '../lib/destinationRegions';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface Destination {
  id: string;
  name: string;
  slug?: string;
  image: string;
  status: string;
  display_order: string;
  min_price?: string;
}

interface HomeDestinationSliderProps {
  destinations: Destination[];
}

export default function HomeDestinationSlider({ destinations }: HomeDestinationSliderProps) {
  return (
    <div className="container-fluid packages-main-div-home-page">
      <div className="container-home-page-package">
        <div className="package-title-div">
          <h2 className="destinations-h2">Top Travel Destinations</h2>
          <p className="package-para">
            Explore our handpicked top travel destinations, where unforgettable
            <br />
            adventure and breathtaking experiences await you.
          </p>
        </div>
        <div className="packages-swiper-main-div">
          <Link href="/destinations" className="view-all-package-button">
            View All
            <i className="fa-solid fa-circle-chevron-down ms-1"></i>
          </Link>
          
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.2}
            spaceBetween={10}
            loop={destinations.length > 4}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              650: { slidesPerView: 2.3, spaceBetween: 20 },
              920: { slidesPerView: 3.3, spaceBetween: 15 },
              1224: { slidesPerView: 4.5, spaceBetween: 20 },
            }}
            className="desnetionSwiperHomePage"
          >
            {destinations.map((dest) => {
              const img = dest.image ? `/${dest.image.replace('../', '')}` : '/images/destination-1.jpg';
              const priceDisplay = dest.min_price
                ? `Start at INR ${parseFloat(dest.min_price).toLocaleString('en-IN')}`
                : 'Custom Packages';
              const regionSlug = dest.slug ? REGION_SLUG_MAP[dest.slug.toLowerCase()] : undefined;
              const destHref = regionSlug ? `/holidays/${regionSlug}` : '/destinations';

              return (
                <SwiperSlide key={dest.id}>
                  <div className="card-destination-main-div">
                    <Link href={destHref}>
                      <img src={img} alt={dest.name} />
                    </Link>
                    <div className="desti-overflow"></div>
                    <Link href={destHref}>
                      <div className="desti-card-text-main-div">
                        <h4 className="destinetion-name-title">{dest.name}</h4>
                        <p className="destinetion-tour-name">Tour Packages</p>
                        <div className="desti-dived-line"></div>
                        <div className="destinetion-card-tour-price">{priceDisplay}</div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
