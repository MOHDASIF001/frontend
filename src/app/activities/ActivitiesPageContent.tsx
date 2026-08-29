'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import ServiceQuickLinks from '../../components/ServiceQuickLinks';
import { slugifyDestination, slugifyActivityTitle } from './utils';

interface Activity {
  id: number;
  name: string;
  location: string;
  duration: string;
  rating?: number | null;
  price: number;
  offer_price: number;
  featured_image: string;
}

interface Destination {
  id: number;
  name: string;
  country?: string;
  image: string;
  activity_count?: number | string;
}

const activitiesFaqList = [
  {
    question: 'How do I book an activity with Twin Brothers Holidays?',
    answer: 'Simply search for your destination or activity in the "Where?" field, browse the handpicked options, and click "Book Now" on the activity you like. Fill in your traveller details to confirm your booking.',
  },
  {
    question: 'Can I cancel or reschedule my activity booking?',
    answer: 'Yes, most activities can be cancelled or rescheduled free of charge up to 24-48 hours before the scheduled time, depending on the specific activity\'s cancellation policy shown at checkout.',
  },
  {
    question: 'Are the activities suitable for families with children?',
    answer: 'Absolutely. We offer a wide range of family-friendly activities alongside adventure sports, so you can filter and choose experiences suited to every age group and comfort level.',
  },
  {
    question: 'Do I need to pay the full amount at the time of booking?',
    answer: 'Not necessarily — many activities allow a partial advance payment to confirm your slot, with the remaining balance payable at the venue or before the activity begins.',
  },
  {
    question: 'What is included in the activity price?',
    answer: 'Pricing typically includes the core experience, applicable equipment, and guide fees where relevant. Any exclusions (like meals, transfers, or entry tickets) are clearly listed on each activity\'s details page.',
  },
  {
    question: 'How will I receive my booking confirmation and tickets?',
    answer: 'Once your booking is confirmed, your e-ticket and all activity details are sent instantly to your registered email address and mobile number.',
  },
  {
    question: 'Can I book both domestic and international activities together?',
    answer: 'Yes, you can browse and book domestic activities (like Kashmir, Goa) and international activities (like Dubai, Singapore) independently in the same trip, each with its own confirmation.',
  },
  {
    question: 'Is it safe to book adventure activities online?',
    answer: 'Yes, all activity partners listed with Twin Brothers Holidays are verified for safety standards, equipment quality, and guide certification before being added to our platform.',
  },
  {
    question: 'What if the weather affects an outdoor activity?',
    answer: 'If an activity is cancelled by the operator due to unsafe weather conditions, you will be offered a full refund or the option to reschedule at no extra cost.',
  },
  {
    question: 'Who can I contact if I need help with my activity booking?',
    answer: 'Our support team is available 24/7 to assist with bookings, changes, or on-the-ground issues — you can reach us through the Contact Us page or the helpline listed in your booking confirmation.',
  },
];

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [whereInput, setWhereInput] = useState('');
  const [whenInput, setWhenInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWhereDropdown, setShowWhereDropdown] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [showFullIntro1, setShowFullIntro1] = useState(false);
  const [showFullIntro2, setShowFullIntro2] = useState(false);
  const wherePickerRef = useRef<HTMLDivElement>(null);
  const whenInputRef = useRef<HTMLInputElement>(null);

  const todayDateString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchActivities();
    fetchDestinations();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wherePickerRef.current && !wherePickerRef.current.contains(event.target as Node)) {
        setShowWhereDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/destinations.php`);
      const data = await res.json();
      if (data.status === 'success') {
        setDestinations(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugifyDestination(whereInput);
    if (slug) {
      router.push(`/activities/activity-in-${slug}/`);
    } else {
      document.getElementById('activities-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities;
    const q = searchQuery.toLowerCase();
    return activities.filter(
      (a) => (a.name || '').toLowerCase().includes(q) || (a.location || '').toLowerCase().includes(q)
    );
  }, [activities, searchQuery]);

  const uniqueLocations = useMemo(
    () => Array.from(new Set(activities.map((a) => a.location).filter(Boolean))),
    [activities]
  );

  const whereQuery = whereInput.trim().toLowerCase();
  const matchedLocations = whereQuery
    ? uniqueLocations.filter((loc) => loc.toLowerCase().includes(whereQuery))
    : uniqueLocations;
  const matchedActivityNames = whereQuery
    ? activities.filter((a) => (a.name || '').toLowerCase().includes(whereQuery))
    : activities;

  const handleSelectWhere = (value: string) => {
    setWhereInput(value);
    setShowWhereDropdown(false);
  };

  const startingPriceFor = (destName: string) => {
    const matches = activities.filter((a) => (a.location || '').toLowerCase().includes(destName.toLowerCase()));
    if (matches.length === 0) return null;
    const min = Math.min(...matches.map((a) => (a.offer_price > 0 ? a.offer_price : a.price)));
    return min;
  };

  const MAX_PER_COLUMN = 4;

  // Real activity data is inconsistent (some locations are just a city name, or blank), so
  // rather than requiring the word "India" to appear, we recognise known international
  // markers and default everything else to domestic (this is an India-based business).
  const internationalKeywords = [
    'dubai', 'uae', 'united arab emirates', 'singapore', 'thailand', 'bangkok',
    'malaysia', 'indonesia', 'bali', 'maldives', 'nepal', 'bhutan', 'sri lanka',
    'vietnam', 'qatar', 'oman', 'turkey', 'egypt', 'usa', 'united states',
    'uk', 'united kingdom', 'virgin islands', 'europe', 'paris', 'london',
  ];
  const isDomestic = (a: Activity) => {
    const loc = (a.location || '').toLowerCase();
    return !internationalKeywords.some((k) => loc.includes(k));
  };

  const domesticActivities = (searchQuery ? filteredActivities : activities).filter(isDomestic).slice(0, MAX_PER_COLUMN);
  const internationalActivities = (searchQuery ? filteredActivities : activities).filter((a) => !isDomestic(a)).slice(0, MAX_PER_COLUMN);

  // Destination cards are admin-controlled (via the destinations table) and only
  // shown once that destination actually has at least one live activity.
  const isDomesticDestination = (d: Destination) => (d.country || 'India').trim().toLowerCase() === 'india';
  const domesticDestinations = destinations
    .filter((d) => isDomesticDestination(d) && Number(d.activity_count) > 0)
    .slice(0, 5);
  const internationalDestinations = destinations
    .filter((d) => !isDomesticDestination(d) && Number(d.activity_count) > 0)
    .slice(0, 5);

  const renderActivityCard = (act: Activity) => {
    const img = act.featured_image ? `/${act.featured_image}` : '/images/default-activity.jpg';
    const price = act.price;
    const offer = act.offer_price > 0 ? act.offer_price : price;

    const goToDetails = () => {
      const citySlug = slugifyDestination(act.location || '');
      const activitySlug = slugifyActivityTitle(act.name);
      if (!citySlug || !activitySlug) return;
      router.push(`/activities/activity-in-${citySlug}/${activitySlug}/`);
    };

    return (
      <div
        key={act.id}
        onClick={goToDetails}
        className="flex items-center gap-4 rounded-xl mb-4 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #fff3eb, #ffe4cf)', border: '1px solid #ffd9b8', padding: '7px' }}
      >
        <div className="w-[68px] h-[68px] rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
          <img src={img} alt={act.name || 'Activity'} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0" style={{ lineHeight: '1' }}>
          <h3 className="font-black text-slate-900 truncate" style={{ fontSize: '15px', lineHeight: '1', margin: 0 }}>
            {act.name || 'Untitled Activity'}
          </h3>
          <p className="font-semibold truncate" style={{ fontSize: '13px', color: '#094074', lineHeight: '1', margin: '4px 0' }}>
            {act.location || 'Location unavailable'}
          </p>
          <span className="font-black text-slate-900" style={{ fontSize: '16px', lineHeight: '1' }}>
            &#8377;{offer.toLocaleString('en-IN')}
          </span>
        </div>
        <button
          type="button"
          onClick={goToDetails}
          className="font-bold flex items-center gap-1.5 border-none bg-transparent cursor-pointer flex-shrink-0"
          style={{ color: '#094074', fontSize: '14px' }}
        >
          Book Now <i className="fa-solid fa-arrow-right text-[12px]"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div
        className="relative w-full flex items-end bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '90px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative" style={{ paddingBottom: '50px' }}>

          {/* Responsive quick access icons row */}
          <ServiceQuickLinks active="activities" />

          <div className="text-center">
            <h1 className="text-white mb-3 text-[40px] sm:text-[56px] whitespace-nowrap sm:whitespace-normal" style={{ fontFamily: "'Alex Brush', cursive", lineHeight: '1.15', fontWeight: 400 }}>
              Never Stop Exploring
            </h1>
            <p className="text-white/85 font-semibold mb-6 max-w-[560px] mx-auto" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Discover thrilling, unforgettable activities across Kashmir and beyond — handpicked experiences for every kind of traveller.
            </p>
          </div>

          <div className="max-sm:-mx-2">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-full sm:rounded-2xl shadow-xl flex flex-row items-stretch sm:items-center max-w-[640px] mx-auto"
          >
            <div
              ref={wherePickerRef}
              onClick={() => setShowWhereDropdown(true)}
              className="relative flex-1 min-w-0 px-3 sm:px-5 py-2 sm:py-3 border-r border-slate-100 flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <i className="fa-solid fa-location-dot text-slate-400 text-[11px] sm:text-base"></i>
              <div className="flex-1 min-w-0">
                <label className="font-black text-slate-800 block text-[10px] sm:text-[13px]">Where?</label>
                <input
                  type="text"
                  value={whereInput}
                  onChange={(e) => setWhereInput(e.target.value)}
                  onClick={(e) => { e.stopPropagation(); setShowWhereDropdown(true); }}
                  placeholder="Search for a location or activity"
                  autoComplete="off"
                  className="w-full border-none p-0 text-slate-500 focus:outline-none focus:ring-0 bg-transparent text-[9px] sm:text-[13px]"
                />
              </div>

              {showWhereDropdown && whereQuery && (
                <div className="absolute top-[100%] left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[340px] max-w-[420px] mt-2">
                  <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-50">
                    {matchedLocations.slice(0, 3).map((loc) => (
                      <div
                        key={loc}
                        onClick={() => handleSelectWhere(loc)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <span className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-location-dot text-slate-500 text-xs"></i>
                        </span>
                        <span className="text-sm font-bold text-slate-800 truncate">{loc}</span>
                      </div>
                    ))}

                    {matchedActivityNames.slice(0, 6).map((act) => {
                      const img = act.featured_image ? `/${act.featured_image}` : '/images/default-activity.jpg';
                      return (
                        <div
                          key={act.id}
                          onClick={() => handleSelectWhere(act.name)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                            <img src={img} alt={act.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 text-start">
                            <div className="text-sm font-bold text-slate-800 truncate">{act.name}</div>
                            <div className="text-xs text-slate-400 font-semibold truncate mt-0.5">{act.location}</div>
                          </div>
                        </div>
                      );
                    })}

                    {matchedLocations.length === 0 && matchedActivityNames.length === 0 ? (
                      <div className="text-center py-4 text-xs font-bold text-slate-400">No matches found</div>
                    ) : (
                      <div
                        onClick={() => handleSelectWhere(whereInput)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <span className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-magnifying-glass text-slate-500 text-xs"></i>
                        </span>
                        <span className="text-sm font-bold" style={{ color: '#1d91f2' }}>See All Results of {whereInput}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div
              onClick={() => whenInputRef.current?.showPicker?.()}
              className="flex-1 min-w-0 px-3 sm:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <i className="fa-regular fa-calendar text-slate-400 text-[11px] sm:text-base"></i>
              <div className="flex-1 min-w-0">
                <label className="font-black text-slate-800 block text-[10px] sm:text-[13px]">When?</label>
                <input
                  ref={whenInputRef}
                  type="date"
                  value={whenInput}
                  min={todayDateString}
                  onChange={(e) => setWhenInput(e.target.value)}
                  className="when-date-input w-full border-none p-0 text-slate-500 focus:outline-none focus:ring-0 bg-transparent cursor-pointer text-[9px] sm:text-[13px]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white flex items-center justify-center self-center border-none cursor-pointer flex-shrink-0 w-9 h-9 sm:w-[52px] sm:h-[52px] m-1 sm:m-[6px] text-xs sm:text-base"
              style={{ background: '#ff8126', borderRadius: '999px' }}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
          </div>
          <style jsx>{`
            .when-date-input::-webkit-calendar-picker-indicator {
              display: none;
              -webkit-appearance: none;
            }
          `}</style>
        </div>
      </div>

      {/* Create Experiences with Top Destinations */}
      {domesticDestinations.length > 0 && (
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '50px' }}>
          <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>
            Create Experiences with Top Destinations
          </h2>
          <p className="text-slate-500 font-semibold mb-6" style={{ fontSize: '14px' }}>
            From trekking to skiing, indulge in every electrifying activity of sublimely divine Kashmir and beyond.
          </p>

          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {domesticDestinations.map((dest) => {
              const price = startingPriceFor(dest.name);
              const count = Number(dest.activity_count) || 0;
              const img = dest.image ? `/${dest.image.replace(/^\/?/, '')}` : '/images/default-dest.jpg';
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => router.push(`/activities/activity-in-${slugifyDestination(dest.name)}/`)}
                  className="flex-shrink-0 w-[200px] text-left border-none bg-transparent cursor-pointer p-0"
                >
                  <div className="relative w-full h-[240px] rounded-2xl overflow-hidden">
                    <img src={img} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }}></div>
                    <span
                      className="absolute top-3 left-3 text-white font-bold rounded-full"
                      style={{ fontSize: '10px', background: 'rgba(0,0,0,0.55)', paddingLeft: '10px', paddingRight: '10px', paddingTop: '4px', paddingBottom: '4px' }}
                    >
                      {count} {count === 1 ? 'Activity' : 'Activities'}
                    </span>
                    <span className="absolute bottom-3 left-3 text-white font-black" style={{ fontSize: '19px' }}>
                      {dest.name}
                    </span>
                  </div>
                  {price !== null && (
                    <span className="font-bold block mt-2" style={{ fontSize: '13px', color: '#094074' }}>
                      Starting At &#8377;{price.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular Activities in Top Attractions */}
      <div id="activities-results" className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '60px', paddingBottom: '60px' }}>
        <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>
          Popular Activities in Top Attractions
        </h2>
        <p className="text-slate-500 font-semibold mb-8" style={{ fontSize: '14px' }}>
          Witness some of the most phenomenal activities with our specially curated domestic &amp; international tour plans.
        </p>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff8126] mx-auto mb-3"></div>
            <p className="text-slate-400 font-semibold text-sm">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
            <p className="text-slate-500 font-semibold">No activities found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setWhereInput(''); }}
                className="mt-3 text-[#1d91f2] font-bold border-none bg-transparent cursor-pointer hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
            <div>
              <h3 className="font-black text-slate-900 mb-4" style={{ fontSize: '19px' }}>Handpicked Domestic Activities</h3>
              {domesticActivities.length > 0 ? (
                domesticActivities.map(renderActivityCard)
              ) : (
                <p className="text-slate-400 font-semibold text-sm">No domestic activities found.</p>
              )}
            </div>
            <div>
              <h3 className="font-black text-slate-900 mb-4" style={{ fontSize: '19px' }}>Handpicked International Activities</h3>
              {internationalActivities.length > 0 ? (
                internationalActivities.map(renderActivityCard)
              ) : (
                <p className="text-slate-400 font-semibold text-sm">No international activities found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exciting Activities of International Destinations */}
      {internationalDestinations.length > 0 && (
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '10px', paddingBottom: '60px' }}>
          <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '26px' }}>
            Exciting Activities of International Destinations
          </h2>
          <p className="text-slate-500 font-semibold mb-6" style={{ fontSize: '14px' }}>
            Relish spine-chilling activities while wandering around our premium international tourist attractions.
          </p>

          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {internationalDestinations.map((dest) => {
              const price = startingPriceFor(dest.name);
              const count = Number(dest.activity_count) || 0;
              const img = dest.image ? `/${dest.image.replace(/^\/?/, '')}` : '/images/default-dest.jpg';
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => router.push(`/activities/activity-in-${slugifyDestination(dest.name)}/`)}
                  className="flex-shrink-0 w-[200px] text-left border-none bg-transparent cursor-pointer p-0"
                >
                  <div className="relative w-full h-[240px] rounded-2xl overflow-hidden">
                    <img src={img} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }}></div>
                    <span
                      className="absolute top-3 left-3 text-white font-bold rounded-full"
                      style={{ fontSize: '10px', background: 'rgba(0,0,0,0.55)', paddingLeft: '10px', paddingRight: '10px', paddingTop: '4px', paddingBottom: '4px' }}
                    >
                      {count} {count === 1 ? 'Activity' : 'Activities'}
                    </span>
                    <span className="absolute bottom-3 left-3 text-white font-black" style={{ fontSize: '19px' }}>
                      {dest.name}
                    </span>
                  </div>
                  {price !== null && (
                    <span className="font-bold block mt-2" style={{ fontSize: '13px', color: '#094074' }}>
                      Starting At &#8377;{price.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Book Activities Online — informational content */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '10px', paddingBottom: '60px' }}>
        <h2 className="font-black text-slate-900 mb-4" style={{ fontSize: '24px' }}>
          Book Activities Online with Twin Brothers Holidays, Your One-Stop Shop for Thrilling Experiences
        </h2>
        <p className={`text-slate-600 leading-relaxed mb-1 sm:mb-8 ${showFullIntro1 ? '' : 'line-clamp-4 sm:line-clamp-none'}`} style={{ fontSize: '15px' }}>
          Witness the world studded with thrilling experiences with Twin Brothers Holidays&apos;s Activities, the ultimate platform for travel enthusiasts looking for memorable and adventure activities across charming destinations. Whether you&apos;re an adventure seeker, leisure wanderer or someone who adores sports tourism, with us, you can discover specially curated activity options that aim to offer the best local experiences at your fingertips. As one of the leading platforms, we always strive to create experiences that last a lifetime. Due to these reasons, we enable all the thrill-seekers like you to dive into a vast selection of handpicked activities. These range from sightseeing excursions, island hopping, to adventure sports, cultural performances and gastronomic experiences. Planning your personalised itinerary is easier than ever before. You just have to choose the most suitable activities at your favourite destination. That&apos;s all, rest assured, Twin Brothers Holidays will take care of everything to offer you the convenience that you deserve. To amplify your overall experience with outdoor activities, Twin Brothers Holidays also offers competitive pricing, verified service partners, well-structured policies and guidance. Our team of professionals is always available to support you with round-the-clock assistance, ensuring that the plan goes on without a hitch. You can even avail yourself of hassle-free tickets to guided tours and exclusive fun activities for an unforgettable journey.
        </p>
        <button
          type="button"
          onClick={() => setShowFullIntro1(!showFullIntro1)}
          className="sm:hidden font-bold border-none bg-transparent cursor-pointer p-0 mb-8 block"
          style={{ color: '#1d91f2', fontSize: '13px' }}
        >
          {showFullIntro1 ? 'Show Less' : 'Show More'}
        </button>

        <h2 className="font-black text-slate-900 mb-4" style={{ fontSize: '24px' }}>
          Why Book Tours &amp; Activities with Twin Brothers Holidays?
        </h2>
        <p className={`text-slate-600 leading-relaxed mb-1 ${showFullIntro2 ? '' : 'line-clamp-4 sm:line-clamp-none'}`} style={{ fontSize: '15px' }}>
          At Twin Brothers Holidays, we totally understand that many tour plans just get delayed due to various budget constraints. After recognising this issue, we offer all of our users unbeatable deals, exclusive festive offers and discounted prices. If you want to unveil the iconic landmarks, adrenaline-pumping activities or exhilarating experiences, you can immerse yourself fully at wallet-friendly prices with Twin Brothers Holidays. So, don&apos;t skip on your adventurous journey. Book your special activities with Twin Brothers Holidays and be ready for lasting memories. Explore more, experience more and enjoy more on every journey you begin with us. Book activities online now and turn every destination into your adventurous playground.
        </p>
        <button
          type="button"
          onClick={() => setShowFullIntro2(!showFullIntro2)}
          className="sm:hidden font-bold border-none bg-transparent cursor-pointer p-0 block"
          style={{ color: '#1d91f2', fontSize: '13px' }}
        >
          {showFullIntro2 ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '60px' }}>
        <h2 className="font-black text-slate-900 mb-6" style={{ fontSize: '24px' }}>
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="flex flex-col" style={{ gap: '12px' }}>
          {activitiesFaqList.map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div
                key={faq.question}
                style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#ffffff' }}
              >
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '16px 18px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span className="font-bold text-slate-900" style={{ fontSize: '14px' }}>{faq.question}</span>
                  <i
                    className="fa-solid fa-chevron-down"
                    style={{
                      color: '#094074',
                      fontSize: '13px',
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  ></i>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? '400px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease, opacity 0.3s ease',
                  }}
                >
                  <p className="text-slate-600 leading-relaxed" style={{ fontSize: '13px', padding: '0 18px 16px' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
