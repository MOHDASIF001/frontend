'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_BASE_URL, resolveAssetUrl } from '../config';

interface Cab {
  id: number;
  name: string;
  vehicle_type: string;
  featured_image: string;
  price?: number;
  price_per_day?: number;
  capacity?: number;
  ac_non_ac?: string;
  bags?: number;
  fuel_type?: string;
  status: number;
}

interface CabLocation {
  value: string;
  name: string;
  subtitle: string;
}

function getFuelType(cab: Cab) {
  return cab.fuel_type || 'Petrol';
}

function getCabImage(cab: Cab) {
  return cab.featured_image ? resolveAssetUrl(cab.featured_image) : '/images/cab.jpg';
}

function getLuggageBags(cab: Cab) {
  return cab.bags || Math.max(1, Math.round((cab.capacity || 4) / 2) + 1);
}

function CabCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 flex flex-col md:flex-row gap-4 animate-pulse shadow-sm">
      <div className="w-full md:w-[220px] h-[140px] bg-slate-200 rounded-xl flex-shrink-0"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="w-full md:w-40 space-y-2">
        <div className="h-6 bg-slate-200 rounded w-full"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
  );
}

interface BookingContext {
  pickupName: string;
  dropName: string;
  pickupDate: string;
  pickupTime: string;
}

function buildCheckoutUrl(cab: Cab, ctx: BookingContext, finalPrice: number) {
  const params = new URLSearchParams({
    cabId: String(cab.id),
    name: cab.name || cab.vehicle_type,
    vehicleType: cab.vehicle_type,
    price: String(finalPrice),
    pickup: ctx.pickupName,
    drop: ctx.dropName,
    pickupDate: ctx.pickupDate,
    pickupTime: ctx.pickupTime,
  });
  return `/cabs/checkout?${params.toString()}`;
}

function CabListingCard({ cab, ctx }: { cab: Cab; ctx: BookingContext }) {
  const router = useRouter();
  const finalPrice = Math.round(Number(cab.price || cab.price_per_day || 2000));
  const luggageBags = getLuggageBags(cab);
  const fuelType = getFuelType(cab);
  const image = getCabImage(cab);

  return (
    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm hover:shadow-md hover:border-[#ff8126] transition duration-300 overflow-hidden mb-4">
      <div className="flex flex-col md:flex-row gap-4" style={{ padding: '15px' }}>
        {/* Image */}
        <div className="w-full md:w-[220px] h-[150px] flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
          <img src={image} alt={cab.name} className="w-full h-full object-contain p-2" />
        </div>

        {/* Middle Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-900 mb-2" style={{ fontSize: '18px' }}>
            {cab.name || cab.vehicle_type}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="py-1 rounded-md text-white font-bold uppercase"
              style={{ fontSize: '10px', paddingLeft: '8px', paddingRight: '8px', background: 'linear-gradient(135deg, #094074, #05213d)' }}
            >
              {cab.vehicle_type}
            </span>
            <span className="text-slate-500 font-semibold text-xs flex items-center gap-1">
              <i className="fa-solid fa-user"></i> {cab.capacity || 4} Seat
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold text-xs flex items-center gap-1">
              <i className="fa-solid fa-suitcase"></i> {luggageBags} Luggage Bag
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold text-xs">
              {cab.ac_non_ac || 'AC'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-gauge-high mt-0.5" style={{ color: '#094074', fontSize: '13px' }}></i>
              <div>
                <div className="font-bold text-slate-800 text-xs">Kilometer Charges</div>
                <div className="text-slate-500 text-xs">
                  1225 km Included, after that <span className="font-bold text-slate-700">&#8377;10/km</span> charge applicable
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-gas-pump mt-0.5" style={{ color: '#094074', fontSize: '13px' }}></i>
              <div>
                <div className="font-bold text-slate-800 text-xs">Fuel Type</div>
                <div className="text-slate-500 text-xs">{fuelType}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-shield-heart mt-0.5" style={{ color: '#1fae5c', fontSize: '13px' }}></i>
              <div>
                <div className="font-bold text-slate-800 text-xs">Cancellation Policy</div>
                <div className="text-[#1fae5c] font-normal text-xs">Free before 24 hours from the journey time.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-hand-holding-dollar mt-0.5" style={{ color: '#094074', fontSize: '13px' }}></i>
              <div>
                <div className="font-bold text-slate-800 text-xs">Part Payment</div>
                <div className="text-slate-500 text-xs">Pay <span className="font-bold text-slate-700">15%</span> now and rest to driver</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Price / CTA */}
        <div className="w-full md:w-44 flex flex-col items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 flex-shrink-0">
          <div className="text-end w-full">
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-2xl font-black text-slate-900">&#8377;{finalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(buildCheckoutUrl(cab, ctx, finalPrice))}
            className="mt-3 w-full text-white font-black text-xs uppercase tracking-wider transition-all border-none cursor-pointer"
            style={{ background: '#ff8126', paddingTop: '10px', paddingBottom: '10px', borderRadius: '10px' }}
          >
            Book Now
          </button>
        </div>
      </div>

      <div className="px-4 py-2 flex items-center gap-5" style={{ background: '#eef6ff' }}>
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-headset text-xs" style={{ color: '#1d91f2' }}></i>
          <span className="text-[11px] font-bold" style={{ color: '#094074' }}>24/7 customer helpline</span>
        </span>
        <span className="flex items-center gap-2">
          <i className="fa-solid fa-receipt text-xs" style={{ color: '#1d91f2' }}></i>
          <span className="text-[11px] font-bold" style={{ color: '#094074' }}>Toll &amp; State Tax Excluded</span>
        </span>
      </div>
    </div>
  );
}

function CabListingCardMobile({ cab, ctx }: { cab: Cab; ctx: BookingContext }) {
  const router = useRouter();
  const finalPrice = Math.round(Number(cab.price || cab.price_per_day || 2000));
  const luggageBags = getLuggageBags(cab);
  const fuelType = getFuelType(cab);
  const image = getCabImage(cab);

  return (
    <div className="bg-white rounded-2xl border border-slate-150 shadow-sm hover:border-[#ff8126] transition duration-300 overflow-hidden mb-4" style={{ padding: '15px' }}>
      {/* Top: image + title/tags */}
      <div className="flex gap-3">
        <div className="relative w-[84px] h-[70px] flex-shrink-0 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
          <img src={image} alt={cab.name} className="w-full h-full object-contain p-1" />
          <span
            className="absolute bottom-0 left-0 right-0 text-white text-center font-bold uppercase"
            style={{
              fontSize: '8px',
              background: 'linear-gradient(135deg, #094074, #05213d)',
              paddingTop: '2px',
              paddingBottom: '2px',
            }}
          >
            {cab.vehicle_type}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-900 mb-1 truncate" style={{ fontSize: '15px' }}>
            {cab.name || cab.vehicle_type}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500 font-semibold" style={{ fontSize: '11px' }}>
            <span>{cab.capacity || 4} Seat</span>
            <span className="text-slate-300">|</span>
            <span>{luggageBags} Luggage Bag</span>
            <span className="text-slate-300">|</span>
            <span>{cab.ac_non_ac || 'AC'}</span>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-start gap-2">
          <i className="fa-solid fa-gauge-high mt-0.5 flex-shrink-0" style={{ color: '#094074', fontSize: '12px' }}></i>
          <div style={{ fontSize: '12px' }}>
            <span className="font-bold text-slate-800">Km Charges: </span>
            <span className="text-slate-500">1225 km Included, after that &#8377;10/km</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <i className="fa-solid fa-gas-pump mt-0.5 flex-shrink-0" style={{ color: '#094074', fontSize: '12px' }}></i>
          <div style={{ fontSize: '12px' }}>
            <span className="font-bold text-slate-800">Fuel Type: </span>
            <span className="text-slate-500">{fuelType}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <i className="fa-solid fa-shield-heart mt-0.5 flex-shrink-0" style={{ color: '#1fae5c', fontSize: '12px' }}></i>
          <div style={{ fontSize: '12px' }}>
            <span className="font-bold text-slate-800">Cancellation: </span>
            <span className="text-[#1fae5c] font-semibold">Free</span>
            <span className="text-slate-500"> before 24 hours from the journey time.</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <i className="fa-solid fa-hand-holding-dollar mt-0.5 flex-shrink-0" style={{ color: '#094074', fontSize: '12px' }}></i>
          <div style={{ fontSize: '12px' }}>
            <span className="font-bold text-slate-800">Part Payment: </span>
            <span className="text-slate-500">Pay 15% now and rest to driver</span>
          </div>
        </div>
      </div>

      {/* Price + Book Now */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-slate-900">&#8377;{finalPrice.toLocaleString('en-IN')}</span>
        </div>
        <button
          type="button"
          onClick={() => router.push(buildCheckoutUrl(cab, ctx, finalPrice))}
          className="text-white font-black uppercase tracking-wider transition-all border-none cursor-pointer"
          style={{
            background: '#ff8126',
            fontSize: '12px',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingTop: '9px',
            paddingBottom: '9px',
            borderRadius: '10px',
          }}
        >
          Book Now
        </button>
      </div>

      {/* Bottom helpline strip */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <i className="fa-solid fa-headset" style={{ color: '#1d91f2', fontSize: '10px' }}></i>
          <span className="font-bold" style={{ color: '#094074', fontSize: '10px' }}>24/7 customer helpline</span>
        </span>
        <span className="flex items-center gap-1.5">
          <i className="fa-solid fa-receipt" style={{ color: '#1d91f2', fontSize: '10px' }}></i>
          <span className="font-bold" style={{ color: '#094074', fontSize: '10px' }}>Toll &amp; State Tax Excluded</span>
        </span>
      </div>
    </div>
  );
}

export function CabListContent({ initialPickup }: { initialPickup?: string } = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pickupParam = searchParams.get('pickup') || initialPickup || 'srinagar';
  const dropParam = searchParams.get('drop') || 'gulmarg';
  const pickupDateParam = searchParams.get('pickupDate') || new Date().toISOString().split('T')[0];
  const pickupTimeParam = searchParams.get('pickupTime') || '10:00';
  const returnDateParam = searchParams.get('returnDate') || '';
  const returnTimeParam = searchParams.get('returnTime') || '';
  const tripParam = searchParams.get('trip') === 'roundtrip' ? 'oneway' : (searchParams.get('trip') || 'oneway');
  const airportModeParam = searchParams.get('airportMode') === 'drop' ? 'drop' : 'pickup';

  const [locationsList, setLocationsList] = useState<CabLocation[]>([]);
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [pickupCity, setPickupCity] = useState(pickupParam);
  const [dropCity, setDropCity] = useState(dropParam);
  const [pickupDate, setPickupDate] = useState(pickupDateParam);
  const [pickupTime, setPickupTime] = useState(pickupTimeParam);
  const [returnDate, setReturnDate] = useState(returnDateParam);
  const [tripType, setTripType] = useState(tripParam);
  const [airportTransferMode, setAirportTransferMode] = useState<'pickup' | 'drop'>(airportModeParam);
  const [showAirportModeDropdown, setShowAirportModeDropdown] = useState(false);

  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropSearch, setDropSearch] = useState('');

  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);

  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high'>('default');

  useEffect(() => {
    setPickupCity(pickupParam);
    setDropCity(dropParam);
    setPickupDate(pickupDateParam);
    setPickupTime(pickupTimeParam);
    setReturnDate(returnDateParam);
    setTripType(tripParam);
    setAirportTransferMode(airportModeParam);
  }, [pickupParam, dropParam, pickupDateParam, pickupTimeParam, returnDateParam, tripParam, airportModeParam]);

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

  const handleSwapLocations = () => {
    const temp = pickupCity;
    setPickupCity(dropCity);
    setDropCity(temp);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.select-none-location')) {
        setShowPickupDropdown(false);
        setShowDropDropdown(false);
        setShowAirportModeDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cab_locations.php`);
        const data = await res.json();
        if (data.status === 'success') {
          setLocationsList(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    const fetchCabs = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(`${API_BASE_URL}/cabs.php`);
        const data = await res.json();
        if (data.status === 'success') {
          setCabs(data.data || []);
        } else {
          throw new Error(data.message || 'API error');
        }
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
    fetchCabs();
  }, []);

  const getLocationName = (value: string) => {
    const loc = locationsList.find((l) => l.value === value);
    return loc ? loc.name : value.replace(/-/g, ' ').toUpperCase();
  };

  const getSelectedLocationSubtitle = (value: string) => {
    const loc = locationsList.find((l) => l.value === value);
    return loc ? loc.subtitle : 'Choose location';
  };

  const vehicleTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cabs.forEach((c) => {
      const type = c.vehicle_type || 'Other';
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [cabs]);

  const fuelTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cabs.forEach((c) => {
      const fuel = getFuelType(c);
      counts[fuel] = (counts[fuel] || 0) + 1;
    });
    return counts;
  }, [cabs]);

  const filteredCabs = useMemo(() => {
    const list = cabs.filter((c) => {
      if (selectedVehicleTypes.length > 0 && !selectedVehicleTypes.includes(c.vehicle_type)) {
        return false;
      }
      if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(getFuelType(c))) {
        return false;
      }
      return true;
    });
    const getPrice = (c: Cab) => Number(c.price || c.price_per_day || 2000);
    if (sortBy === 'price_low') {
      return [...list].sort((a, b) => getPrice(a) - getPrice(b));
    }
    if (sortBy === 'price_high') {
      return [...list].sort((a, b) => getPrice(b) - getPrice(a));
    }
    return list;
  }, [cabs, selectedVehicleTypes, selectedFuelTypes, sortBy]);

  const tripLabel = tripType === 'airport' ? 'Airport Transfer' : (returnDate ? 'Outstation Round Trip' : 'Outstation One-Way');

  const bookingContext: BookingContext = {
    pickupName: getLocationName(pickupCity),
    dropName: getLocationName(dropCity),
    pickupDate,
    pickupTime,
  };

  const formatScheduled = (dateStr: string, timeStr: string) => {
    if (!dateStr) return '';
    const d = new Date(`${dateStr}T${timeStr || '00:00'}`);
    if (isNaN(d.getTime())) return '';
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hh = String(hours).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${hh}:${mm}:00 ${ampm}`;
  };

  const toggleVehicleType = (type: string) => {
    setSelectedVehicleTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleFuelType = (type: string) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setSelectedVehicleTypes([]);
    setSelectedFuelTypes([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      pickup: pickupCity,
      drop: dropCity,
      pickupDate,
      pickupTime,
      trip: tripType,
    });
    if (tripType === 'oneway' && returnDate) {
      params.set('returnDate', returnDate);
    }
    if (tripType === 'airport') {
      params.set('airportMode', airportTransferMode);
    }
    setMobileSearchExpanded(false);
    router.push(`/cabs/list?${params.toString()}`);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 pb-16">
      {/* Top Search Bar */}
      <div className="bg-gradient-to-r from-[#094074] to-[#05213d] px-4 sm:px-6 lg:px-8" style={{ paddingTop: '60px', paddingBottom: '12px' }}>
        <div className="max-w-[1140px] mx-auto">

          {/* Mobile compact summary header (collapsed state) */}
          {!mobileSearchExpanded && (
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => router.push('/cabs')}
                  className="text-white border-none bg-transparent cursor-pointer"
                  style={{ fontSize: '16px' }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="text-center flex-1 px-2 min-w-0">
                  <div className="text-white font-black truncate" style={{ fontSize: '14px' }}>{tripLabel}</div>
                  <div className="text-white/60 font-bold uppercase truncate" style={{ fontSize: '9px' }}>
                    SCHEDULED {formatScheduled(pickupDate, pickupTime)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSearchExpanded(true)}
                  className="text-white border-none bg-transparent cursor-pointer"
                  style={{ fontSize: '15px' }}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden mb-1">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase" style={{ fontSize: '10px' }}>From</span>
                  <span className="font-extrabold text-slate-800 text-sm truncate">{getLocationName(pickupCity)}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase" style={{ fontSize: '10px' }}>To</span>
                  <span className="font-extrabold text-slate-800 text-sm truncate">{getLocationName(dropCity)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Full search form: always visible on desktop; on mobile only when expanded */}
          <div className={mobileSearchExpanded ? 'block' : 'hidden lg:block'}>

          {mobileSearchExpanded && (
            <div className="lg:hidden flex justify-end mb-1">
              <button
                type="button"
                onClick={() => setMobileSearchExpanded(false)}
                className="text-white border-none bg-transparent cursor-pointer"
                style={{ fontSize: '18px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* Trip type radio selector */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3">
            {[
              { value: 'airport', label: 'AIRPORT TRANSFER' },
              { value: 'oneway', label: 'OUTSTATION/OTHER' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTripType(opt.value)}
                className="flex items-center gap-2 border-none bg-transparent cursor-pointer p-0"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: '#ffffff' }}
                >
                  {tripType === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
                <span className="text-white font-bold" style={{ fontSize: '10px' }}>{opt.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-xl overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-150">

              {/* AIRPORT TRANSFER selector (Airport tab only, mirrors main cabs page) */}
              {tripType === 'airport' && (
                <div className="lg:col-span-2 px-4 py-2.5 relative">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-0.5">
                    Airport Transfer
                  </label>
                  <div
                    onClick={() => setShowAirportModeDropdown(!showAirportModeDropdown)}
                    className="font-bold text-slate-800 cursor-pointer flex items-center gap-2"
                    style={{ fontSize: '15px' }}
                  >
                    Airport
                    <i className="fa-solid fa-chevron-down text-slate-400 text-[10px]"></i>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                    {airportTransferMode === 'pickup' ? 'Pick Up' : 'Drop'}
                  </span>

                  {showAirportModeDropdown && (
                    <div className="absolute top-[100%] left-4 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[220px] mt-1">
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

              {/* FROM (Pick-up) location — same dropdown-search feature as the main cabs page */}
              <div className="lg:col-span-3 px-4 py-2.5 relative select-none-location">
                <div
                  className="flex items-center gap-1.5 mb-0.5 cursor-pointer"
                  onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); setShowAirportModeDropdown(false); }}
                >
                  <i className="fa-solid fa-location-dot text-[#094074] text-xs"></i>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                    {tripType === 'airport' ? (airportTransferMode === 'pickup' ? 'FROM (AIRPORT)' : 'FROM (PICK-UP)') : 'FROM (PICK-UP)'}
                  </span>
                </div>

                <div
                  onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); setShowAirportModeDropdown(false); }}
                  className="text-sm font-extrabold text-slate-800 cursor-pointer truncate pr-4 py-0.5"
                >
                  {getLocationName(pickupCity)}
                </div>
                <span
                  className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate cursor-pointer block"
                  onClick={() => { setShowPickupDropdown(!showPickupDropdown); setShowDropDropdown(false); setShowAirportModeDropdown(false); }}
                >
                  {getSelectedLocationSubtitle(pickupCity)}
                </span>

                {/* Swap Button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleSwapLocations(); }}
                  className="absolute right-[-14px] top-[65%] translate-y-[-50%] z-10 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer hidden sm:flex"
                  title="Swap locations"
                >
                  <i className="fa-solid fa-right-left text-[#094074] text-[10px]"></i>
                </button>

                {showPickupDropdown && (
                  <div className="absolute top-[100%] left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-[360px] mt-1">
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
                        .filter((loc: any) =>
                          loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
                          loc.subtitle.toLowerCase().includes(pickupSearch.toLowerCase())
                        )
                        .map((loc: any) => (
                          <div
                            key={loc.id || loc.value}
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
                      {locationsList.filter((loc: any) =>
                        loc.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
                        loc.subtitle.toLowerCase().includes(pickupSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="text-center py-4 text-xs font-bold text-slate-400">No supported locations found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* TO (Drop-off) location — same dropdown-search feature as the main cabs page */}
              <div className="lg:col-span-3 px-4 py-2.5 relative select-none-location">
                <div
                  className="flex items-center gap-1.5 mb-0.5 cursor-pointer"
                  onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); setShowAirportModeDropdown(false); }}
                >
                  <i className="fa-solid fa-location-crosshairs text-[#094074] text-xs"></i>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                    {tripType === 'airport' ? (airportTransferMode === 'drop' ? 'TO (AIRPORT)' : 'TO (DROP-OFF)') : 'TO (DROP-OFF)'}
                  </span>
                </div>

                <div
                  onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); setShowAirportModeDropdown(false); }}
                  className="text-sm font-extrabold text-slate-800 cursor-pointer truncate pr-4 py-0.5"
                >
                  {getLocationName(dropCity)}
                </div>
                <span
                  className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate cursor-pointer block"
                  onClick={() => { setShowDropDropdown(!showDropDropdown); setShowPickupDropdown(false); setShowAirportModeDropdown(false); }}
                >
                  {getSelectedLocationSubtitle(dropCity)}
                </span>

                {showDropDropdown && (
                  <div className="absolute top-[100%] left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-[360px] mt-1">
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
                        .filter((loc: any) =>
                          loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
                          loc.subtitle.toLowerCase().includes(dropSearch.toLowerCase())
                        )
                        .map((loc: any) => (
                          <div
                            key={loc.id || loc.value}
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
                      {locationsList.filter((loc: any) =>
                        loc.name.toLowerCase().includes(dropSearch.toLowerCase()) ||
                        loc.subtitle.toLowerCase().includes(dropSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="text-center py-4 text-xs font-bold text-slate-400">No supported locations found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 px-4 py-2.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block mb-0.5">
                  Pick-up Date & Time
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="border-none p-0 font-extrabold text-slate-800 focus:outline-none focus:ring-0 bg-transparent"
                    style={{ fontSize: '13px' }}
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="border-none p-0 font-extrabold text-slate-800 focus:outline-none focus:ring-0 bg-transparent w-[75px]"
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Return Date & Time (hidden for Airport Transfer, same as main cabs page) */}
              {tripType !== 'airport' && (
                <div className="lg:col-span-2 px-4 py-2.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 block mb-0.5">
                    Return Date & Time
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    placeholder="Optional"
                    className="border-none p-0 font-extrabold text-slate-800 focus:outline-none focus:ring-0 bg-transparent"
                    style={{ fontSize: '13px' }}
                  />
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Add return to save more</span>
                </div>
              )}

              <div className="lg:col-span-2 flex">
                <button
                  type="submit"
                  className="w-full h-full font-black tracking-widest border-none cursor-pointer transition-all rounded-b-2xl lg:rounded-b-none lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-2xl lg:rounded-br-2xl"
                  style={{
                    background: '#ff8126',
                    color: '#ffffff',
                    fontSize: '14px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                  }}
                >
                  SEARCH
                </button>
              </div>
            </div>
          </form>
          </div>
          {/* End full search form wrapper */}

        </div>
      </div>

      {/* Body: Filters + Results */}
      <div className="max-w-[1140px] mx-auto px-[10px] sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-150 p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-900" style={{ fontSize: '17px' }}>Filter</h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-blue-500 font-bold text-xs border-none bg-transparent cursor-pointer hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-2">
                <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '14px' }}>Cab Type</h4>
                <div className="space-y-3">
                  {Object.keys(vehicleTypeCounts).map((type) => {
                    const isChecked = selectedVehicleTypes.includes(type);
                    return (
                      <div
                        key={type}
                        onClick={() => toggleVehicleType(type)}
                        className="flex items-center justify-between cursor-pointer select-none group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                            {isChecked && <i className="fa-solid fa-check text-[9px]"></i>}
                          </div>
                          <span className="text-slate-700 font-semibold" style={{ fontSize: '13px' }}>{type}</span>
                        </div>
                        <span className="text-slate-400 font-semibold" style={{ fontSize: '12px' }}>{vehicleTypeCounts[type]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '14px' }}>Fuel Type</h4>
                <div className="space-y-3">
                  {Object.keys(fuelTypeCounts).map((type) => {
                    const isChecked = selectedFuelTypes.includes(type);
                    return (
                      <div
                        key={type}
                        onClick={() => toggleFuelType(type)}
                        className="flex items-center justify-between cursor-pointer select-none group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                            {isChecked && <i className="fa-solid fa-check text-[9px]"></i>}
                          </div>
                          <span className="text-slate-700 font-semibold" style={{ fontSize: '13px' }}>{type}</span>
                        </div>
                        <span className="text-slate-400 font-semibold" style={{ fontSize: '12px' }}>{fuelTypeCounts[type]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 min-w-0" style={{ marginTop: '10px' }}>
            {isLoading && (
              <>
                <CabCardSkeleton />
                <CabCardSkeleton />
                <CabCardSkeleton />
              </>
            )}

            {!isLoading && isError && (
              <div className="bg-white rounded-2xl border border-slate-150 p-10 text-center">
                <p className="text-slate-500 font-semibold">Unable to load cabs right now. Please try again shortly.</p>
              </div>
            )}

            {!isLoading && !isError && filteredCabs.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-150 p-10 text-center">
                <p className="text-slate-500 font-semibold">No cabs match the selected filters.</p>
              </div>
            )}

            {!isLoading && !isError && filteredCabs.map((cab) => (
              <React.Fragment key={cab.id}>
                <div className="hidden lg:block">
                  <CabListingCard cab={cab} ctx={bookingContext} />
                </div>
                <div className="lg:hidden">
                  <CabListingCardMobile cab={cab} ctx={bookingContext} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Sort By / Filter Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex" style={{ background: '#05213d' }}>
        <button
          type="button"
          onClick={() => setMobileSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 text-white font-bold border-none bg-transparent cursor-pointer"
          style={{ fontSize: '13px', paddingTop: '14px', paddingBottom: '14px' }}
        >
          <i className="fa-solid fa-arrow-up-wide-short"></i> Sort By
        </button>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }}></div>
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 text-white font-bold border-none bg-transparent cursor-pointer"
          style={{ fontSize: '13px', paddingTop: '14px', paddingBottom: '14px' }}
        >
          <i className="fa-solid fa-filter"></i> Filter
        </button>
      </div>

      {/* Mobile Sort By Bottom Sheet */}
      {mobileSortOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end" onClick={() => setMobileSortOpen(false)}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative bg-white w-full rounded-t-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-black text-slate-900 mb-4" style={{ fontSize: '17px' }}>Sort By</h3>
            {[
              { value: 'default', label: 'Relevance' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
            ].map((opt) => (
              <div
                key={opt.value}
                onClick={() => { setSortBy(opt.value as 'default' | 'price_low' | 'price_high'); setMobileSortOpen(false); }}
                className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0 cursor-pointer select-none"
              >
                <span
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: sortBy === opt.value ? '#ff8126' : '#cbd5e1' }}
                >
                  {sortBy === opt.value && <span className="w-2 h-2 rounded-full" style={{ background: '#ff8126' }}></span>}
                </span>
                <span className="text-slate-700 font-semibold text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end" onClick={() => setMobileFilterOpen(false)}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative bg-white w-full rounded-t-2xl p-5 max-h-[75vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900" style={{ fontSize: '17px' }}>Filter</h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-blue-500 font-bold text-xs border-none bg-transparent cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 mb-2">
              <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '14px' }}>Cab Type</h4>
              <div className="space-y-3">
                {Object.keys(vehicleTypeCounts).map((type) => {
                  const isChecked = selectedVehicleTypes.includes(type);
                  return (
                    <div
                      key={type}
                      onClick={() => toggleVehicleType(type)}
                      className="flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                          {isChecked && <i className="fa-solid fa-check text-[9px]"></i>}
                        </div>
                        <span className="text-slate-700 font-semibold" style={{ fontSize: '13px' }}>{type}</span>
                      </div>
                      <span className="text-slate-400 font-semibold" style={{ fontSize: '12px' }}>{vehicleTypeCounts[type]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 mb-2">
              <h4 className="font-bold text-slate-900 mb-3" style={{ fontSize: '14px' }}>Fuel Type</h4>
              <div className="space-y-3">
                {Object.keys(fuelTypeCounts).map((type) => {
                  const isChecked = selectedFuelTypes.includes(type);
                  return (
                    <div
                      key={type}
                      onClick={() => toggleFuelType(type)}
                      className="flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-[16px] h-[16px] rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                          {isChecked && <i className="fa-solid fa-check text-[9px]"></i>}
                        </div>
                        <span className="text-slate-700 font-semibold" style={{ fontSize: '13px' }}>{type}</span>
                      </div>
                      <span className="text-slate-400 font-semibold" style={{ fontSize: '12px' }}>{fuelTypeCounts[type]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-2 text-white font-black uppercase tracking-wider border-none cursor-pointer"
              style={{ background: '#ff8126', paddingTop: '12px', paddingBottom: '12px', borderRadius: '10px' }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
