'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface Package {
  id: string;
  title: string;
  destination_id: string;
  duration_days: string;
  duration_nights: string;
  price: string;
  discounted_price: string;
  featured_image: string;
  short_description: string;
  location_name?: string;
}

interface HomePackageSliderProps {
  packages: Package[];
  title?: string;
  description?: string;
  hideHeader?: boolean;
}

export default function HomePackageSlider({ packages, title, description, hideHeader = false }: HomePackageSliderProps) {
  const sectionTitle = title ?? 'Kashmir Tour Packages';
  const sectionDesc = description ?? 'Discover the Kashmir most iconic destinations with our Exceptional Kashmir Tour Package offering unparalleled experiences, personalized itineraries, and unforgettable memories';

  return (
    <div className="container-fluid packages-main-div-home-page">
      <div className="container-home-page-package">
        {!hideHeader && (
          <div className="package-title-div">
            <h1 className="package-h1">{sectionTitle}</h1>
            <p className="package-para">{sectionDesc}</p>
          </div>
        )}
        <div className="packages-swiper-main-div">
          <Link href="/holidays" className="view-all-package-button">
            View All
            <i className="fa-solid fa-circle-chevron-down ms-1"></i>
          </Link>
          
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.3}
            spaceBetween={10}
            loop={packages.length > 4}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              650: { slidesPerView: 2.3, spaceBetween: 20 },
              920: { slidesPerView: 3.3, spaceBetween: 15 },
              1224: { slidesPerView: 4.5, spaceBetween: 20 },
            }}
            className="packageSwiperHomePage"
          >
            {packages.map((pkg) => {
              const img = pkg.featured_image ? `/${pkg.featured_image.replace('../', '')}` : '/images/default-package.jpg';
              const rating = (4.0 + (parseInt(pkg.id) % 10) / 10).toFixed(1);
              const reviews = 10 + (parseInt(pkg.id) * 3) % 190;
              const offerPrice = pkg.discounted_price ? parseFloat(pkg.discounted_price) : parseFloat(pkg.price);

              return (
                <SwiperSlide key={pkg.id}>
                  <div className="package-card-main-div">
                    <div className="package-image-div">
                      <img src={img} alt={pkg.title} />
                    </div>
                    <div className="package-card-text-detail-div">
                      <h3>
                        <i className="fa-solid fa-location-dot me-1"></i>
                        {pkg.location_name || 'Kashmir'}
                      </h3>
                      <h2>{pkg.title}</h2>
                      <p className="tour-page-package-card-pera">
                        {pkg.short_description ? pkg.short_description.substring(0, 100) + '...' : ''}
                      </p>
                      <p className="package-review">
                        <i className="fa-solid fa-star me-1"></i>
                        {rating}
                        <span>({reviews} Reviews)</span> &nbsp; &nbsp;
                        <i className="fa-solid fa-clock mx-1"></i>
                        {pkg.duration_days}D / {pkg.duration_nights}N
                      </p>
                      <div className="line-packge-card"></div>
                      <div className="package-card-price-deatil-div">
                        <span>
                          <i className="fa-solid fa-rupee-sign me-1"></i>
                          {offerPrice.toLocaleString('en-IN')}
                        </span>
                        <Link href={`/tour-details?id=${pkg.id}`}>Details</Link>
                      </div>
                    </div>
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
