'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { slugifyDestination, toTitleCase, slugifyActivityName } from '../utils';

interface Activity {
  id: number;
  name: string;
  location: string;
  duration: string;
  rating?: number | null;
  price: number;
  offer_price: number;
  featured_image: string;
  description?: string;
}

const durationBuckets = [
  { label: 'Up to 1 hour', test: (mins: number) => mins <= 60 },
  { label: '1 to 4 hours', test: (mins: number) => mins > 60 && mins <= 240 },
  { label: '4 hours to 1 day', test: (mins: number) => mins > 240 && mins <= 1440 },
  { label: 'Multi-day', test: (mins: number) => mins > 1440 },
];

function parseDurationMinutes(duration: string) {
  if (!duration) return 60;
  const hourMatch = duration.match(/(\d+(\.\d+)?)\s*hour/i);
  const dayMatch = duration.match(/(\d+(\.\d+)?)\s*day/i);
  if (dayMatch) return parseFloat(dayMatch[1]) * 1440;
  if (hourMatch) return parseFloat(hourMatch[1]) * 60;
  return 60;
}

export default function CityActivitiesPage() {
  const params = useParams();
  const router = useRouter();
  // URL segment is the full "activity-in-<city>" slug — strip the prefix to get the city.
  const rawSegment = (params?.city as string) || '';
  const citySlug = rawSegment.replace(/^activity-in-/, '');
  const cityName = toTitleCase(citySlug);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sortBy, setSortBy] = useState<'rating' | 'price_low' | 'price_high'>('rating');
  const [searchText, setSearchText] = useState('');
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [mobilePriceOpen, setMobilePriceOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const [whereInput, setWhereInput] = useState(cityName);
  const [whenInput, setWhenInput] = useState('');
  const whenInputRef = useRef<HTMLInputElement>(null);
  const todayDateString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setWhereInput(cityName);
  }, [cityName]);

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

  const cityActivities = useMemo(
    () => activities.filter((a) => (a.location || '').toLowerCase().includes(cityName.toLowerCase())),
    [activities, cityName]
  );

  const priceCeiling = useMemo(() => {
    const prices = cityActivities.map((a) => (a.offer_price > 0 ? a.offer_price : a.price));
    return prices.length > 0 ? Math.max(...prices) : 10000;
  }, [cityActivities]);

  const filteredSorted = useMemo(() => {
    let list = cityActivities;

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter((a) => (a.name || '').toLowerCase().includes(q));
    }

    if (selectedDurations.length > 0) {
      list = list.filter((a) => {
        const mins = parseDurationMinutes(a.duration);
        return selectedDurations.some((label) => durationBuckets.find((b) => b.label === label)?.test(mins));
      });
    }

    if (maxPrice !== null) {
      list = list.filter((a) => (a.offer_price > 0 ? a.offer_price : a.price) <= maxPrice);
    }

    const getPrice = (a: Activity) => (a.offer_price > 0 ? a.offer_price : a.price);
    const sorted = [...list];
    if (sortBy === 'price_low') sorted.sort((a, b) => getPrice(a) - getPrice(b));
    else if (sortBy === 'price_high') sorted.sort((a, b) => getPrice(b) - getPrice(a));
    else sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return sorted;
  }, [cityActivities, searchText, selectedDurations, maxPrice, sortBy]);

  const toggleDuration = (label: string) => {
    setSelectedDurations((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugifyDestination(whereInput);
    if (slug) router.push(`/activities/activity-in-${slug}`);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero with search bar */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden"
        style={{ paddingTop: '90px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative" style={{ paddingBottom: '40px', paddingTop: '30px' }}>
          <form
            onSubmit={handleHeroSearch}
            className="bg-white rounded-full sm:rounded-2xl shadow-xl flex flex-row items-stretch sm:items-center max-w-[640px] mx-auto"
          >
            <div className="flex-1 min-w-0 px-3 sm:px-5 py-2 sm:py-3 border-r border-slate-100 flex items-center gap-2 sm:gap-3">
              <i className="fa-solid fa-location-dot text-slate-400 text-[11px] sm:text-base"></i>
              <div className="flex-1 min-w-0">
                <label className="font-black text-slate-800 block text-[10px] sm:text-[13px]">Where?</label>
                <input
                  type="text"
                  value={whereInput}
                  onChange={(e) => setWhereInput(e.target.value)}
                  className="w-full border-none p-0 text-slate-500 focus:outline-none focus:ring-0 bg-transparent text-[9px] sm:text-[13px]"
                />
              </div>
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
                  className="hero-date-input w-full border-none p-0 text-slate-500 focus:outline-none focus:ring-0 bg-transparent cursor-pointer text-[9px] sm:text-[13px]"
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
          <style jsx>{`
            .hero-date-input::-webkit-calendar-picker-indicator {
              display: none;
              -webkit-appearance: none;
            }
          `}</style>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-2 sm:px-6 lg:px-8 pb-[110px] lg:pb-[60px]" style={{ paddingTop: '24px' }}>
        {/* Breadcrumb + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Home</Link>
            <span className="mx-1.5">&gt;</span>
            <Link href="/activities" className="hover:underline" style={{ textDecoration: 'none', color: '#64748b' }}>Activities</Link>
            <span className="mx-1.5">&gt;</span>
            <span className="font-bold" style={{ color: '#1d91f2' }}>{cityName} Activities</span>
          </p>

          <div className="hidden lg:flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-700 mr-1">Sort By:</span>
            {[
              { key: 'rating', label: 'Traveller Rating' },
              { key: 'price_low', label: 'Price (Low to High)' },
              { key: 'price_high', label: 'Price (High to Low)' },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSortBy(opt.key as 'rating' | 'price_low' | 'price_high')}
                className="font-bold border cursor-pointer transition"
                style={{
                  fontSize: '12px',
                  borderRadius: '999px',
                  padding: '7px 14px',
                  borderColor: sortBy === opt.key ? '#1d91f2' : '#e2e8f0',
                  color: sortBy === opt.key ? '#1d91f2' : '#64748b',
                  background: sortBy === opt.key ? '#eef6ff' : '#ffffff',
                }}
              >
                {opt.label}
              </button>
            ))}
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                className="border border-slate-200 rounded-full text-xs font-semibold focus:outline-none focus:border-[#1d91f2]"
                style={{ padding: '8px 32px 8px 14px', width: '140px' }}
              />
              <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs absolute" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
            </div>
          </div>
        </div>

        <h1 className="font-black text-slate-900 mb-6" style={{ fontSize: '26px' }}>
          {cityName} Activities
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900" style={{ fontSize: '16px' }}>Filter</h3>
              <button
                type="button"
                onClick={() => { setSelectedDurations([]); setMaxPrice(null); }}
                className="text-xs font-bold border-none bg-transparent cursor-pointer hover:underline"
                style={{ color: '#1d91f2' }}
              >
                Reset
              </button>
            </div>

            <div className="bg-white border border-slate-150 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '13px' }}>Price</h4>
              <input
                type="range"
                min={0}
                max={Math.ceil(priceCeiling)}
                value={maxPrice ?? Math.ceil(priceCeiling)}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#1d91f2' }}
              />
              <div className="text-xs font-semibold text-slate-500 mt-1">
                &#8377;0 - &#8377;{(maxPrice ?? Math.ceil(priceCeiling)).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-xl p-4">
              <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '13px' }}>Duration</h4>
              <div className="space-y-2.5">
                {durationBuckets.map((bucket) => {
                  const isChecked = selectedDurations.includes(bucket.label);
                  return (
                    <div
                      key={bucket.label}
                      onClick={() => toggleDuration(bucket.label)}
                      className="flex items-center gap-2.5 cursor-pointer select-none"
                    >
                      <div className={`w-[15px] h-[15px] rounded border flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-[#1d91f2] border-[#1d91f2] text-white' : 'bg-white border-slate-300'}`}>
                        {isChecked && <i className="fa-solid fa-check text-[8px]"></i>}
                      </div>
                      <span className="text-slate-700 font-semibold" style={{ fontSize: '12px' }}>{bucket.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <style jsx>{`
              .twb-activity-card {
                padding: 10px !important;
              }
              @media (min-width: 640px) {
                .twb-activity-card {
                  padding: 14px !important;
                }
              }
            `}</style>
            {isLoading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff8126] mx-auto mb-3"></div>
                <p className="text-slate-400 font-semibold text-sm">Loading {cityName} activities...</p>
              </div>
            )}

            {!isLoading && filteredSorted.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
                <p className="text-slate-500 font-semibold">No activities found in {cityName} right now.</p>
                <Link href="/activities" className="mt-3 inline-block font-bold hover:underline" style={{ color: '#1d91f2', textDecoration: 'none' }}>
                  Browse all activities
                </Link>
              </div>
            )}

            {!isLoading && filteredSorted.map((act) => {
              const img = act.featured_image ? `/${act.featured_image}` : '/images/default-activity.jpg';
              const price = Number(act.offer_price) > 0 ? Number(act.offer_price) : Number(act.price) || 0;
              // Only a genuine, admin-set rating is shown - no fallback/fabricated
              // number, and no invented "review count" since there's no real
              // reviews system behind it.
              const ratingNum = Number(act.rating) || 0;
              const ratingValue = ratingNum.toFixed(1);
              const filledStars = Math.round(ratingNum);

              const description = act.description?.trim() ||
                `Discover ${act.name || 'this experience'} in ${cityName} — a handpicked activity offering a memorable, hassle-free way to explore the destination with Twin Brothers Holidays.`;

              return (
                <div
                  key={act.id}
                  className="twb-activity-card flex flex-col sm:flex-row gap-4 bg-white border border-slate-150 rounded-2xl mb-4"
                >
                  <div className="relative w-full sm:w-[260px] h-[152px] sm:h-[310px] self-start rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={img} alt={act.name || 'Activity'} className="w-full h-full object-cover" />
                    {/* Rating badge overlay (mobile only) - only when a real rating is set */}
                    {ratingNum > 0 && (
                      <span
                        className="sm:hidden absolute top-2 right-2 flex items-center gap-1 rounded-full font-bold"
                        style={{ background: 'rgba(255,255,255,0.92)', fontSize: '11px', padding: '3px 8px', color: '#1e293b' }}
                      >
                        <i className="fa-solid fa-star text-amber-500" style={{ fontSize: '10px' }}></i>
                        {ratingValue}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-[4px]">
                        <h3 className="font-black text-slate-900 truncate" style={{ fontSize: '17px' }}>
                          {act.name || 'Untitled Activity'}
                        </h3>
                        {act.duration && (
                          <span className="sm:hidden flex items-center gap-1 text-slate-500 font-semibold flex-shrink-0" style={{ fontSize: '12px' }}>
                            <i className="fa-regular fa-clock"></i>
                            {act.duration}
                          </span>
                        )}
                      </div>
                      <p className="flex items-center gap-1.5 mb-[6px] text-slate-500 font-semibold" style={{ fontSize: '13px' }}>
                        <i className="fa-solid fa-location-dot text-slate-400"></i>
                        {cityName}
                      </p>
                      {ratingNum > 0 && (
                        <p className="hidden sm:flex items-center gap-1.5 mb-[6px]">
                          <span className="text-amber-500 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i
                                key={i}
                                className={i < filledStars ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                                style={{ fontSize: '12px' }}
                              ></i>
                            ))}
                          </span>
                          <span className="text-slate-500 font-semibold" style={{ fontSize: '13px' }}>{ratingValue}</span>
                        </p>
                      )}
                      {act.duration && (
                        <p className="hidden sm:flex items-center gap-1.5 text-slate-500 font-semibold mb-[8px]" style={{ fontSize: '13px' }}>
                          <i className="fa-regular fa-clock"></i>
                          {act.duration}
                        </p>
                      )}
                      <div className="border-t border-slate-100 pt-[8px]">
                        <p className="text-slate-600 line-clamp-3" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                          {description}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-[150px] flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                      <div className="text-right">
                        <span className="font-black text-slate-900 block" style={{ fontSize: '20px' }}>
                          &#8377;{price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400 font-semibold" style={{ fontSize: '11px' }}>Per Person</span>
                      </div>
                      <span className="flex items-center gap-1 font-bold" style={{ fontSize: '12px', color: '#1fae5c' }}>
                        <i className="fa-solid fa-check-double"></i> Free Cancellation
                      </span>
                      <button
                        type="button"
                        onClick={() => router.push(`/activities/${rawSegment}/${slugifyActivityName(act.name)}/`)}
                        className="text-white font-black uppercase tracking-wider border-none cursor-pointer"
                        style={{ background: '#ff8126', fontSize: '13px', borderRadius: '999px', padding: '12px 26px' }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Floating Price / Filters / Sort Bar */}
      <div
        className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex items-stretch justify-around rounded-full shadow-lg"
        style={{ background: '#0f172a' }}
      >
        <button
          type="button"
          onClick={() => setMobilePriceOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white border-none bg-transparent cursor-pointer"
          style={{ paddingTop: '10px', paddingBottom: '10px' }}
        >
          <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: '14px' }}></i>
          <span className="font-bold" style={{ fontSize: '11px' }}>Price</span>
        </button>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.18)', margin: '10px 0' }}></div>
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white border-none bg-transparent cursor-pointer"
          style={{ paddingTop: '10px', paddingBottom: '10px' }}
        >
          <i className="fa-solid fa-sliders" style={{ fontSize: '14px' }}></i>
          <span className="font-bold" style={{ fontSize: '11px' }}>Filters</span>
        </button>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.18)', margin: '10px 0' }}></div>
        <button
          type="button"
          onClick={() => setMobileSortOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-white border-none bg-transparent cursor-pointer"
          style={{ paddingTop: '10px', paddingBottom: '10px' }}
        >
          <i className="fa-solid fa-arrow-up-wide-short" style={{ fontSize: '14px' }}></i>
          <span className="font-bold" style={{ fontSize: '11px' }}>Sort</span>
        </button>
      </div>

      {/* Mobile Price Bottom Sheet */}
      {mobilePriceOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end" onClick={() => setMobilePriceOpen(false)}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative bg-white w-full rounded-t-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 mb-4" style={{ fontSize: '17px' }}>Price</h3>
            <input
              type="range"
              min={0}
              max={Math.ceil(priceCeiling)}
              value={maxPrice ?? Math.ceil(priceCeiling)}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#1d91f2' }}
            />
            <div className="text-sm font-semibold text-slate-500 mt-1 mb-4">
              &#8377;0 - &#8377;{(maxPrice ?? Math.ceil(priceCeiling)).toLocaleString('en-IN')}
            </div>
            <button
              type="button"
              onClick={() => setMobilePriceOpen(false)}
              className="w-full text-white font-black uppercase tracking-wider border-none cursor-pointer"
              style={{ background: '#ff8126', paddingTop: '12px', paddingBottom: '12px', borderRadius: '10px' }}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filters Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end" onClick={() => setMobileFilterOpen(false)}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative bg-white w-full rounded-t-2xl p-5 max-h-[75vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900" style={{ fontSize: '17px' }}>Filters</h3>
              <button
                type="button"
                onClick={() => { setSelectedDurations([]); setMaxPrice(null); }}
                className="text-xs font-bold border-none bg-transparent cursor-pointer"
                style={{ color: '#1d91f2' }}
              >
                Reset
              </button>
            </div>

            <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '13px' }}>Duration</h4>
            <div className="space-y-2.5 mb-4">
              {durationBuckets.map((bucket) => {
                const isChecked = selectedDurations.includes(bucket.label);
                return (
                  <div
                    key={bucket.label}
                    onClick={() => toggleDuration(bucket.label)}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-[#1d91f2] border-[#1d91f2] text-white' : 'bg-white border-slate-300'}`}>
                      {isChecked && <i className="fa-solid fa-check text-[9px]"></i>}
                    </div>
                    <span className="text-slate-700 font-semibold" style={{ fontSize: '13px' }}>{bucket.label}</span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full text-white font-black uppercase tracking-wider border-none cursor-pointer"
              style={{ background: '#ff8126', paddingTop: '12px', paddingBottom: '12px', borderRadius: '10px' }}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {mobileSortOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end" onClick={() => setMobileSortOpen(false)}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative bg-white w-full rounded-t-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 mb-4" style={{ fontSize: '17px' }}>Sort By</h3>
            {[
              { key: 'rating', label: 'Traveller Rating' },
              { key: 'price_low', label: 'Price (Low to High)' },
              { key: 'price_high', label: 'Price (High to Low)' },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => { setSortBy(opt.key as 'rating' | 'price_low' | 'price_high'); setMobileSortOpen(false); }}
                className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0 cursor-pointer select-none"
              >
                <span
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: sortBy === opt.key ? '#ff8126' : '#cbd5e1' }}
                >
                  {sortBy === opt.key && <span className="w-2 h-2 rounded-full" style={{ background: '#ff8126' }}></span>}
                </span>
                <span className="text-slate-700 font-semibold text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
