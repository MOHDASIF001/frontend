'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { API_BASE_URL, resolveAssetUrl } from '../../config';
import { hotelData, Mood, Destination, FAQ } from './hotel-data';
import ServiceQuickLinks from '../../components/ServiceQuickLinks';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Hotel {
  id: number;
  name: string;
  slug: string;
  location: string;
  city?: string;
  featured_image: string;
  price_per_night: number;
  star_rating?: number;
  short_description?: string;
  amenities?: string;
  hotel_type?: string;
}

// Some hotels only have `city` filled in by the admin (the `location` field
// isn't exposed on the admin hotel form at all) - fall back to city so those
// hotels still show up as a searchable location suggestion.
function hotelSearchLocation(h: Hotel): string {
  return h.location || h.city || '';
}

/* ==========================================================================
   1. HotelSearchHero Component
   ========================================================================== */
interface HotelSearchHeroProps {
  searchLocation: string;
  setSearchLocation: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  checkInDate: string;
  setCheckInDate: (val: string) => void;
  checkOutDate: string;
  setCheckOutDate: (val: string) => void;
  roomsList: { adults: number; children: number; childAges: number[] }[];
  setRoomsList: React.Dispatch<React.SetStateAction<{ adults: number; children: number; childAges: number[] }[]>>;
  handleSearchSubmit: (e: React.FormEvent) => void;
  hotels: Hotel[];
}

/* ==========================================================================
   CustomCalendarDropdown Component
   ========================================================================== */
interface CustomCalendarDropdownProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minDate?: string;
  onClose: () => void;
  calRef?: React.RefObject<HTMLDivElement | null>;
  align?: 'left' | 'right';
}

function CustomCalendarDropdown({
  selectedDate,
  onSelectDate,
  minDate,
  onClose,
  calRef,
  align = 'left'
}: CustomCalendarDropdownProps) {
  // Parse initial date or default to current date
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [displayMonth, setDisplayMonth] = useState(initialDate.getMonth());
  const [displayYear, setDisplayYear] = useState(initialDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  
  // Align grid: Monday (0) to Sunday (6)
  const startDayIndex = (() => {
    const day = new Date(displayYear, displayMonth, 1).getDay();
    return day === 0 ? 6 : day - 1;
  })();

  const cells = [];
  // Empty leading cells
  for (let i = 0; i < startDayIndex; i++) {
    cells.push(<div key={`empty-${i}`} className="w-8 h-8 sm:w-9 sm:h-9" />);
  }

  const minDateTime = minDate ? new Date(minDate).setHours(0, 0, 0, 0) : null;
  const currentSelTime = selectedDate ? new Date(selectedDate).setHours(0, 0, 0, 0) : null;

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(displayYear, displayMonth, day);
    const timeValue = currentDate.getTime();
    
    // Disable past dates
    const isPast = currentDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
    const isBelowMin = minDateTime ? currentDate.setHours(0, 0, 0, 0) < minDateTime : false;
    const isDisabled = isPast || isBelowMin;

    const isSelected = currentSelTime === currentDate.setHours(0, 0, 0, 0);

    const yyyy = displayYear;
    const mm = String(displayMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    cells.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation();
          onSelectDate(dateStr);
          onClose();
        }}
        className={`w-8 h-8 sm:w-9 sm:h-9 text-xs rounded-full flex items-center justify-center font-bold transition-all border-none ${
          isSelected
            ? 'bg-[#ff8126] text-white shadow-md cursor-pointer'
            : isDisabled
            ? 'text-slate-200 cursor-not-allowed bg-transparent'
            : 'text-slate-700 hover:bg-slate-100 cursor-pointer bg-transparent'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div
      ref={calRef}
      className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl p-4 border border-slate-200 z-50 w-[280px] sm:w-[310px] ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Month Year Navigation */}
      <div className="flex justify-between items-center mb-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer bg-white"
        >
          <i className="fa-solid fa-chevron-left text-slate-600 text-xs"></i>
        </button>
        <span className="font-extrabold text-xs sm:text-sm text-slate-800">
          {months[displayMonth]} {displayYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer bg-white"
        >
          <i className="fa-solid fa-chevron-right text-slate-600 text-xs"></i>
        </button>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((wd) => (
          <span key={wd} className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {cells}
      </div>
    </div>
  );
}

function HotelSearchHero({
  searchLocation,
  setSearchLocation,
  selectedLocation,
  setSelectedLocation,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  roomsList,
  setRoomsList,
  handleSearchSubmit,
  hotels
}: HotelSearchHeroProps) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showCheckInCal, setShowCheckInCal] = useState(false);
  const [showCheckOutCal, setShowCheckOutCal] = useState(false);
  
  const desktopLocationPickerRef = useRef<HTMLDivElement>(null);
  const mobileLocationPickerRef = useRef<HTMLDivElement>(null);
  const desktopGuestPickerRef = useRef<HTMLDivElement>(null);
  const mobileGuestPickerRef = useRef<HTMLDivElement>(null);
  const desktopCheckInCalRef = useRef<HTMLDivElement>(null);
  const mobileCheckInCalRef = useRef<HTMLDivElement>(null);
  const desktopCheckOutCalRef = useRef<HTMLDivElement>(null);
  const mobileCheckOutCalRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: '--', monthYear: '---', weekday: '---' };
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthYear = `${months[date.getMonth()]}'${date.getFullYear()}`;
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return { day, monthYear, weekday: weekdays[date.getDay()] };
  };

  // Handler functions for Room Management
  const handleAddRoom = () => {
    setRoomsList([...roomsList, { adults: 1, children: 0, childAges: [] }]);
  };

  const handleRemoveRoom = (index: number) => {
    const list = [...roomsList];
    list.splice(index, 1);
    setRoomsList(list);
  };

  const handleUpdateRoomCount = (index: number, type: 'adults' | 'children', value: number) => {
    if (type === 'adults') {
      if (value > 3) {
        // Auto-split: cap current room at 3, add new room with 1 adult
        const list = [...roomsList];
        list[index].adults = 3;

        // If next room exists, increment its adults (if < 3), else push a new room
        if (list[index + 1]) {
          if (list[index + 1].adults < 3) {
            list[index + 1].adults += 1;
          } else {
            list.push({ adults: 1, children: 0, childAges: [] });
          }
        } else {
          list.push({ adults: 1, children: 0, childAges: [] });
        }
        setRoomsList(list);
        return;
      }
    }

    const list = [...roomsList];
    list[index][type] = Math.max(0, value);

    // Keep childAges in sync with the children count (default new child to 5 yrs)
    if (type === 'children') {
      const ages = [...(list[index].childAges || [])];
      while (ages.length < list[index].children) ages.push(5);
      while (ages.length > list[index].children) ages.pop();
      list[index].childAges = ages;
    }

    // Auto-remove empty rooms if it is not the first room
    if (list[index].adults === 0 && list[index].children === 0 && list.length > 1) {
      list.splice(index, 1);
    }

    setRoomsList(list);
  };

  const handleUpdateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const list = [...roomsList];
    const ages = [...(list[roomIndex].childAges || [])];
    ages[childIndex] = age;
    list[roomIndex].childAges = ages;
    setRoomsList(list);
  };

  const totalGuests = roomsList.reduce((acc, r) => acc + r.adults + r.children, 0);

  // Extract unique locations from database hotels list
  const uniqueDbLocations = Array.from(
    new Set(hotels.map(hotelSearchLocation).filter(Boolean))
  );

  // Filter dynamic suggestions based on typed location search input
  const query = searchLocation.trim().toLowerCase();
  const matchedLocations = uniqueDbLocations.filter((loc) =>
    loc.toLowerCase().includes(query)
  );
  const matchedHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(query)
  );

  const checkInDisp = formatDateDisplay(checkInDate);
  const checkOutDisp = formatDateDisplay(checkOutDate);

  // Create refs to keep track of state variables for click outside and snapping
  const searchLocationRef = useRef(searchLocation);
  const selectedLocationRef = useRef(selectedLocation);
  const showLocationPickerRef = useRef(showLocationPicker);
  const hotelsRef = useRef(hotels);

  // Sync refs on every render
  searchLocationRef.current = searchLocation;
  selectedLocationRef.current = selectedLocation;
  showLocationPickerRef.current = showLocationPicker;
  hotelsRef.current = hotels;

  const validateAndSnapLocation = () => {
    const currentSearch = searchLocationRef.current.trim();
    const currentSelected = selectedLocationRef.current;
    const currentHotels = hotelsRef.current;

    if (!currentSearch) {
      setSearchLocation(currentSelected);
      return;
    }
    
    // Extract unique locations from database hotels list
    const uniqueDbLocs = Array.from(
      new Set(currentHotels.map(hotelSearchLocation).filter(Boolean))
    );

    // Check for exact match in unique locations
    const matchedLoc = uniqueDbLocs.find(
      (loc) => loc.toLowerCase() === currentSearch.toLowerCase()
    );
    if (matchedLoc) {
      setSearchLocation(matchedLoc);
      setSelectedLocation(matchedLoc);
      return;
    }

    // Check for exact match in hotel names
    const matchedH = currentHotels.find(
      (h) => h.name.toLowerCase() === currentSearch.toLowerCase()
    );
    if (matchedH) {
      setSearchLocation(matchedH.name);
      setSelectedLocation(hotelSearchLocation(matchedH));
      return;
    }

    // Filter locations/hotels
    const queryLower = currentSearch.toLowerCase();
    const matchedL = uniqueDbLocs.filter((loc) =>
      loc.toLowerCase().includes(queryLower)
    );
    const matchedHot = currentHotels.filter((h) =>
      h.name.toLowerCase().includes(queryLower)
    );

    // If no exact match, try to auto-select the first suggestion from filtered lists
    if (matchedL.length > 0) {
      setSearchLocation(matchedL[0]);
      setSelectedLocation(matchedL[0]);
    } else if (matchedHot.length > 0) {
      setSearchLocation(matchedHot[0].name);
      setSelectedLocation(hotelSearchLocation(matchedHot[0]));
    } else {
      // Reset to last valid selection if absolutely no match
      setSearchLocation(currentSelected);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Location Picker Outside Click Check
      const clickedInsideLocation =
        (desktopLocationPickerRef.current && desktopLocationPickerRef.current.contains(target)) ||
        (mobileLocationPickerRef.current && mobileLocationPickerRef.current.contains(target));
      if (!clickedInsideLocation) {
        if (showLocationPickerRef.current) {
          setShowLocationPicker(false);
          validateAndSnapLocation();
        }
      }

      // Guest Picker Outside Click Check
      const clickedInsideGuest =
        (desktopGuestPickerRef.current && desktopGuestPickerRef.current.contains(target)) ||
        (mobileGuestPickerRef.current && mobileGuestPickerRef.current.contains(target));
      if (!clickedInsideGuest) {
        setShowGuestPicker(false);
      }

      // Check-In Calendar Outside Click Check
      const clickedInsideCheckIn =
        (desktopCheckInCalRef.current && desktopCheckInCalRef.current.contains(target)) ||
        (mobileCheckInCalRef.current && mobileCheckInCalRef.current.contains(target));
      if (!clickedInsideCheckIn) {
        setShowCheckInCal(false);
      }

      // Check-Out Calendar Outside Click Check
      const clickedInsideCheckOut =
        (desktopCheckOutCalRef.current && desktopCheckOutCalRef.current.contains(target)) ||
        (mobileCheckOutCalRef.current && mobileCheckOutCalRef.current.contains(target));
      if (!clickedInsideCheckOut) {
        setShowCheckOutCal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="w-full px-2 md:px-8 relative"
      style={{ 
        paddingTop: '100px',
        paddingBottom: '70px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #ff8126 130%)',
      }}
    >
      <div className="container max-w-6xl mx-auto">
        {/* Responsive quick access icons row */}
        <ServiceQuickLinks active="hotels" />

        <div className="flex justify-center lg:justify-end mb-2">
          {/* Desktop header */}
          <h2 className="hidden lg:block text-white font-bold tracking-wide text-right" style={{ fontSize: '18px' }}>
            Same Hotel, Best Price — Guaranteed!
          </h2>
          {/* Mobile header */}
          <h2 className="block lg:hidden text-white font-black tracking-wide text-center uppercase" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>
            SAME HOTEL, CHEAPEST PRICE. GUARANTEED!
          </h2>
        </div>

        {/* Desktop Search Engine Card */}
        <div className="hidden lg:block bg-[var(--color-white)] rounded-xl shadow-xl p-0 border border-[var(--color-border)]">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)]">
              
              <div 
                ref={desktopLocationPickerRef}
                className="flex-grow px-4 hover:bg-[var(--color-bg-light)] rounded-t-xl lg:rounded-t-none lg:rounded-l-xl cursor-pointer transition relative min-w-[260px] flex gap-2 items-start"
                style={{ paddingTop: '14px', paddingBottom: '14px' }}
                onClick={() => setShowLocationPicker(true)}
              >
                <i className="fa-solid fa-hotel text-slate-400 text-sm mt-1"></i>
                <div className="flex-grow">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                    Enter City Name, Location, or Specific hotel
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 p-0 text-sm md:text-base font-extrabold text-[var(--color-text-primary)] focus:outline-none focus:ring-0 placeholder:text-slate-450 placeholder:font-normal"
                    placeholder="Search city, area or hotel..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLocationPicker(true);
                    }}
                  />
                  <span className="text-[10px] text-slate-450 font-semibold block mt-0.5">India</span>
                </div>
                <i className="fa-solid fa-chevron-down text-slate-400 text-[10px] mt-1.5"></i>

                {showLocationPicker && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-[var(--color-white)] rounded-xl shadow-2xl p-4 border border-[var(--color-border)] z-50 min-w-[320px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {matchedLocations.map((loc) => (
                        <div 
                          key={loc}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-bold text-xs text-slate-700 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSearchLocation(loc);
                            setSelectedLocation(loc);
                            setShowLocationPicker(false);
                          }}
                        >
                          <i className="fa-solid fa-location-dot text-[var(--color-accent)] text-xs"></i>
                          <div className="flex flex-col">
                            <span>{loc}</span>
                            <span className="text-[9px] text-slate-400 font-medium">city</span>
                          </div>
                        </div>
                      ))}
                      {matchedHotels.map((h) => (
                        <div 
                          key={h.id}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-bold text-xs text-slate-700 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSearchLocation(h.name);
                            setSelectedLocation(hotelSearchLocation(h));
                            setShowLocationPicker(false);
                          }}
                        >
                          <i className="fa-solid fa-hotel text-blue-500 text-xs"></i>
                          <div className="flex flex-col">
                            <span>{h.name}</span>
                            <span className="text-[9px] text-slate-400 font-medium">{hotelSearchLocation(h)}</span>
                          </div>
                        </div>
                      ))}
                      {matchedLocations.length === 0 && matchedHotels.length === 0 && (
                        <span className="text-[10px] text-slate-400 block p-2">No matching locations found.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Check-In */}
              <div 
                ref={desktopCheckInCalRef}
                className="w-full lg:w-44 px-4 hover:bg-[var(--color-bg-light)] cursor-pointer transition relative flex-shrink-0 flex gap-2 items-start"
                style={{ paddingTop: '14px', paddingBottom: '14px' }}
                onClick={() => {
                  setShowCheckInCal(!showCheckInCal);
                  setShowCheckOutCal(false);
                  setShowGuestPicker(false);
                  setShowLocationPicker(false);
                }}
              >
                <i className="fa-solid fa-calendar-days text-slate-400 text-sm mt-0.5"></i>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                    Check-in
                  </label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-black text-[var(--color-accent)] leading-none tracking-tight">
                      {checkInDisp.day}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-extrabold text-[10px] text-[var(--color-text-primary)] uppercase">
                        {checkInDisp.monthYear}
                      </span>
                      <span className="text-[9px] text-slate-450 font-bold">
                        {checkInDisp.weekday}
                      </span>
                    </div>
                  </div>
                </div>

                {showCheckInCal && (
                  <CustomCalendarDropdown
                    selectedDate={checkInDate}
                    onSelectDate={(date) => {
                      setCheckInDate(date);
                      const ci = new Date(date);
                      const co = new Date(checkOutDate);
                      if (co <= ci) {
                        const nextDay = new Date(ci);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOutDate(formatDateString(nextDay));
                      }
                      setTimeout(() => {
                        setShowCheckOutCal(true);
                      }, 100);
                    }}
                    minDate={formatDateString(today)}
                    onClose={() => setShowCheckInCal(false)}
                  />
                )}
              </div>

              {/* Check-Out */}
              <div 
                ref={desktopCheckOutCalRef}
                className="w-full lg:w-44 px-4 hover:bg-[var(--color-bg-light)] cursor-pointer transition relative flex-shrink-0 flex gap-2 items-start"
                style={{ paddingTop: '14px', paddingBottom: '14px' }}
                onClick={() => {
                  setShowCheckOutCal(!showCheckOutCal);
                  setShowCheckInCal(false);
                  setShowGuestPicker(false);
                  setShowLocationPicker(false);
                }}
              >
                <i className="fa-solid fa-calendar-days text-slate-400 text-sm mt-0.5"></i>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                    Check-out
                  </label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-black text-slate-850 leading-none tracking-tight">
                      {checkOutDisp.day}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="font-extrabold text-[10px] text-slate-800 uppercase">
                        {checkOutDisp.monthYear}
                      </span>
                      <span className="text-[9px] text-slate-450 font-bold">
                        {checkOutDisp.weekday}
                      </span>
                    </div>
                  </div>
                </div>

                {showCheckOutCal && (
                  <CustomCalendarDropdown
                    selectedDate={checkOutDate}
                    onSelectDate={(date) => setCheckOutDate(date)}
                    minDate={checkInDate ? formatDateString(new Date(new Date(checkInDate).getTime() + 86400000)) : formatDateString(tomorrow)}
                    onClose={() => setShowCheckOutCal(false)}
                    align="right"
                  />
                )}
              </div>

              {/* Rooms & Guests Selection (Dynamic Stepper matching Screenshot) */}
              <div 
                ref={desktopGuestPickerRef}
                className="w-full lg:w-56 px-4 hover:bg-[var(--color-bg-light)] cursor-pointer transition relative flex-shrink-0 flex gap-2 items-start"
                style={{ paddingTop: '14px', paddingBottom: '14px' }}
                onClick={() => setShowGuestPicker(!showGuestPicker)}
              >
                <i className="fa-solid fa-users text-slate-400 text-sm mt-0.5"></i>
                <div className="flex-grow">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                    Rooms & Guests
                  </label>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-extrabold text-sm md:text-base text-slate-850 tracking-tight block">
                      {roomsList.length} Room, {totalGuests} Guests
                    </span>
                    <i className="fa-solid fa-chevron-down text-slate-400 text-[10px] ml-2"></i>
                  </div>
                </div>

                {showGuestPicker && (
                  <div 
                    className="absolute top-full right-0 mt-2 bg-[var(--color-white)] rounded-xl shadow-2xl p-4 border border-[var(--color-border)] z-50 min-w-[300px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                    <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
                      {roomsList.map((room, idx) => (
                        <div className="border-b last:border-b-0 pb-3 last:pb-0" key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-extrabold text-xs text-slate-700">Room {idx + 1}:</span>
                            {roomsList.length > 1 && (
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                                onClick={() => handleRemoveRoom(idx)}
                              >
                                <i className="fa-solid fa-trash-can mr-1"></i> Remove
                              </button>
                            )}
                          </div>

                          {/* Adults */}
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <div className="font-bold text-xs text-slate-800">Adult</div>
                              <div className="text-[9px] text-slate-450 font-bold">(Above 12 years)</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                type="button" 
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                disabled={room.adults <= 1}
                                onClick={() => handleUpdateRoomCount(idx, 'adults', room.adults - 1)}
                              >
                                -
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{room.adults}</span>
                              <button 
                                type="button" 
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                onClick={() => handleUpdateRoomCount(idx, 'adults', room.adults + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold text-xs text-slate-800">Child</div>
                              <div className="text-[9px] text-slate-450 font-bold">(Below 12 years)</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                type="button" 
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                disabled={room.children <= 0}
                                onClick={() => handleUpdateRoomCount(idx, 'children', room.children - 1)}
                              >
                                -
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{room.children}</span>
                              <button
                                type="button"
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                onClick={() => handleUpdateRoomCount(idx, 'children', room.children + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Child ages (used to auto-apply CNB / extra bed charges) */}
                          {room.children > 0 && (
                            <div className="mt-2 space-y-1.5">
                              {Array.from({ length: room.children }).map((_, cIdx) => (
                                <div key={cIdx} className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-450">Age of Child {cIdx + 1}</span>
                                  <select
                                    className="border border-slate-200 rounded text-[11px] font-bold px-1.5 py-1"
                                    value={room.childAges?.[cIdx] ?? 5}
                                    onChange={(e) => handleUpdateChildAge(idx, cIdx, parseInt(e.target.value, 10))}
                                  >
                                    {Array.from({ length: 18 }).map((_, age) => (
                                      <option key={age} value={age}>{age} {age === 1 ? 'yr' : 'yrs'}</option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 justify-between items-center mt-3 pt-3 border-t border-[var(--color-border)]">
                      <button
                        type="button"
                        className="px-3 py-1.5 border border-green-500 rounded text-green-600 font-bold text-xs hover:bg-green-50"
                        onClick={handleAddRoom}
                      >
                        Add Room
                      </button>
                      <button
                        type="button"
                        className="px-4 py-1.5 bg-[var(--color-accent)] text-white rounded font-bold text-xs hover:bg-[var(--color-accent-hover)]"
                        onClick={() => setShowGuestPicker(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SEARCH BUTTON */}
              <div 
                className="w-full lg:w-32 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-b-xl lg:rounded-b-none lg:rounded-r-xl transition flex-shrink-0 overflow-hidden"
                style={{ borderBottomRightRadius: '11px', borderTopRightRadius: '11px' }}
              >
                <button 
                  type="submit"
                  className="w-full h-full py-3.5 lg:py-0 font-black text-white text-sm tracking-widest text-center flex items-center justify-center cursor-pointer uppercase rounded-b-xl lg:rounded-b-none lg:rounded-r-xl"
                  style={{ borderBottomRightRadius: '11px', borderTopRightRadius: '11px' }}
                >
                  SEARCH
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Desktop Bottom Options capsules */}
        <div className="hidden lg:flex flex-row justify-between items-center gap-4" style={{ marginTop: '10px' }}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[var(--color-white)] rounded-full px-4 py-2 border border-[var(--color-border)] shadow-md flex items-center gap-2 text-xs font-extrabold text-slate-700">
              <i className="fa-solid fa-hourglass-half fa-spin text-[var(--color-accent)] text-sm"></i>
              <span>Last Minute Deals</span>
              <input type="checkbox" className="accent-[var(--color-accent)] rounded ml-1 w-3.5 h-3.5" />
            </div>

            <div className="bg-[var(--color-white)] rounded-full px-4 py-2 border border-[var(--color-border)] shadow-md flex items-center gap-2 text-xs font-extrabold text-slate-700">
              <i className="fa-solid fa-shield-halved text-[var(--color-success)] text-sm"></i>
              <span>Lowest Price Guarantee</span>
              <input type="checkbox" defaultChecked className="accent-[var(--color-accent)] rounded ml-1 w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Mobile Search Engine Card */}
        <div 
          className="block lg:hidden bg-white border border-slate-100"
          style={{ borderRadius: '11px', padding: '15px' }}
        >
          <form onSubmit={handleSearchSubmit}>
            <div className="flex flex-col gap-3">
              
              {/* Row 1: Destination */}
              <div 
                ref={mobileLocationPickerRef}
                className="relative flex gap-3 items-start cursor-pointer pb-3 border-b border-slate-100"
                onClick={() => setShowLocationPicker(true)}
              >
                <i className="fa-solid fa-hotel text-slate-400 text-base mt-1 flex-shrink-0"></i>
                <div className="flex-grow">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                    Enter City Name, Location or Specific Hotel
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-0 p-0 text-base font-black text-slate-900 focus:outline-none focus:ring-0 placeholder:text-slate-400 placeholder:font-normal"
                    placeholder="Search city, area or hotel..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLocationPicker(true);
                    }}
                  />
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">India</span>
                </div>

                {showLocationPicker && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-white)] rounded-xl shadow-2xl p-4 border border-[var(--color-border)] z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="max-h-60 overflow-y-auto space-y-1 col-12">
                      {matchedLocations.map((loc) => (
                        <div 
                          key={loc}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-bold text-xs text-slate-700 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSearchLocation(loc);
                            setSelectedLocation(loc);
                            setShowLocationPicker(false);
                          }}
                        >
                          <i className="fa-solid fa-location-dot text-[var(--color-accent)] text-xs"></i>
                          <div className="flex flex-col">
                            <span>{loc}</span>
                            <span className="text-[9px] text-slate-400 font-medium">city</span>
                          </div>
                        </div>
                      ))}
                      {matchedHotels.map((h) => (
                        <div 
                          key={h.id}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-bold text-xs text-slate-700 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSearchLocation(h.name);
                            setSelectedLocation(hotelSearchLocation(h));
                            setShowLocationPicker(false);
                          }}
                        >
                          <i className="fa-solid fa-hotel text-blue-500 text-xs"></i>
                          <div className="flex flex-col">
                            <span>{h.name}</span>
                            <span className="text-[9px] text-slate-450 font-medium">{hotelSearchLocation(h)}</span>
                          </div>
                        </div>
                      ))}
                      {matchedLocations.length === 0 && matchedHotels.length === 0 && (
                        <span className="text-[10px] text-slate-400 block p-2">No matching locations found.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2: Check-In & Check-Out (Side-by-side) */}
              <div className="flex items-stretch border-b border-slate-100 pb-3">
                
                {/* Check-In Column */}
                <div 
                  ref={mobileCheckInCalRef}
                  className="w-1/2 flex gap-3 items-start cursor-pointer relative"
                  onClick={() => {
                    setShowCheckInCal(!showCheckInCal);
                    setShowCheckOutCal(false);
                    setShowGuestPicker(false);
                  }}
                >
                  <i className="fa-regular fa-calendar text-slate-450 text-base mt-0.5 flex-shrink-0"></i>
                  <div className="flex-grow">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                      Check-In
                    </label>
                    <span className="text-sm font-black text-slate-900 block leading-tight">
                      {checkInDisp.day} {checkInDisp.monthYear.replace('\'', '\' ')}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                      {checkInDisp.weekday}
                    </span>
                  </div>

                  {showCheckInCal && (
                    <CustomCalendarDropdown
                      selectedDate={checkInDate}
                      onSelectDate={(date) => {
                        setCheckInDate(date);
                        const ci = new Date(date);
                        const co = new Date(checkOutDate);
                        if (co <= ci) {
                          const nextDay = new Date(ci);
                          nextDay.setDate(nextDay.getDate() + 1);
                          setCheckOutDate(formatDateString(nextDay));
                        }
                        setTimeout(() => {
                          setShowCheckOutCal(true);
                        }, 100);
                      }}
                      minDate={formatDateString(today)}
                      onClose={() => setShowCheckInCal(false)}
                      align="left"
                    />
                  )}
                </div>

                {/* Vertical Divider */}
                <div className="border-r border-slate-100 mx-2"></div>

                {/* Check-Out Column */}
                <div 
                  ref={mobileCheckOutCalRef}
                  className="w-1/2 flex gap-3 items-start cursor-pointer relative pl-2"
                  onClick={() => {
                    setShowCheckOutCal(!showCheckOutCal);
                    setShowCheckInCal(false);
                    setShowGuestPicker(false);
                  }}
                >
                  <i className="fa-regular fa-calendar text-slate-450 text-base mt-0.5 flex-shrink-0"></i>
                  <div className="flex-grow">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                      Check-out
                    </label>
                    <span className="text-sm font-black text-slate-900 block leading-tight">
                      {checkOutDisp.day} {checkOutDisp.monthYear.replace('\'', '\' ')}
                    </span>
                    <span className="text-[9px] text-slate-450 font-bold block mt-0.5">
                      {checkOutDisp.weekday}
                    </span>
                  </div>

                  {showCheckOutCal && (
                    <CustomCalendarDropdown
                      selectedDate={checkOutDate}
                      onSelectDate={(date) => setCheckOutDate(date)}
                      minDate={checkInDate ? formatDateString(new Date(new Date(checkInDate).getTime() + 86400000)) : formatDateString(tomorrow)}
                      onClose={() => setShowCheckOutCal(false)}
                      align="right"
                    />
                  )}
                </div>

              </div>

              {/* Row 3: Room & Guest Selection */}
              <div 
                ref={mobileGuestPickerRef}
                className="relative flex gap-3 items-start cursor-pointer py-1 pb-3 border-b border-slate-100"
                onClick={() => setShowGuestPicker(!showGuestPicker)}
              >
                <i className="fa-regular fa-user text-slate-450 text-base mt-0.5 flex-shrink-0"></i>
                <div className="flex-grow">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                    Guest & Room
                  </label>
                  <span className="text-sm font-black text-slate-900 block leading-tight">
                    {totalGuests} Guest, {roomsList.length} Room
                  </span>
                </div>
                
                {/* Plus Icon on right */}
                <i className="fa-solid fa-circle-plus text-[#008cff] text-lg ml-auto mt-0.5"></i>

                {showGuestPicker && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-white)] rounded-xl shadow-2xl p-4 border border-[var(--color-border)] z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
                      {roomsList.map((room, idx) => (
                        <div className="border-b last:border-b-0 pb-3 last:pb-0" key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-extrabold text-xs text-slate-700">Room {idx + 1}:</span>
                            {roomsList.length > 1 && (
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                                onClick={() => handleRemoveRoom(idx)}
                              >
                                <i className="fa-solid fa-trash-can mr-1"></i> Remove
                              </button>
                            )}
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <div className="font-bold text-xs text-slate-800">Adult</div>
                              <div className="text-[9px] text-slate-450 font-bold">(Above 12 years)</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                type="button" 
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                disabled={room.adults <= 1}
                                onClick={() => handleUpdateRoomCount(idx, 'adults', room.adults - 1)}
                              >
                                -
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{room.adults}</span>
                              <button 
                                type="button" 
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                onClick={() => handleUpdateRoomCount(idx, 'adults', room.adults + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold text-xs text-slate-800">Child</div>
                              <div className="text-[9px] text-slate-450 font-bold">(Below 12 years)</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                type="button" 
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                disabled={room.children <= 0}
                                onClick={() => handleUpdateRoomCount(idx, 'children', room.children - 1)}
                              >
                                -
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{room.children}</span>
                              <button
                                type="button"
                                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                onClick={() => handleUpdateRoomCount(idx, 'children', room.children + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Child ages (used to auto-apply CNB / extra bed charges) */}
                          {room.children > 0 && (
                            <div className="mt-2 space-y-1.5">
                              {Array.from({ length: room.children }).map((_, cIdx) => (
                                <div key={cIdx} className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-slate-450">Age of Child {cIdx + 1}</span>
                                  <select
                                    className="border border-slate-200 rounded text-[11px] font-bold px-1.5 py-1"
                                    value={room.childAges?.[cIdx] ?? 5}
                                    onChange={(e) => handleUpdateChildAge(idx, cIdx, parseInt(e.target.value, 10))}
                                  >
                                    {Array.from({ length: 18 }).map((_, age) => (
                                      <option key={age} value={age}>{age} {age === 1 ? 'yr' : 'yrs'}</option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-between items-center mt-3 pt-3 border-t border-[var(--color-border)]">
                      <button
                        type="button"
                        className="px-3 py-1.5 border border-green-500 rounded text-green-600 font-bold text-xs hover:bg-green-50"
                        onClick={handleAddRoom}
                      >
                        Add Room
                      </button>
                      <button
                        type="button"
                        className="px-4 py-1.5 bg-[var(--color-accent)] text-white rounded font-bold text-xs hover:bg-[var(--color-accent-hover)]"
                        onClick={() => setShowGuestPicker(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 4: Bottom capsules (Side-by-side) */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                
                {/* Last Minute Deals */}
                <div 
                  className="bg-white border rounded-lg p-2 flex items-center justify-between gap-1"
                  style={{ borderColor: '#ff8126' }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <i className="fa-solid fa-hourglass-half text-[#ff8126] text-xs flex-shrink-0"></i>
                    <span className="font-black text-slate-800 text-[10px] leading-tight truncate">Last Minute Deals</span>
                  </div>
                  <input type="checkbox" className="accent-[var(--color-accent)] rounded w-3.5 h-3.5 flex-shrink-0" />
                </div>

                {/* Lowest Price Guarantee */}
                <div 
                  className="bg-[#f0faf2] border rounded-lg p-2 flex items-center justify-between gap-1"
                  style={{ borderColor: '#1fae5c' }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <i className="fa-solid fa-circle-check text-[#1fae5c] text-xs flex-shrink-0"></i>
                    <span className="font-black text-slate-850 text-[10px] leading-tight truncate">Lowest Price Guarantee</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[var(--color-accent)] rounded w-3.5 h-3.5 flex-shrink-0" />
                </div>

              </div>

              {/* Row 5: Search Button */}
              <button 
                type="submit"
                className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-black text-sm tracking-wider transition mt-2 uppercase focus:outline-none"
                style={{ borderRadius: '8px', paddingTop: '16px', paddingBottom: '16px' }}
              >
                Search Hotels
              </button>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   3. ExclusiveOffersSection Component
   ========================================================================== */
interface ExclusiveOffer {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  tag?: string;
  code?: string;
  valid_until?: string;
  image?: string;
}

interface ExclusiveOffersSectionProps {
  offers: ExclusiveOffer[];
}

function ExclusiveOffersSection({ offers }: ExclusiveOffersSectionProps) {
  if (offers.length === 0) return null;

  return (
    <div className="container max-w-6xl mb-16 relative" style={{ marginTop: '30px' }}>
      <h2 className="text-3xl font-black text-center text-[var(--color-text-primary)] mb-8">Exclusive Offers</h2>
      <div className="relative px-1 md:px-8">
        <Swiper
          modules={[Navigation]}
          slidesPerView={1.2}
          spaceBetween={20}
          navigation={{
            prevEl: '.offers-prev',
            nextEl: '.offers-next',
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {offers.map((o) => {
            const img = o.image ? resolveAssetUrl(o.image) : '/images/default-dest.jpg';
            const validity = o.valid_until
              ? `Valid Till : ${new Date(o.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
              : '';
            return (
              <SwiperSlide key={o.id}>
                <Link
                  href={`/offers/${o.slug}`}
                  className="block bg-[var(--color-white)] rounded-lg border border-[var(--color-border)] shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition duration-300"
                  style={{ textDecoration: 'none' }}
                >
                  {/* Banner Image Block */}
                  <div className="relative h-[160px] w-full overflow-hidden">
                    <img
                      src={img}
                      alt={o.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Coupon Code badge on top right of image */}
                    {o.code && (
                      <div
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit cursor-pointer hover:bg-white/35 transition z-10"
                        style={{ paddingLeft: '5px', paddingRight: '5px' }}
                        title="Click to copy coupon code"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigator.clipboard.writeText(o.code!);
                          alert(`Coupon Code "${o.code}" copied to clipboard!`);
                        }}
                      >
                        <span>{o.code}</span>
                        <i className="fa-regular fa-copy text-[10px]"></i>
                      </div>
                    )}
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 flex flex-col justify-end p-4">
                      {/* Top Text / Badge */}
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-350 tracking-wider block">
                          {o.tag}
                        </span>
                        <h3 className="font-extrabold text-sm md:text-base text-white mt-1 leading-snug drop-shadow-md whitespace-pre-line">
                          {o.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Details Panel */}
                  <div className="py-2 px-4 flex-grow flex flex-col justify-between bg-[var(--color-white)]">
                    <p className="font-normal text-[12px] md:text-[13px] text-slate-800 leading-snug line-clamp-2 min-h-[36px] mb-2">
                      {o.subtitle}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        {validity}
                      </span>
                      <span
                        className="text-[var(--color-accent)] font-black text-xs uppercase tracking-wider flex items-center gap-1"
                      >
                        <span>VIEW OFFER</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button 
          type="button"
          className="offers-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-[#008cff] shadow-lg border border-[var(--color-border)] rounded-full w-10 h-10 hidden md:flex items-center justify-center z-20 transition"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>
        <button 
          type="button"
          className="offers-next absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-[#008cff] shadow-lg border border-[var(--color-border)] rounded-full w-10 h-10 hidden md:flex items-center justify-center z-20 transition"
        >
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. HotelsOfChoiceCarousel Component
   ========================================================================== */
interface HotelsOfChoiceCarouselProps {
  choiceHotelsList: Hotel[];
}

function HotelsOfChoiceCarousel({ choiceHotelsList }: HotelsOfChoiceCarouselProps) {
  if (choiceHotelsList.length === 0) return null;
  return (
    <div id="hotels-list-section" className="container max-w-6xl mb-16 relative">
      <style>{`
        #hotels-list-section {
          margin-top: 30px !important;
        }
        @media (min-width: 1024px) {
          #hotels-list-section {
            margin-top: 60px !important;
          }
        }
      `}</style>
      <h2 className="text-3xl font-black text-center text-[var(--color-text-primary)] mb-8">Hotels Of Choice</h2>
      
      <div className="relative px-1 md:px-8">
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={1.2}
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: '.hotels-prev',
            nextEl: '.hotels-next',
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          className="w-full"
        >
          {choiceHotelsList.map((h) => {
            const img = h.featured_image ? resolveAssetUrl(h.featured_image) : '/images/default-hotel.jpg';
            return (
              <SwiperSlide key={h.id}>
                <div
                  className="group bg-[var(--color-white)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition duration-300 flex flex-col h-[320px] relative overflow-hidden"
                  style={{ borderRadius: '11px' }}
                >

                  {/* Background Image that covers the whole card */}
                  <div
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ borderRadius: '11px' }}
                  >
                    <img
                      src={img}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Subtle dark overlay at the bottom so the white card pops */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>

                  {/* Floating Bottom Card Overlap containing Hotel Name */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-white rounded-xl p-3 text-left shadow-lg border border-white/50 z-10">
                    <h4
                      className="font-extrabold text-slate-850 mb-1 leading-snug line-clamp-2 flex items-center"
                      style={{ fontSize: '11.8px', minHeight: '24px' }}
                    >
                      {h.name}
                    </h4>
                    <Link
                      href={`/hotels-details/${h.slug}`}
                      className="text-[var(--color-accent)] font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-[var(--color-accent-hover)] no-underline"
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Explore More</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>

                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button 
          type="button"
          className="hotels-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-[#008cff] shadow-lg border border-[var(--color-border)] rounded-full w-10 h-10 hidden md:flex items-center justify-center z-20 transition"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>
        <button 
          type="button"
          className="hotels-next absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-[#008cff] shadow-lg border border-[var(--color-border)] rounded-full w-10 h-10 hidden md:flex items-center justify-center z-20 transition"
        >
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. MoodCategoryCarousel Component
   ========================================================================== */
interface MoodCategoryCarouselProps {
  moods: Mood[];
}

function MoodCategoryCarousel({ moods }: MoodCategoryCarouselProps) {
  return (
    <div 
      className="w-full py-16 mb-16 relative bg-cover bg-center"
      style={{ 
        backgroundImage: 'linear-gradient(to bottom, rgba(245,246,249,0.92), rgba(245,246,249,0.95)), url("/images/dotted-world-map-png.webp")',
      }}
    >
      <div className="container max-w-6xl relative">
        <h2 className="text-3xl font-black text-center text-[var(--color-text-primary)] mb-2">Book Hotels For Every Mood</h2>
        <p className="text-slate-400 text-xs font-bold text-center uppercase tracking-wider mb-10">Curated Escapes for Your Curious Soul!</p>
        
        <div className="relative px-1 md:px-8">
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={20}
            navigation={{
              prevEl: '.moods-prev',
              nextEl: '.moods-next',
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            className="w-full"
          >
            {moods.map((e, idx) => (
              <SwiperSlide key={idx}>
                <div className="group relative rounded-3xl overflow-hidden shadow-sm aspect-[4/5] cursor-pointer">
                  <img 
                    src={e.img} 
                    alt={e.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-750"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-5">
                    <h4 className="font-extrabold text-white text-lg">{e.name}</h4>
                    <span className="text-white/90 text-xs font-bold mt-2 flex items-center gap-1 group-hover:underline">
                      Explore More <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button 
            type="button"
            className="moods-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-[var(--color-accent)] shadow-lg border border-[var(--color-border)] rounded-full w-10 h-10 flex items-center justify-center z-20 transition"
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>
          <button 
            type="button"
            className="moods-next absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-[var(--color-accent)] shadow-lg border border-[var(--color-border)] rounded-full w-10 h-10 flex items-center justify-center z-20 transition"
          >
            <i className="fa-solid fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. PopularDestinationsGrid Component
   ========================================================================== */
interface PopularDestinationsGridProps {
  destinations: Destination[];
  handleQuickLocationFilter: (loc: string) => void;
}

function PopularDestinationsGrid({ destinations, handleQuickLocationFilter }: PopularDestinationsGridProps) {
  return (
    <div id="popular-destinations-section" className="container max-w-6xl mb-16">
      <style>{`
        #popular-destinations-section {
          margin-top: 30px !important;
        }
        @media (min-width: 1024px) {
          #popular-destinations-section {
            margin-top: 60px !important;
          }
        }
      `}</style>
      <h2 className="text-3xl font-black text-center text-[var(--color-text-primary)] mb-10">Book Hotels At Popular Destinations</h2>
      <div className="row g-3">
        {destinations.map((d, index) => (
          <div key={index} className="col-lg-4 col-md-6 col-12">
            <div 
              className="bg-[var(--color-white)] flex items-center gap-3 hover:shadow-md cursor-pointer transition"
              style={{ 
                paddingTop: '3px', 
                paddingBottom: '3px', 
                paddingLeft: '6px', 
                paddingRight: '6px',
                border: '1px solid #008cff',
                borderRadius: '8px'
              }}
              onClick={() => handleQuickLocationFilter(d.name)}
            >
              <div 
                className="w-16 h-16 overflow-hidden flex-shrink-0 relative"
                style={{ borderRadius: '8px' }}
              >
                <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 
                  className="font-extrabold text-[var(--color-text-primary)] leading-tight"
                  style={{ fontSize: '14px' }}
                >
                  {d.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-2 leading-tight">
                  {d.count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ==========================================================================
   8. AppPromotionStrip Component
   ========================================================================== */
function AppPromotionStrip() {
  return (
    <div className="container max-w-6xl mb-16">
      <div className="bg-[var(--color-white)] rounded-3xl border border-[var(--color-border)] p-6 md:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-20 h-36 bg-slate-800 rounded-xl border-[3px] border-slate-900 relative shadow-lg flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-slate-600 rounded-full absolute top-1 left-1/2 -translate-x-1/2"></div>
            <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center p-1 overflow-hidden">
              <div className="bg-[var(--color-primary)] text-white font-black text-[9px] p-1 rounded text-center w-full">
                Twin Brothers
              </div>
            </div>
            <div className="w-4 h-4 bg-slate-900 border rounded-full absolute bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>

          <div>
            <h3 className="font-extrabold text-lg text-[var(--color-text-primary)]">Highest-rated mobile app</h3>
            <p className="text-slate-400 text-xs font-semibold mt-1">4.6/5 stars based on 4,83,459 ratings.</p>
            
            <div className="flex items-center gap-4 mt-3 justify-center md:justify-start">
              <div className="text-[var(--color-accent)] font-extrabold text-sm">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
              </div>
              <div className="text-[10px] text-slate-400 font-bold">Trusted By 30 Million+ Customers</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Link href="/contact-us" className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] font-black text-xs py-3 px-6 rounded-lg text-center transition shadow-sm">
            GET IN TOUCH
          </Link>
          <Link href="/about-us" className="bg-slate-100 hover:bg-slate-200 font-black text-slate-700 text-xs py-3 px-6 rounded-lg text-center transition">
            KNOW MORE
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   9. SeoContentBlock Component
   ========================================================================== */
interface SeoContentBlockProps {
  isSeoExpanded: boolean;
  setIsSeoExpanded: (val: boolean) => void;
}

function SeoContentBlock({ isSeoExpanded, setIsSeoExpanded }: SeoContentBlockProps) {
  return (
    <div id="seo-content-section" className="container max-w-6xl mb-16">
      <style>{`
        #seo-content-section {
          margin-top: 30px !important;
          margin-bottom: 20px !important;
        }
        @media (min-width: 1024px) {
          #seo-content-section {
            margin-top: 60px !important;
          }
        }
      `}</style>
      <div 
        className="bg-[var(--color-white)] border border-[var(--color-border)] shadow-sm"
        style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '24px', paddingBottom: '24px', borderRadius: '16px' }}
      >
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <h3 className="font-extrabold text-[var(--color-text-primary)] text-lg md:text-2xl mb-4">
              Cheapest Deals on Budget &amp; Luxury Hotels, Verified by Twin Brothers Holidays
            </h3>
            <div className={`text-[var(--color-text-secondary)] text-xs md:text-sm font-semibold leading-relaxed space-y-3 transition-all duration-500 overflow-hidden ${isSeoExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-24 opacity-90'}`}>
              <p>
                Twin Brothers Holidays lists a verified portfolio of hotels across our destinations, from budget stays to premium resorts, so you can book with confidence and get genuine pricing with no hidden surprises. Every property is personally vetted by our team before it goes live on the platform.
              </p>
              <p>
                Our current hotel inventory is focused on Jammu &amp; Kashmir — Srinagar, Gulmarg and Pahalgam — with more destinations being added as we expand across India. Whether it&apos;s a houseboat stay on Dal Lake or a resort with mountain views, we make booking your stay simple and affordable.
              </p>
            </div>
            <button 
              type="button" 
              className="mt-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-5 py-2 text-xs font-black transition duration-300 flex items-center gap-1.5 focus:outline-none"
              style={{ borderRadius: '9999px' }}
              onClick={() => setIsSeoExpanded(!isSeoExpanded)}
            >
              <span>{isSeoExpanded ? 'Read Less' : 'Read More'}</span>
              <i className={`fa-solid ${isSeoExpanded ? 'fa-angle-up' : 'fa-angle-down'} text-[10px]`}></i>
            </button>
          </div>
          
          <div className="col-lg-5">
            <div className="rounded-3xl overflow-hidden">
              <img 
                src="/images/banner-bg.jpg" 
                alt="Luxury Villa" 
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   10. WhyBookWithUsGrid Component
   ========================================================================== */
function WhyBookWithUsGrid() {
  return (
    <div id="why-book-with-us-section" className="container max-w-6xl mb-16">
      <style>{`
        #why-book-with-us-section {
          margin-top: 30px !important;
        }
        @media (min-width: 1024px) {
          #why-book-with-us-section {
            margin-top: 60px !important;
          }
        }
      `}</style>
      <h2 className="text-3xl font-black text-center text-[var(--color-text-primary)] mb-10">Why Book Hotels With Twin Brothers Holidays?</h2>
      <div className="row g-4">
        <div className="col-lg-3 col-md-6 col-12">
          <div 
            className="bg-[var(--color-white)] px-6 border border-[var(--color-border)] text-center shadow-sm hover:shadow-md transition min-h-[170px] flex flex-col justify-center items-center"
            style={{ borderRadius: '16px', paddingTop: '12px', paddingBottom: '12px' }}
          >
            <i className="fa-solid fa-hotel text-4xl block mb-4 text-[var(--color-accent)]"></i>
            <h4 
              className="font-extrabold text-[var(--color-text-primary)] mb-2"
              style={{ fontSize: '13px' }}
            >
              Extensive Hotel Options
            </h4>
            <p className="text-slate-400 text-xs font-semibold leading-relaxed">Best hotels available for different destinations to offer you the stay of a lifetime.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <div 
            className="bg-[var(--color-white)] px-6 border border-[var(--color-border)] text-center shadow-sm hover:shadow-md transition min-h-[170px] flex flex-col justify-center items-center"
            style={{ borderRadius: '16px', paddingTop: '12px', paddingBottom: '12px' }}
          >
            <i className="fa-solid fa-wallet text-4xl block mb-4 text-[var(--color-accent)]"></i>
            <h4 
              className="font-extrabold text-[var(--color-text-primary)] mb-2"
              style={{ fontSize: '13px' }}
            >
              Savings on Hotel Booking
            </h4>
            <p className="text-slate-400 text-xs font-semibold leading-relaxed">Enjoy hotel bookings with the best offers and discounts and make your stay unforgettable.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <div 
            className="bg-[var(--color-white)] px-6 border border-[var(--color-border)] text-center shadow-sm hover:shadow-md transition min-h-[170px] flex flex-col justify-center items-center"
            style={{ borderRadius: '16px', paddingTop: '12px', paddingBottom: '12px' }}
          >
            <i className="fa-solid fa-star-half-stroke text-4xl block mb-4 text-[var(--color-accent)]"></i>
            <h4 
              className="font-extrabold text-[var(--color-text-primary)] mb-2"
              style={{ fontSize: '13px' }}
            >
              Hotel Ratings
            </h4>
            <p className="text-slate-400 text-xs font-semibold leading-relaxed">All our hotels have good ratings on Trip Advisor and are recommended by users.</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <div 
            className="bg-[var(--color-white)] px-6 border border-[var(--color-border)] text-center shadow-sm hover:shadow-md transition min-h-[170px] flex flex-col justify-center items-center"
            style={{ borderRadius: '16px', paddingTop: '12px', paddingBottom: '12px' }}
          >
            <i className="fa-solid fa-umbrella-beach text-4xl block mb-4 text-[var(--color-accent)]"></i>
            <h4 
              className="font-extrabold text-[var(--color-text-primary)] mb-2"
              style={{ fontSize: '13px' }}
            >
              Best Price
            </h4>
            <p className="text-slate-400 text-xs font-semibold leading-relaxed">Get excellent hotels/resorts at the best prices to pamper your desires.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   11. FaqAccordion Component
   ========================================================================== */
interface FaqAccordionProps {
  faqs: FAQ[];
  openFaq: number | null;
  setOpenFaq: (val: number | null) => void;
}

function FaqAccordion({ faqs, openFaq, setOpenFaq }: FaqAccordionProps) {
  return (
    <div id="faq-section" className="container max-w-4xl mb-16">
      <style>{`
        #faq-section {
          margin-top: 30px !important;
        }
        @media (min-width: 1024px) {
          #faq-section {
            margin-top: 60px !important;
          }
        }
      `}</style>
      <h2 className="text-2xl font-black text-center text-[var(--color-text-primary)] mb-8">FAQ's</h2>
      <div className="bg-[var(--color-white)] rounded-2xl border border-[var(--color-border)] shadow-sm p-4 space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b last:border-b-0 pb-2 last:pb-0">
            <button 
              type="button"
              className="w-full text-left py-3 font-extrabold text-slate-700 flex justify-between items-center hover:text-[var(--color-accent)] transition text-sm focus:outline-none"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenFaq(openFaq === index ? null : index);
                }
              }}
            >
              <span>{faq.q}</span>
              <span className={`text-[var(--color-accent)] font-black text-lg transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}>
                {openFaq === index ? '−' : '+'}
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed font-semibold pb-2">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   Main HotelPage Component
   ========================================================================== */
export default function HotelPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [offers, setOffers] = useState<ExclusiveOffer[]>([]);
  const [popularCities, setPopularCities] = useState<Destination[]>([]);
  const [choiceHotels, setChoiceHotels] = useState<Hotel[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Srinagar');
  const [searchLocation, setSearchLocation] = useState('Srinagar');
  const [isLoading, setIsLoading] = useState(true);

  // Date and Room/Guest States (Using multiple room list as per PRD/screenshot request)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [checkInDate, setCheckInDate] = useState(formatDateString(today));
  const [checkOutDate, setCheckOutDate] = useState(formatDateString(tomorrow));
  
  // Multiple rooms storage
  const [roomsList, setRoomsList] = useState<{ adults: number; children: number; childAges: number[] }[]>([{ adults: 2, children: 0, childAges: [] }]);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // SEO Expand State
  const [isSeoExpanded, setIsSeoExpanded] = useState(false);

  useEffect(() => {
    fetchHotels();
    fetchOffers();
    fetchChoiceHotels();
    fetchPopularCities();
  }, []);

  const fetchChoiceHotels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels.php?featured=1`);
      const data = await res.json();
      if (data.status === 'success') {
        setChoiceHotels(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/offers.php?page=hotel`);
      const data = await res.json();
      if (data.status === 'success') {
        setOffers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPopularCities = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels.php?cities=1`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setPopularCities(
          data.data.map((c: { city: string; hotel_count: string; sample_image?: string }) => ({
            name: c.city,
            count: `${c.hotel_count} ${Number(c.hotel_count) === 1 ? 'Hotel' : 'Hotels'}`,
            img: c.sample_image ? resolveAssetUrl(c.sample_image) : '/images/default-dest.jpg',
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hotels.php`);
      const data = await res.json();
      if (data.status === 'success') {
        const list = data.data || [];
        setHotels(list);
        
        // Initial filter by default location
        const filtered = list.filter((h: Hotel) =>
          (h.location || '').toLowerCase().includes('srinagar')
        );
        setFilteredHotels(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchLocation.trim();
    
    // Extract unique locations from database hotels list
    const uniqueDbLocations = Array.from(
      new Set(hotels.map(hotelSearchLocation).filter(Boolean))
    );

    // Check exact matches
    const matchedLoc = uniqueDbLocations.find(
      (loc) => loc.toLowerCase() === trimmed.toLowerCase()
    );
    const matchedH = hotels.find(
      (h) => h.name.toLowerCase() === trimmed.toLowerCase()
    );

    let finalQuery = searchLocation;
    if (matchedLoc) {
      finalQuery = matchedLoc;
    } else if (matchedH) {
      finalQuery = matchedH.name;
    } else {
      // Try to auto-select the first suggestion
      const matchedL = uniqueDbLocations.filter((loc) =>
        loc.toLowerCase().includes(trimmed.toLowerCase())
      );
      const matchedHot = hotels.filter((h) =>
        h.name.toLowerCase().includes(trimmed.toLowerCase())
      );
      if (matchedL.length > 0) {
        finalQuery = matchedL[0];
      } else if (matchedHot.length > 0) {
        finalQuery = matchedHot[0].name;
      }
    }

    router.push(`/hotel/list?location=${encodeURIComponent(finalQuery)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&rooms=${encodeURIComponent(JSON.stringify(roomsList))}`);
  };

  const handleQuickLocationFilter = (loc: string) => {
    router.push(`/hotel/list?location=${encodeURIComponent(loc)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&rooms=${encodeURIComponent(JSON.stringify(roomsList))}`);
  };

  return (
    <div className="bg-[#f5f6f9] min-h-screen text-slate-800 font-sans pb-16">
      
      {/* 3.1 Hero + Search Widget */}
      <HotelSearchHero
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        checkInDate={checkInDate}
        setCheckInDate={setCheckInDate}
        checkOutDate={checkOutDate}
        setCheckOutDate={setCheckOutDate}
        roomsList={roomsList}
        setRoomsList={setRoomsList}
        handleSearchSubmit={handleSearchSubmit}
        hotels={hotels}
      />


      {/* 3.3 Exclusive Offers Carousel */}
      <ExclusiveOffersSection offers={offers} />

      {/* 3.4 Hotels Of Choice Carousel */}
      <HotelsOfChoiceCarousel
        choiceHotelsList={choiceHotels}
      />


      {/* 3.6 Popular Destinations Grid — real cities we actually have hotels in */}
      {popularCities.length > 0 && (
        <PopularDestinationsGrid
          destinations={popularCities}
          handleQuickLocationFilter={handleQuickLocationFilter}
        />
      )}



      {/* 3.10 Why Book Hotels With Us */}
      <WhyBookWithUsGrid />

      {/* 3.11 FAQ Accordion */}
      <FaqAccordion
        faqs={hotelData.faqs}
        openFaq={openFaq}
        setOpenFaq={setOpenFaq}
      />

      {/* 3.9 SEO Content Block */}
      <SeoContentBlock 
        isSeoExpanded={isSeoExpanded} 
        setIsSeoExpanded={setIsSeoExpanded} 
      />

    </div>
  );
}
