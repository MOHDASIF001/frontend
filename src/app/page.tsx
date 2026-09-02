import React from 'react';
import Link from 'next/link';
import QuickAccessBanner from '../components/QuickAccessBanner';
import HolidaysPromoSlider from '../components/HolidaysPromoSlider';
import HomeMostPopularPackages from '../components/HomeMostPopularPackages';
import { ExploreWorldSection } from '../components/explore-world/ExploreWorldSection';
import HomeDestinationSlider from '../components/HomeDestinationSlider';
import HomeReviewSlider from '../components/HomeReviewSlider';
import HomeSeoContent from '../components/HomeSeoContent';
import OpenModalButton from '../components/OpenModalButton';
import { API_BASE_URL } from '../config';

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=index.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "Twin Brothers Holidays - Travel Kashmir",
      description: "Book Jammu & Kashmir tour packages, hotels, cabs, and adventure activities.",
    };
  }
}

async function getPopularPackages() {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php?home=1`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch packages');
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching popular packages:', err);
    return [];
  }
}

async function getDestinations() {
  try {
    const res = await fetch(`${API_BASE_URL}/destinations.php?home=1`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch destinations');
    const data = await res.json();
    
    // The API destinations endpoint structure: { status: 'success', data: [...] }
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data.slice(0, 10);
    }
    return [];
  } catch (err) {
    console.error('Error fetching destinations:', err);
    return [];
  }
}
export default async function HomePage() {
  const [destinations, popularPackages] = await Promise.all([
    getDestinations(),
    getPopularPackages(),
  ]);

  return (
    <div className="overflow-x-hidden">
      {/* Quick Access Dashboard */}
      <QuickAccessBanner />

      {/* Offers Slider — admin-controlled via Admin Panel → Sliders / Offers → Slider Position: "Home Page" */}
      <HolidaysPromoSlider position="home" />

      {/* Most Popular Packages Section (admin-controlled via "Show on Homepage") */}
      <HomeMostPopularPackages packages={popularPackages} />

      {/* Explore World Section */}
      <ExploreWorldSection />

      {/* About Us Section */}
      <div className="container-fluid about-main-div">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="about-us-text-div">
                <p className="about-us">About Us</p>
                <h3>The Story Behind Our Journeys</h3>
                <p className="about-para">
                  Twin Brothers Holidays has been the premier choice for travelers looking to experience the magic of Jammu and Kashmir. From bespoke family tours to adventurous treks, our focus is on creating memories that last a lifetime.
                </p>
                <h6>
                  <i className="fa-solid fa-person-walking-luggage me-2"></i>
                  Great travel experience
                </h6>
                <h6>
                  <i className="fa-solid fa-wallet me-2"></i>
                  Competitive pricing offers
                </h6>
                <Link href="/about-us" className="about-us-button text-decoration-none d-inline-block text-center mt-3">
                  Read More
                </Link>
              </div>
            </div>
            <div className="col-lg-1 hid-about-col"></div>
            <div className="col-lg-4">
              <div className="about-img-div">
                <img className="about-img-desktop" width="100%" src="/images/about-desktop.jpg" alt="About Twin Brothers Holidays" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Destinations Section */}
      <HomeDestinationSlider destinations={destinations} />

      {/* Why Choose Us Section */}
      <div className="container-fluid why-choose-main-div">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="why-choose-text-main-div">
                <h3>Why Choose Us</h3>
                <p className="why-choose-pera">
                  We specialize in crafting customized itineraries that cater to your unique interests and preferences. We take care of every detail so you can focus on creating unforgettable memories.
                </p>
                <div className="why-coose-points-div">
                  <div className="points-choose">
                    <i className="fa-solid fa-mountain-sun"></i>
                    <p>Every place and activity is thoughtfully selected by our team</p>
                  </div>
                  <div className="points-choose">
                    <i className="fa-solid fa-route"></i>
                    <p>We provide different types of tour plans</p>
                  </div>
                  <div className="points-choose">
                    <i className="fa-solid fa-book-open-reader"></i>
                    <p>Easy booking system</p>
                  </div>
                  <div className="points-choose">
                    <i className="fa-solid fa-hand-holding-heart"></i>
                    <p>Trusted by 24,000+ users</p>
                  </div>
                </div>
                <Link href="/about-us" className="why-choose-button text-decoration-none d-inline-block text-center mt-3">
                  Find Out More
                </Link>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="why-choose-img-div">
                <div className="choose-color-div"></div>
                <img src="/images/men-choos.png" alt="Why Choose Us" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Call-to-Action Section */}
      <div className="container-fluid inquiery-main-div">
        <div className="container inquiery-sub-div">
          <h4>All Inclusive Tour Packages</h4>
          <h3>
            No matter the size of your group, whether small or corporate, we have the ideal package tailored just for you
          </h3>
          <OpenModalButton modalType="customize" className="inqry-botton-main-page border-0">
            Get Your Free Query
          </OpenModalButton>
        </div>
      </div>

      {/* Testimonials Review Section */}
      <HomeReviewSlider />

      {/* SEO Content Section (home page only, shown just above the footer) */}
      <HomeSeoContent />
    </div>
  );
}
