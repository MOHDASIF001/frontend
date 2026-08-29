'use client';

import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const busStops = [
  { city: 'Delhi', terminal: 'ISBT Kashmiri Gate / Anand Vihar' },
  { city: 'Srinagar', terminal: 'TRC Bus Stand / Batamaloo' },
  { city: 'Jammu', terminal: 'General Bus Stand Jammu Tawi' },
  { city: 'Manali', terminal: 'Private Bus Stand Manali' },
  { city: 'Shimla', terminal: 'ISBT Tutikandi Shimla' },
  { city: 'Amritsar', terminal: 'ISBT GT Road Amritsar' },
  { city: 'Chandigarh', terminal: 'ISBT Sector 43 Chandigarh' },
  { city: 'Mumbai', terminal: 'Bandra / Borivali Bus Station' },
  { city: 'Bengaluru', terminal: 'Majestic Bus Stand / Kempegowda' },
  { city: 'Goa', terminal: 'Panjim Bus Stand / Mapusa' },
  { city: 'Ahmedabad', terminal: 'Gita Mandir Bus Terminal' },
  { city: 'Pune', terminal: 'Swargate / Shivaji Nagar' },
  { city: 'Jaipur', terminal: 'Sindhi Camp Bus Stand' },
  { city: 'Lucknow', terminal: 'Alambagh Bus Terminal' },
];

// Helper to format Date string as DD-MM-YYYY
const formatDateStr = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

// Custom Professional React Calendar Dropdown Component
const ProfessionalCalendarDropdown = ({
  selectedDateStr,
  onSelectDate,
  onClose,
}: {
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onClose: () => void;
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (selectedDateStr) {
      const parts = selectedDateStr.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, 1);
      }
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 min-w-[300px] text-slate-800 animate-in fade-in duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Month Nav */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 font-normal transition cursor-pointer"
        >
          ‹
        </button>
        <span className="font-semibold text-sm text-slate-900">
          {monthNames[month]} {year}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 font-normal transition cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-[10px] font-normal text-slate-400 uppercase">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dateObj, idx) => {
          if (!dateObj) return <div key={idx} className="h-8 w-8" />;

          const isPast = dateObj < today;
          const formatted = formatDateStr(dateObj);
          const isSelected = formatted === selectedDateStr;
          const isToday = dateObj.getTime() === today.getTime();

          return (
            <button
              key={idx}
              type="button"
              disabled={isPast}
              onClick={() => {
                onSelectDate(formatted);
                onClose();
              }}
              className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-normal transition cursor-pointer ${isPast
                ? 'text-slate-300 cursor-not-allowed opacity-40'
                : isSelected
                  ? 'bg-[#ff8126] text-white shadow-md font-bold'
                  : isToday
                    ? 'bg-blue-50 text-[#ff8126] border border-[#ff8126]'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
            >
              {dateObj.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Mock bus list dataset matching EaseMyTrip structure
const allBuses = [
  {
    id: 'bus-101',
    operator: 'Deltin Travels Pvt Ltd',
    busType: '2+1, Bharat Benz AC Sleeper with Biotoilet, AC, ...',
    acType: 'AC',
    seatCategory: 'Sleeper',
    rating: 4.5,
    seatsLeft: 33,
    departTime: '18:15',
    departCity: 'Delhi',
    duration: '18h 30m',
    arrivalTime: '12:45',
    arrivalCity: 'Srinagar',
    price: 768,
    gpsEnabled: true,
    boardingPoints: ['ISBT Kashmiri gate 47 -', 'Majnu Ka Tila'],
    droppingPoints: ['TRC Bus Stand Srinagar', 'Lal Chowk'],
    amenities: ['Wi-Fi', 'Biotoilet', 'Charging Point', 'Blanket', 'Water Bottle'],
  },
  {
    id: 'bus-102',
    operator: 'Laxmi Holidays Pvt Ltd',
    busType: '2+1, Bharath benz GliderZ premium A/C sleeper (2+1)',
    acType: 'AC',
    seatCategory: 'Sleeper',
    rating: 4.5,
    seatsLeft: 34,
    departTime: '15:30',
    departCity: 'Delhi',
    duration: '19h 00m',
    arrivalTime: '10:30',
    arrivalCity: 'Srinagar',
    price: 1200,
    gpsEnabled: true,
    boardingPoints: ['ISBT Kashmiri gate 47 -', 'Anand Vihar ISBT'],
    droppingPoints: ['TRC Bus Stand Srinagar', 'Batamaloo'],
    amenities: ['Wi-Fi', 'Charging Point', 'Blanket', 'Reading Light', 'Live Tracking'],
  },
  {
    id: 'bus-103',
    operator: 'Zingbus Special Express',
    busType: '2+1, Volvo AC Sleeper (2+1) with Free Wi-Fi & Snacks',
    acType: 'AC',
    seatCategory: 'Sleeper',
    rating: 4.8,
    seatsLeft: 19,
    departTime: '19:00',
    departCity: 'Delhi',
    duration: '17h 45m',
    arrivalTime: '12:45',
    arrivalCity: 'Srinagar',
    price: 899,
    gpsEnabled: true,
    boardingPoints: ['Majnu Ka Tila', 'Dhaula Kuan'],
    droppingPoints: ['TRC Bus Stand Srinagar'],
    amenities: ['Wi-Fi', 'Snacks', 'Charging Point', 'Blanket', 'Live Tracking'],
  },
  {
    id: 'bus-104',
    operator: 'Kashmir Tourism Travels',
    busType: '2+1, Multi-Axle Luxury AC Sleeper Volvo',
    acType: 'AC',
    seatCategory: 'Sleeper',
    rating: 4.6,
    seatsLeft: 15,
    departTime: '20:30',
    departCity: 'Delhi',
    duration: '16h 30m',
    arrivalTime: '13:00',
    arrivalCity: 'Srinagar',
    price: 1150,
    gpsEnabled: false,
    boardingPoints: ['ISBT Kashmiri gate 47 -'],
    droppingPoints: ['Lal Chowk'],
    amenities: ['AC', 'Charging Point', 'Blanket'],
  },
  {
    id: 'bus-105',
    operator: 'TwinB Express Seater',
    busType: '2+2, Non-AC Executive Seater (2+2)',
    acType: 'Non AC',
    seatCategory: 'Seater',
    rating: 4.3,
    seatsLeft: 42,
    departTime: '21:15',
    departCity: 'Delhi',
    duration: '17h 15m',
    arrivalTime: '14:30',
    arrivalCity: 'Srinagar',
    price: 650,
    gpsEnabled: false,
    boardingPoints: ['Anand Vihar ISBT', 'Dhaula Kuan'],
    droppingPoints: ['Batamaloo'],
    amenities: ['Charging Point'],
  },
  {
    id: 'bus-106',
    operator: 'Maharani Volvo Travels',
    busType: '2+1, Bharat Benz AC Sleeper Premium',
    acType: 'AC',
    seatCategory: 'Sleeper',
    rating: 4.7,
    seatsLeft: 22,
    departTime: '16:30',
    departCity: 'Delhi',
    duration: '18h 30m',
    arrivalTime: '11:00',
    arrivalCity: 'Srinagar',
    price: 1000,
    gpsEnabled: true,
    boardingPoints: ['Majnu Ka Tila'],
    droppingPoints: ['TRC Bus Stand Srinagar'],
    amenities: ['Wi-Fi', 'AC', 'Charging Point', 'Live Tracking'],
  },
];

function BusListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial params
  const initialFrom = searchParams.get('from') || 'Delhi';
  const initialTo = searchParams.get('to') || 'Srinagar';
  const initialDate = searchParams.get('date') || '06-08-2026';

  // Search input state in top bar
  const [sourceCity, setSourceCity] = useState(initialFrom);
  const [destCity, setDestCity] = useState(initialTo);
  const [travelDate, setTravelDate] = useState(initialDate);

  // Dropdown visibility states & refs
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  // Selected date pill tab
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Filter states
  const [filterGps, setFilterGps] = useState(false);
  const [filterAc, setFilterAc] = useState<string[]>([]);
  const [filterSeat, setFilterSeat] = useState<string[]>([]);
  const [boardingSearch, setBoardingSearch] = useState('');
  const [selectedBoarding, setSelectedBoarding] = useState<string[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);

  // Seat map modal selection
  const [activeSeatModalBus, setActiveSeatModalBus] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeCardTab, setActiveCardTab] = useState<{ busId: string; tab: 'boarding' | 'cancellation' } | null>(null);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>('');
  const [seatPriceFilter, setSeatPriceFilter] = useState<string>('all');
  const [modalPointTab, setModalPointTab] = useState<'boarding' | 'dropping'>('boarding');

  // Sort State
  const [sortBy, setSortBy] = useState<'price' | 'depart' | 'duration' | 'rating'>('price');

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setFromOpen(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setToOpen(false);
      }
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Submission
  const handleTopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bus/list?from=${encodeURIComponent(sourceCity)}&to=${encodeURIComponent(destCity)}&date=${encodeURIComponent(travelDate)}`);
  };

  // Swap Source and Dest
  const handleSwap = () => {
    const temp = sourceCity;
    setSourceCity(destCity);
    setDestCity(temp);
  };

  // Filtered bus stops for dropdowns
  const filteredFromStops = busStops.filter(
    (b) =>
      b.city.toLowerCase().includes(fromSearch.toLowerCase()) ||
      b.terminal.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToStops = busStops.filter(
    (b) =>
      b.city.toLowerCase().includes(toSearch.toLowerCase()) ||
      b.terminal.toLowerCase().includes(toSearch.toLowerCase())
  );

  // Horizontal Date Scroll Ref
  const datePillContainerRef = useRef<HTMLDivElement>(null);

  const scrollPillsLeft = () => {
    if (datePillContainerRef.current) {
      datePillContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollPillsRight = () => {
    if (datePillContainerRef.current) {
      datePillContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  // Dynamic Real Date Pills Generator (21 Days starting from today)
  const datePills = useMemo(() => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const list = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${day}-${month}-${year}`;

      const monthName = monthNames[d.getMonth()];
      const dayName = dayNames[d.getDay()];
      const shortDate = `${monthName} ${day}`;

      list.push({ dateStr, dayName, shortDate, dateObj: d });
    }
    return list;
  }, []);

  // Formatted Selected Date String for Header
  const selectedDateDisplay = useMemo(() => {
    const pill = datePills.find(p => p.dateStr === selectedDate);
    if (pill) {
      return `${pill.dayName}, ${pill.shortDate} ${pill.dateObj.getFullYear()}`;
    }
    return selectedDate;
  }, [selectedDate, datePills]);

  // Filtering Logic
  const filteredBuses = useMemo(() => {
    return allBuses.filter((b) => {
      if (filterGps && !b.gpsEnabled) return false;
      if (filterAc.length > 0 && !filterAc.includes(b.acType)) return false;
      if (filterSeat.length > 0 && !filterSeat.includes(b.seatCategory)) return false;
      if (selectedOperators.length > 0 && !selectedOperators.includes(b.operator)) return false;
      if (selectedBoarding.length > 0 && !b.boardingPoints.some(bp => selectedBoarding.includes(bp))) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'depart') return a.departTime.localeCompare(b.departTime);
      return 0;
    });
  }, [filterGps, filterAc, filterSeat, selectedOperators, selectedBoarding, sortBy]);

  // Reset Filters
  const resetFilters = () => {
    setFilterGps(false);
    setFilterAc([]);
    setFilterSeat([]);
    setBoardingSearch('');
    setSelectedBoarding([]);
    setSelectedOperators([]);
  };

  // Toggle AC filter
  const toggleAcFilter = (val: string) => {
    setFilterAc(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  // Toggle Seat type filter
  const toggleSeatFilter = (val: string) => {
    setFilterSeat(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  // Toggle Seat selection in seat map
  const toggleSeatSelect = (seatNo: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatNo) ? prev.filter(s => s !== seatNo) : [...prev, seatNo]
    );
  };

  return (
    <div className="bg-[#f4f7f9] min-h-screen font-sans text-slate-800 pb-16">

      {/* ── TOP SEARCH MODIFIED BAR (NAVY DARK BLUE WEBSITE THEME) ── */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-3.5 px-4 shadow-md sticky top-13 z-40">
        <div className="container mx-auto max-w-7xl">
          <form onSubmit={handleTopSearch} className="flex flex-wrap lg:flex-nowrap items-center gap-3">

            {/* SOURCE CITY WITH INTERACTIVE DROPDOWN */}
            <div
              ref={fromRef}
              className="flex-1 min-w-[200px] bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/20 flex flex-col justify-center relative cursor-pointer"
              onClick={() => {
                setFromOpen(!fromOpen);
                setToOpen(false);
                setCalOpen(false);
              }}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff8126]">SOURCE CITY</span>
              <input
                type="text"
                value={sourceCity}
                readOnly
                className="bg-transparent text-white font-bold text-sm outline-none placeholder-white/70 cursor-pointer"
                placeholder="From City"
              />

              {fromOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-72 overflow-y-auto p-3 text-slate-800 animate-in fade-in duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative mb-2">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs" />
                    <input
                      type="text"
                      value={fromSearch}
                      onChange={(e) => setFromSearch(e.target.value)}
                      placeholder="Search departure city..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#ff8126]"
                    />
                  </div>
                  <div className="space-y-1">
                    {filteredFromStops.map((stop, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSourceCity(stop.city);
                          setFromOpen(false);
                        }}
                        className="p-2 hover:bg-orange-50 rounded-lg cursor-pointer flex items-center justify-between text-xs transition"
                      >
                        <div className="font-bold text-slate-800">{stop.city}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{stop.terminal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SWAP ICON */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#ff8126] border border-white/30 flex items-center justify-center text-white transition shrink-0 cursor-pointer shadow-sm"
              title="Swap Cities"
            >
              <i className="fa-solid fa-right-left text-xs" />
            </button>

            {/* DESTINATION CITY WITH INTERACTIVE DROPDOWN */}
            <div
              ref={toRef}
              className="flex-1 min-w-[200px] bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/20 flex flex-col justify-center relative cursor-pointer"
              onClick={() => {
                setToOpen(!toOpen);
                setFromOpen(false);
                setCalOpen(false);
              }}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff8126]">DESTINATION CITY</span>
              <input
                type="text"
                value={destCity}
                readOnly
                className="bg-transparent text-white font-bold text-sm outline-none placeholder-white/70 cursor-pointer"
                placeholder="To City"
              />

              {toOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-72 overflow-y-auto p-3 text-slate-800 animate-in fade-in duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative mb-2">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs" />
                    <input
                      type="text"
                      value={toSearch}
                      onChange={(e) => setToSearch(e.target.value)}
                      placeholder="Search destination city..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#ff8126]"
                    />
                  </div>
                  <div className="space-y-1">
                    {filteredToStops.map((stop, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setDestCity(stop.city);
                          setToOpen(false);
                        }}
                        className="p-2 hover:bg-orange-50 rounded-lg cursor-pointer flex items-center justify-between text-xs transition"
                      >
                        <div className="font-bold text-slate-800">{stop.city}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{stop.terminal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DEPARTURE DATE WITH PROFESSIONAL CALENDAR POPUP */}
            <div
              ref={calRef}
              className="w-full sm:w-[220px] bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/20 flex flex-col justify-center relative cursor-pointer"
              onClick={() => {
                setCalOpen(!calOpen);
                setFromOpen(false);
                setToOpen(false);
              }}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff8126]">DEPARTURE DATE</span>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={travelDate}
                  readOnly
                  className="bg-transparent text-white font-bold text-sm outline-none placeholder-white/70 w-full cursor-pointer"
                  placeholder="DD-MM-YYYY"
                />
              </div>

              {calOpen && (
                <ProfessionalCalendarDropdown
                  selectedDateStr={travelDate}
                  onSelectDate={(newDate) => {
                    setTravelDate(newDate);
                    setSelectedDate(newDate);
                    setCalOpen(false);
                  }}
                  onClose={() => setCalOpen(false)}
                />
              )}
            </div>

            {/* SEARCH BUTTON (TRANSPARENT OUTLINE PILL SHAPE WITH WHITE BORDER) */}
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-2.5 bg-transparent hover:bg-[#ff8126] text-white font-bold text-sm uppercase tracking-wider border-2 border-white transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 cursor-pointer shadow-sm"
              style={{ borderRadius: '9999px' }}
            >
              SEARCH
            </button>

          </form>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="container mx-auto max-w-7xl px-4 mt-5">

        {/* ── MAIN 12-COLUMN GRID (SIDEBAR ON LEFT, CONTENT & BUS CARDS ON RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT SIDEBAR COLUMN (COL SPAN 3) ── */}
          <div className="lg:col-span-3 space-y-4">

            {/* BUSES FOUND COUNT TITLE (EXACT 20PX WITH 10PX TOP GAP) */}
            <div
              className="font-extrabold text-slate-900 leading-none"
              style={{ fontSize: '20px', marginTop: '10px' }}
            >
              {filteredBuses.length} Buses Found
            </div>

            {/* LEFT SIDEBAR FILTERS (EXACT EASEMYTRIP MATCH) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-5 sticky top-20">

              {/* FILTER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 leading-none" style={{ fontSize: '20px' }}>Filter</h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#2196f3] hover:text-[#1976d2] font-semibold transition cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* 1. BUS TYPE (AC / NON AC) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Bus Type</span>
                  <i className="fa-solid fa-chevron-up text-[10px] text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAcFilter('AC')}
                    className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer ${filterAc.includes('AC')
                      ? 'bg-blue-50/70 border-[#2196f3] text-[#2196f3] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="fa-regular fa-snowflake text-base text-slate-400" />
                    <span className="text-xs">AC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleAcFilter('Non AC')}
                    className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer ${filterAc.includes('Non AC')
                      ? 'bg-blue-50/70 border-[#2196f3] text-[#2196f3] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="fa-solid fa-fan text-base text-slate-400" />
                    <span className="text-xs">Non Ac</span>
                  </button>
                </div>
              </div>

              {/* 3. SEAT TYPE (SLEEPER / SEATER) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Seat Type</span>
                  <i className="fa-solid fa-chevron-up text-[10px] text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSeatFilter('Sleeper')}
                    className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer ${filterSeat.includes('Sleeper')
                      ? 'bg-blue-50/70 border-[#2196f3] text-[#2196f3] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="fa-solid fa-bed text-base text-slate-400" />
                    <span className="text-xs">Sleeper</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSeatFilter('Seater')}
                    className={`p-3 border flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer ${filterSeat.includes('Seater')
                      ? 'bg-blue-50/70 border-[#2196f3] text-[#2196f3] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <i className="fa-solid fa-chair text-base text-slate-400" />
                    <span className="text-xs">Seater</span>
                  </button>
                </div>
              </div>

              {/* 4. DEPARTURE TIME SLOTS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Departure</span>
                  <i className="fa-solid fa-chevron-up text-[10px] text-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Before 6 AM', icon: 'fa-regular fa-moon' },
                    { label: '6 AM - 12 PM', icon: 'fa-regular fa-sun' },
                    { label: '12 PM - 6 PM', icon: 'fa-solid fa-sun' },
                    { label: 'After 6 PM', icon: 'fa-solid fa-moon' },
                  ].map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="p-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-medium flex flex-col items-center gap-1 transition text-center cursor-pointer"
                      style={{ borderRadius: '12px' }}
                    >
                      <i className={`${slot.icon} text-sm text-slate-400`} />
                      <span>{slot.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN (COL SPAN 9) ── */}
          <div className="lg:col-span-9 space-y-4">

            {/* ROUTE INFO & RECOMMENDED TOGGLE (WITH TOP 10PX SPACING) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-[10px]">
              <div className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>{sourceCity}</span>
                <span className="text-slate-400">→</span>
                <span>{destCity}</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-slate-600 font-medium text-xs">{selectedDateDisplay}</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>Recommended</span>
                <div className="w-9 h-5 bg-slate-300 rounded-full p-0.5 cursor-pointer relative">
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>

            {/* DYNAMIC HORIZONTAL DATE SELECTION PILLS WITH REAL SCROLL */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex items-center gap-1">
              <button
                type="button"
                onClick={scrollPillsLeft}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 shrink-0 cursor-pointer transition"
                title="Scroll Previous Dates"
              >
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>

              <div
                ref={datePillContainerRef}
                className="flex items-center gap-1.5 flex-1 overflow-x-auto py-0.5 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {datePills.map((p) => {
                  const isSel = selectedDate === p.dateStr;
                  return (
                    <button
                      key={p.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(p.dateStr);
                        setTravelDate(p.dateStr);
                      }}
                      className={`flex-1 min-w-[115px] py-2 px-2.5 rounded-lg text-center transition-all cursor-pointer shrink-0 ${isSel
                        ? 'bg-[#fffbe6] border-2 border-[#ffe58f] text-slate-900 shadow-sm font-bold'
                        : 'hover:bg-slate-50 border border-transparent text-slate-600'
                        }`}
                    >
                      <span className="text-[11px] font-bold block leading-tight">{p.shortDate}</span>
                      <span className={`text-[10px] block font-normal leading-tight ${isSel ? 'text-[#ff8126] font-semibold' : 'text-slate-400'}`}>{p.dayName}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={scrollPillsRight}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 shrink-0 cursor-pointer transition"
                title="Scroll Next Dates"
              >
                <i className="fa-solid fa-chevron-right text-xs" />
              </button>
            </div>

            {/* BUS CARDS LIST */}
            {filteredBuses.map((bus, idx) => (
              <React.Fragment key={bus.id}>

                {/* PROMO BANNER BEFORE CARD 3 */}
                {idx === 2 && (
                  <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-black text-white rounded-2xl overflow-hidden shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#ff8126] text-slate-900 font-black text-xs px-3 py-1 rounded uppercase tracking-wider">
                        AZADI SALE
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base">Get Flat 10% OFF* on Bus Bookings</h4>
                        <p className="text-xs text-slate-300">Use Code: <span className="font-mono text-amber-400 font-bold">TWINAZADI</span></p>
                      </div>
                    </div>
                    <Link
                      href="/bus"
                      className="bg-[#ff8126] hover:bg-[#e06d19] text-white font-bold text-xs px-5 py-2 rounded-full shadow-md transition shrink-0 no-underline"
                      style={{ textDecoration: 'none' }}
                    >
                      CLAIM OFFER →
                    </Link>
                  </div>
                )}

                {/* BUS CARD ITEM (MATCHING SCREENSHOT PIXEL-TO-PIXEL) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-3">

                  {/* TOP ROW: OPERATOR, TIMELINE & PRICE/BUTTON */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                    {/* LEFT OPERATOR INFO */}
                    <div className="space-y-1 flex-1">
                      <div className="font-bold text-slate-900 leading-tight mb-1" style={{ fontSize: '18px' }}>{bus.operator}</div>

                      {/* SUB-TAG BADGE */}
                      <div>
                        <span className="text-[11px] text-[#d97706] bg-[#fff8e7] border border-[#fef3c7] px-2 py-0.5 rounded-md font-medium inline-block mb-1.5">
                          {bus.busType}
                        </span>
                      </div>

                      {/* RATING & SEATS LEFT */}
                      <div className="flex items-center gap-3 pt-0.5">
                        <span className="bg-[#00b562] text-white text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          ★ {bus.rating}
                        </span>
                        <span className="text-[#e67e22] text-xs font-medium flex items-center gap-1">
                          <i className="fa-solid fa-chair text-[10px]" /> {bus.seatsLeft} Seat(s) left
                        </span>
                      </div>
                    </div>

                    {/* CENTER TIMELINE */}
                    <div className="flex items-center gap-5 text-center min-w-[240px]">
                      <div>
                        <span className="text-lg font-bold text-slate-900 block leading-tight">{bus.departTime}</span>
                        <span className="text-xs text-slate-500 font-medium block mt-0.5">{bus.departCity}</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center">
                        <span className="text-xs text-slate-400 font-medium mb-1">{bus.duration}</span>
                        <div className="w-full flex items-center gap-1">
                          <div className="h-0.5 flex-1 bg-slate-200 border-dashed border-b border-slate-300" />
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2196f3]" />
                          <div className="h-0.5 flex-1 bg-slate-200 border-dashed border-b border-slate-300" />
                        </div>
                      </div>

                      <div>
                        <span className="text-lg font-bold text-slate-900 block leading-tight">{bus.arrivalTime}</span>
                        <span className="text-xs text-slate-500 font-medium block mt-0.5">{bus.arrivalCity}</span>
                      </div>
                    </div>

                    {/* RIGHT PRICE & BUTTON */}
                    <div className="text-right flex flex-col items-end min-w-[140px]">
                      <span className="text-xs text-slate-400 font-normal mb-0.5">Starting From</span>
                      <span className="text-2xl font-bold text-slate-900 mb-2">₹ {bus.price}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSeatModalBus(bus);
                          setSelectedSeats([]);
                          setSelectedBoardingPoint(bus.boardingPoints[0] || '');
                          setSelectedDroppingPoint(bus.droppingPoints[0] || '');
                        }}
                        className="bg-[#ff5722] hover:bg-[#e64a19] text-white px-6 py-2.5 font-bold text-xs shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        style={{ borderRadius: '9999px' }}
                      >
                        Select Seats
                      </button>
                    </div>

                  </div>

                  {/* BOTTOM SUB-LINKS ROW WITH DOTTED DIVIDER & INTERACTIVE EXPANDABLE PANEL */}
                  <div className="border-t border-dashed border-slate-200 pt-3 mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-6 font-medium">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCardTab(
                            activeCardTab?.busId === bus.id && activeCardTab?.tab === 'boarding'
                              ? null
                              : { busId: bus.id, tab: 'boarding' }
                          );
                        }}
                        className={`flex items-center gap-1.5 transition cursor-pointer pb-0.5 ${activeCardTab?.busId === bus.id && activeCardTab?.tab === 'boarding'
                          ? 'text-[#2196f3] font-bold border-b-2 border-[#2196f3]'
                          : 'hover:text-[#2196f3]'
                          }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2196f3] inline-block" /> Boarding & Dropping Point
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveCardTab(
                            activeCardTab?.busId === bus.id && activeCardTab?.tab === 'cancellation'
                              ? null
                              : { busId: bus.id, tab: 'cancellation' }
                          );
                        }}
                        className={`flex items-center gap-1.5 transition cursor-pointer pb-0.5 ${activeCardTab?.busId === bus.id && activeCardTab?.tab === 'cancellation'
                          ? 'text-[#2196f3] font-bold border-b-2 border-[#2196f3]'
                          : 'hover:text-[#2196f3]'
                          }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2196f3] inline-block" /> Cancellation Policy
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE TAB PANEL (MATCHING SCREENSHOT PIXEL-TO-PIXEL) */}
                  {activeCardTab?.busId === bus.id && (
                    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 mt-3 animate-in fade-in duration-200">
                      {activeCardTab.tab === 'boarding' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* BOARDING POINTS COLUMN */}
                          <div>
                            <div className="font-bold text-slate-900 mb-2.5" style={{ fontSize: '16px' }}>
                              Boarding Points
                            </div>
                            <ul className="space-y-2 text-xs text-slate-700 font-medium">
                              {bus.boardingPoints.map((pt: string, pIdx: number) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-1.5 shrink-0" />
                                  <span>
                                    <span className="font-bold text-slate-900">({bus.departTime})</span> {pt}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* DROPPING POINTS COLUMN */}
                          <div className="md:border-l border-slate-200 md:pl-6">
                            <div className="font-bold text-slate-900 mb-2.5" style={{ fontSize: '16px' }}>
                              Dropping Points
                            </div>
                            <ul className="space-y-2 text-xs text-slate-700 font-medium">
                              {bus.droppingPoints.map((pt: string, pIdx: number) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-1.5 shrink-0" />
                                  <span>
                                    <span className="font-bold text-slate-900">({bus.arrivalTime})</span> {pt}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeCardTab.tab === 'cancellation' && (
                        <div className="space-y-3">
                          <div className="font-bold text-slate-900 mb-2.5" style={{ fontSize: '16px' }}>
                            Cancellation & Refund Policy
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                                  <th className="py-2">Cancellation Time</th>
                                  <th className="py-2 text-right">Refund Percentage</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200/60 text-slate-700 font-medium">
                                <tr>
                                  <td className="py-2">Before 24 hours of departure</td>
                                  <td className="py-2 text-right font-bold text-emerald-600">90% Refund</td>
                                </tr>
                                <tr>
                                  <td className="py-2">Between 12 to 24 hours of departure</td>
                                  <td className="py-2 text-right font-bold text-amber-600">50% Refund</td>
                                </tr>
                                <tr>
                                  <td className="py-2">Within 12 hours of departure</td>
                                  <td className="py-2 text-right font-bold text-rose-600">0% (No Refund)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </React.Fragment>
            ))}

          </div>

        </div>

      </div>

      {/* ── SEAT SELECTION POPUP MODAL (EXACT EASEMYTRIP MATCH) ── */}
      {activeSeatModalBus && (
        <div
          className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-[99999] flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setActiveSeatModalBus(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[1020px] max-h-[94vh] overflow-hidden relative text-slate-800 my-auto flex flex-col animate-in zoom-in-95 duration-150 z-[100000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON AT TOP RIGHT CORNER */}
            <button
              type="button"
              onClick={() => setActiveSeatModalBus(null)}
              className="absolute top-3.5 right-4 bg-slate-900 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition shadow-md z-20 cursor-pointer"
              title="Close"
            >
              ✕
            </button>

            {/* MODAL TOP HEADER */}
            <div className="bg-slate-50 border-b border-slate-200 p-3.5 space-y-1.5 pr-14 shrink-0">
              {/* ROUTE & BUS SUMMARY LINE */}
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                <span>{sourceCity} → {destCity}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-medium">{selectedDateDisplay}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-900 font-bold">{activeSeatModalBus.operator}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-normal">{activeSeatModalBus.busType}</span>
              </div>

              {/* STEP INDICATOR LINE (LEFT & RIGHT ALIGNED) */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-700 pt-0.5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-5 h-5 rounded-full bg-[#00b562] text-white flex items-center justify-center text-[11px] font-bold">1</span>
                    <span>Select Your Seat</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-normal">
                    <i className="fa-solid fa-circle-info text-xs" />
                    <span>Seat information</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-600 pr-2">
                  <span className="w-5 h-5 rounded-full bg-[#00b562] text-white flex items-center justify-center text-[11px] font-bold">2</span>
                  <span>Select Boarding And Dropping Point</span>
                </div>
              </div>
            </div>

            {/* MODAL BODY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-5 overflow-hidden flex-1">

              {/* LEFT COLUMN: SEAT MAP & DECKS (SPAN 8) */}
              <div className="lg:col-span-8 space-y-3 flex flex-col overflow-hidden">

                {/* LEGEND BADGES BOX */}
                <div className="bg-[#f1f4f8] rounded-xl p-2.5 flex items-center justify-around text-xs font-medium text-slate-700 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded border-2 border-pink-400 bg-white inline-block" />
                    <span>Ladies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#3cc89c] inline-block" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded border border-slate-300 bg-white inline-block" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#c4c4c4] inline-block" />
                    <span>Booked</span>
                  </div>
                </div>

                {/* SEAT LAYOUT DECKS SIDE BY SIDE (BACKEND READY DYNAMIC SEAT RENDERER WITH GUARANTEED SCROLLING) */}
                {(() => {
                  const isHybrid = activeSeatModalBus?.busType?.toLowerCase().includes('seater') || activeSeatModalBus?.busType?.toLowerCase().includes('executive');

                  const layout = isHybrid ? {
                    lowerDeck: {
                      left: [
                        { id: 'SL1', type: 'sleeper', price: '1749' },
                        { id: 'SL2', type: 'sleeper', price: '1749' },
                        { id: 'SL3', type: 'sleeper', price: '1749' },
                        { id: 'SL4', type: 'sleeper', price: '1749' },
                        { id: 'SL5', type: 'sleeper', price: '1749' },
                        { id: 'SL6', type: 'sleeper', price: '1749' },
                        { id: 'SL7', type: 'sleeper', price: '1749' },
                        { id: 'SL8', type: 'sleeper', price: '1749' },
                      ],
                      right: [
                        { id: '1A', type: 'seater', price: '768', booked: true }, { id: '1B', type: 'seater', price: '768', booked: true },
                        { id: '2A', type: 'seater', price: '768', booked: true }, { id: '2B', type: 'seater', price: '768', booked: true },
                        { id: '3A', type: 'seater', price: '768' }, { id: '3B', type: 'seater', price: '768' },
                        { id: '4A', type: 'seater', price: '768' }, { id: '4B', type: 'seater', price: '768', booked: true },
                        { id: '5A', type: 'seater', price: '768', booked: true }, { id: '5B', type: 'seater', price: '768', booked: true },
                        { id: '6A', type: 'seater', price: '768' }, { id: '6B', type: 'seater', price: '768' },
                        { id: '7A', type: 'seater', price: '768' }, { id: '7B', type: 'seater', price: '768' },
                        { id: '8A', type: 'seater', price: '768' }, { id: '8B', type: 'seater', price: '768' },
                      ],
                    },
                    upperDeck: {
                      left: [
                        { id: 'SU1', type: 'sleeper', price: '1421' },
                        { id: 'SU2', type: 'sleeper', price: '1421' },
                        { id: 'SU3', type: 'sleeper', price: '1421' },
                        { id: 'SU4', type: 'sleeper', price: '1421', booked: true },
                        { id: 'SU5', type: 'sleeper', price: '1421' },
                        { id: 'SU6', type: 'sleeper', price: '1421' },
                        { id: 'SU7', type: 'sleeper', price: '1421' },
                        { id: 'SU8', type: 'sleeper', price: '1421' },
                      ],
                      right: [
                        { id: 'DU1', type: 'sleeper', price: '1294' }, { id: 'DU2', type: 'sleeper', price: '1294' },
                        { id: 'DU3', type: 'sleeper', price: '1294', booked: true }, { id: 'DU4', type: 'sleeper', price: '1294', booked: true },
                        { id: 'DU5', type: 'sleeper', price: '1294', booked: true }, { id: 'DU6', type: 'sleeper', price: '1294' },
                        { id: 'DU7', type: 'sleeper', price: '1294' }, { id: 'DU8', type: 'sleeper', price: '1294' },
                        { id: 'DU9', type: 'sleeper', price: '1294' }, { id: 'DU10', type: 'sleeper', price: '1294' },
                        { id: 'DU11', type: 'sleeper', price: '1294' }, { id: 'DU12', type: 'sleeper', price: '1294' },
                        { id: 'DU13', type: 'sleeper', price: '1294' }, { id: 'DU14', type: 'sleeper', price: '1294' },
                        { id: 'DU15', type: 'sleeper', price: '1294' }, { id: 'DU16', type: 'sleeper', price: '1294' },
                      ],
                    },
                  } : {
                    lowerDeck: {
                      left: [
                        { id: 'SL1', type: 'sleeper', price: '1276' },
                        { id: 'SL2', type: 'sleeper', price: '1276' },
                        { id: 'SL3', type: 'sleeper', price: '1276' },
                        { id: 'SL4', type: 'sleeper', price: '1276' },
                        { id: 'SL5', type: 'sleeper', price: '1276' },
                        { id: 'SL6', type: 'sleeper', price: '1276' },
                        { id: 'SL7', type: 'sleeper', price: '1276' },
                        { id: 'SL8', type: 'sleeper', price: '1276' },
                      ],
                      right: [
                        { id: 'DL1', type: 'sleeper', price: '1238' }, { id: 'DL2', type: 'sleeper', price: '1238' },
                        { id: 'DL3', type: 'sleeper', price: '1257' }, { id: 'DL4', type: 'sleeper', price: '1257' },
                        { id: 'DL5', type: 'sleeper', price: '1257' }, { id: 'DL6', type: 'sleeper', price: '1257' },
                        { id: 'DL7', type: 'sleeper', price: '1257' }, { id: 'DL8', type: 'sleeper', price: '1257' },
                        { id: 'DL9', type: 'sleeper', price: '1257' }, { id: 'DL10', type: 'sleeper', price: '1257' },
                        { id: 'DL11', type: 'sleeper', price: '1257' }, { id: 'DL12', type: 'sleeper', price: '1257' },
                        { id: 'DL13', type: 'sleeper', price: '1257' }, { id: 'DL14', type: 'sleeper', price: '1257' },
                        { id: 'DL15', type: 'sleeper', price: '1257' }, { id: 'DL16', type: 'sleeper', price: '1257' },
                      ],
                    },
                    upperDeck: {
                      left: [
                        { id: 'SU1', type: 'sleeper', price: '1257', booked: true },
                        { id: 'SU2', type: 'sleeper', price: '1257', booked: true },
                        { id: 'SU3', type: 'sleeper', price: '1257' },
                        { id: 'SU4', type: 'sleeper', price: '1257' },
                        { id: 'SU5', type: 'sleeper', price: '1257' },
                        { id: 'SU6', type: 'sleeper', price: '1257' },
                        { id: 'SU7', type: 'sleeper', price: '1257' },
                        { id: 'SU8', type: 'sleeper', price: '1257' },
                      ],
                      right: [
                        { id: 'DU1', type: 'sleeper', price: '1214' }, { id: 'DU2', type: 'sleeper', price: '1214' },
                        { id: 'DU3', type: 'sleeper', price: '1238' }, { id: 'DU4', type: 'sleeper', price: '1238', booked: true },
                        { id: 'DU5', type: 'sleeper', price: '1238' }, { id: 'DU6', type: 'sleeper', price: '1238' },
                        { id: 'DU7', type: 'sleeper', price: '1238' }, { id: 'DU8', type: 'sleeper', price: '1238' },
                        { id: 'DU9', type: 'sleeper', price: '1238' }, { id: 'DU10', type: 'sleeper', price: '1238' },
                        { id: 'DU11', type: 'sleeper', price: '1238' }, { id: 'DU12', type: 'sleeper', price: '1238' },
                        { id: 'DU13', type: 'sleeper', price: '1238' }, { id: 'DU14', type: 'sleeper', price: '1238' },
                        { id: 'DU15', type: 'sleeper', price: '1238' }, { id: 'DU16', type: 'sleeper', price: '1238' },
                      ],
                    },
                  };

                  const renderSeat = (seat: any) => {
                    const isSelected = selectedSeats.includes(seat.id);

                    if (seat.type === 'seater') {
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.booked}
                          onClick={() => toggleSeatSelect(seat.id)}
                          className={`w-12 h-12 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center border cursor-pointer shrink-0 ${seat.booked
                              ? 'bg-[#c4c4c4] text-slate-700 border-0 cursor-not-allowed'
                              : isSelected
                                ? 'bg-[#3cc89c] text-white border-0 shadow-md'
                                : 'bg-white border-slate-300 text-slate-800 hover:border-[#2196f3]'
                            }`}
                        >
                          {!seat.booked ? (
                            <>
                              <span className={`border-b w-full pb-0.5 text-[10px] font-extrabold ${isSelected ? 'border-emerald-300' : 'border-slate-200'}`}>{seat.id}</span>
                              <span className={`text-[9px] font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>₹ {seat.price}</span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-800">{seat.id}</span>
                          )}
                        </button>
                      );
                    }

                    // Sleeper seat card
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={seat.booked}
                        onClick={() => toggleSeatSelect(seat.id)}
                        className={`w-14 h-24 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-between p-2 border cursor-pointer shrink-0 ${seat.booked
                            ? 'bg-[#c4c4c4] text-slate-700 border-0 cursor-not-allowed justify-center'
                            : isSelected
                              ? 'bg-[#3cc89c] text-white border-0 shadow-md'
                              : 'bg-white border-slate-300 text-slate-800 hover:border-[#2196f3]'
                          }`}
                      >
                        {!seat.booked ? (
                          <>
                            <span className={`border-b w-full pb-0.5 text-[11px] font-extrabold ${isSelected ? 'border-emerald-300' : 'border-slate-200'}`}>{seat.id}</span>
                            <span className={`text-[11px] font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>₹ {seat.price}</span>
                            <div className={`w-6 h-1.5 rounded-full border ${isSelected ? 'border-white bg-white/30' : 'border-slate-300'}`} />
                          </>
                        ) : (
                          <span className="text-xs font-bold text-slate-800">{seat.id}</span>
                        )}
                      </button>
                    );
                  };

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                      {/* LOWER SEAT DECK */}
                      <div className="bg-[#eef7ff] border border-[#d2eafe] rounded-2xl overflow-hidden shadow-2xs">
                        <div className="bg-[#d9ecff] py-2 px-3 text-center text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1.5 border-b border-[#d2eafe]">
                          <i className="fa-solid fa-steering-wheel text-slate-500" />
                          <span>LOWER SEAT</span>
                        </div>

                        <div className="p-3.5 flex gap-4 justify-center items-start h-[330px] overflow-y-scroll custom-blue-scrollbar">
                          <div className="flex flex-col gap-3">
                            {layout.lowerDeck.left.map(renderSeat)}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {layout.lowerDeck.right.map(renderSeat)}
                          </div>
                        </div>
                      </div>

                      {/* UPPER SEAT DECK */}
                      <div className="bg-[#eef7ff] border border-[#d2eafe] rounded-2xl overflow-hidden shadow-2xs">
                        <div className="bg-[#d9ecff] py-2 px-3 text-center text-xs font-extrabold text-slate-800 border-b border-[#d2eafe]">
                          <span>UPPER SEAT</span>
                        </div>

                        <div className="p-3.5 flex gap-4 justify-center items-start h-[330px] overflow-y-scroll custom-blue-scrollbar">
                          <div className="flex flex-col gap-3">
                            {layout.upperDeck.left.map(renderSeat)}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {layout.upperDeck.right.map(renderSeat)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* RIGHT COLUMN: BOARDING/DROPPING & CHECKOUT SUMMARY (SPAN 4) */}
              <div className="lg:col-span-4 border border-slate-200 rounded-3xl p-4 bg-white flex flex-col justify-between space-y-4">

                <div className="space-y-4">
                  {/* BOARDING / DROPPING TABS */}
                  <div className="flex items-center border-b border-slate-200 text-xs font-bold text-slate-500">
                    <button
                      type="button"
                      onClick={() => setModalPointTab('boarding')}
                      className={`flex-1 pb-2 text-center transition cursor-pointer ${modalPointTab === 'boarding'
                        ? 'text-[#2196f3] border-b-2 border-[#2196f3]'
                        : 'hover:text-slate-800'
                        }`}
                    >
                      BOARDING POINT
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalPointTab('dropping')}
                      className={`flex-1 pb-2 text-center transition cursor-pointer ${modalPointTab === 'dropping'
                        ? 'text-[#2196f3] border-b-2 border-[#2196f3]'
                        : 'hover:text-slate-800'
                        }`}
                    >
                      DROPPING POINT
                    </button>
                  </div>

                  {/* POINT RADIO CARD */}
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {(modalPointTab === 'boarding' ? activeSeatModalBus.boardingPoints : activeSeatModalBus.droppingPoints).map((pt: string, pIdx: number) => {
                      const isSel = modalPointTab === 'boarding' ? selectedBoardingPoint === pt : selectedDroppingPoint === pt;
                      return (
                        <div
                          key={pIdx}
                          onClick={() => {
                            if (modalPointTab === 'boarding') setSelectedBoardingPoint(pt);
                            else setSelectedDroppingPoint(pt);
                          }}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 text-xs ${isSel
                            ? 'bg-blue-50/40 border-[#2196f3] text-slate-900 shadow-2xs font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                        >
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-900 text-sm block">
                              {modalPointTab === 'boarding' ? activeSeatModalBus.departTime : activeSeatModalBus.arrivalTime}
                            </span>
                            <span className="text-xs text-slate-600 leading-relaxed block">{pt}</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSel ? 'border-[#2196f3] bg-white' : 'border-slate-300'
                            }`}>
                            {isSel && <div className="w-2.5 h-2.5 rounded-full bg-[#2196f3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CHECKOUT SUMMARY & CONTINUE BUTTON */}
                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <Link
                    href={`/cabs/checkout?bus=${encodeURIComponent(activeSeatModalBus.operator)}&seats=${selectedSeats.join(',')}&total=${selectedSeats.length * activeSeatModalBus.price}`}
                    className={`w-full py-3.5 rounded-full font-bold text-sm text-center block transition uppercase tracking-wider ${selectedSeats.length > 0
                      ? 'bg-[#ff5722] hover:bg-[#e64a19] text-white shadow-md cursor-pointer'
                      : 'bg-[#d3d3d3] text-white pointer-events-none'
                      }`}
                    style={{ borderRadius: '9999px', textDecoration: 'none' }}
                  >
                    Continue
                  </Link>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-slate-400 font-normal block text-[11px]">Seat Selected</span>
                      <span className="font-bold text-slate-900 text-xs">{selectedSeats.length > 0 ? selectedSeats.join(', ') : ''}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 font-normal block text-[11px]">Grand Total</span>
                      <span className="text-xl font-bold text-slate-900">
                        ₹ {selectedSeats.length * (activeSeatModalBus.price || 768)}
                      </span>
                      <a href="#" className="text-[11px] text-[#2196f3] font-semibold block hover:underline" style={{ textDecoration: 'none' }}>Fare Details</a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function BusListPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading bus results...</div>}>
      <BusListContent />
    </Suspense>
  );
}
