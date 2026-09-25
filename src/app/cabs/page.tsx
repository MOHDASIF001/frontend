'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, resolveAssetUrl } from '../../config';
import ServiceQuickLinks from '../../components/ServiceQuickLinks';

interface CabOffer {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  tag?: string;
  code?: string;
  image?: string;
  image_alt?: string | null;
}

export default function CabsPage() {
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const router = useRouter();
  const [pickupCity, setPickupCity] = useState('srinagar');
  const [dropCity, setDropCity] = useState('gulmarg');
  const [pickupDate, setPickupDate] = useState(getTodayDateString());
  const [pickupTime, setPickupTime] = useState(getCurrentTimeString());
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('10:00');

  const [activeTab, setActiveTab] = useState<'oneway' | 'roundtrip' | 'hourly' | 'airport'>('oneway');
  const [airportTransferMode, setAirportTransferMode] = useState<'pickup' | 'drop'>('pickup');
  const [showAirportModeDropdown, setShowAirportModeDropdown] = useState(false);

  const offerContainerRef = useRef<HTMLDivElement>(null);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [offers, setOffers] = useState<CabOffer[]>([]);

  const handleOfferScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const cardWidth = 380;
    const index = Math.round(scrollLeft / cardWidth);
    const boundedIndex = Math.max(0, Math.min(offers.length - 1, index));
    setActiveOfferIndex(boundedIndex);
  };

  const scrollToOffer = (index: number) => {
    if (offerContainerRef.current) {
      const cardWidth = 380;
      offerContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveOfferIndex(index);
    }
  };

  const [popularServiceTab, setPopularServiceTab] = useState<'airport' | 'hourly' | 'outstation' | 'service'>('airport');
  const popularCitiesRef = useRef<HTMLDivElement>(null);

  const scrollPopularCities = (direction: 'left' | 'right') => {
    if (popularCitiesRef.current) {
      const scrollAmount = 340;
      popularCitiesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCityClick = (cityValue: string, dropValue?: string) => {
    router.push(`/cabs/${cityValue}${dropValue ? `?drop=${dropValue}` : ''}`);
  };

  interface PopularCity {
    id: number;
    name: string;
    state: string;
    value: string;
    image: string | null;
    image_alt?: string | null;
  }
  const [popularCities, setPopularCities] = useState<PopularCity[]>([]);

  const fetchPopularCities = async (tab: 'airport' | 'outstation' | 'service') => {
    try {
      const res = await fetch(`${API_BASE_URL}/cab_service_cities.php?section=popular&tab=${tab}`);
      const data = await res.json();
      if (data.status === 'success') {
        setPopularCities(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching popular cab cities:', err);
    }
  };

  useEffect(() => {
    const tab = popularServiceTab === 'hourly' ? 'airport' : popularServiceTab;
    fetchPopularCities(tab);
  }, [popularServiceTab]);

  const hourlyRentalsRef = useRef<HTMLDivElement>(null);

  const scrollHourlyRentals = (direction: 'left' | 'right') => {
    if (hourlyRentalsRef.current) {
      const scrollAmount = 300;
      hourlyRentalsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  interface HourlyRentalCity {
    id: number;
    name: string;
    state: string;
    value: string;
    image: string | null;
    image_alt?: string | null;
    hourly_price: number | null;
    drop_name?: string;
    drop_value?: string;
  }
  const [hourlyRentalCities, setHourlyRentalCities] = useState<HourlyRentalCity[]>([]);

  const fetchHourlyRentalCities = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cab_service_cities.php?section=hourly`);
      const data = await res.json();
      if (data.status === 'success') {
        setHourlyRentalCities(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching hourly rental cities:', err);
    }
  };

  const [locationsList, setLocationsList] = useState<any[]>([]);
  const [isCabInfoExpanded, setIsCabInfoExpanded] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const faqList = [
    {
      question: 'How do I book an outstation cab with Twin Brothers Holidays?',
      answer: 'Booking an outstation cab is simple — select your trip type (One Way or Round Trip), enter your pickup and drop-off city, choose your travel date and time, and click Search. You can compare cab options like Hatchbacks, Sedans, and SUVs before confirming your booking.',
    },
    {
      question: 'Do you provide airport transfer cab services?',
      answer: 'Yes, we offer reliable airport transfer cabs across major cities. Simply select the Airport Transfer tab, enter your pickup location and flight details, and we will arrange a comfortable cab to get you to the airport or your destination on time.',
    },
    {
      question: 'What types of cabs are available for booking?',
      answer: 'We offer a wide variety of cabs including Hatchbacks, Sedans, SUVs, and AC/Non-AC options through our network of 4000+ cab operators, so you can choose a vehicle that fits your group size and budget.',
    },
    {
      question: 'Are there any discounts or offers on cab bookings?',
      answer: 'Yes, Twin Brothers Holidays regularly offers discounted rates and exclusive promo codes on outstation, airport, and hourly cab bookings. Check our Exclusive Offers section above for the latest deals.',
    },
    {
      question: 'Is it safe to book a cab online with Twin Brothers Holidays?',
      answer: 'Absolutely. All our cab partners are verified, drivers are experienced, and vehicles are well-maintained. We also offer 24/7 customer support and a 100% full refund policy for cancellations, ensuring a safe and hassle-free journey.',
    },
    {
      question: 'Can I cancel or modify my cab booking after confirmation?',
      answer: 'Yes, you can cancel or modify your cab booking easily through our platform. Our 100% full refund policy ensures you get your money back for eligible cancellations, and our support team is available 24/7 to assist with changes.',
    },
  ];
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const bannerImages = [
    '/images/cabs_promo_banner.png',
    '/images/cabs_promo_banner2.png',
    '/images/cabs_promo_banner3.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropSearch, setDropSearch] = useState('');
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);

  const pickupTimeRef = useRef<HTMLInputElement>(null);
  const returnTimeRef = useRef<HTMLInputElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  // Computed client-side only (in an effect) rather than during render, since
  // calling getCurrentTimeString() directly in JSX produces a different value
  // on the server render vs. the client hydration pass and triggers a
  // hydration mismatch on this `min` attribute.
  const [minPickupTime, setMinPickupTime] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    setMinPickupTime(pickupDate === getTodayDateString() ? getCurrentTimeString() : undefined);
  }, [pickupDate]);

  useEffect(() => {
    fetchLocations();
    fetchOffers();
    fetchHourlyRentalCities();

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.select-none-location')) {
        setShowPickupDropdown(false);
        setShowDropDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/offers.php?page=cabs`);
      const data = await res.json();
      if (data.status === 'success') {
        setOffers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cab_locations.php`);
      const data = await res.json();
      if (data.status === 'success') {
        setLocationsList(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const getSelectedLocationName = (value: string) => {
    const loc = locationsList.find(l => l.value === value);
    return loc ? loc.name : value.toUpperCase();
  };

  const getSelectedLocationSubtitle = (value: string) => {
    const loc = locationsList.find(l => l.value === value);
    return loc ? loc.subtitle : 'Choose location';
  };

  const handlePickupDateChange = (val: string) => {
    setPickupDate(val);
    const today = getTodayDateString();
    if (val === today) {
      const curTime = getCurrentTimeString();
      if (pickupTime < curTime) {
        setPickupTime(curTime);
      }
    }
    if (returnDate && val > returnDate) {
      setReturnDate(val);
    }
  };

  const handlePickupTimeChange = (val: string) => {
    const today = getTodayDateString();
    if (pickupDate === today) {
      const curTime = getCurrentTimeString();
      if (val < curTime) {
        setPickupTime(curTime);
        return;
      }
    }
    setPickupTime(val);
  };

  const handleReturnDateChange = (val: string) => {
    setReturnDate(val);
    if (val === pickupDate) {
      if (returnTime < pickupTime) {
        setReturnTime(pickupTime);
      }
    }
  };

  const handleReturnTimeChange = (val: string) => {
    if (returnDate === pickupDate) {
      if (val < pickupTime) {
        setReturnTime(pickupTime);
        return;
      }
    }
    setReturnTime(val);
  };



  const handleTabChange = (tab: 'oneway' | 'roundtrip' | 'hourly' | 'airport') => {
    setActiveTab(tab);
    if (tab === 'airport') {
      setAirportTransferMode('pickup');
      setPickupCity('srinagar-airport');
      setDropCity('srinagar');
    } else if (pickupCity === 'srinagar-airport') {
      setPickupCity('srinagar');
    }
  };

  const handleSwapLocations = () => {
    const temp = pickupCity;
    setPickupCity(dropCity);
    setDropCity(temp);
  };

  const handleSearchClick = () => {
    const params = new URLSearchParams({
      pickup: pickupCity,
      drop: dropCity,
      pickupDate,
      pickupTime,
      trip: activeTab,
    });
    if (activeTab === 'roundtrip') {
      params.set('returnDate', returnDate);
      params.set('returnTime', returnTime);
    }
    if (activeTab === 'airport') {
      params.set('airportMode', airportTransferMode);
    }
    router.push(`/cabs/list?${params.toString()}`);
  };

  const handleAirportModeChange = (mode: 'pickup' | 'drop') => {
    setAirportTransferMode(mode);
    if (mode === 'pickup') {
      setPickupCity('srinagar-airport');
      setDropCity('srinagar');
    } else {
      setPickupCity('srinagar');
      setDropCity('srinagar-airport');
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-3 pb-16">

      {/* 1. Hero Section (Navy Blue Gradient) */}
      <div className="bg-gradient-to-r from-[#094074] to-[#05213d] px-4 sm:px-6 lg:px-8 text-white relative pt-5 lg:pt-[40px]" style={{ paddingBottom: '40px' }}>
        <div className="max-w-[1140px] mx-auto">

          {/* Responsive quick access icons row */}
          <ServiceQuickLinks active="cabs" />

          {/* Desktop Header Row + Search Widget (unchanged) */}
          <div className="hidden lg:block">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Trip Type Tabs bar */}
            <div className="bg-white/10 backdrop-blur-md p-1 inline-flex gap-1 border border-white/20" style={{ borderRadius: '30px', marginBottom: '10px' }}>
              <button
                onClick={() => handleTabChange('oneway')}
                className={`py-1.5 font-bold transition-all border-none cursor-pointer ${activeTab === 'oneway' ? 'bg-[#ff8126] text-white shadow-md' : 'bg-transparent text-white hover:bg-white/10'}`}
                style={{ fontSize: '14px', borderRadius: '30px', paddingLeft: '11px', paddingRight: '11px' }}
              >
                Outstation One Way
              </button>
              <button
                onClick={() => handleTabChange('roundtrip')}
                className={`py-1.5 font-bold transition-all border-none cursor-pointer ${activeTab === 'roundtrip' ? 'bg-[#ff8126] text-white shadow-md' : 'bg-transparent text-white hover:bg-white/10'}`}
                style={{ fontSize: '14px', borderRadius: '30px', paddingLeft: '11px', paddingRight: '11px' }}
              >
                Outstation Round Trip
              </button>
              <button
                onClick={() => handleTabChange('airport')}
                className={`py-1.5 font-bold transition-all border-none cursor-pointer ${activeTab === 'airport' ? 'bg-[#ff8126] text-white shadow-md' : 'bg-transparent text-white hover:bg-white/10'}`}
                style={{ fontSize: '14px', borderRadius: '30px', paddingLeft: '11px', paddingRight: '11px' }}
              >
                Airport Transfer
              </button>
            </div>

            <h1 className="font-black uppercase tracking-wider text-right mb-0" style={{ fontSize: '18px' }}>
              Book Online Cab
            </h1>
          </div>

          {/* Search Box Widget Card */}
          <div id="cab-searchbar-container" className="bg-white rounded-2xl shadow-2xl border border-slate-100 text-slate-800 overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* Inputs columns wrapper (10 cols on large screens) */}
              <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-150">

                {/* AIRPORT TRANSFER selector (Airport tab only) */}
                {activeTab === 'airport' && (
                  <div className="py-3 px-4 flex flex-col justify-center relative select-none-location rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                    <div
                      className="flex items-center gap-1.5 mb-1 cursor-pointer"
                      onClick={() => setShowAirportModeDropdown(!showAirportModeDropdown)}
                    >
                      <i className="fa-solid fa-plane text-[#094074] text-xs"></i>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">AIRPORT TRANSFER</span>
                    </div>

                    <div
                      onClick={() => setShowAirportModeDropdown(!showAirportModeDropdown)}
                      className="text-sm font-extrabold text-slate-800 cursor-pointer flex items-center gap-2 py-0.5"
                    >
                      Airport
                      <i className="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {airportTransferMode === 'pickup' ? 'Pick Up' : 'Drop'}
                    </span>

                    {/* Dropdown Card */}
                    {showAirportModeDropdown && (
                      <div className="absolute top-[100%] left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[220px] mt-1">
                        <div
                          onClick={() => { handleAirportModeChange('pickup'); setShowAirportModeDropdown(false); }}
                          className={`px-4 py-3 cursor-pointer hover:bg-slate-50 font-bold text-sm ${airportTransferMode === 'pickup' ? 'bg-blue-50 text-[#094074]' : 'text-slate-700'}`}
                        >
                          Airport Pick Up
                        </div>
                        <div
                          onClick={() => { handleAirportModeChange('drop'); setShowAirportModeDropdown(false); }}
                          className={`px-4 py-3 cursor-pointer hover:bg-slate-50 font-bold text-sm border-t border-slate-100 ${airportTransferMode === 'drop' ? 'bg-blue-50 text-[#094074]' : 'text-slate-700'}`}
                        >
                          Airport Drop
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FROM location */}
                <div className={`py-3 px-4 flex flex-col justify-center relative select-none-location ${activeTab === 'airport' ? 'rounded-t-2xl lg:rounded-none' : 'rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none'}`}>
                  <div className="flex items-center gap-1.5 mb-1 cursor-pointer" onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); setShowAirportModeDropdown(false); }}>
                    <i className="fa-solid fa-location-dot text-[#094074] text-xs"></i>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                      {activeTab === 'airport' ? (airportTransferMode === 'pickup' ? 'FROM (AIRPORT)' : 'FROM (PICK-UP)') : 'FROM (PICK-UP)'}
                    </span>
                  </div>

                  {/* Selected Display Value */}
                  <div
                    onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); }}
                    className="text-sm font-extrabold text-slate-800 cursor-pointer truncate pr-4 py-0.5 animate-fade-in"
                  >
                    {getSelectedLocationName(pickupCity)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate cursor-pointer" onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); }}>
                    {getSelectedLocationSubtitle(pickupCity)}
                  </span>

                  {/* Dropdown Card */}
                  {showPickupDropdown && (
                    <div className="absolute top-[100%] left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-[360px] mt-1">
                      {/* Search input field */}
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                        <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                        <input
                          type="text"
                          placeholder="Search pick-up..."
                          value={pickupSearch}
                          onChange={(e) => setPickupSearch(e.target.value)}
                          className="border-none p-0 text-xs font-bold text-slate-700 bg-transparent focus:ring-0 w-full outline-none"
                          autoFocus
                        />
                      </div>
                      {/* Scrollable list */}
                      <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-50">
                        {locationsList
                          .filter(loc =>
                            loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
                            loc.subtitle.toLowerCase().includes(pickupSearch.toLowerCase())
                          )
                          .map(loc => (
                            <div
                              key={loc.id}
                              onClick={() => {
                                setPickupCity(loc.value);
                                setShowPickupDropdown(false);
                                setPickupSearch('');
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center w-8 text-center flex-shrink-0">
                                {loc.type === 'Airport' && <i className="fa-solid fa-plane text-[#ff8126] text-xs"></i>}
                                {loc.type === 'Station' && <i className="fa-solid fa-train text-blue-500 text-xs"></i>}
                                {loc.type === 'City' && <i className="fa-solid fa-city text-emerald-500 text-[10px]"></i>}
                                {loc.type === 'Region' && <i className="fa-solid fa-location-dot text-indigo-500 text-xs"></i>}
                                <span className="text-[6px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">{loc.type}</span>
                              </div>
                              <div className="flex-1 min-w-0 text-start">
                                <div className="text-xs font-extrabold text-slate-800 truncate">{loc.name}</div>
                                <div className="text-[9px] text-slate-400 font-bold truncate mt-0.5">{loc.subtitle}</div>
                              </div>
                            </div>
                          ))}
                        {locationsList.filter(loc =>
                          loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
                          loc.subtitle.toLowerCase().includes(pickupSearch.toLowerCase())
                        ).length === 0 && (
                            <div className="text-center py-4 text-xs font-bold text-slate-400">No supported locations found</div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Swap Location Button */}
                  <button
                    onClick={handleSwapLocations}
                    className="absolute right-[-14px] top-[40%] translate-y-[-50%] z-10 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer hidden sm:flex"
                    title="Swap locations"
                  >
                    <i className="fa-solid fa-right-left text-[#094074] text-[10px]"></i>
                  </button>
                </div>

                {/* TO location */}
                <div className="py-3 px-4 flex flex-col justify-center relative select-none-location">
                  <div className="flex items-center gap-1.5 mb-1 cursor-pointer" onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); setShowAirportModeDropdown(false); }}>
                    <i className="fa-solid fa-location-crosshairs text-[#094074] text-xs"></i>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                      {activeTab === 'airport' ? (airportTransferMode === 'drop' ? 'TO (AIRPORT)' : 'TO (DROP-OFF)') : 'TO (DROP-OFF)'}
                    </span>
                  </div>

                  {/* Selected Display Value */}
                  <div
                    onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); }}
                    className="text-sm font-extrabold text-slate-800 cursor-pointer truncate pr-4 py-0.5 animate-fade-in"
                  >
                    {getSelectedLocationName(dropCity)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate cursor-pointer" onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); }}>
                    {getSelectedLocationSubtitle(dropCity)}
                  </span>

                  {/* Dropdown Card */}
                  {showDropDropdown && (
                    <div className="absolute top-[100%] left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-[360px] mt-1">
                      {/* Search input field */}
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                        <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                        <input
                          type="text"
                          placeholder="Search drop-off..."
                          value={dropSearch}
                          onChange={(e) => setDropSearch(e.target.value)}
                          className="border-none p-0 text-xs font-bold text-slate-700 bg-transparent focus:ring-0 w-full outline-none"
                          autoFocus
                        />
                      </div>
                      {/* Scrollable list */}
                      <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-50">
                        {locationsList
                          .filter(loc =>
                            loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
                            loc.subtitle.toLowerCase().includes(dropSearch.toLowerCase())
                          )
                          .map(loc => (
                            <div
                              key={loc.id}
                              onClick={() => {
                                setDropCity(loc.value);
                                setShowDropDropdown(false);
                                setDropSearch('');
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center w-8 text-center flex-shrink-0">
                                {loc.type === 'Airport' && <i className="fa-solid fa-plane text-[#ff8126] text-xs"></i>}
                                {loc.type === 'Station' && <i className="fa-solid fa-train text-blue-500 text-xs"></i>}
                                {loc.type === 'City' && <i className="fa-solid fa-city text-emerald-500 text-[10px]"></i>}
                                {loc.type === 'Region' && <i className="fa-solid fa-location-dot text-indigo-500 text-xs"></i>}
                                <span className="text-[6px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">{loc.type}</span>
                              </div>
                              <div className="flex-1 min-w-0 text-start">
                                <div className="text-xs font-extrabold text-slate-800 truncate">{loc.name}</div>
                                <div className="text-[9px] text-slate-400 font-bold truncate mt-0.5">{loc.subtitle}</div>
                              </div>
                            </div>
                          ))}
                        {locationsList.filter(loc =>
                          loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
                          loc.subtitle.toLowerCase().includes(dropSearch.toLowerCase())
                        ).length === 0 && (
                            <div className="text-center py-4 text-xs font-bold text-slate-400">No supported locations found</div>
                          )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PICKUP Date & Time */}
                <div className="py-3 px-4 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <i className="fa-regular fa-calendar-days text-[#094074] text-xs"></i>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">PICK-UP DATE & TIME</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="date"
                      value={pickupDate}
                      min={getTodayDateString()}
                      onChange={(e) => {
                        handlePickupDateChange(e.target.value);
                        setTimeout(() => {
                          pickupTimeRef.current?.showPicker();
                        }, 100);
                      }}
                      className="border border-slate-200/60 bg-transparent rounded px-1.5 py-0.5 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer w-[115px]"
                      style={{ fontSize: '14px' }}
                    />
                    <input
                      ref={pickupTimeRef}
                      type="time"
                      value={pickupTime}
                      min={minPickupTime}
                      onChange={(e) => handlePickupTimeChange(e.target.value)}
                      className="border border-slate-200/60 bg-transparent rounded px-1.5 py-0.5 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer w-[80px]"
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Departure timing</span>
                </div>

                {/* RETURN Date & Time (hidden for Airport Transfer, replaced by the Airport selector) */}
                {activeTab !== 'airport' && (
                  <div className="py-3 px-4 flex flex-col justify-center bg-slate-50/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <i className="fa-regular fa-calendar-check text-[#094074] text-xs"></i>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">RETURN DATE & TIME</span>
                    </div>

                    {activeTab === 'roundtrip' ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="date"
                          value={returnDate}
                          min={pickupDate || getTodayDateString()}
                          onChange={(e) => {
                            handleReturnDateChange(e.target.value);
                            setTimeout(() => {
                              returnTimeRef.current?.showPicker();
                            }, 100);
                          }}
                          className="border border-slate-200/60 bg-transparent rounded px-1.5 py-0.5 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer w-[115px]"
                          style={{ fontSize: '14px' }}
                        />
                        <input
                          ref={returnTimeRef}
                          type="time"
                          value={returnTime}
                          min={returnDate === pickupDate ? pickupTime : undefined}
                          onChange={(e) => handleReturnTimeChange(e.target.value)}
                          className="border border-slate-200/60 bg-transparent rounded px-1.5 py-0.5 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer w-[80px]"
                          style={{ fontSize: '14px' }}
                        />
                      </div>
                    ) : (
                      <span className="font-bold text-slate-400 block py-0.5" style={{ fontSize: '14px' }}>
                        Book a round trip to save more
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Round trip options</span>
                  </div>
                )}

              </div>

              {/* Search button column (2 cols on large screens) */}
              <div className="lg:col-span-2 flex">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="bg-[#f25b22] hover:bg-orange-600 text-white font-black tracking-widest text-base py-4 lg:py-0 w-full border-none cursor-pointer transition-all flex items-center justify-center gap-2"
                  style={{
                    borderTopRightRadius: isMobile ? '0px' : '16px',
                    borderBottomRightRadius: '16px',
                    borderBottomLeftRadius: isMobile ? '16px' : '0px',
                    borderTopLeftRadius: '0px'
                  }}
                >
                  SEARCH
                </button>
              </div>

            </div>
          </div>
          </div>
          {/* End Desktop Header Row + Search Widget */}

          {/* Mobile Header Row + Search Widget (redesigned) */}
          <div className="lg:hidden">
            {/* Trip Type Segmented Tabs */}
            <div className="bg-white/10 backdrop-blur-md p-1 flex w-full border border-white/20" style={{ borderRadius: '30px', marginBottom: '14px' }}>
              <button
                onClick={() => handleTabChange('oneway')}
                className={`flex-1 py-2.5 font-bold text-center transition-all border-none cursor-pointer ${activeTab === 'oneway' ? 'bg-[#ff8126] text-white shadow-md' : 'bg-transparent text-white/80'}`}
                style={{ fontSize: '12px', borderRadius: '30px' }}
              >
                One Way
              </button>
              <button
                onClick={() => handleTabChange('roundtrip')}
                className={`flex-1 py-2.5 font-bold text-center transition-all border-none cursor-pointer ${activeTab === 'roundtrip' ? 'bg-[#ff8126] text-white shadow-md' : 'bg-transparent text-white/80'}`}
                style={{ fontSize: '12px', borderRadius: '30px' }}
              >
                Round Trip
              </button>
              <button
                onClick={() => handleTabChange('airport')}
                className={`flex-1 py-2.5 font-bold text-center transition-all border-none cursor-pointer ${activeTab === 'airport' ? 'bg-[#ff8126] text-white shadow-md' : 'bg-transparent text-white/80'}`}
                style={{ fontSize: '12px', borderRadius: '30px' }}
              >
                Airport
              </button>
            </div>

            {/* Mobile Search Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 text-slate-800 overflow-visible">

              {/* Airport Pickup / Drop toggle (Airport tab only) */}
              {activeTab === 'airport' && (
                <div className="flex border-b border-slate-100 px-4 pt-3 pb-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAirportModeChange('pickup')}
                    className={`flex-1 py-2 font-black text-center border-none cursor-pointer transition-all ${airportTransferMode === 'pickup' ? 'bg-[#1d91f2] text-white' : 'bg-transparent text-slate-500'}`}
                    style={{ fontSize: '11px', borderRadius: '30px' }}
                  >
                    AIRPORT PICKUP
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAirportModeChange('drop')}
                    className={`flex-1 py-2 font-black text-center border-none cursor-pointer transition-all ${airportTransferMode === 'drop' ? 'bg-[#1d91f2] text-white' : 'bg-transparent text-slate-500'}`}
                    style={{ fontSize: '11px', borderRadius: '30px' }}
                  >
                    AIRPORT DROP
                  </button>
                </div>
              )}

              {/* FROM location */}
              <div className="px-4 relative select-none-location border-b border-slate-100" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <div
                  className="flex items-center gap-1.5 mb-1 cursor-pointer"
                  onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); }}
                >
                  <i className="fa-solid fa-location-dot text-[#094074] text-xs"></i>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                    {activeTab === 'airport' ? (airportTransferMode === 'pickup' ? 'FROM (AIRPORT)' : 'FROM (PICK-UP)') : 'FROM (PICK-UP)'}
                  </span>
                </div>
                <div
                  onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); }}
                  className="text-base font-extrabold text-slate-800 cursor-pointer truncate pr-8"
                >
                  {getSelectedLocationName(pickupCity)}
                </div>

                {/* Swap Button (straddles the divider between From & To) */}
                <button
                  onClick={handleSwapLocations}
                  className="absolute right-4 bottom-0 translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer"
                  title="Swap locations"
                >
                  <i className="fa-solid fa-right-left text-[#1d91f2] text-[11px]" style={{ transform: 'rotate(90deg)' }}></i>
                </button>

                {/* Dropdown Card */}
                {showPickupDropdown && (
                  <div className="absolute top-[100%] left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden mt-1">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                      <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                      <input
                        type="text"
                        placeholder="Search pick-up..."
                        value={pickupSearch}
                        onChange={(e) => setPickupSearch(e.target.value)}
                        className="border-none p-0 text-xs font-bold text-slate-700 bg-transparent focus:ring-0 w-full outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-50">
                      {locationsList
                        .filter(loc =>
                          loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
                          loc.subtitle.toLowerCase().includes(pickupSearch.toLowerCase())
                        )
                        .map(loc => (
                          <div
                            key={loc.id}
                            onClick={() => {
                              setPickupCity(loc.value);
                              setShowPickupDropdown(false);
                              setPickupSearch('');
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center w-8 text-center flex-shrink-0">
                              {loc.type === 'Airport' && <i className="fa-solid fa-plane text-[#ff8126] text-xs"></i>}
                              {loc.type === 'Station' && <i className="fa-solid fa-train text-blue-500 text-xs"></i>}
                              {loc.type === 'City' && <i className="fa-solid fa-city text-emerald-500 text-[10px]"></i>}
                              {loc.type === 'Region' && <i className="fa-solid fa-location-dot text-indigo-500 text-xs"></i>}
                              <span className="text-[6px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">{loc.type}</span>
                            </div>
                            <div className="flex-1 min-w-0 text-start">
                              <div className="text-xs font-extrabold text-slate-800 truncate">{loc.name}</div>
                              <div className="text-[9px] text-slate-400 font-bold truncate mt-0.5">{loc.subtitle}</div>
                            </div>
                          </div>
                        ))}
                      {locationsList.filter(loc =>
                        loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
                        loc.subtitle.toLowerCase().includes(pickupSearch.toLowerCase())
                      ).length === 0 && (
                          <div className="text-center py-4 text-xs font-bold text-slate-400">No supported locations found</div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              {/* TO location */}
              <div className="px-4 relative select-none-location border-b border-slate-100" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <div
                  className="flex items-center gap-1.5 mb-1 cursor-pointer"
                  onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); }}
                >
                  <i className="fa-solid fa-location-crosshairs text-[#094074] text-xs"></i>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                    {activeTab === 'airport' ? (airportTransferMode === 'drop' ? 'TO (AIRPORT)' : 'TO (DROP-OFF)') : 'TO (DROP-OFF)'}
                  </span>
                </div>
                <div
                  onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); }}
                  className="text-base font-extrabold text-slate-800 cursor-pointer truncate pr-4"
                >
                  {getSelectedLocationName(dropCity)}
                </div>

                {/* Dropdown Card */}
                {showDropDropdown && (
                  <div className="absolute top-[100%] left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden mt-1">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                      <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                      <input
                        type="text"
                        placeholder="Search drop-off..."
                        value={dropSearch}
                        onChange={(e) => setDropSearch(e.target.value)}
                        className="border-none p-0 text-xs font-bold text-slate-700 bg-transparent focus:ring-0 w-full outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-50">
                      {locationsList
                        .filter(loc =>
                          loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
                          loc.subtitle.toLowerCase().includes(dropSearch.toLowerCase())
                        )
                        .map(loc => (
                          <div
                            key={loc.id}
                            onClick={() => {
                              setDropCity(loc.value);
                              setShowDropDropdown(false);
                              setDropSearch('');
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center w-8 text-center flex-shrink-0">
                              {loc.type === 'Airport' && <i className="fa-solid fa-plane text-[#ff8126] text-xs"></i>}
                              {loc.type === 'Station' && <i className="fa-solid fa-train text-blue-500 text-xs"></i>}
                              {loc.type === 'City' && <i className="fa-solid fa-city text-emerald-500 text-[10px]"></i>}
                              {loc.type === 'Region' && <i className="fa-solid fa-location-dot text-indigo-500 text-xs"></i>}
                              <span className="text-[6px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">{loc.type}</span>
                            </div>
                            <div className="flex-1 min-w-0 text-start">
                              <div className="text-xs font-extrabold text-slate-800 truncate">{loc.name}</div>
                              <div className="text-[9px] text-slate-400 font-bold truncate mt-0.5">{loc.subtitle}</div>
                            </div>
                          </div>
                        ))}
                      {locationsList.filter(loc =>
                        loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
                        loc.subtitle.toLowerCase().includes(dropSearch.toLowerCase())
                      ).length === 0 && (
                          <div className="text-center py-4 text-xs font-bold text-slate-400">No supported locations found</div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              {/* PICKUP Date & Time */}
              <div className="px-4 border-b border-slate-100" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <i className="fa-regular fa-calendar-days text-[#094074] text-xs"></i>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">PICK-UP DATE & TIME</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={pickupDate}
                    min={getTodayDateString()}
                    onChange={(e) => {
                      handlePickupDateChange(e.target.value);
                      setTimeout(() => {
                        pickupTimeRef.current?.showPicker();
                      }, 100);
                    }}
                    className="border border-slate-200/60 bg-transparent rounded px-1.5 py-1 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer flex-1"
                    style={{ fontSize: '14px' }}
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    min={minPickupTime}
                    onChange={(e) => handlePickupTimeChange(e.target.value)}
                    className="border border-slate-200/60 bg-transparent rounded px-1.5 py-1 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer w-[90px]"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* RETURN Date & Time / Add Return link (not applicable to Airport Transfer) */}
              {activeTab !== 'airport' && (
                <div className="py-3.5 px-4">
                  {activeTab === 'roundtrip' ? (
                    <>
                      <div className="flex items-center gap-1.5 mb-1">
                        <i className="fa-regular fa-calendar-check text-[#094074] text-xs"></i>
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">RETURN DATE & TIME</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <input
                          type="date"
                          value={returnDate}
                          min={pickupDate || getTodayDateString()}
                          onChange={(e) => {
                            handleReturnDateChange(e.target.value);
                            setTimeout(() => {
                              returnTimeRef.current?.showPicker();
                            }, 100);
                          }}
                          className="border border-slate-200/60 bg-transparent rounded px-1.5 py-1 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer flex-1"
                          style={{ fontSize: '14px' }}
                        />
                        <input
                          type="time"
                          value={returnTime}
                          min={returnDate === pickupDate ? pickupTime : undefined}
                          onChange={(e) => handleReturnTimeChange(e.target.value)}
                          className="border border-slate-200/60 bg-transparent rounded px-1.5 py-1 text-sm font-extrabold text-slate-800 focus:ring-0 cursor-pointer w-[90px]"
                          style={{ fontSize: '14px' }}
                        />
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTabChange('roundtrip')}
                      className="font-bold flex items-center gap-1.5 border-none bg-transparent cursor-pointer p-0"
                      style={{ color: '#1d91f2', fontSize: '13px' }}
                    >
                      <i className="fa-solid fa-plus" style={{ fontSize: '10px' }}></i>
                      Add Return (Save more on round trips)
                    </button>
                  )}
                </div>
              )}

              {/* Search Button */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="bg-[#f25b22] hover:bg-orange-600 text-white font-black tracking-widest text-base w-full border-none cursor-pointer transition-all"
                style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', paddingTop: '12.8px', paddingBottom: '12.8px' }}
              >
                SEARCH CABS
              </button>
            </div>
          </div>
          {/* End Mobile Header Row + Search Widget */}

          {/* Bottom trusted tagline (Desktop only) */}
          <div className="hidden lg:flex justify-end mt-3">
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-1 text-[11px] font-bold text-white flex items-center gap-1.5">
              <i className="fa-solid fa-shield text-emerald-400"></i>
              Trusted by 30M+ travellers
            </span>
          </div>

        </div>
      </div>

      {/* 2. Ads Offers Banner Slider Section */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-0" style={{ marginTop: '0px' }}>
        <div className="relative overflow-hidden border border-slate-150 h-[88px] sm:h-[103px] rounded-[13px] sm:rounded-2xl">
          {/* Sliding track container */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
          >
            {bannerImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Majestic Kashmir Cabs Banner ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Exclusive Offers Section */}
      {offers.length > 0 && (
        <div className="max-w-[1140px] mx-auto px-4 sm:px-0 relative" style={{ marginTop: '30px' }}>
          <h2 className="text-2xl font-black text-slate-800 text-left sm:text-center mb-6">
            Exclusive Offers
          </h2>

          {/* Horizontal scroll promo cards list wrapper */}
          <div
            ref={offerContainerRef}
            onScroll={handleOfferScroll}
            className="flex gap-[14px] sm:gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {offers.map((o) => {
              const img = o.image ? resolveAssetUrl(o.image) : '/images/default-dest.jpg';
              return (
                <Link
                  key={o.id}
                  href={`/offers/${o.slug}`}
                  className="w-[76%] sm:w-[380px] flex-shrink-0 bg-white border border-slate-200/80 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] flex flex-col justify-between snap-start transition-all rounded-[20px] p-[10px] pb-[20px]"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="h-[135px] overflow-hidden relative rounded-[14px]">
                    <img src={img} alt={o.image_alt || o.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/45"></div>
                    <div className="absolute inset-0 flex flex-col justify-start p-5 text-white text-start">
                      <span className="font-semibold mb-0.5 block" style={{ fontSize: '11px', color: '#e2e8f0' }}>{o.tag}</span>
                      <h3 className="font-black uppercase tracking-wide leading-tight" style={{ fontSize: '15px' }}>{o.title}</h3>
                    </div>
                  </div>
                  <div className="pt-3 pb-1 px-1 flex flex-col justify-between flex-grow text-start">
                    <p className="text-sm font-normal text-slate-600 leading-relaxed mb-2 line-clamp-2">
                      {o.subtitle}
                    </p>
                    <div className="flex justify-end pt-0">
                      <span className="text-[#ff8126] font-black text-[12px] flex items-center gap-1.5 uppercase">
                        VIEW OFFER <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {offers.map((o, index) => (
              <button
                key={o.id}
                onClick={() => scrollToOffer(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none border-none ${index === activeOfferIndex ? 'bg-[#ff8126] w-6' : 'bg-slate-300 w-2.5 hover:bg-slate-400'
                  }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3.6. Flexible Hourly Car Rentals Section */}
      {hourlyRentalCities.length > 0 && (
      <div className="max-w-[1140px] mx-auto px-4 sm:px-0 relative" style={{ marginTop: '40px' }}>
        <h2 className="text-[22px] sm:text-2xl font-black text-slate-800 text-start mb-2">
          Flexible Hourly Car Rentals in Jammu &amp; Kashmir
        </h2>
        <p className="text-sm font-normal text-slate-500 text-start leading-relaxed max-w-[900px] mb-6">
          Rent a car by the hour for convenient and affordable travel within Kashmir&apos;s most popular destinations. Enjoy the freedom to explore at your own pace.
        </p>

        <div className="relative w-full overflow-visible">
          {/* Left Scroll Button (Desktop only) */}
          <button
            onClick={() => scrollHourlyRentals('left')}
            className="hidden sm:flex absolute left-[-15px] top-1/2 translate-y-[-50%] z-20 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center cursor-pointer hover:bg-slate-50 transition-all focus:outline-none"
            title="Scroll Left"
          >
            <i className="fa-solid fa-chevron-left text-slate-600 text-xs"></i>
          </button>

          {/* Right Scroll Button (Desktop only) */}
          <button
            onClick={() => scrollHourlyRentals('right')}
            className="hidden sm:flex absolute right-[-15px] top-1/2 translate-y-[-50%] z-20 w-9 h-9 rounded-full items-center justify-center cursor-pointer transition-all focus:outline-none"
            style={{ background: '#1d91f2', border: 'none', boxShadow: '0 4px 10px rgba(29,145,242,0.35)' }}
            title="Scroll Right"
          >
            <i className="fa-solid fa-arrow-right text-white text-xs"></i>
          </button>

          {/* Horizontal scroll rental cards */}
          <div
            ref={hourlyRentalsRef}
            className="flex gap-[14px] sm:gap-5 overflow-x-auto pt-1 pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {hourlyRentalCities.map((city) => (
              <div
                key={city.id}
                className="flex-shrink-0 snap-start w-[240px] sm:w-[260px]"
              >
                <div
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{
                    height: '230px',
                    borderRadius: '20px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                    background: 'linear-gradient(135deg, #0c3a6b, #094074)',
                  }}
                >
                  <img
                    src={city.image ? resolveAssetUrl(city.image) : '/images/default-dest.jpg'}
                    alt={city.image_alt || `${city.name} cab rental`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="relative bg-white"
                  style={{
                    marginTop: '-44px',
                    marginLeft: '12px',
                    marginRight: '12px',
                    borderRadius: '14px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    padding: '10px 12px',
                    zIndex: 10,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      {city.drop_name ? (
                        <div className="flex items-center gap-1.5" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                          <span className="font-black text-slate-900 truncate">{city.name}</span>
                          <i className="fa-solid fa-arrow-right text-slate-300" style={{ fontSize: '9px' }}></i>
                          <span className="font-black text-slate-900 truncate">{city.drop_name}</span>
                        </div>
                      ) : (
                        <h3 className="font-black text-slate-900" style={{ fontSize: '14px', lineHeight: '1.2' }}>{city.name}</h3>
                      )}
                      <p className="text-slate-400" style={{ fontSize: '11px', lineHeight: '1.2', marginTop: '2px' }}>{city.state}</p>
                    </div>
                    <div className="flex flex-col items-center text-slate-300 flex-shrink-0">
                      <i className="fa-regular fa-clock" style={{ fontSize: '13px' }}></i>
                      <i className="fa-solid fa-taxi" style={{ fontSize: '13px' }}></i>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '3px 0' }}></div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400" style={{ fontSize: '10px' }}>From </span>
                      <span className="font-black text-slate-900" style={{ fontSize: '14px' }}>₹{city.hourly_price?.toLocaleString('en-IN')}</span>
                      <span className="text-slate-400 font-semibold" style={{ fontSize: '11px' }}>/hour</span>
                    </div>
                    <button
                      onClick={() => handleCityClick(city.value, city.drop_value)}
                      className="font-bold flex items-center cursor-pointer"
                      style={{ color: '#ff8126', fontSize: '12px', background: 'none', border: 'none', gap: '3px' }}
                    >
                      Book <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* 3.5. Popular Cab Services Section */}
      {popularCities.length > 0 && (
      <div className="max-w-[1140px] mx-auto px-4 sm:px-0 relative" style={{ marginTop: '40px' }}>
        <h2 className="text-[22px] sm:text-2xl font-black text-slate-800 text-start mb-2">
          Popular Cab Services
        </h2>
        <p className="text-sm font-normal text-slate-500 text-start leading-relaxed max-w-[900px] mb-6">
          Book reliable cab services across Jammu &amp; Kashmir, including airport transfers, hourly rentals, and outstation taxis. Enjoy comfortable, affordable, and hassle-free rides wherever you travel.
        </p>

        {/* Filter Tabs (Desktop only) */}
        <div className="hidden sm:flex flex-wrap gap-2.5 justify-start" style={{ marginBottom: '10px' }}>
          <button
            onClick={() => setPopularServiceTab('airport')}
            className={`py-2.5 text-xs transition-all border-none cursor-pointer ${popularServiceTab === 'airport' ? 'bg-[#ff8126] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'}`}
            style={{ borderRadius: '10px', paddingLeft: '15px', paddingRight: '15px', fontWeight: 'normal' }}
          >
            Airport Taxi
          </button>

          <button
            onClick={() => setPopularServiceTab('outstation')}
            className={`py-2.5 text-xs transition-all border-none cursor-pointer ${popularServiceTab === 'outstation' ? 'bg-[#ff8126] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'}`}
            style={{ borderRadius: '10px', paddingLeft: '15px', paddingRight: '15px', fontWeight: 'normal' }}
          >
            Outstation Taxi
          </button>
          <button
            onClick={() => setPopularServiceTab('service')}
            className={`py-2.5 text-xs transition-all border-none cursor-pointer ${popularServiceTab === 'service' ? 'bg-[#ff8126] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'}`}
            style={{ borderRadius: '10px', paddingLeft: '15px', paddingRight: '15px', fontWeight: 'normal' }}
          >
            Service Taxi
          </button>
        </div>

        {/* Cities Carousel Slider Container */}
        <div className="relative w-full overflow-visible">
          {/* Left Scroll Button (Desktop only) */}
          <button
            onClick={() => scrollPopularCities('left')}
            className="hidden sm:flex absolute left-[-15px] top-[40%] translate-y-[-50%] z-20 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center cursor-pointer hover:bg-slate-50 transition-all focus:outline-none"
            title="Scroll Left"
          >
            <i className="fa-solid fa-chevron-left text-slate-600 text-xs"></i>
          </button>

          {/* Right Scroll Button (Desktop only) */}
          <button
            onClick={() => scrollPopularCities('right')}
            className="hidden sm:flex absolute right-[-15px] top-[40%] translate-y-[-50%] z-20 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center cursor-pointer hover:bg-slate-50 transition-all focus:outline-none"
            title="Scroll Right"
          >
            <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
          </button>

          {/* Horizontal scroll city list */}
          <div
            ref={popularCitiesRef}
            className="flex gap-[14px] sm:gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {popularCities.map((city) => (
              <div
                key={city.id}
                onClick={() => handleCityClick(city.value)}
                className="flex flex-col items-center flex-shrink-0 snap-start cursor-pointer w-[55%] sm:w-[155px]"
              >
                <div className="w-full sm:w-[145px] aspect-square sm:h-[145px] overflow-hidden rounded-[26px] border border-slate-100/50 shadow-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                  <img
                    src={city.image ? resolveAssetUrl(city.image) : '/images/default-dest.jpg'}
                    alt={city.image_alt || city.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-3 text-sm font-black text-slate-800 tracking-wider text-center">{city.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* 3.6. Benefits To Book Cab With Us Section */}
      <div style={{ background: 'linear-gradient(to bottom, #fff3eb, #ffffff)', marginTop: '40px', paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-0 relative">
        <h2 className="text-[22px] sm:text-2xl font-black text-slate-800 text-start mb-6">
          Benefits To Book Cab With Us
        </h2>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white rounded-[20px] text-start border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-start" style={{ padding: '15px' }}>
            <div className="mb-4 text-slate-800">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path>
                <circle cx="12" cy="10" r="3" stroke="#1d91f2" fill="white" strokeWidth="2"></circle>
              </svg>
            </div>
            <h3 className="font-black text-slate-800 mb-2 leading-snug" style={{ fontSize: '16px' }}>
              Local & Outstation Rides
            </h3>
            <p className="text-[12px] font-normal text-slate-500 leading-relaxed">
              From short local hops to long outstation trips across Jammu &amp; Kashmir and beyond.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-[20px] text-start border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-start" style={{ padding: '15px' }}>
            <div className="mb-4 text-slate-800">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <circle cx="17" cy="17" r="4" stroke="#1d91f2" fill="white" strokeWidth="2"></circle>
                <polyline points="17 15 17 17 18.5 17.5" stroke="#1d91f2"></polyline>
              </svg>
            </div>
            <h3 className="font-black text-slate-800 mb-2 leading-snug" style={{ fontSize: '16px' }}>
              Trusted Local Drivers
            </h3>
            <p className="text-[12px] font-normal text-slate-500 leading-relaxed">
              Experienced, verified drivers who know Kashmir&apos;s roads and routes well.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-[20px] text-start border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-start" style={{ padding: '15px' }}>
            <div className="mb-4 text-slate-800">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 11l2 2 4-4" stroke="#1d91f2" strokeWidth="2.5"></path>
              </svg>
            </div>
            <h3 className="font-black text-slate-800 mb-2 leading-snug" style={{ fontSize: '16px' }}>
              100% Full Refund Policy
            </h3>
            <p className="text-[12px] font-normal text-slate-500 leading-relaxed">
              We offer free cancellation on cab bookings in select cases for your convenience.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white rounded-[20px] text-start border border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-start" style={{ padding: '15px' }}>
            <div className="mb-4 text-slate-800">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                <circle cx="12" cy="13" r="1.5" fill="#1d91f2" stroke="#1d91f2"></circle>
              </svg>
            </div>
            <h3 className="font-black text-slate-800 mb-2 leading-snug" style={{ fontSize: '16px' }}>
              24/7 Support
            </h3>
            <p className="text-[12px] font-normal text-slate-500 leading-relaxed">
              Our dedicated support team is available around the clock to assist you.
            </p>
          </div>
        </div>
        </div>
      </div>
      {/* 3.7. Hassle-Free Cab Booking Section */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-0" style={{ marginTop: '50px', marginBottom: '50px' }}>
        <h2 className="font-black text-slate-900 mb-4" style={{ fontSize: '22px' }}>
          Hassle-Free Cab Booking with Twin Brothers Holidays
        </h2>

        <p className="text-slate-600 leading-relaxed mb-5" style={{ fontSize: '14px' }}>
          Are you tired of the never-ending struggle to book a cab online, especially during unfavorable weather conditions or in emergency situations? Look no further! Twin Brothers Holidays is here to provide you with a seamless and convenient solution for all your cab booking needs. As a customer-centric company, we strive to deliver the best services to our travellers, ensuring a stress-free journey every time.
        </p>

        <h3 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>
          Unmatched Variety of Cabs and Discounts
        </h3>

        <p className="text-slate-600 leading-relaxed mb-4" style={{ fontSize: '14px' }}>
          At Twin Brothers Holidays, we believe in providing our customers with a wide selection of cab options to cater to their diverse needs. Our extensive network consists of{' '}
          <span style={{ color: '#1d91f2', fontWeight: '600' }}>4000+ cab operators</span>
          {' '}through different vendors, ensuring you always have a reliable and comfortable mode of transportation available. Choose from a range of categories, including Hatchbacks, Sedans, SUVs, and more, depending on your preferences and group size.
        </p>

        <p className="text-slate-600 leading-relaxed mb-5" style={{ fontSize: '14px' }}>
          Moreover, we understand the value of saving money while traveling. That&apos;s why Twin Brothers Holidays offers discounted rates on taxi services. By booking through our platform, you can enjoy cost-effective cab rides without compromising on quality and reliability.
        </p>

        <div
          style={{
            maxHeight: isCabInfoExpanded ? '3000px' : '0px',
            opacity: isCabInfoExpanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.6s ease, opacity 0.4s ease',
          }}
        >
          <h3 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>
            Hassle-Free Cab Booking with Twin Brothers Holidays
          </h3>

          <p className="text-slate-600 leading-relaxed mb-5" style={{ fontSize: '14px' }}>
            At Twin Brothers Holidays, we have designed an intuitive and user-friendly interface to enhance your online cab booking experience. Our platform offers a straightforward and effortless process, allowing you to book a cab in just a few clicks. Here&apos;s how it works:
          </p>

          <ul className="text-slate-600 leading-relaxed mb-5" style={{ fontSize: '14px', paddingLeft: '20px', listStyleType: 'disc' }}>
            <li className="mb-2">
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Login/Open Twin Brothers Holidays Portal:</span> Begin by accessing our user-friendly website or mobile app. Log in to your account or create a new one if you haven&apos;t already.
            </li>
            <li className="mb-2">
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Head to the Cabs Section:</span> Once you&apos;re logged in, navigate to the dedicated &quot;Cabs&quot; section, where you&apos;ll find a wide range of options tailored to suit your specific requirements.
            </li>
            <li className="mb-2">
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Choose Your Purpose:</span> Select the purpose for which you need the cab. Whether it&apos;s for local hourly travel, outstation trips or airport transfers, we have you covered.
            </li>
            <li className="mb-2">
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Enter the Details:</span> Fill in the necessary details, such as the pickup location, drop-off location, date, time, and any additional preferences you may have. Our advanced search filters help you find the perfect cab that matches your criteria.
            </li>
            <li className="mb-2">
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Book with Ease:</span> With a few clicks, confirm your booking, and your cab will be reserved instantly. No more waiting endlessly or uncertain about the availability of your ride. We prioritize efficiency and promptness.
            </li>
          </ul>

          <h3 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>
            Your Journey, Our Priority
          </h3>

          <p className="text-slate-600 leading-relaxed mb-5" style={{ fontSize: '14px' }}>
            When you book a cab with Twin Brothers Holidays, we prioritize your safety, comfort, and satisfaction. Our dedicated team ensures that every aspect of your journey is well taken care of, from the moment you make the booking until you reach your destination. With our experienced drivers and well-maintained vehicles, you can relax and enjoy a hassle-free ride.
          </p>

          <h3 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>
            Book Your Cab with Twin Brothers Holidays Today!
          </h3>

          <p className="text-slate-600 leading-relaxed mb-4" style={{ fontSize: '14px' }}>
            Don&apos;t let the complexities of cab booking deter you from enjoying a smooth and convenient travel experience. Twin Brothers Holidays simplifies the process, making it accessible to everyone. With our user-friendly interface, diverse range of cabs, discounted rates, and unwavering commitment to customer satisfaction, we are your go-to platform for online cab booking.
          </p>

          <p className="text-slate-600 leading-relaxed mb-5" style={{ fontSize: '14px' }}>
            So, why wait? Take advantage of Twin Brothers Holidays&apos;s exceptional cab booking services and travel comfortably, knowing that your journey is in good hands. Book your cab today and embark on a hassle-free travel experience.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCabInfoExpanded((prev) => !prev)}
          className="font-semibold"
          style={{
            color: '#ff8126',
            fontSize: '14px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isCabInfoExpanded ? 'Read Less' : 'Read More'}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isCabInfoExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* 3.8. FAQ Section */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-0" style={{ marginTop: '10px', marginBottom: '60px' }}>
        <h2 className="font-black text-slate-900 mb-6" style={{ fontSize: '22px' }}>
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col" style={{ gap: '12px' }}>
          {faqList.map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div
                key={faq.question}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
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
                  <span
                    className="font-bold text-slate-900"
                    style={{ fontSize: '14px' }}
                  >
                    {faq.question}
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff8126"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? '400px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease, opacity 0.3s ease',
                  }}
                >
                  <p
                    className="text-slate-600 leading-relaxed"
                    style={{ fontSize: '13px', padding: '0 18px 16px' }}
                  >
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
