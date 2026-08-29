'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function HomeReviewSlider() {
  const reviews = [
    {
      name: 'Client Name',
      profile: 'Client Profile',
      text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio sapiente eos, accusantium esse ullam inventore facilis nisi voluptates neque corrupti.',
      stars: 5,
    },
    {
      name: 'Client Name',
      profile: 'Client Profile',
      text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio sapiente eos, accusantium esse ullam inventore facilis nisi voluptates neque corrupti.',
      stars: 5,
    },
    {
      name: 'Client Name',
      profile: 'Client Profile',
      text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio sapiente eos, accusantium esse ullam inventore facilis nisi voluptates neque corrupti.',
      stars: 5,
    },
    {
      name: 'Client Name',
      profile: 'Client Profile',
      text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio sapiente eos, accusantium esse ullam inventore facilis nisi voluptates neque corrupti.',
      stars: 5,
    },
  ];

  return (
    <div className="container-fluid review-main-div">
      <div className="review-title-div">
        <h4>Testimonial</h4>
        <p>
          Journeys made unforgettable, experiences shared by real travelers.
          <br />
          Discover the Kashmir through their stories and reviews
        </p>
      </div>
      <div className="container">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            650: { slidesPerView: 2, spaceBetween: 20 },
            920: { slidesPerView: 3, spaceBetween: 15 },
            1224: { slidesPerView: 3, spaceBetween: 20 },
          }}
          className="reviewSwiperHomePage"
        >
          {reviews.map((rev, index) => (
            <SwiperSlide key={index}>
              <div className="review-card-main-div">
                <div className="review-card-color-div"></div>
                <div className="image-name-div">
                  <img src="/images/review-image.jpg" alt={rev.name} />
                  <h5>{rev.name}</h5>
                  <p className="client-profile">{rev.profile}</p>
                </div>
                <div className="client-review-para-div">
                  <p className="client-review-text">{rev.text}</p>
                </div>
                <div className="review-divide-line"></div>
                <p className="review-start">
                  Reviews:{' '}
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star ms-1"></i>
                  ))}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
