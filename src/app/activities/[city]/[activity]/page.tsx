'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useModals } from '../../../../context/ModalContext';
import { API_BASE_URL, resolveAssetUrl } from '../../../../config';
import { toTitleCase, slugifyActivityName } from '../../utils';

interface Activity {
  id: number;
  name: string;
  location: string;
  duration: string;
  rating?: number | null;
  price: number;
  offer_price: number;
  featured_image: string;
  featured_image_alt?: string | null;
  description?: string;
  inclusions?: string;
  exclusions?: string;
  cancellation_policy?: string;
  gallery_images?: string;
}

const tabs = ['Package Options', 'Overview', 'Inclusion', 'Address & Map', 'Reviews'] as const;
type TabKey = (typeof tabs)[number];

// Used only when the admin hasn't filled in an activity's own Inclusions/Exclusions yet.
const defaultInclusions = [
  'Professional local tour guide',
  'All transfers by private air-conditioned vehicle',
  'Entrance fees for sights mentioned',
  'Bottled water',
  'Pickup from starting location and drop-off at ending location',
];

const defaultExclusions = [
  'Camera fees at monuments',
  'Food and drinks, unless specified',
  'Gratuities',
  'Anything not mentioned in Inclusions',
];

const defaultCancellationPolicy = 'For a full refund, cancel at least 24 hours before the scheduled departure time.';

function linesToList(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const importantInfo = [
  'Infants are required to sit on an adult’s lap',
  'Infants and small children can ride in a pram or stroller',
  'Public transportation options are available nearby',
  'Suitable for all physical fitness levels',
  'Vegetarian option is available, please advise at time of booking if required',
  'The duration of transfers are approximate, the exact duration will depend on the time of day and traffic conditions',
];

export default function ActivityDetailPage() {
  const params = useParams();
  const { openModal } = useModals();

  const rawCitySegment = (params?.city as string) || '';
  const citySlug = rawCitySegment.replace(/^activity-in-/, '');
  const cityName = toTitleCase(citySlug);
  const activitySlug = (params?.activity as string) || '';

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('Package Options');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/activities.php`);
        const data = await res.json();
        if (data.status === 'success') {
          setActivities(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const activity = useMemo(
    () => activities.find((a) => slugifyActivityName(a.name) === activitySlug),
    [activities, activitySlug]
  );

  const img = activity?.featured_image ? resolveAssetUrl(activity.featured_image) : '/images/default-activity.jpg';
  const adminGallery = (activity?.gallery_images || '')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)
    .map((g) => resolveAssetUrl(g));
  const galleryImages = adminGallery.length > 0 ? adminGallery : [img, img, img, img];
  const altFor = (i: number) => {
    const base = activity?.featured_image_alt || activity?.name || '';
    return i === 0 ? base : `${base} - photo ${i + 1}`;
  };
  const inclusions = linesToList(activity?.inclusions);
  const displayInclusions = inclusions.length > 0 ? inclusions : defaultInclusions;
  const exclusions = linesToList(activity?.exclusions);
  const displayExclusions = exclusions.length > 0 ? exclusions : defaultExclusions;
  const cancellationPolicy = activity?.cancellation_policy?.trim() || defaultCancellationPolicy;
  // Only a genuine, admin-set rating is shown - no fallback/fabricated number,
  // and no invented review count since there's no real reviews system behind it.
  const ratingNum = Number(activity?.rating) || 0;
  const ratingValue = ratingNum.toFixed(1);
  const filledStars = Math.round(ratingNum);
  const price = activity
    ? Number(activity.offer_price) > 0
      ? Number(activity.offer_price)
      : Number(activity.price) || 0
    : 0;
  const description =
    activity?.description?.trim() ||
    `Discover ${activity?.name || 'this experience'} in ${cityName} — a handpicked activity offering a memorable, hassle-free way to explore the destination with Twin Brothers Holidays.`;

  const handleBookNow = () => {
    if (!activity) return;
    openModal('activity', { activityName: activity.name, price });
  };

  if (!isLoading && !activity) {
    return (
      <div className="max-w-[1140px] mx-auto px-4" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
          <p className="text-slate-500 font-semibold">This activity could not be found.</p>
          <Link
            href={`/activities/${rawCitySegment}/`}
            className="mt-3 inline-block font-bold hover:underline"
            style={{ color: '#1d91f2', textDecoration: 'none' }}
          >
            Back to {cityName} Activities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-[1140px] mx-auto px-[11px] sm:px-6 lg:px-8 pb-[86px] sm:pb-[80px]" style={{ paddingTop: '73px' }}>
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff8126] mx-auto mb-3"></div>
            <p className="text-slate-400 font-semibold text-sm">Loading activity...</p>
          </div>
        )}

        {!isLoading && activity && (
          <>
            {/* Breadcrumb */}
            <p className="hidden sm:block text-sm font-semibold text-slate-500 mb-[10px]">
              <Link href="/" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Home</Link>
              <span className="mx-1.5">&gt;</span>
              <Link href="/activities" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Activities</Link>
              <span className="mx-1.5">&gt;</span>
              <Link href={`/activities/${rawCitySegment}/`} className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>
                Activities in {cityName}
              </Link>
              <span className="mx-1.5">&gt;</span>
              <span className="font-bold" style={{ color: '#1d91f2' }}>{activity.name}</span>
            </p>

            {/* Title + meta */}
            <div className="mb-[12px]">
              <h1 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>{activity.name}</h1>
              <div className="flex items-center gap-4">
                {ratingNum > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-amber-500 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={i < filledStars ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                          style={{ fontSize: '13px' }}
                        ></i>
                      ))}
                    </span>
                    <span className="text-slate-600 font-semibold text-sm">{ratingValue}</span>
                  </span>
                )}
                <span className="hidden sm:flex items-center gap-1.5 text-slate-600 font-semibold text-sm">
                  <i className="fa-solid fa-location-dot text-slate-400"></i>
                  {cityName}
                </span>
              </div>
              <span className="sm:hidden flex items-center gap-1.5 text-slate-600 font-semibold text-sm mt-1">
                <i className="fa-solid fa-location-dot text-slate-400"></i>
                {cityName}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column */}
              <div className="flex-1 min-w-0">
                {/* Gallery (mobile): main image on top, thumbnail grid below */}
                <div className="sm:hidden mb-6">
                  <div className="relative rounded-xl overflow-hidden bg-slate-100 mb-2" style={{ height: '220px' }}>
                    <img src={galleryImages[activeImageIndex]} alt={altFor(activeImageIndex)} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                      className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
                      style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', width: '30px', height: '30px', background: 'rgba(15,23,42,0.55)', color: '#fff' }}
                    >
                      <i className="fa-solid fa-chevron-left" style={{ fontSize: '12px' }}></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((i) => (i + 1) % galleryImages.length)}
                      className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
                      style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', width: '30px', height: '30px', background: 'rgba(15,23,42,0.55)', color: '#fff' }}
                    >
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.slice(0, 3).map((thumb, i) => (
                      <div
                        key={i}
                        onClick={() => (i === 2 ? setLightboxOpen(true) : setActiveImageIndex(i))}
                        className="relative rounded-lg overflow-hidden bg-slate-100 cursor-pointer"
                        style={{
                          height: '64px',
                          border: activeImageIndex === i && i !== 2 ? '2px solid #1d91f2' : '2px solid transparent',
                        }}
                      >
                        <img src={thumb} alt={altFor(i)} className="w-full h-full object-cover" />
                        {i === 2 && (
                          <div
                            className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold"
                            style={{ background: 'rgba(15,23,42,0.55)', fontSize: '11px' }}
                          >
                            <i className="fa-solid fa-images mb-0.5"></i>
                            See More
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery (desktop) */}
                <div className="hidden sm:flex gap-2 mb-6">
                  <div className="flex flex-col gap-2" style={{ width: '110px' }}>
                    {galleryImages.slice(0, 3).map((thumb, i) => (
                      <div
                        key={i}
                        onClick={() => (i === 2 ? setLightboxOpen(true) : setActiveImageIndex(i))}
                        className="relative rounded-lg overflow-hidden bg-slate-100 cursor-pointer"
                        style={{
                          height: '92px',
                          border: activeImageIndex === i && i !== 2 ? '2px solid #1d91f2' : '2px solid transparent',
                        }}
                      >
                        <img src={thumb} alt={altFor(i)} className="w-full h-full object-cover" />
                        {i === 2 && (
                          <div
                            className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs"
                            style={{ background: 'rgba(15,23,42,0.55)' }}
                          >
                            See More
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-100" style={{ height: '290px' }}>
                    <img src={galleryImages[activeImageIndex]} alt={altFor(activeImageIndex)} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                      className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
                      style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', background: 'rgba(15,23,42,0.55)', color: '#fff' }}
                    >
                      <i className="fa-solid fa-chevron-left" style={{ fontSize: '13px' }}></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((i) => (i + 1) % galleryImages.length)}
                      className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
                      style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', background: 'rgba(15,23,42,0.55)', color: '#fff' }}
                    >
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '13px' }}></i>
                    </button>
                  </div>
                </div>

                {/* Quick facts row (desktop) */}
                <div className="hidden sm:flex flex-wrap items-center gap-x-6 gap-y-3 pb-1 mb-1 border-b border-slate-150">
                  {activity.duration && (
                    <span className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                      <i className="fa-regular fa-clock"></i>
                      {activity.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                    <i className="fa-solid fa-van-shuttle"></i>
                    Pickup offered
                  </span>
                  <span className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                    <i className="fa-solid fa-mobile-screen"></i>
                    Mobile Ticket
                  </span>
                  <span className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                    <i className="fa-solid fa-language"></i>
                    Offered In: English
                  </span>
                </div>

                {/* Extra Services card (mobile) */}
                <div className="sm:hidden bg-white border border-slate-150 rounded-xl px-[11px] py-4 mb-4">
                  <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Extra Services</h4>
                  <div className="space-y-3">
                    {activity.duration && (
                      <span className="flex items-center gap-2.5 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                        <i className="fa-regular fa-clock text-slate-400"></i>
                        {activity.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-2.5 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                      <i className="fa-solid fa-van-shuttle text-slate-400"></i>
                      Pickup offered
                    </span>
                    <span className="flex items-center gap-2.5 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                      <i className="fa-solid fa-mobile-screen text-slate-400"></i>
                      Mobile Ticket
                    </span>
                    <span className="flex items-center gap-2.5 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                      <i className="fa-solid fa-language text-slate-400"></i>
                      Offered In: English
                    </span>
                  </div>
                </div>

                {/* Date, Time, Travellers + Cancellation Policy (mobile) */}
                <div className="sm:hidden bg-white border border-slate-150 rounded-xl px-[11px] py-4 mb-4">
                  <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Select Date, Time and Travelers</h4>

                  <div className="relative flex items-center justify-between border border-slate-200 rounded-lg mb-3" style={{ padding: '10px 10px' }}>
                    <span className="flex items-center gap-2.5 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                      <i className="fa-regular fa-calendar text-slate-400"></i>
                      {selectedDate || 'Choose Date'}
                    </span>
                    <i className="fa-solid fa-chevron-down text-slate-400" style={{ fontSize: '11px' }}></i>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer"
                    />
                  </div>

                  <div className="relative flex items-center justify-between border border-slate-200 rounded-lg mb-3" style={{ padding: '10px 10px' }}>
                    <span className="flex items-center gap-2.5 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                      <i className="fa-regular fa-clock text-slate-400"></i>
                      {selectedTime
                        ? selectedTime.charAt(0).toUpperCase() + selectedTime.slice(1)
                        : 'Select Time'}
                    </span>
                    <i className="fa-solid fa-chevron-down text-slate-400" style={{ fontSize: '11px' }}></i>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="absolute opacity-0 w-full h-full left-0 top-0 cursor-pointer"
                    >
                      <option value="">Select Time</option>
                      <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                      <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border border-slate-200 rounded-lg mb-4" style={{ padding: '10px 10px' }}>
                    <span className="flex items-center gap-2.5 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                      <i className="fa-regular fa-user text-slate-400"></i>
                      {travellers} {travellers === 1 ? 'adult' : 'adults'}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setTravellers((t) => Math.max(1, t - 1))}
                        className="flex items-center justify-center rounded-full border border-slate-300 cursor-pointer bg-white"
                        style={{ width: '22px', height: '22px', fontSize: '12px' }}
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900" style={{ fontSize: '13px' }}>{travellers}</span>
                      <button
                        type="button"
                        onClick={() => setTravellers((t) => t + 1)}
                        className="flex items-center justify-center rounded-full border border-slate-300 cursor-pointer bg-white"
                        style={{ width: '22px', height: '22px', fontSize: '12px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden">
                    <div className="text-white font-black text-center" style={{ background: '#1fae5c', fontSize: '13px', padding: '10px' }}>
                      <i className="fa-solid fa-circle-check mr-2"></i>
                      CANCELLATION POLICY
                    </div>
                    <div style={{ background: '#eafaf0', padding: '14px' }}>
                      <p className="text-slate-700 font-semibold" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        {cancellationPolicy}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-nowrap items-center gap-6 bg-white border border-slate-150 rounded-xl px-[14px] sm:px-5 mb-5 overflow-x-auto" style={{ paddingTop: '16px', paddingBottom: '14px' }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className="font-bold border-none bg-transparent cursor-pointer whitespace-nowrap"
                      style={{
                        fontSize: '14px',
                        paddingBottom: '10px',
                        color: activeTab === tab ? '#1d91f2' : '#0f172a',
                        borderBottom: activeTab === tab ? '2px solid #1d91f2' : '2px solid transparent',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="bg-white border border-slate-150 rounded-xl p-2">
                  {activeTab === 'Package Options' && (
                    <>
                      <h3 className="font-black text-slate-900 mb-4" style={{ fontSize: '17px' }}>Select Package Options</h3>
                      <div className="rounded-xl border-1 relative px-[11px] py-4 sm:px-4" style={{ borderColor: 'rgb(255, 129, 38)' }}>
                        <span
                          className="absolute flex items-center justify-center rounded-full text-white"
                          style={{ top: '-10px', right: '-10px', width: '26px', height: '26px', background: '#1d91f2' }}
                        >
                          <i className="fa-solid fa-check" style={{ fontSize: '11px' }}></i>
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <h4 className="font-black text-slate-900 mb-2" style={{ fontSize: '15px' }}>Standard Package</h4>
                            <span
                              className="inline-flex items-center gap-1.5 font-bold rounded-full mb-2"
                              style={{ fontSize: '12px', color: '#1fae5c', background: '#eafaf0', padding: '4px 10px' }}
                            >
                              <i className="fa-regular fa-clock"></i>
                              {activity.duration || '2 hours (approx.)'}
                            </span>
                            <p className="text-slate-500 font-semibold" style={{ fontSize: '13px' }}>
                              Includes: Professional Guide + Transfers + Entrance Fees + Bottled Water
                            </p>
                          </div>
                          <span className="font-black text-slate-900 whitespace-nowrap" style={{ fontSize: '22px' }}>
                            &#8377;{price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'Overview' && (
                    <p className="text-slate-600" style={{ fontSize: '14px', lineHeight: '1.8' }}>{description}</p>
                  )}

                  {activeTab === 'Inclusion' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl px-[11px] py-4 sm:px-4" style={{ background: '#eafaf0', borderLeft: '4px solid #1fae5c' }}>
                        <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Inclusions</h4>
                        <ul className="space-y-2.5">
                          {displayInclusions.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                              <i className="fa-solid fa-check mt-0.5" style={{ color: '#1fae5c' }}></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl px-[11px] py-4 sm:px-4" style={{ background: '#fdecec', borderLeft: '4px solid #e23a3a' }}>
                        <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Exclusions</h4>
                        <ul className="space-y-2.5">
                          {displayExclusions.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                              <i className="fa-solid fa-xmark mt-0.5" style={{ color: '#e23a3a' }}></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Address & Map' && (
                    <p className="flex items-center gap-2 text-slate-700 font-semibold" style={{ fontSize: '14px' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#ff8126' }}></i>
                      {cityName}, India
                    </p>
                  )}

                  {activeTab === 'Reviews' && (
                    <p className="text-slate-500 font-semibold" style={{ fontSize: '14px' }}>
                      Be the first to review this activity.
                    </p>
                  )}
                </div>

                {/* Important Information (mobile) */}
                <div className="sm:hidden bg-white border border-slate-150 rounded-xl px-[11px] py-4 mt-4" style={{ borderLeft: '4px solid #1d91f2' }}>
                  <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2" style={{ fontSize: '15px' }}>
                    <i className="fa-regular fa-file-lines" style={{ color: '#1d91f2' }}></i>
                    Important Information
                  </h4>
                  <ul className="space-y-2.5">
                    {importantInfo.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-slate-600 font-semibold" style={{ fontSize: '13px' }}>
                        <span className="rounded-full flex-shrink-0" style={{ width: '5px', height: '5px', background: '#94a3b8', marginTop: '7px' }}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right sidebar (desktop) */}
              <div className="hidden lg:block w-full lg:w-[340px] flex-shrink-0">
                <div className="lg:sticky" style={{ top: '96px' }}>
                  <div className="bg-white border border-slate-150 rounded-xl p-3 mb-3">
                    <p className="text-slate-500 font-semibold mb-1" style={{ fontSize: '13px' }}>
                      Starting from{' '}
                      <span className="font-black text-slate-900" style={{ fontSize: '20px' }}>&#8377;{price.toLocaleString('en-IN')}</span>{' '}
                      per Person
                    </p>
                    <h4 className="font-black text-slate-900 mt-3 mb-3" style={{ fontSize: '15px' }}>Select Date, Time and Travelers</h4>

                    <div className="relative mb-3">
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-[#1d91f2]"
                        style={{ fontSize: '13px', padding: '11px 14px' }}
                      />
                    </div>

                    <div className="relative mb-3">
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-[#1d91f2] appearance-none"
                        style={{ fontSize: '13px', padding: '11px 14px' }}
                      >
                        <option value="">Select Time</option>
                        <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                        <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                        <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between border border-slate-200 rounded-lg mb-4" style={{ padding: '9px 14px' }}>
                      <span className="text-slate-700 font-semibold" style={{ fontSize: '13px' }}>
                        <i className="fa-solid fa-user mr-2 text-slate-400"></i>
                        Travellers
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setTravellers((t) => Math.max(1, t - 1))}
                          className="flex items-center justify-center rounded-full border border-slate-300 cursor-pointer bg-white"
                          style={{ width: '22px', height: '22px', fontSize: '12px' }}
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-900" style={{ fontSize: '13px' }}>{travellers}</span>
                        <button
                          type="button"
                          onClick={() => setTravellers((t) => t + 1)}
                          className="flex items-center justify-center rounded-full border border-slate-300 cursor-pointer bg-white"
                          style={{ width: '22px', height: '22px', fontSize: '12px' }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mb-4">
                      <span className="font-black text-slate-900" style={{ fontSize: '14px' }}>Total Amount to Pay</span>
                      <span className="font-black" style={{ fontSize: '18px', color: '#1fae5c' }}>
                        &#8377;{(price * travellers).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="w-full text-white font-black uppercase tracking-wider border-none cursor-pointer"
                      style={{ background: '#ff8126', fontSize: '14px', borderRadius: '999px', padding: '13px 0' }}
                    >
                      Book Now
                    </button>
                  </div>

                  <div className="rounded-xl overflow-hidden mb-3">
                    <div className="text-white font-black text-center" style={{ background: '#1fae5c', fontSize: '13px', padding: '10px' }}>
                      <i className="fa-solid fa-circle-check mr-2"></i>
                      CANCELLATION POLICY
                    </div>
                    <div style={{ background: '#eafaf0', padding: '14px' }}>
                      <p className="text-slate-700 font-semibold" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        {cancellationPolicy}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-150 rounded-xl p-4" style={{ borderLeft: '4px solid #1d91f2' }}>
                    <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2" style={{ fontSize: '15px' }}>
                      <i className="fa-regular fa-file-lines" style={{ color: '#1d91f2' }}></i>
                      Important Information
                    </h4>
                    <ul className="space-y-2.5 max-h-[260px] overflow-y-auto">
                      {importantInfo.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-slate-600 font-semibold" style={{ fontSize: '13px' }}>
                          <span className="rounded-full flex-shrink-0" style={{ width: '5px', height: '5px', background: '#94a3b8', marginTop: '7px' }}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile sticky Price / Book Now bar */}
      {!isLoading && activity && (
        <div
          className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between"
          style={{ padding: '14px 16px', background: '#12141c', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
        >
          <div>
            <p className="font-semibold" style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '0' }}>Activity Package Price</p>
            <p className="flex items-center gap-1.5 font-black text-white" style={{ fontSize: '18px', lineHeight: '0', marginTop: '0px' }}>
              &#8377;{(price * travellers).toLocaleString('en-IN')}
              <i className="fa-regular fa-circle-question" style={{ fontSize: '13px', color: '#64748b' }}></i>
            </p>
          </div>
          <button
            type="button"
            onClick={handleBookNow}
            className="text-white font-black uppercase tracking-wider border-none cursor-pointer"
            style={{ background: '#ff8126', fontSize: '13px', borderRadius: '999px', padding: '8px 30px' }}
          >
            Book Now
          </button>
        </div>
      )}

      {/* Lightbox Gallery */}
      {lightboxOpen && activity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.9)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
            style={{ top: '20px', right: '20px', width: '38px', height: '38px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '16px' }}></i>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
            }}
            className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
            style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <img
            src={galleryImages[activeImageIndex]}
            alt={altFor(activeImageIndex)}
            className="rounded-xl"
            style={{ maxWidth: '85vw', maxHeight: '80vh', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIndex((i) => (i + 1) % galleryImages.length);
            }}
            className="absolute flex items-center justify-center rounded-full border-none cursor-pointer"
            style={{ right: '20px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}
