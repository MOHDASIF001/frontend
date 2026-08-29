'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ServiceQuickLinks from '../../components/ServiceQuickLinks';

const popularDestinations = [
  {
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    image: '/images/dest_srinagar.png',
    price: '₹999',
    duration: '8h 30m',
    busesPerDay: '45+',
    badge: '🔥 Best Seller',
    tagline: 'Gateway to Dal Lake, Gulmarg & Pahalgam'
  },
  {
    city: 'Delhi',
    state: 'NCR',
    image: '/images/dest_delhi.png',
    price: '₹750',
    duration: '5h 15m',
    busesPerDay: '120+',
    badge: 'Trending',
    tagline: 'Capital hub connecting North India'
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    image: '/images/dest_mumbai.png',
    price: '₹1,250',
    duration: '12h 00m',
    busesPerDay: '90+',
    badge: 'Popular',
    tagline: 'Coastal metropolis & economic hub'
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    image: '/images/dest_bangalore.png',
    price: '₹1,100',
    duration: '10h 45m',
    busesPerDay: '85+',
    badge: 'Express',
    tagline: 'Garden city & IT capital'
  },
  {
    city: 'Goa',
    state: 'Goa',
    image: '/images/dest_goa.png',
    price: '₹1,400',
    duration: '14h 20m',
    busesPerDay: '60+',
    badge: 'Leisure',
    tagline: 'Sun, sand beaches & nightlife'
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    image: '/images/dest_hyderabad.png',
    price: '₹950',
    duration: '9h 30m',
    busesPerDay: '75+',
    badge: 'Popular',
    tagline: 'City of pearls & rich heritage'
  },
];

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

const offers = [
  {
    tagline: 'Get Flat 10% OFF* On',
    titleOverlay: 'First Bus Booking',
    code: 'TWINFIRST',
    image: '/images/cabs_promo_banner.png',
    bgGradient: 'from-blue-950/90 via-[#0f172a]/70 to-black/85',
    description: 'Grab Flat 10% OFF* On First Bus Booking With Twin Brothers Holidays',
    validity: 'Valid Till : 31st Dec, 2026',
    brandBadge: 'TwinB Holidays',
  },
  {
    tagline: 'The Greatest Travel Deals Are Here!',
    titleOverlay: 'Azadi Travel Sale',
    code: 'TWINAZADI',
    image: '/images/cabs_promo_banner2.png',
    bgGradient: 'from-[#451a03]/90 via-slate-900/70 to-black/85',
    description: 'Celebrate The Spirit Of Freedom With Up To 10% OFF* On Bus Bookings',
    validity: 'Valid Till : 7th Aug, 2026',
    brandBadge: 'Azadi Offer',
  },
  {
    tagline: 'Enjoy Flat 10% OFF*',
    titleOverlay: 'On Bus Bookings',
    code: 'BUS10',
    image: '/images/cabs_outstation.png',
    bgGradient: 'from-[#064e3b]/90 via-slate-900/70 to-black/85',
    description: 'Book Bus Tickets For Your Preferred Route At 10% Discount',
    validity: 'Valid Till : 31st Dec, 2026',
    brandBadge: 'TwinB Holidays',
  },
  {
    tagline: 'Enjoy Flat 10% OFF*',
    titleOverlay: 'On City Land Travels Booking',
    code: 'CITY10',
    image: '/images/cabs_hourly.png',
    bgGradient: 'from-[#0c4a6e]/90 via-slate-900/70 to-black/85',
    description: 'Book City Land Travels Booking Flat 10% OFF* (Up To ₹200)',
    validity: 'Valid Till : 30th Jun, 2026',
    brandBadge: 'Express Bus',
  },
];

const routeTabs = [
  { id: 'routes', label: 'Popular Bus Routes' },
  { id: 'distance', label: 'Bus Distance' },
  { id: 'city_buses', label: 'City Buses' },
  { id: 'sleeper', label: 'Sleeper Buses' },
  { id: 'operators', label: 'Bus Operators' },
  { id: 'stand', label: 'Bus Stand to City' },
];

const routesData = [
  { city: 'Bengaluru', to: 'To: Hyderabad, Mumbai, Goa, Chennai, Pune', image: '/images/dest_bangalore.png' },
  { city: 'Hyderabad', to: 'To: Bengaluru, Mumbai, Goa, Chennai, Pune', image: '/images/dest_hyderabad.png' },
  { city: 'Pune', to: 'To: Bengaluru, Goa, Indore, Nagpur, Hyderabad', image: '/images/dest_srinagar.png' },
  { city: 'Chennai', to: 'To: Bengaluru, Coimbatore, Hyderabad, Madurai, Tirunelveli', image: '/images/dest_chennai.png' },
  { city: 'Delhi', to: 'To: Manali, Jaipur, Amritsar, Lucknow, Shimla', image: '/images/dest_delhi.png' },
  { city: 'Mumbai', to: 'To: Bengaluru, Hyderabad, Indore, Goa, Pune', image: '/images/dest_mumbai.png' },
  { city: 'Indore', to: 'To: Mumbai, Pune, Ahmedabad, Ahmednagar, Nagpur', image: '/images/dest_delhi.png' },
  { city: 'Ahmedabad', to: 'To: Porbandar, Jamnagar, Udaipur, Indore, Rajkot', image: '/images/dest_bangalore.png' },
  { city: 'Goa', to: 'To: Hyderabad, Bengaluru, Pune, Mumbai, Kolhapur', image: '/images/dest_goa.png' },
];

const faqsData = [
  {
    question: "Why should I book bus tickets with TwinBrothersHolidays.com?",
    answer: "Twin Brothers Holidays offers the lowest ticket charges, partnerships with over 3999+ bus operators, and a completely seamless, hassle-free booking experience with 24/7 customer support."
  },
  {
    question: "What are the payment methods for booking bus tickets?",
    answer: "We support a variety of secure payment options, including UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and popular digital wallets."
  },
  {
    question: "How to avail discount on bus booking with Twin Brothers Holidays?",
    answer: "You can apply active promo codes like TWINFIRST or TWINAZADI at the time of checkout to grab flat discounts and cashback on your bookings."
  },
  {
    question: "What to do if I lose my ticket?",
    answer: "Don't worry! A digital copy of your e-ticket is automatically sent via SMS and email to your registered details. You can also download it from our website using your booking reference or reach out to support."
  },
  {
    question: "How can I cancel my bus ticket at Twin Brothers Holidays?",
    answer: "You can easily cancel your booking by logging into your account, navigating to 'My Bookings', and clicking 'Cancel Ticket'. Refund amounts are credited as per the operator's cancellation policy."
  }
];

// Helper to format Date string as DD-MM-YYYY
const formatDateStr = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

// Custom Professional React Calendar Component
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
      className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 min-w-[300px] text-slate-800 animate-in fade-in duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Month Nav */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 font-normal transition"
        >
          ‹
        </button>
        <span className="font-semibold text-sm text-slate-900">
          {monthNames[month]} {year}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 font-normal transition"
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
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((dateObj, idx) => {
          if (!dateObj) {
            return <div key={idx} className="h-8" />;
          }

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
              className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-normal transition ${isPast
                ? 'text-slate-300 cursor-not-allowed opacity-40'
                : isSelected
                  ? 'bg-[#ff8126] text-white shadow-md'
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

export default function BusBookingPage() {
  const router = useRouter();
  const todayObj = new Date();
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);

  const [from, setFrom] = useState('Delhi');
  const [to, setTo] = useState('Srinagar');
  const [departStr, setDepartStr] = useState(formatDateStr(tomorrowObj));
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [activeRouteTab, setActiveRouteTab] = useState('routes');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Search filter states for dropdowns
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');

  // Dropdown visibility states
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [swapRotated, setSwapRotated] = useState(false);

  const offersContainerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

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

  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwapRotated(!swapRotated);
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const scrollOffersLeft = () => {
    if (offersContainerRef.current) {
      offersContainerRef.current.scrollBy({ left: -310, behavior: 'smooth' });
    }
  };

  const scrollOffersRight = () => {
    if (offersContainerRef.current) {
      offersContainerRef.current.scrollBy({ left: 310, behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-12 font-sans text-slate-800">

      {/* ── HERO BANNER WITH DARK NAVY BLUE GRADIENT & SERVICE ICONS NAV ── */}
      <div
        className="relative z-30 overflow-visible bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white"
        style={{ paddingTop: '80px', paddingBottom: '55px', marginBottom: '30px' }}
      >
        <div className="absolute inset-0 bg-black/25 pointer-events-none z-0" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />

        <div className="container mx-auto px-4 max-w-6xl relative z-40">

          {/* ── RESPONSIVE QUICK ACCESS SERVICE ICONS ROW MATCHING HOME ── */}
          <ServiceQuickLinks active="bus" />

          {/* Heading Right Aligned */}
          <div className="flex justify-end mb-3">
            <h1 className="font-extrabold text-white tracking-wide drop-shadow-md text-lg sm:text-xl md:text-2xl">
              Book Bus Tickets Online
            </h1>
          </div>

          {/* ── HORIZONTAL BUS SEARCH CARD ── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/bus/list?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(departStr)}`);
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 flex flex-col lg:flex-row items-stretch overflow-visible relative">

              {/* FROM SECTION */}
              <div
                ref={fromRef}
                className="flex-1 p-3.5 sm:p-4 flex items-center gap-3 relative cursor-pointer border-b lg:border-b-0 lg:border-r border-slate-200 hover:bg-slate-50/80 transition"
                onClick={() => {
                  setFromOpen(!fromOpen);
                  setToOpen(false);
                  setCalOpen(false);
                }}
              >
                <i className="fa-solid fa-bus text-slate-800 text-xl sm:text-2xl shrink-0" />
                <div className="min-w-0 flex-grow">
                  <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest block mb-0.5 select-none">
                    FROM
                  </span>
                  <span className="font-normal text-xl sm:text-2xl text-slate-900 block truncate leading-tight">
                    {from}
                  </span>
                </div>

                {/* Swap Button on Divider */}
                <button
                  type="button"
                  onClick={handleSwap}
                  className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#ff8126] items-center justify-center cursor-pointer shadow-md transition-all hover:scale-110"
                  title="Swap Cities"
                >
                  <i className={`fa-solid fa-right-left text-[11px] transition-transform duration-300 ${swapRotated ? 'rotate-180 text-[#ff8126]' : ''}`} />
                </button>

                {/* From Interactive Dropdown */}
                {fromOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-80 overflow-y-auto p-3 animate-in fade-in duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative mb-2">
                      <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Search departure city..."
                        value={fromSearch}
                        onChange={(e) => setFromSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-normal text-slate-800 focus:outline-none focus:bg-white focus:border-[#ff8126]"
                        autoFocus
                      />
                    </div>
                    <div className="text-[9px] font-normal text-slate-400 px-1 py-1 uppercase tracking-wider block mb-1">
                      Popular Bus Cities
                    </div>
                    {filteredFromStops.length === 0 ? (
                      <div className="text-xs text-slate-400 p-2 text-center">No cities found</div>
                    ) : (
                      filteredFromStops.map((b, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setFrom(b.city);
                            setFromOpen(false);
                            setFromSearch('');
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition"
                        >
                          <i className="fa-solid fa-bus text-slate-800 text-sm shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-normal text-slate-800">{b.city}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate">{b.terminal}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* TO SECTION */}
              <div
                ref={toRef}
                className="flex-1 p-3.5 sm:p-4 flex items-center gap-3 relative cursor-pointer border-b lg:border-b-0 lg:border-r border-slate-200 hover:bg-slate-50/80 transition"
                onClick={() => {
                  setToOpen(!toOpen);
                  setFromOpen(false);
                  setCalOpen(false);
                }}
              >
                <i className="fa-solid fa-bus text-slate-800 text-xl sm:text-2xl shrink-0" />
                <div className="min-w-0 flex-grow">
                  <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest block mb-0.5 select-none">
                    TO
                  </span>
                  <span className="font-normal text-xl sm:text-2xl text-slate-900 block truncate leading-tight">
                    {to}
                  </span>
                </div>

                {/* To Interactive Dropdown */}
                {toOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-80 overflow-y-auto p-3 animate-in fade-in duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative mb-2">
                      <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Search destination city..."
                        value={toSearch}
                        onChange={(e) => setToSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs font-normal text-slate-800 focus:outline-none focus:bg-white focus:border-[#ff8126]"
                        autoFocus
                      />
                    </div>
                    <div className="text-[9px] font-normal text-slate-400 px-1 py-1 uppercase tracking-wider block mb-1">
                      Popular Bus Destinations
                    </div>
                    {filteredToStops.length === 0 ? (
                      <div className="text-xs text-slate-400 p-2 text-center">No cities found</div>
                    ) : (
                      filteredToStops.map((b, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setTo(b.city);
                            setToOpen(false);
                            setToSearch('');
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition"
                        >
                          <i className="fa-solid fa-location-dot text-slate-800 text-sm shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-normal text-slate-800">{b.city}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate">{b.terminal}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* DATE SECTION WITH CUSTOM PROFESSIONAL CALENDAR */}
              <div
                ref={calRef}
                className="flex-1 p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b lg:border-b-0 border-slate-200 hover:bg-slate-50/80 transition relative cursor-pointer"
                onClick={() => {
                  setCalOpen(!calOpen);
                  setFromOpen(false);
                  setToOpen(false);
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <i className="fa-regular fa-calendar-days text-slate-800 text-xl sm:text-2xl shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest block select-none">
                        DATE
                      </span>
                      <i className="fa-solid fa-chevron-down text-[8px] text-slate-600" />
                    </div>
                    <span className="font-normal text-xl sm:text-2xl text-slate-900 block truncate leading-tight">
                      {departStr}
                    </span>
                  </div>
                </div>

                {/* Today & Tomorrow Quick Pill Buttons */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => {
                      setDepartStr(formatDateStr(todayObj));
                      setCalOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-normal transition border ${departStr === formatDateStr(todayObj)
                      ? 'bg-slate-200 border-slate-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                      }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDepartStr(formatDateStr(tomorrowObj));
                      setCalOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-normal transition border ${departStr === formatDateStr(tomorrowObj)
                      ? 'bg-slate-200 border-slate-300 text-slate-900'
                      : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                      }`}
                  >
                    Tomorrow
                  </button>
                </div>

                {/* Professional Custom React Calendar Popup */}
                {calOpen && (
                  <ProfessionalCalendarDropdown
                    selectedDateStr={departStr}
                    onSelectDate={(newDate) => setDepartStr(newDate)}
                    onClose={() => setCalOpen(false)}
                  />
                )}
              </div>

              {/* SEARCH BUTTON WITH TOP-RIGHT & BOTTOM-RIGHT BORDER RADIUS */}
              <button
                type="submit"
                className="bg-[#ff8126] hover:bg-[#e06d19] text-white font-semibold text-lg px-8 py-4 lg:py-0 flex items-center justify-center uppercase tracking-wider transition cursor-pointer shrink-0 lg:rounded-r-xl"
                style={{
                  borderTopRightRadius: '12px',
                  borderBottomRightRadius: '12px',
                }}
              >
                SEARCH
              </button>

            </div>
          </form>

        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="container mx-auto px-4 max-w-6xl space-y-12">

        {/* SECTION 1: Exclusive Offers (50% REDUCED SIZE FOR COUPON CODE TEXT: TWINAZADI, BUS10, TWINFIRST) */}
        <div className="relative group">
          <div className="text-center mb-4">
            <h2 className="text-1xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Exclusive Offers
            </h2>
          </div>

          {/* Left Carousel Arrow */}
          <button
            onClick={scrollOffersLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200 text-[#1e88e5] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer -ml-3 sm:-ml-5"
            title="Scroll Left"
          >
            <i className="fa-solid fa-arrow-left text-sm" />
          </button>

          {/* Right Carousel Arrow */}
          <button
            onClick={scrollOffersRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200 text-[#1e88e5] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer -mr-3 sm:-mr-5"
            title="Scroll Right"
          >
            <i className="fa-solid fa-arrow-right text-sm" />
          </button>

          {/* Scrollable Offers Cards Grid */}
          <div
            ref={offersContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {offers.map((offer, idx) => (
              <div
                key={idx}
                className="w-[280px] sm:w-[300px] shrink-0 bg-white rounded-lg border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Top Image Graphic Banner */}
                <div className="relative h-[115px] overflow-hidden bg-slate-900">
                  <img
                    src={offer.image}
                    alt={offer.titleOverlay}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cabs_banner_two_1784032832151.png';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${offer.bgGradient} p-3 flex flex-col justify-between text-white`} />

                  {/* Top Header Text Overlay */}
                  <div className="absolute top-2.5 left-3 right-3 flex items-start justify-between z-10">
                    <div className="max-w-[72%]">
                      <span className="text-[10px] font-medium text-slate-200 block drop-shadow leading-tight">
                        {offer.tagline}
                      </span>
                      <h5 className="text-sm sm:text-base font-extrabold text-white leading-tight drop-shadow-md">
                        {offer.titleOverlay}
                      </h5>
                    </div>

                    {/* Right Logo Badge */}
                    <div className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-slate-900 text-[9px] font-extrabold shadow-sm shrink-0">
                      {offer.brandBadge}
                    </div>
                  </div>

                  {/* Bottom Left Coupon Button (50% SIZE REDUCTION via scale and small font size to bypass browser min limits) */}
                  <div className="absolute bottom-2.5 left-3 z-10">
                    <button
                      type="button"
                      onClick={() => handleCopyCoupon(offer.code)}
                      className="bg-white/20 hover:bg-white/35 backdrop-blur-md text-white font-mono font-bold px-1.5 py-0.5 rounded border border-white/30 flex items-center gap-1 transition shadow-sm"
                      style={{
                        fontSize: '9px',
                        transform: 'scale(0.7)',
                        transformOrigin: 'left bottom',
                        display: 'inline-flex'
                      }}
                    >
                      <span className="tracking-wide">{offer.code}</span>
                      <i className="fa-regular fa-copy" style={{ fontSize: '8px' }} />
                    </button>
                  </div>
                </div>

                {/* Bottom Text Content & Action Row */}
                <div className="p-3 space-y-1 bg-white flex-grow flex flex-col justify-between">
                  <p className="text-[12px] font-normal text-slate-700 leading-tight line-clamp-2">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400 font-normal">
                      {offer.validity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCoupon(offer.code)}
                      className="font-extrabold text-slate-900 hover:text-[#ff8126] flex items-center gap-1 transition"
                    >
                      <span>{copiedCoupon === offer.code ? 'COPIED ✓' : 'BOOK NOW'}</span>
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Popular Bus Routes (Flat list direct on page background) */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Popular Bus Routes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              Explore most traveled bus routes across Jammu &amp; Kashmir and India
            </p>
          </div>

          {/* List Grid (3 columns, direct on page background) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {routesData.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setTo(item.city);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-4 p-[1px] pl-[5px] bg-white rounded-xl shadow-sm hover:shadow transition-all duration-200 group border border-slate-200/80 cursor-pointer"
              >
                {/* Rounded Route Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default-dest.jpg';
                    }}
                  />
                </div>

                {/* Route Information */}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#ff8126] transition-colors leading-tight">
                    {item.city}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1 truncate max-w-[180px] sm:max-w-none">
                    {item.to}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Centered View More Button */}
          <div className="flex justify-center mt-8">
            <button
              type="button"
              className="border border-[#ff8126] text-[#ff8126] hover:bg-[#ff8126] hover:text-white px-8 py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              View More
            </button>
          </div>
        </div>

        {/* SECTION 3: Editorial Section */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Book Bus Tickets Online with <span className="text-[#ff8126]">Twin Brothers Holidays</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Just think that you&apos;re all set for your much-awaited road trip across India and Jammu &amp; Kashmir with your loved ones, and you&apos;re starting this incredible journey by bus. It&apos;s indeed an amazing experience that everyone desires. And why not? There&apos;s something truly intriguing about setting off on a road trip.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Imagine yourself settled, capturing awe-inspiring scenes, lush greenery, vibrant cities, snow-capped peaks, and rustic villages from the window seat. From wholesome conversations with loved ones to exploring unplanned stops, you can experience it during your mesmerising journey.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 max-w-md w-full">
                <img
                  src="/images/cabs_outstation.png"
                  alt="Twin Brothers Holidays Luxury Bus Travel"
                  className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/kashmir-tour.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">
                    Comfortable Luxury Volvo &amp; AC Buses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Redefining Delight of Bus Travel with Twin Brothers Holidays */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center leading-tight">
              Redefining the Delight of Bus Travel with <span className="text-[#ff8126]">Twin Brothers Holidays</span>
            </h2>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
              <p>
                Around 570 million Indian travellers love to explore magnificent destinations via bus. This is because they seek enriching experiences that speak volumes and leave lasting impressions on the souls of travel fanatics. At Twin Brothers Holidays, your evolving requirements are paramount. Therefore, we&apos;re constantly striving to revolutionise the way Indian travellers travel.
              </p>
              <p>
                With our state-of-the-art bus ticket booking platforms and robust technologies, we bring effortless journeys to millions. In just a few clicks and simple steps, users can access a wide network of trusted bus operators, top routes, and budget-friendly fares with zero compromises. And that&apos;s not all.
              </p>
              <p>
                Through Twin Brothers Holidays, passengers from across India can unlock a world packed with premier benefits: exclusive deals, limited-time offers, real-time updates, user-friendly features and unmatched convenience. It&apos;s not just about the features that we offer, it&apos;s also about the best experiences that we believe in delivering to travellers who&apos;ve trusted us. Overall, it&apos;s more than a ticket—it&apos;s your much-awaited getaway to unbelievable travel moments that you waited for. So, why wait? Book your bus tickets online with Twin Brothers Holidays now and get ready for a mesmerising journey that moves along with you.
              </p>
            </div>
          </div>

          {/* Top Reasons to Make Bus Ticket Bookings Online */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-center leading-tight">
              Top Reasons to Make Bus Ticket Bookings Online
            </h3>

            <div className="bg-slate-50 border border-slate-200/60 p-6 sm:p-8 rounded-2xl space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                The online bus booking feature has significantly transformed the way Indians travel. From convenience to innumerable choices and cost-effectiveness, you can access them all at your fingertips. So, without any further delay, let&apos;s explore why millions of passengers prefer booking buses digitally.
              </p>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff8126] font-bold text-lg shrink-0 leading-none">•</span>
                  <div>
                    <strong className="text-slate-900 font-bold">Widest Selection of Routes, Services &amp; Features:</strong> Online platforms cover thousands of bus operators and routes across India. Compare travel duration, prices, seat availability, and amenities like onboard Wi-Fi, AC, etc.—all from the comfort of your home.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff8126] font-bold text-lg shrink-0 leading-none">•</span>
                  <div>
                    <strong className="text-slate-900 font-bold">Unmatched Booking Experience, Anytime, Anywhere:</strong> Say goodbye to long queues. Book your seat instantly, anytime, anywhere. It&apos;s fast, secure, and flexible.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 5: How to Book Bus Tickets & Why Book With Us */}
        <div className="space-y-12">
          {/* How to Book Bus Tickets with Twin Brothers Holidays? */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center leading-tight">
              How to Book Bus Tickets with <span className="text-[#ff8126]">Twin Brothers Holidays?</span>
            </h2>
            
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                At Twin Brothers Holidays, we aim to offer an effortless bus booking experience to every traveler who&apos;s looking for a memorable journey. So, here&apos;s a step-by-step procedure to book a bus online:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed list-none pl-0">
                {[
                  'Visit the Twin Brothers Holidays website or open the mobile app.',
                  'Select the "Bus" option from the home screen.',
                  'Enter your origin, destination, and travel date.',
                  'Tap on "Search" to view available buses for your route.',
                  'Choose your preferred bus and select your seat.',
                  'Fill in the passenger details and proceed with the payment.',
                  'Your e-ticket will be sent to your registered email ID and mobile number.'
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#ff8126] font-bold text-lg shrink-0 leading-none">•</span>
                    <span className="text-slate-700 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Why Book With Us? */}
          <div className="space-y-8 pt-4 border-t border-slate-100">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Why book with us?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1 */}
              <div className="space-y-3 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#ff8126] text-xl shadow-sm shrink-0">
                  <i className="fa-solid fa-ticket-simple" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Lowest Ticket Charges
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Grab huge discounts and cashbacks on your bus booking with Twin Brothers Holidays.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="space-y-3 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-blue-500 text-xl shadow-sm shrink-0">
                  <i className="fa-solid fa-users-gear" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    3999+ Bus Operators
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Leverage our partnerships with over 3999 bus operators for a hassle-free journey.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="space-y-3 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 text-xl shadow-sm shrink-0">
                  <i className="fa-regular fa-file-lines" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Seamless Booking
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Our user-friendly platform makes it easy for customers to book their bus tickets.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="space-y-3 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 text-xl shadow-sm shrink-0">
                  <i className="fa-solid fa-shield-halved" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Trusted by 20K+ Users
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    20K+ users have trusted and enjoyed our seamless bus booking service.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION 6: FAQ's Accordion */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              FAQ&apos;s
            </h2>
          </div>

          <div className="space-y-4">
            {faqsData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="border-b border-slate-100 pb-4 transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-[#ff8126] transition-colors duration-150">
                      {faq.question}
                    </span>
                    <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-250 ${isOpen ? 'rotate-180 text-[#ff8126]' : ''}`} />
                  </button>
                  
                  {/* Expanded content */}
                  <div className={`overflow-hidden transition-all duration-300 max-h-0 ${isOpen ? 'max-h-40 mt-2' : ''}`}>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
