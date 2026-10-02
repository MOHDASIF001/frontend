import React from 'react';
import Link from 'next/link';
import QuickAccessBanner from '../components/QuickAccessBanner';
import HolidaysPromoSlider from '../components/HolidaysPromoSlider';
import HomeBlogSection from '../components/HomeBlogSection';
import HomeMostPopularPackages from '../components/HomeMostPopularPackages';
import { ExploreWorldSection } from '../components/explore-world/ExploreWorldSection';
import HomeDestinationSlider from '../components/HomeDestinationSlider';
import HomeSeoContent from '../components/HomeSeoContent';
import FaqSection from '../components/FaqSection';
import OpenModalButton from '../components/OpenModalButton';
import { API_BASE_URL } from '../config';
import { fetchPromoSlides } from '../lib/promoSlides';
import { fetchHomeFaqs } from '../lib/faqs';

export const revalidate = 60;

export async function generateMetadata() {
  // Canonical points every homepage variant (http, www, trailing query params) at one
  // URL, which is also what the site's own www -> non-www redirect resolves to.
  const alternates = { canonical: '/' };
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=index.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
      alternates,
    };
  } catch (err) {
    return {
      title: "Twin Brothers Holidays - Travel Kashmir",
      description: "Book Jammu & Kashmir tour packages, hotels, cabs, and adventure activities.",
      alternates,
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

async function getBlogPosts() {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs.php?home=1`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (err) {
    console.error('Error fetching blog posts:', err);
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
  const [destinations, popularPackages, blogPosts, promoSlides, homeFaqs] = await Promise.all([
    getDestinations(),
    getPopularPackages(),
    getBlogPosts(),
    fetchPromoSlides('home'),
    fetchHomeFaqs(),
  ]);

  return (
    <div className="overflow-x-hidden">
      {/* Real (crawlable) page heading — the large "Explore World" graphic below is a
          decorative section heading, not a page title, so it can't serve as the H1. */}
      <h1 className="sr-only">
        Kashmir &amp; India Holiday Packages, Hotels, Cabs and Activities | Twin Brothers Holidays
      </h1>

      {/* Quick Access Dashboard */}
      <QuickAccessBanner />

      {/* Offers Slider — admin-controlled via Admin Panel → Sliders / Offers → Slider Position: "Home Page" */}
      <HolidaysPromoSlider position="home" initialPromos={promoSlides} />

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
                <h3>Your Trusted Travel Partner</h3>
                <p className="about-para">
                  Twin Brothers Holidays is an organization that designs tour packages and holidays for families, couples, honeymooners, groups, solo travelers, and religious wanderers. We offer a wide range of travel services and organize trips for those who want to enjoy the beauty of the world around them, have new experiences, and have a comfortable, unforgettable, and affordable adventure.
                </p>
                <p className="about-para">
                  Our company offers a variety of itineraries from mountain climbing and visiting valleys to visiting cultural, spiritual, and adventurous places. We provide unique travel packages developed according to the client&apos;s preferences, interests, and budget.
                </p>
                <h6>
                  <i className="fa-solid fa-person-walking-luggage me-2"></i>
                  Great travel experience
                </h6>
                <h6>
                  <i className="fa-solid fa-wallet me-2"></i>
                  Competitive pricing offers
                </h6>
                <Link href="/about-us" aria-label="Read more about Twin Brothers Holidays" className="about-us-button text-decoration-none d-inline-block text-center mt-3">
                  Read Our Story
                </Link>
              </div>
            </div>
            <div className="col-lg-1 hid-about-col"></div>
            <div className="col-lg-4">
              <div className="about-img-div">
                <img className="about-img-desktop" width="100%" loading="lazy" src="/images/about-desktop.jpg" alt="About Twin Brothers Holidays" />
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
                  Our amenities are developed around the interests and needs of our clients. Excursions, accommodation, and routes are organized and implemented by local staff, and trips can be customized for honeymooners, families, solo travelers, groups of friends, and much more.
                </p>
                <div className="why-coose-points-div">
                  <div className="points-choose">
                    <i className="fa-solid fa-mountain-sun"></i>
                    <p>Tours and activities designed around your interests and needs</p>
                  </div>
                  <div className="points-choose">
                    <i className="fa-solid fa-route"></i>
                    <p>Local staff manage accommodation, excursions, and routes</p>
                  </div>
                  <div className="points-choose">
                    <i className="fa-solid fa-book-open-reader"></i>
                    <p>Customized trips for honeymooners, families, solo travelers, and groups</p>
                  </div>
                  <div className="points-choose">
                    <i className="fa-solid fa-hand-holding-heart"></i>
                    <p>Trusted by 24,000+ users</p>
                  </div>
                </div>
                <Link href="/about-us" aria-label="Find out more about why to choose Twin Brothers Holidays" className="why-choose-button text-decoration-none d-inline-block text-center mt-3">
                  Find Out More
                </Link>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="why-choose-img-div">
                <div className="choose-color-div"></div>
                <img src="/images/men-choos.png" alt="Why Choose Us" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Section — admin-controlled via Admin Panel → Blog */}
      <HomeBlogSection posts={blogPosts} />

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

      {/* FAQs (admin-controlled via Admin Panel → FAQs), shown just above the footer */}
      <FaqSection faqs={homeFaqs} />

      {/* SEO Content Section (home page only, shown just above the footer) */}
      <HomeSeoContent />
    </div>
  );
}
