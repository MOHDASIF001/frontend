import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import TourGallerySlider from '../../components/TourGallerySlider';
import TourItineraryAccordion from '../../components/TourItineraryAccordion';
import TourBookingSection from '../../components/TourBookingSection';
import HomePackageSlider from '../../components/HomePackageSlider';
import { API_BASE_URL, resolveAssetUrl } from '../../config';
import { buildPackageMetadata } from '../../lib/packageSeo';
import { buildPackageSchema } from '../../lib/schema';

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getPackageDetails(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php?id=${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success' && data.data) {
      return data.data;
    }
    return null;
  } catch (err) {
    console.error('Error fetching package details:', err);
    return null;
  }
}

async function getRelatedPackages(category: string, id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/packages.php`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.data)) {
      return data.data
        .filter((pkg: any) => pkg.category === category && pkg.id.toString() !== id.toString())
        .slice(0, 4);
    }
    return [];
  } catch (err) {
    console.error('Error fetching related packages:', err);
    return [];
  }
}

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = typeof params.id === 'string' ? params.id : '';
  if (!id) return { title: 'Tour Details - Twin Brothers Holidays' };
  
  const pkg = await getPackageDetails(id);
  if (!pkg) return { title: 'Tour Details - Twin Brothers Holidays' };
  
  return buildPackageMetadata(pkg);
}

export default async function TourDetailsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = typeof params.id === 'string' ? params.id : '';
  if (!id) {
    redirect('/holidays');
  }

  const pkg = await getPackageDetails(id);
  if (!pkg) {
    redirect('/holidays');
  }

  const related = await getRelatedPackages(pkg.category, pkg.id);

  // Inclusions and exclusions newline split
  const inclusions = pkg.inclusions ? pkg.inclusions.split('\n').map((i: string) => i.trim()).filter((i: string) => i !== '') : [];
  const exclusions = pkg.exclusions ? pkg.exclusions.split('\n').map((i: string) => i.trim()).filter((i: string) => i !== '') : [];

  // Parse gallery path
  // Main (featured) image first, then the gallery images.
  const featured = pkg.featured_image ? pkg.featured_image.replace(/^\.\.\//, '') : '';
  const baseAlt: string = pkg.featured_image_alt || pkg.title;
  const gallery: string[] = [];
  const galleryAlts: string[] = [];
  if (featured) { gallery.push(featured); galleryAlts.push(baseAlt); }
  ((pkg.gallery || []) as string[]).forEach((g, i) => {
    if (g === featured) return;
    gallery.push(g);
    galleryAlts.push(pkg.gallery_alt?.[i] || `${baseAlt} - photo ${gallery.length - 1}`);
  });

  // Itinerary format
  let itineraryList = [];
  if (Array.isArray(pkg.itinerary)) {
    itineraryList = pkg.itinerary.map((day: any, idx: number) => ({
      day_number: idx + 1,
      title: day.title || `Day ${idx + 1}`,
      description: day.description || '',
    }));
  } else if (typeof pkg.itinerary === 'string' && pkg.itinerary.trim() !== '') {
    itineraryList = [
      {
        day_number: 1,
        title: 'Itinerary Details',
        description: pkg.itinerary,
      }
    ];
  }

  // Random reviews count
  const reviewsCount = 20 + (parseInt(pkg.id) * 7) % 130;

  const packageSchema = buildPackageSchema({
    ...pkg,
    image: featured ? resolveAssetUrl(featured) : undefined,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packageSchema) }} />
      {/* Hero Section */}
      <div className="container-fluid tour-dtls-pg-hero-main-div">
        <div className="container">
          <div className="tour-dtls-pg-hero-title-div">
            <h1>{pkg.title}</h1>
            <p>
              <i className="fa-solid fa-star text-warning"></i>
              <i className="fa-solid fa-star text-warning"></i>
              <i className="fa-solid fa-star text-warning"></i>
              <i className="fa-solid fa-star text-warning"></i>
              <i className="fa-solid fa-star text-warning"></i>
              <span className="ms-2">({reviewsCount} Reviews)</span>
            </p>
          </div>
          <TourGallerySlider gallery={gallery} title={pkg.title} alts={galleryAlts} />
        </div>
      </div>

      {/* Book with Confidence (Tablet / Mobile View) */}
      <div className="container-fluid tour-dlts-only-tab-and-mobile-book-help">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tour-details-book-with-confidence-main-div">
                <h5>Book With Confidence</h5>
                <p><i className="fa-solid fa-thumbs-up me-2"></i> No hassle best price guarantee</p>
                <p><i className="fa-solid fa-phone me-2"></i> Customer support available 24/7</p>
                <p><i className="fa-solid fa-star me-2"></i> Hand picked Tour & Activities</p>
                <p><i className="fa-solid fa-person-walking-luggage me-2"></i> Expert-Led Tours & Activities</p>
              </div>
            </div>
            <div className="col-md-6 tour-dtls-need-help-only-tablate mt-3 mt-md-0">
              <div className="tour-details-book-with-confidence-main-div only-border-tour-dtls-pg">
                <h5>Need Help?</h5>
                <p><i className="fa-solid fa-phone me-2"></i> Call Us: +91 6005242675</p>
                <p><i className="fa-solid fa-envelope me-2"></i> Email: info@twinbholidays.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Block */}
      <div className="container-fluid mt-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tour-details-main-div p-4 shadow-sm border rounded bg-white">
                <h4 className="border-bottom pb-2 mb-3">Overview</h4>
                <p style={{ whiteSpace: 'pre-line', color: '#555', lineHeight: '1.7', fontSize: '15px' }}>
                  {pkg.description || pkg.short_description}
                </p>
              </div>
            </div>
            <div className="col-lg-4 tour-dtls-pg-book-confdnce-destop-main-div">
              <div className="tour-details-book-with-confidence-main-div shadow-sm">
                <h5>Book With Confidence</h5>
                <p><i className="fa-solid fa-thumbs-up me-2"></i> No hassle best price guarantee</p>
                <p><i className="fa-solid fa-phone me-2"></i> Customer support available 24/7</p>
                <p><i className="fa-solid fa-star me-2"></i> Hand picked Tour & Activities</p>
                <p><i className="fa-solid fa-person-walking-luggage me-2"></i> Expert-Led Tours & Activities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusions / Exclusions */}
      <div className="container-fluid py-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="tour-dtls-pg-include-main-div h-100 p-4 border rounded shadow-sm bg-white">
                <h6 className="border-bottom pb-2 mb-3 fw-bold text-success fs-5">Inclusions</h6>
                {inclusions.length > 0 ? (
                  inclusions.map((inc: string, index: number) => (
                    <p key={index} className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> {inc}</p>
                  ))
                ) : (
                  <p className="text-muted">Contact us for inclusions details.</p>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mt-3 mt-md-0">
              <div className="tour-dtls-pg-include-main-div h-100 p-4 border rounded shadow-sm bg-white">
                <h6 className="border-bottom pb-2 mb-3 fw-bold text-danger fs-5">Exclusions</h6>
                {exclusions.length > 0 ? (
                  exclusions.map((exc: string, index: number) => (
                    <p key={index} className="mb-2"><i className="fa-solid fa-xmark text-danger me-2"></i> {exc}</p>
                  ))
                ) : (
                  <p className="text-muted">Contact us for exclusions details.</p>
                )}
              </div>
            </div>
            <div className="col-lg-4 tour-dtls-pg-help-destop-main-div mt-3 mt-lg-0">
              <div className="tour-details-book-with-confidence-main-div only-border-tour-dtls-pg shadow-sm h-100">
                <h5>Need Help?</h5>
                <p><i className="fa-solid fa-phone me-2"></i> Call Us: +91 6005242675</p>
                <p><i className="fa-solid fa-envelope me-2"></i> Email: info@twinbholidays.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What to Expect */}
      {pkg.what_to_expect && (
        <div className="container-fluid mt-3">
          <div className="container">
            <div className="tour-dtls-pg-what-expact-main-div p-4 border rounded shadow-sm bg-white">
              <h4 className="border-bottom pb-2 mb-3">What to Expect</h4>
              <p style={{ whiteSpace: 'pre-line', color: '#555', lineHeight: '1.7' }}>
                {pkg.what_to_expect}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Actions */}
      <TourBookingSection packageData={pkg} />

      {/* Collapsible Itinerary */}
      <TourItineraryAccordion itinerary={itineraryList} />

      {/* Related Tours */}
      {related.length > 0 && (
        <div className="mt-5 mb-5">
          <div className="container-home-page-package text-center pt-4">
            <h2 className="fs-3 fw-bold" style={{ fontFamily: 'serif', color: '#2c2c2c' }}>Related Tour Packages</h2>
          </div>
          <HomePackageSlider packages={related} hideHeader={true} />
        </div>
      )}
    </>
  );
}
