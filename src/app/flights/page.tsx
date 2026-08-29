'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useModals } from '@/context/ModalContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { API_BASE_URL } from '../../config';
import ServiceQuickLinks from '../../components/ServiceQuickLinks';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const popularDestinations = [
  {
    city: 'Srinagar',
    code: 'SXR',
    country: 'India',
    image: '/images/dest_srinagar.png',
    price: '₹3,100',
    duration: '1h 40m',
    flightsPerWeek: '120+',
    badge: '🔥 Best Seller',
    tagline: 'Gateway to paradise, Dal Lake & Shikaras'
  },
  {
    city: 'Delhi',
    code: 'DEL',
    country: 'India',
    image: '/images/dest_delhi.png',
    price: '₹3,250',
    duration: '1h 45m',
    flightsPerWeek: '210+',
    badge: 'Trending',
    tagline: 'Heart of India, rich history & markets'
  },
  {
    city: 'Mumbai',
    code: 'BOM',
    country: 'India',
    image: '/images/dest_mumbai.png',
    price: '₹5,800',
    duration: '2h 15m',
    flightsPerWeek: '180+',
    badge: 'Popular',
    tagline: 'City of dreams, coastal beauty'
  },
  {
    city: 'Bangalore',
    code: 'BLR',
    country: 'India',
    image: '/images/dest_bangalore.png',
    price: '₹6,400',
    duration: '4h 30m (1 stop)',
    flightsPerWeek: '95+',
    badge: 'Business',
    tagline: 'Silicon valley, pleasant weather'
  },
  {
    city: 'Goa',
    code: 'GOI',
    country: 'India',
    image: '/images/dest_goa.png',
    price: '₹5,900',
    duration: '5h 10m (1 stop)',
    flightsPerWeek: '75+',
    badge: 'Leisure',
    tagline: 'Sun, sand, beaches & night life'
  },
  {
    city: 'Dubai',
    code: 'DXB',
    country: 'UAE',
    image: '/images/dest_dubai.png',
    price: '₹13,999',
    duration: '3h 50m',
    flightsPerWeek: '60+',
    badge: 'International',
    tagline: 'Skyscrapers, luxury shopping & deserts'
  },
];

const airports = [
  { city: 'Srinagar', code: 'SXR', name: 'Sheikh ul-Alam International Airport', country: 'India' },
  { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International Airport', country: 'India' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India' },
  { city: 'Jammu', code: 'IXJ', name: 'Jammu Airport', country: 'India' },
  { city: 'Leh', code: 'IXL', name: 'Kushok Bakula Rimpochee Airport', country: 'India' },
  { city: 'Bangalore', code: 'BLR', name: 'Kempegowda International Airport', country: 'India' },
  { city: 'Goa', code: 'GOI', name: 'Manohar International Airport', country: 'India' },
  { city: 'Dubai', code: 'DXB', name: 'Dubai International Airport', country: 'UAE' },
  { city: 'London', code: 'LHR', name: 'Heathrow Airport', country: 'United Kingdom' },
  { city: 'Singapore', code: 'SIN', name: 'Changi Airport', country: 'Singapore' },
];

const airlines = [
  { name: 'Air India', code: 'AI', tagline: 'Fly with Pride' },
  { name: 'IndiGo', code: '6E', tagline: 'On time, Everytime' },
  { name: 'SpiceJet', code: 'SG', tagline: 'Red. Hot. Spicy.' },
  { name: 'Vistara', code: 'UK', tagline: 'Fly the New Feeling' },
  { name: 'GoAir', code: 'G8', tagline: 'Fly Smart' },
  { name: 'Air Arabia', code: 'G9', tagline: 'Low Fares Always' },
];

const offers = [
  { title: 'Flat 15% Off on First Booking', image: '/images/offer_first_booking.png' },
  { title: 'Kashmir Flights from ₹2,999', image: '/images/offer_kashmir_flights.png' },
  { title: 'International Combo Deals', image: '/images/offer_intl_combo.png' },
  { title: 'Honeymoon Special Flights', image: '/images/offer_honeymoon_special.png' },
  { title: 'Group Booking Discounts', image: '/images/offer_group_discounts.png' },
];

const whyItems = [
  { icon: 'fa-shield-halved', title: 'Secure Booking', desc: '100% secure payment with SSL encryption.' },
  { icon: 'fa-tags', title: 'Best Price Guarantee', desc: 'We match any lower price found elsewhere.' },
  { icon: 'fa-headset', title: '24/7 Support', desc: 'Round-the-clock support from travel experts.' },
  { icon: 'fa-ticket', title: 'Instant Confirmation', desc: 'E-ticket instantly on email and WhatsApp.' },
  { icon: 'fa-rotate-left', title: 'Easy Cancellation', desc: 'Flexible cancellation across all airlines.' },
  { icon: 'fa-star', title: 'Trusted by 10,000+', desc: 'Thousands of happy travellers every year.' },
];

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

const getShortClassLabel = (label: string) => {
  if (label === 'Premium Economy') return 'Premium';
  if (label === 'Business Class') return 'Business';
  if (label === 'First Class') return 'First';
  return label;
};

const getDurationInMinutes = (durStr: string) => {
  const hMatch = durStr.match(/(\d+)h/);
  const mMatch = durStr.match(/(\d+)m/);
  const hours = hMatch ? parseInt(hMatch[1]) : 0;
  const minutes = mMatch ? parseInt(mMatch[1]) : 0;
  return hours * 60 + minutes;
};

const AirlineLogo = ({ code, name, color, isMobile = false }: { code: string, name: string, color: string, isMobile?: boolean }) => {
  const [imgError, setImgError] = useState(false);
  const sizeClass = isMobile ? "h-[22px] max-w-[54px]" : "h-7 max-w-[72px]";
  const textClass = isMobile ? "text-[8.5px]" : "text-[9.5px]";
  
  if (imgError) {
    return (
      <div 
        className={`${isMobile ? 'w-[54px] h-[22px]' : 'w-[72px] h-[28px]'} rounded flex items-center justify-center text-white ${textClass} font-black shrink-0 relative overflow-hidden select-none`}
        style={{ backgroundColor: color }}
        title={name}
      >
        <span className="relative z-10 uppercase tracking-tight">{isMobile ? code : name}</span>
      </div>
    );
  }

  return (
    <img 
      src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${code}.svg`} 
      alt={name}
      onError={() => setImgError(true)}
      className={`${sizeClass} w-auto object-contain select-none`}
    />
  );
};

export default function FlightsPage() {
  const { openModal } = useModals();
  const router = useRouter();

  // Calendar Helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDayIndex = firstDay.getDay(); // Sunday is 0, Monday is 1, etc.
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < startDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSameDay = (dateStr: string, date: Date) => {
    if (!dateStr) return false;
    const d1 = new Date(dateStr);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(date);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fare Options Drawer States
  const [selectedFlightForFare, setSelectedFlightForFare] = useState<any | null>(null);
  const [selectedFareClass, setSelectedFareClass] = useState<'value' | 'classic' | 'flex'>('value');
  const [drawerStep, setDrawerStep] = useState<'options' | 'passenger_info'>('options');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerMessage, setPassengerMessage] = useState('');
  const [isSubmittingFare, setIsSubmittingFare] = useState(false);
  const [farePhoneError, setFarePhoneError] = useState('');

  const getFarePrice = (basePrice: number, fareClass: 'value' | 'classic' | 'flex') => {
    if (fareClass === 'classic') return Math.round(basePrice * 1.1);
    if (fareClass === 'flex') return Math.round(basePrice * 1.2);
    return basePrice;
  };

  const handleFarePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPassengerPhone(val);
    if (val.length === 10) {
      setFarePhoneError('');
    }
  };

  const handleBookNowClick = (fareClass: 'value' | 'classic' | 'flex') => {
    localStorage.setItem('booking_flight', JSON.stringify(selectedFlightForFare));
    localStorage.setItem('booking_fare_class', fareClass);
    localStorage.setItem('booking_depart', depart);
    localStorage.setItem('booking_return_date', returnDate || '');
    localStorage.setItem('booking_trip_type', tripType);
    localStorage.setItem('booking_class', travelClass);
    localStorage.setItem('booking_adults', String(adults));
    localStorage.setItem('booking_children', String(children));
    localStorage.setItem('booking_infants', String(infants));
    router.push('/flights/book');
  };

  const handleFareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passengerPhone.length !== 10) {
      setFarePhoneError('Please enter a valid 10-digit number.');
      return;
    }

    setIsSubmittingFare(true);

    const price = getFarePrice(selectedFlightForFare.price, selectedFareClass);
    const messageContent = `Selected Flight: ${selectedFlightForFare.airlineName} (${selectedFlightForFare.flightNo})
Route: ${selectedFlightForFare.fromCity} (${selectedFlightForFare.fromCode}) → ${selectedFlightForFare.toCity} (${selectedFlightForFare.toCode})
Timings: ${selectedFlightForFare.departureTime} → ${selectedFlightForFare.arrivalTime} (${selectedFlightForFare.duration})
Fare Class: ${selectedFareClass.toUpperCase()} (Price: ₹${price.toLocaleString('en-IN')})
Travel Date: ${depart} ${tripType === 'round-trip' ? `| Return Date: ${returnDate}` : ''}
Cabin Class: ${travelClass}
Travellers: ${adults} Adults, ${children} Children, ${infants} Infants
Additional Requirements: ${passengerMessage}`;

    const payload = {
      name: passengerName,
      phone: passengerPhone,
      email: passengerEmail,
      service_type: 'Flight Booking',
      pickup_location: from,
      drop_location: to,
      travel_date: depart,
      travel_date_end: tripType === 'round-trip' ? returnDate : '',
      passengers: adults + children + infants,
      plan_type: `${travelClass} - ${selectedFareClass.toUpperCase()} Fare`,
      message: messageContent,
      source_page: 'nextjs_frontend_fare_drawer'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/submit_inquiry.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSelectedFlightForFare(null);
        setPassengerName('');
        setPassengerPhone('');
        setPassengerEmail('');
        setPassengerMessage('');
        router.push('/thank-you');
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmittingFare(false);
    }
  };

  const renderFareDetails = (fareClass: 'value' | 'classic' | 'flex', flightPrice: number) => {
    let checkIn = '15 Kgs';
    let cancellation = '₹4,300 Onwards';
    let dateChange = '₹3,000 Onwards';
    let meal = 'Paid Meal';
    let seat = 'Paid Seat';

    if (fareClass === 'classic') {
      checkIn = '15 Kgs';
      cancellation = '₹2,000 Onwards';
      dateChange = '₹300 Onwards';
      meal = 'Paid Meal';
      seat = 'Complimentary Standard Seat';
    } else if (fareClass === 'flex') {
      checkIn = '20 Kgs';
      cancellation = '₹1,500 Onwards';
      dateChange = '₹0 (Free Date Change)';
      meal = 'Paid Meal';
      seat = 'Complimentary Prime Seat';
    }

    return (
      <div className="space-y-1.5 mt-2.5 text-[10.5px] text-slate-600">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Baggage</div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-briefcase text-slate-400 text-[9px] w-3" />
          <span>Cabin Bag: <strong className="text-slate-800">7 Kgs</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-suitcase-rolling text-slate-400 text-[9px] w-3" />
          <span>Check In: <strong className="text-slate-800">{checkIn}</strong></span>
        </div>

        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide pt-0.5">Flexibility</div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-ban text-slate-400 text-[9px] w-3" />
          <span>Cancellation: <strong className="text-slate-800">{cancellation}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-calendar-days text-slate-400 text-[9px] w-3" />
          <span>Date Change: <strong className="text-slate-800">{dateChange}</strong></span>
        </div>

        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide pt-0.5">Seats, Meals & More</div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-chair text-slate-400 text-[9px] w-3" />
          <span>Seat: <strong className="text-slate-800">{seat}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-utensils text-slate-400 text-[9px] w-3" />
          <span>Meal: <strong className="text-slate-800">{meal}</strong></span>
        </div>
      </div>
    );
  };

  const getAirportName = (val: string) => {
    const code = val.match(/\(([^)]+)\)/)?.[1] || '';
    const airport = airports.find(a => a.code === code);
    return airport ? airport.name : '';
  };

  // Searchbar States
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [from, setFrom] = useState('Delhi (DEL)');
  const [to, setTo] = useState('Srinagar (SXR)');
  const [depart, setDepart] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [visibleFlightsCount, setVisibleFlightsCount] = useState(10);

  // Dropdown UI States
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [tripTypeOpen, setTripTypeOpen] = useState(false);
  const [cabinClassOpen, setCabinClassOpen] = useState(false);
  const [isDepartCalendarOpen, setIsDepartCalendarOpen] = useState(false);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);
  const [departActiveMonth, setDepartActiveMonth] = useState<Date>(new Date());
  const [returnActiveMonth, setReturnActiveMonth] = useState<Date>(new Date());

  // Guest counters & cabin
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');

  // Search Results States
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'best' | 'cheapest' | 'fastest'>('best');

  // Swap Icon rotation state
  const [swapRotated, setSwapRotated] = useState(false);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDay = new Date(tomorrow);
    returnDay.setDate(returnDay.getDate() + 3);

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setDepart(formatDate(tomorrow));
    setReturnDate(formatDate(returnDay));
    setDepartActiveMonth(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1));
    setReturnActiveMonth(new Date(returnDay.getFullYear(), returnDay.getMonth(), 1));
  }, []);

  const handleSwap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwapRotated(!swapRotated);
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setShowResults(true);
    setVisibleFlightsCount(10);

    const fromCity = from.split(' (')[0] || from;
    const toCity = to.split(' (')[0] || to;
    const fromCode = from.match(/\(([^)]+)\)/)?.[1] || 'DEL';
    const toCode = to.match(/\(([^)]+)\)/)?.[1] || 'SXR';

    setTimeout(() => {
      let basePrice = 3600;
      if ((fromCode === 'SXR' && toCode === 'DEL') || (fromCode === 'DEL' && toCode === 'SXR')) basePrice = 3100;
      else if ((fromCode === 'SXR' && toCode === 'BOM') || (fromCode === 'BOM' && toCode === 'SXR')) basePrice = 6200;
      else if ((fromCode === 'DEL' && toCode === 'BOM') || (fromCode === 'BOM' && toCode === 'DEL')) basePrice = 4400;
      else if ((fromCode === 'SXR' && toCode === 'BLR') || (fromCode === 'BLR' && toCode === 'SXR')) basePrice = 6900;
      else if (toCode === 'DXB' || fromCode === 'DXB') basePrice = 14800;
      else if (toCode === 'LHR' || fromCode === 'LHR') basePrice = 38500;
      else if (toCode === 'SIN' || fromCode === 'SIN') basePrice = 25000;

      let classMultiplier = 1;
      if (travelClass === 'Premium Economy') classMultiplier = 1.35;
      else if (travelClass === 'Business Class') classMultiplier = 2.4;
      else if (travelClass === 'First Class') classMultiplier = 4.2;

      const totalPassengers = adults + children + infants;
      const passengerMultiplier = totalPassengers > 0 ? totalPassengers : 1;

      const airlineOptions = [
        { name: 'Vistara', code: 'UK', logoColor: '#5f183f', rating: '4.6/5', luggage: '15kg check-in, 7kg cabin' },
        { name: 'IndiGo', code: '6E', logoColor: '#002f6c', rating: '4.5/5', luggage: '15kg check-in, 7kg cabin' },
        { name: 'Air India', code: 'AI', logoColor: '#ed1c24', rating: '4.2/5', luggage: '25kg check-in, 7kg cabin' },
        { name: 'SpiceJet', code: 'SG', logoColor: '#ff6600', rating: '3.9/5', luggage: '15kg check-in, 7kg cabin' }
      ];

      const baseTimes = [
        { dep: '06:15', arr: '07:55', duration: '1h 40m', stops: 'Non-stop' },
        { dep: '07:30', arr: '09:10', duration: '1h 40m', stops: 'Non-stop' },
        { dep: '08:45', arr: '10:30', duration: '1h 45m', stops: 'Non-stop' },
        { dep: '10:30', arr: '12:15', duration: '1h 45m', stops: 'Non-stop' },
        { dep: '11:15', arr: '13:00', duration: '1h 45m', stops: 'Non-stop' },
        { dep: '12:40', arr: '17:25', duration: '4h 45m', stops: '1 stop (via DEL)' },
        { dep: '13:50', arr: '18:35', duration: '4h 45m', stops: '1 stop (via DEL)' },
        { dep: '14:20', arr: '19:05', duration: '4h 45m', stops: '1 stop (via DEL)' },
        { dep: '15:30', arr: '20:15', duration: '4h 45m', stops: '1 stop (via BOM)' },
        { dep: '16:45', arr: '18:30', duration: '1h 45m', stops: 'Non-stop' },
        { dep: '17:50', arr: '19:30', duration: '1h 40m', stops: 'Non-stop' },
        { dep: '18:50', arr: '20:30', duration: '1h 40m', stops: 'Non-stop' },
        { dep: '19:45', arr: '21:25', duration: '1h 40m', stops: 'Non-stop' },
        { dep: '21:00', arr: '22:40', duration: '1h 40m', stops: 'Non-stop' },
        { dep: '22:15', arr: '23:55', duration: '1h 40m', stops: 'Non-stop' }
      ];

      const flightSchedules: any[] = [];
      for (let i = 0; i < 30; i++) {
        const base = baseTimes[i % baseTimes.length];
        flightSchedules.push({
          dep: base.dep,
          arr: base.arr,
          duration: base.duration,
          stops: base.stops,
          flightNo: String(800 + i * 13)
        });
      }

      const codeToCity: Record<string, string> = {
        DEL: 'Delhi', BOM: 'Mumbai', LKO: 'Lucknow', BLR: 'Bengaluru',
        GOI: 'Goa', SXR: 'Srinagar', DXB: 'Dubai', CCU: 'Kolkata',
        MAA: 'Chennai', HYD: 'Hyderabad'
      };

      const fmtTime = (totalMin: number) => {
        const h = Math.floor(totalMin / 60) % 24;
        const m = totalMin % 60;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      };
      const fmtDur = (min: number) => {
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`;
      };
      const parseDur = (dur: string) => {
        const hr = dur.match(/(\d+)\s*h/i); const mn = dur.match(/(\d+)\s*m/i);
        return (hr ? parseInt(hr[1]) : 0) * 60 + (mn ? parseInt(mn[1]) : 0);
      };
      const buildSegments = (sched: any, aln: any, fCode: string, tCode: string, fCity: string, tCity: string) => {
        if (sched.stops.toLowerCase().includes('non-stop') || !sched.stops.toLowerCase().includes('stop')) return null;
        const transitMatch = sched.stops.match(/\((?:via\s+)?([A-Z]{3})\)/i);
        const tCode2 = transitMatch ? transitMatch[1].toUpperCase() : 'LKO';
        const tCity2 = codeToCity[tCode2] || tCode2;
        const totalMin = parseDur(sched.duration);
        const s1Min = Math.round(totalMin * 0.40);
        const layMin = Math.round(totalMin * 0.20);
        const s2Min = totalMin - s1Min - layMin;
        const [depH, depM] = sched.dep.split(':').map(Number);
        const dep1M = depH * 60 + depM;
        const arr1M = dep1M + s1Min;
        const dep2M = arr1M + layMin;
        const flightNoBase = parseInt(sched.flightNo);
        return [
          { type: 'flight', airlineName: aln.name, airlineCode: aln.code,
            flightNo: `${aln.code}-${flightNoBase}`, aircraft: 'Boeing 737 (Narrow-body)',
            depTime: sched.dep, arrTime: fmtTime(arr1M),
            depCode: fCode, arrCode: tCode2, depCity: fCity, arrCity: tCity2,
            duration: fmtDur(s1Min), depTerminal: 'Terminal-1', arrTerminal: 'Terminal-3' },
          { type: 'layover', layoverDuration: fmtDur(layMin), transitCity: tCity2, transitCode: tCode2 },
          { type: 'flight', airlineName: aln.name, airlineCode: aln.code,
            flightNo: `${aln.code}-${flightNoBase + 1}`, aircraft: 'Boeing 737 (Narrow-body)',
            depTime: fmtTime(dep2M), arrTime: sched.arr,
            depCode: tCode2, arrCode: tCode, depCity: tCity2, arrCity: tCity,
            duration: fmtDur(s2Min), depTerminal: 'Terminal-3', arrTerminal: 'Terminal-2' }
        ];
      };

      const results = flightSchedules
        .filter(sched => !nonStopOnly || sched.stops === 'Non-stop')
        .map((sched, idx) => {
          const airline = airlineOptions[idx % airlineOptions.length];
          const finalPrice = Math.round(basePrice * classMultiplier * passengerMultiplier * (1 + (idx * 0.04) - (idx === 1 ? 0.03 : 0)));
          const returnSched = flightSchedules[(idx + 1) % flightSchedules.length];
          
          return {
            id: idx + 1,
            airlineName: airline.name,
            airlineCode: airline.code,
            flightNo: `${airline.code}-${sched.flightNo}`,
            logoColor: airline.logoColor,
            rating: airline.rating,
            luggage: airline.luggage,
            departureTime: sched.dep,
            arrivalTime: sched.arr,
            duration: sched.duration,
            stops: sched.stops,
            fromCode,
            toCode,
            fromCity,
            toCity,
            price: finalPrice,
            dealsCount: Math.floor(Math.random() * 8) + 8,
            co2Reduction: idx === 0 ? '7%' : idx === 1 ? '15%' : '12%',
            isSponsored: idx === 0,
            segments: buildSegments(sched, airline, fromCode, toCode, fromCity, toCity),
            returnFlight: tripType === 'round-trip' ? {
              departureTime: returnSched.dep,
              arrivalTime: returnSched.arr,
              duration: returnSched.duration,
              stops: returnSched.stops,
              flightNo: `${airline.code}-${returnSched.flightNo}`,
              fromCode: toCode,
              toCode: fromCode,
              fromCity: toCity,
              toCity: fromCity,
              segments: buildSegments(returnSched, airline, toCode, fromCode, toCity, fromCity),
            } : null
          };
        });

      setSearchResults(results);
      setIsLoading(false);
    }, 1200);
  };

  const getPassengerSummary = () => {
    const total = adults + children + infants;
    if (total === 1 && adults === 1) return '1 Adult';
    return `${total} Travellers`;
  };

  const filteredAirports = (searchVal: string) => {
    if (!searchVal) return airports;
    const lower = searchVal.toLowerCase();
    return airports.filter(
      a =>
        a.city.toLowerCase().includes(lower) ||
        a.code.toLowerCase().includes(lower) ||
        a.name.toLowerCase().includes(lower)
    );
  };

  const cheapestFlight = searchResults.length > 0 
    ? [...searchResults].sort((a, b) => a.price - b.price)[0] 
    : null;

  const fastestFlight = searchResults.length > 0 
    ? [...searchResults].sort((a, b) => getDurationInMinutes(a.duration) - getDurationInMinutes(b.duration))[0] 
    : null;

  const bestFlight = searchResults.length > 0 
    ? searchResults[0] 
    : null;

  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortBy === 'cheapest') {
      return a.price - b.price;
    }
    if (sortBy === 'fastest') {
      return getDurationInMinutes(a.duration) - getDurationInMinutes(b.duration);
    }
    if (sortBy === 'best') {
      const aStopVal = a.stops === 'Non-stop' ? 0 : 1;
      const bStopVal = b.stops === 'Non-stop' ? 0 : 1;
      if (aStopVal !== bStopVal) return aStopVal - bStopVal;
      return a.price - b.price;
    }
    return 0;
  });

  const totalPassengers = adults + children + infants;
  const passengerMultiplier = totalPassengers > 0 ? totalPassengers : 1;

  const showBackdrop = fromOpen || toOpen || guestOpen || tripTypeOpen || cabinClassOpen || isDepartCalendarOpen || isReturnCalendarOpen;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-12 font-sans text-slate-800">

      {/* ── HERO BANNER ── */}
      <div 
        className="relative z-30 overflow-visible bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white"
        style={{ paddingTop: '120px', paddingBottom: '65px', marginBottom: '30px' }}
      >
        <div className="absolute inset-0 bg-black/25 pointer-events-none z-0" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />

        {/* ── BACKDROP OVERLAY INSIDE HERO BANNER ── */}
        {showBackdrop && (
          <div 
            className="fixed inset-0 z-35 bg-transparent" 
            onClick={() => {
              setFromOpen(false);
              setToOpen(false);
              setGuestOpen(false);
              setTripTypeOpen(false);
              setCabinClassOpen(false);
              setIsDepartCalendarOpen(false);
              setIsReturnCalendarOpen(false);
              setFromSearch('');
              setToSearch('');
            }}
          />
        )}

        <div className="container mx-auto px-4 relative z-40">
          <style dangerouslySetInnerHTML={{ __html: `
            .flights-title-custom {
              font-size: 20px !important;
              white-space: nowrap !important;
            }
            @media (min-width: 576px) {
              .flights-title-custom {
                font-size: 20px !important;
              }
            }
            @media (min-width: 640px) {
              .flights-title-custom {
                font-size: 24px !important;
              }
            }
            @media (min-width: 768px) {
              .flights-title-custom {
                font-size: 32px !important;
              }
            }
            @media (min-width: 1024px) {
              .flights-title-custom {
                font-size: 38px !important;
              }
            }
          ` }} />

          {/* Responsive quick access icons row */}
          <ServiceQuickLinks active="flights" />

          <h1 className="text-center font-extrabold tracking-tight mb-2 text-white drop-shadow-md flights-title-custom">
            Compare & Book Cheap Flights
          </h1>
          <p className="text-center text-xs sm:text-sm md:text-base text-slate-300 mb-8 sm:mb-10 max-w-lg mx-auto">
            Get best-in-market rates with 500+ major airlines. No hidden charges.
          </p>

          {/* ── SKYSCANNER STYLE SEARCH BAR WRAPPER ── */}
          <div className="max-w-5xl mx-auto relative z-50">
            
            {/* Top Options Bar (Trip type & Class dropdowns) */}
            <div className="flex flex-row flex-nowrap items-center justify-start gap-1.5 sm:gap-3 mb-3 w-full overflow-visible">
              
              {/* Trip type selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setTripTypeOpen(!tripTypeOpen);
                    setCabinClassOpen(false);
                    setFromOpen(false);
                    setToOpen(false);
                    setGuestOpen(false);
                  }}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-white/10 text-slate-200 hover:text-white text-[10px] sm:text-xs font-normal flex items-center gap-1 sm:gap-2 transition-all cursor-pointer duration-200 select-none ${
                    tripTypeOpen ? 'bg-white/15 text-white' : ''
                  }`}
                >
                  <span>{tripType === 'one-way' ? 'One way' : 'Return'}</span>
                  <i className={`fa-solid fa-chevron-down text-[8px] text-slate-400 transition-transform duration-200 ${tripTypeOpen ? 'rotate-180 text-white' : ''}`} />
                </button>
                {tripTypeOpen && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 z-50 py-1.5 min-w-[140px] text-slate-900 animate-in fade-in duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setTripType('one-way');
                        setTripTypeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-all flex items-center justify-between whitespace-nowrap ${
                        tripType === 'one-way' 
                          ? 'text-[#0062e3] bg-blue-50/40 font-medium' 
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-normal'
                      }`}
                    >
                      <span>One way</span>
                      {tripType === 'one-way' && <i className="fa-solid fa-check text-[10px] text-[#0062e3]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTripType('round-trip');
                        setTripTypeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-all flex items-center justify-between whitespace-nowrap ${
                        tripType === 'round-trip' 
                          ? 'text-[#0062e3] bg-blue-50/40 font-medium' 
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-normal'
                      }`}
                    >
                      <span>Return</span>
                      {tripType === 'round-trip' && <i className="fa-solid fa-check text-[10px] text-[#0062e3]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Cabin class selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCabinClassOpen(!cabinClassOpen);
                    setTripTypeOpen(false);
                    setFromOpen(false);
                    setToOpen(false);
                    setGuestOpen(false);
                  }}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-white/10 text-slate-200 hover:text-white text-[10px] sm:text-xs font-normal flex items-center gap-1 sm:gap-2 transition-all cursor-pointer duration-200 select-none ${
                    cabinClassOpen ? 'bg-white/15 text-white' : ''
                  }`}
                >
                  <span>{getShortClassLabel(travelClass)}</span>
                  <i className={`fa-solid fa-chevron-down text-[8px] text-slate-400 transition-transform duration-200 ${cabinClassOpen ? 'rotate-180 text-white' : ''}`} />
                </button>
                {cabinClassOpen && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 z-50 py-1.5 min-w-[200px] text-slate-900 animate-in fade-in duration-100">
                    {['Economy', 'Premium Economy', 'Business Class', 'First Class'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setTravelClass(c);
                          setCabinClassOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-all flex items-center justify-between gap-4 whitespace-nowrap ${
                          travelClass === c 
                            ? 'text-[#0062e3] bg-blue-50/40 font-medium' 
                            : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-normal'
                        }`}
                      >
                        <span>{c}</span>
                        {travelClass === c && <i className="fa-solid fa-check text-[10px] text-[#0062e3] shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct flights checkbox */}
              <label className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-white/10 text-slate-200 hover:text-white text-[10px] sm:text-xs font-normal flex items-center gap-1.5 transition-all cursor-pointer duration-200 select-none ml-0.5 sm:ml-1 !mb-0">
                <input
                  type="checkbox"
                  checked={nonStopOnly}
                  onChange={(e) => setNonStopOnly(e.target.checked)}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0062e3] border-white/20 bg-white/10 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                />
                <span>Direct flights</span>
              </label>

            </div>

            {/* Main Search Inputs Unified Row */}
            <form onSubmit={handleSearch}>
              <div className="flex flex-col lg:flex-row gap-2.5 items-stretch w-full">
                
                {/* Relative wrapper to float the absolute positioned swap button outside the grid */}
                <div className="flex-1 relative">

                  {/* Unified input bar grid */}
                  <div className={`grid grid-cols-1 bg-white border border-slate-300 rounded-md shadow-md divide-y md:divide-y-0 md:divide-x divide-slate-300 ${
                    tripType === 'one-way' ? 'md:grid-cols-10' : 'md:grid-cols-12'
                  }`}>
                    
                    {/* FROM SELECTOR: md:col-span-3 */}
                    <div 
                      className="col-span-1 md:col-span-3 p-3 relative cursor-pointer hover:bg-slate-50 transition-colors rounded-t-md md:rounded-l-md md:rounded-tr-none flex flex-col justify-center min-w-0"
                      onClick={() => {
                        setFromOpen(true);
                        setToOpen(false);
                        setGuestOpen(false);
                        setTripTypeOpen(false);
                        setCabinClassOpen(false);
                      }}
                    >
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5 select-none">From</span>
                      <span className="font-normal text-slate-900 text-xs md:text-sm truncate leading-tight">{from}</span>
                      <span className="text-[9px] text-slate-500 truncate block mt-0.5 select-none">{getAirportName(from)}</span>

                      {/* Autocomplete Dropdown */}
                      {fromOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 z-50 max-h-72 overflow-y-auto p-2.5 scrollbar-thin">
                          <div className="relative mb-2">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs" />
                            <input
                              type="text"
                              placeholder="Where from? (city or code)"
                              value={fromSearch}
                              onChange={(e) => setFromSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-slate-50 border border-slate-200/70 focus:border-[#0062e3] rounded-lg pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all shadow-sm"
                              autoFocus
                            />
                          </div>
                          <div className="text-[9px] font-semibold text-slate-400 px-2 py-1.5 uppercase tracking-wider block mt-1 border-t border-slate-100 pt-2">Popular Airports</div>
                          {filteredAirports(fromSearch).length === 0 ? (
                            <div className="text-xs text-slate-400 px-2 py-3 text-center">No matching airports</div>
                          ) : (
                            filteredAirports(fromSearch).map((a, idx) => (
                              <div
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFrom(`${a.city} (${a.code})`);
                                  setFromOpen(false);
                                  setFromSearch('');
                                }}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-left transition-all duration-150"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100">
                                    <i className="fa-solid fa-plane-departure text-[10px]" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-medium text-slate-800 truncate leading-snug">{a.city}</div>
                                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{a.name}</div>
                                  </div>
                                </div>
                                <span className="bg-slate-100 text-slate-500 font-semibold text-[10px] px-2 py-0.5 rounded tracking-wide shrink-0 ml-2 border border-slate-200/30">
                                  {a.code}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* TO SELECTOR: md:col-span-3 */}
                    <div 
                      className="col-span-1 md:col-span-3 p-3 relative cursor-pointer hover:bg-slate-50 transition-colors flex flex-col justify-center min-w-0"
                      onClick={() => {
                        setToOpen(true);
                        setFromOpen(false);
                        setGuestOpen(false);
                        setTripTypeOpen(false);
                        setCabinClassOpen(false);
                      }}
                    >
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5 select-none">To</span>
                      <span className="font-normal text-slate-900 text-xs md:text-sm truncate leading-tight">{to}</span>
                      <span className="text-[9px] text-slate-500 truncate block mt-0.5 select-none">{getAirportName(to)}</span>

                      {/* Autocomplete Dropdown */}
                      {toOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 z-50 max-h-72 overflow-y-auto p-2.5 scrollbar-thin">
                          <div className="relative mb-2">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs" />
                            <input
                              type="text"
                              placeholder="Where to? (city or code)"
                              value={toSearch}
                              onChange={(e) => setToSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-slate-50 border border-slate-200/70 focus:border-[#0062e3] rounded-lg pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all shadow-sm"
                              autoFocus
                            />
                          </div>
                          <div className="text-[9px] font-semibold text-slate-400 px-2 py-1.5 uppercase tracking-wider block mt-1 border-t border-slate-100 pt-2">Popular Airports</div>
                          {filteredAirports(toSearch).length === 0 ? (
                            <div className="text-xs text-slate-400 px-2 py-3 text-center">No matching airports</div>
                          ) : (
                            filteredAirports(toSearch).map((a, idx) => (
                              <div
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTo(`${a.city} (${a.code})`);
                                  setToOpen(false);
                                  setToSearch('');
                                }}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-left transition-all duration-150"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100">
                                    <i className="fa-solid fa-plane-departure text-[10px]" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-medium text-slate-800 truncate leading-snug">{a.city}</div>
                                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{a.name}</div>
                                  </div>
                                </div>
                                <span className="bg-slate-100 text-slate-500 font-semibold text-[10px] px-2 py-0.5 rounded tracking-wide shrink-0 ml-2 border border-slate-200/30">
                                  {a.code}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* DEPARTURE DATE: md:col-span-2 */}
                    <div 
                      className="col-span-1 md:col-span-2 p-3 relative cursor-pointer hover:bg-slate-50 transition-colors flex flex-col justify-center min-w-0"
                      onClick={(e) => {
                        setIsDepartCalendarOpen(!isDepartCalendarOpen);
                        setIsReturnCalendarOpen(false);
                        setFromOpen(false);
                        setToOpen(false);
                        setGuestOpen(false);
                        setTripTypeOpen(false);
                        setCabinClassOpen(false);
                      }}
                    >
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5 select-none">Depart</span>
                      <span className="font-normal text-slate-900 text-xs md:text-sm leading-tight block select-none">
                        {formatDisplayDate(depart) || 'Add date'}
                      </span>
                      
                      {/* Custom Calendar Dropdown */}
                      {isDepartCalendarOpen && (
                        <div 
                          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 z-50 p-4 w-72 text-slate-800 animate-in fade-in duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Calendar Header */}
                          <div className="flex items-center justify-between mb-3 select-none">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDepartActiveMonth(new Date(departActiveMonth.getFullYear(), departActiveMonth.getMonth() - 1, 1));
                              }}
                              className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-chevron-left text-[10px]" />
                            </button>
                            <span className="font-bold text-xs text-slate-800">
                              {departActiveMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDepartActiveMonth(new Date(departActiveMonth.getFullYear(), departActiveMonth.getMonth() + 1, 1));
                              }}
                              className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer"
                            >
                              <i className="fa-solid fa-chevron-right text-[10px]" />
                            </button>
                          </div>

                          {/* Week Days Header Row */}
                          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase select-none mb-1">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                              <div key={d} className="py-1">{d}</div>
                            ))}
                          </div>

                          {/* Days Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {getDaysInMonth(departActiveMonth).map((day, idx) => {
                              if (!day) {
                                return <div key={`empty-${idx}`} />;
                              }
                              
                              const isPast = isDateInPast(day);
                              const isSelected = isSameDay(depart, day);
                              
                              return (
                                <div
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isPast) {
                                      const newDateStr = formatDateString(day);
                                      setDepart(newDateStr);
                                      setIsDepartCalendarOpen(false);
                                      
                                      // Adjust return date if departure date is pushed past it
                                      if (returnDate) {
                                        const returnDateObj = new Date(returnDate);
                                        returnDateObj.setHours(0, 0, 0, 0);
                                        if (day > returnDateObj) {
                                          const nextDay = new Date(day);
                                          nextDay.setDate(day.getDate() + 3);
                                          setReturnDate(formatDateString(nextDay));
                                        }
                                      }
                                    }
                                  }}
                                  className={`text-xs py-1.5 rounded transition-colors select-none font-semibold ${
                                    isPast 
                                      ? 'text-slate-300 cursor-not-allowed font-normal' 
                                      : isSelected 
                                        ? 'bg-[#ff8126] text-white font-bold cursor-pointer' 
                                        : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                                  }`}
                                >
                                  {day.getDate()}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RETURN DATE: md:col-span-2 */}
                    {tripType !== 'one-way' && (
                      <div 
                        className="col-span-1 md:col-span-2 p-3 relative cursor-pointer hover:bg-slate-50 transition-colors flex flex-col justify-center min-w-0"
                        onClick={(e) => {
                          setIsReturnCalendarOpen(!isReturnCalendarOpen);
                          setIsDepartCalendarOpen(false);
                          setFromOpen(false);
                          setToOpen(false);
                          setGuestOpen(false);
                          setTripTypeOpen(false);
                          setCabinClassOpen(false);
                        }}
                      >
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5 select-none">Return</span>
                        <span className="font-normal text-slate-900 text-xs md:text-sm leading-tight block select-none">
                          {formatDisplayDate(returnDate) || 'Add date'}
                        </span>
                        
                        {/* Custom Calendar Dropdown */}
                        {isReturnCalendarOpen && (
                          <div 
                            className="absolute top-full left-0 md:left-auto md:right-0 mt-2 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 z-50 p-4 w-72 text-slate-800 animate-in fade-in duration-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-3 select-none">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReturnActiveMonth(new Date(returnActiveMonth.getFullYear(), returnActiveMonth.getMonth() - 1, 1));
                                }}
                                className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-chevron-left text-[10px]" />
                              </button>
                              <span className="font-bold text-xs text-slate-800">
                                {returnActiveMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReturnActiveMonth(new Date(returnActiveMonth.getFullYear(), returnActiveMonth.getMonth() + 1, 1));
                                }}
                                className="w-7 h-7 rounded-full border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-chevron-right text-[10px]" />
                              </button>
                            </div>

                            {/* Week Days Header Row */}
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase select-none mb-1">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                                <div key={d} className="py-1">{d}</div>
                              ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                              {getDaysInMonth(returnActiveMonth).map((day, idx) => {
                                if (!day) {
                                  return <div key={`empty-${idx}`} />;
                                }
                                
                                const isPast = isDateInPast(day);
                                const isBeforeDepart = (() => {
                                  if (!depart) return false;
                                  const depDateObj = new Date(depart);
                                  depDateObj.setHours(0, 0, 0, 0);
                                  return day < depDateObj;
                                })();
                                const isDisabled = isPast || isBeforeDepart;
                                const isSelected = isSameDay(returnDate, day);
                                
                                return (
                                  <div
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isDisabled) {
                                        setReturnDate(formatDateString(day));
                                        setIsReturnCalendarOpen(false);
                                      }
                                    }}
                                    className={`text-xs py-1.5 rounded transition-colors select-none font-semibold ${
                                      isDisabled 
                                        ? 'text-slate-350 cursor-not-allowed font-normal' 
                                        : isSelected 
                                          ? 'bg-[#ff8126] text-white font-bold cursor-pointer' 
                                          : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                                    }`}
                                  >
                                    {day.getDate()}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PASSENGERS/TRAVELLERS: md:col-span-2 */}
                    <div 
                      className="col-span-1 md:col-span-2 p-3 relative cursor-pointer hover:bg-slate-50 transition-colors rounded-b-md md:rounded-r-md md:rounded-bl-none flex flex-col justify-center min-w-0"
                      onClick={() => {
                        setGuestOpen(true);
                        setFromOpen(false);
                        setToOpen(false);
                        setTripTypeOpen(false);
                        setCabinClassOpen(false);
                      }}
                    >
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5 select-none">Travellers</span>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-normal text-slate-900 text-xs md:text-sm truncate leading-tight select-none">
                          {getPassengerSummary()}
                        </span>
                        <i className="fa-solid fa-chevron-down text-slate-400 text-[8px] shrink-0" />
                      </div>

                      {/* Guest steppers popover card popup */}
                      {guestOpen && (
                        <div 
                          className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 z-50 w-72 p-4 text-left animate-in fade-in duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h4 className="text-xs font-semibold text-slate-500 mb-3.5 uppercase tracking-wider border-b border-slate-100 pb-2">Passengers</h4>
                          
                          {/* Adults stepper */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-xs font-medium text-slate-800">Adults</div>
                              <span className="text-[10px] text-slate-400">Ages 16+</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-minus text-[9px]" />
                              </button>
                              <span className="text-xs font-semibold text-slate-800 w-4 text-center select-none">{adults}</span>
                              <button
                                type="button"
                                onClick={() => setAdults(Math.min(9, adults + 1))}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-plus text-[9px]" />
                              </button>
                            </div>
                          </div>

                          {/* Children stepper */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-xs font-medium text-slate-800">Children</div>
                              <span className="text-[10px] text-slate-400">Ages 2-15</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-minus text-[9px]" />
                              </button>
                              <span className="text-xs font-semibold text-slate-800 w-4 text-center select-none">{children}</span>
                              <button
                                type="button"
                                onClick={() => setChildren(Math.min(9, children + 1))}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-plus text-[9px]" />
                              </button>
                            </div>
                          </div>

                          {/* Infants stepper */}
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <div className="text-xs font-medium text-slate-800">Infants</div>
                              <span className="text-[10px] text-slate-400">Under 2</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setInfants(Math.max(0, infants - 1))}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-minus text-[9px]" />
                              </button>
                              <span className="text-xs font-semibold text-slate-800 w-4 text-center select-none">{infants}</span>
                              <button
                                type="button"
                                onClick={() => setInfants(Math.min(4, infants + 1))}
                                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <i className="fa-solid fa-plus text-[9px]" />
                              </button>
                            </div>
                          </div>

                          {/* Done button */}
                          <button
                            type="button"
                            onClick={() => setGuestOpen(false)}
                            className="w-full bg-[#0062e3] hover:bg-[#0052c2] text-white font-medium py-2 rounded-lg text-xs shadow-md hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* SWAP BUTTON (Overlay float outside the grid) */}
                  <div className={`absolute right-6 md:right-auto md:-translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center top-[70px] md:top-1/2 ${
                    tripType === 'one-way' ? 'md:left-[30%]' : 'md:left-[25%]'
                  }`}>
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-6 h-6 rounded-full border border-slate-300 bg-white hover:border-slate-400 hover:shadow-lg text-slate-700 flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 active:scale-95"
                      title="Swap locations"
                    >
                      <i className={`fa-solid fa-arrow-right-arrow-left text-[9px] transition-all duration-300 ${swapRotated ? 'rotate-[270deg] md:rotate-180' : 'rotate-90 md:rotate-0'}`} />
                    </button>
                  </div>

                </div>

                {/* SEARCH BUTTON */}
                <button
                  type="submit"
                  style={{ borderRadius: '8px' }}
                  className="w-full lg:w-48 bg-gradient-to-r from-[#ff8126] to-[#fd661e] hover:from-[#fd661e] hover:to-[#e8520a] text-white font-black px-6 py-4 lg:py-0 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-200 active:scale-[0.98] cursor-pointer text-base uppercase tracking-wider shrink-0"
                >
                  <i className="fa-solid fa-magnifying-glass text-base" />
                  <span>Search</span>
                </button>

              </div>
            </form>

        </div>
      </div>
    </div>

      {/* ── ✈️ DYNAMIC SEARCH RESULTS SECTION ── */}
      {showResults && (
        <div className="container mx-auto -mt-6 relative z-30 flight-results-container-custom">
          <style dangerouslySetInnerHTML={{ __html: `
            .flight-results-container-custom {
              padding-left: 5px !important;
              padding-right: 5px !important;
            }
            @media (min-width: 768px) {
              .flight-results-container-custom {
                padding-left: 16px !important;
                padding-right: 16px !important;
              }
            }

            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .flight-card-animate {
              animation: fadeSlideUp 0.35s ease both;
            }
            .flight-card-animate:nth-child(2) { animation-delay: 0.07s; }
            .flight-card-animate:nth-child(3) { animation-delay: 0.14s; }
            .flight-card-animate:nth-child(4) { animation-delay: 0.21s; }

            .flight-results-body-custom {
              padding: 20px !important;
            }
            .flight-card-desktop-left-custom {
              padding-top: 7px !important;
              padding-bottom: 7px !important;
            }
            .flight-card-desktop-row-custom {
              padding-left: 18px !important;
              padding-right: 18px !important;
            }
            .flight-card-desktop-right-custom {
              padding: 10px 16px !important;
            }
            .flight-card-mobile-container-custom {
              padding: 8px 10px !important;
            }
            .flight-card-banner-custom {
              padding-left: 10px !important;
              padding-right: 10px !important;
              padding-top: 6px !important;
              padding-bottom: 6px !important;
            }
            .flight-sort-tab-custom {
              padding: 10px !important;
            }
            @media (max-width: 768px) {
              .flight-results-body-custom {
                padding: 12px 5px !important;
                border: none !important;
              }
            }

            /* Fare Drawer Overlay */
            .fare-drawer-overlay {
              position: fixed;
              inset: 0;
              background-color: rgba(0, 0, 0, 0.4);
              z-index: 1040;
              opacity: 0;
              pointer-events: none;
              transition: opacity 0.3s ease;
            }
            .fare-drawer-overlay.open {
              opacity: 1;
              pointer-events: auto;
            }

            /* Fare Drawer Container */
            .fare-drawer {
              position: fixed;
              background-color: #ffffff;
              z-index: 1050;
              box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
              transition: transform 0.3s ease-in-out;
              display: flex;
              flex-direction: column;
              font-family: 'Outfit', sans-serif;
            }

            /* Desktop View (Default / Large screens) */
            @media (min-width: 768px) {
              .fare-drawer {
                top: 0;
                right: 0;
                width: 900px;
                max-width: 95vw;
                height: 100%;
                transform: translateX(100%);
                border-top-left-radius: 16px;
                border-bottom-left-radius: 16px;
              }
              .fare-drawer.open {
                transform: translateX(0);
              }
            }

            /* Mobile View (Small screens) */
            @media (max-width: 767px) {
              .fare-drawer {
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 85vh;
                transform: translateY(100%);
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
              }
              .fare-drawer.open {
                transform: translateY(0);
              }
            }

            /* Radio Button styling */
            .fare-radio-custom {
              appearance: none;
              width: 16px;
              height: 16px;
              border: 2px solid #cbd5e1;
              border-radius: 50%;
              outline: none;
              cursor: pointer;
              position: relative;
              transition: all 0.2s;
            }
            .fare-radio-custom:checked {
              border-color: #0062e3;
            }
            .fare-radio-custom:checked::after {
              content: '';
              position: absolute;
              inset: 3px;
              background-color: #0062e3;
              border-radius: 50%;
            }
          ` }} />

          <div className="max-w-4xl mx-auto">

            {/* ── Results Header Panel ── */}
            <div 
              className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-t-xl pr-6 flex flex-wrap items-center justify-between gap-3"
              style={{ paddingLeft: '48px', paddingTop: '10px', paddingBottom: '10px' }}
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-extrabold text-base leading-tight">Available Flights</h3>
                    <span 
                      className="bg-[#ff8126] text-white text-[10px] font-black rounded-full uppercase tracking-wider"
                      style={{ paddingTop: '5px', paddingBottom: '5px', paddingLeft: '10px', paddingRight: '10px' }}
                    >
                      {from.match(/\(([^)]+)\)/)?.[1] || 'DEL'} → {to.match(/\(([^)]+)\)/)?.[1] || 'SXR'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {formatDisplayDate(depart)}{tripType === 'round-trip' && ` – ${formatDisplayDate(returnDate)}`} &nbsp;·&nbsp; {getPassengerSummary()} &nbsp;·&nbsp; {travelClass}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Results Body (Skyscanner themed layout) ── */}
            <div className="flight-results-body-custom bg-[#f8f9fa] border border-t-0 border-slate-200 rounded-b-xl overflow-hidden">
              {isLoading ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                  <div className="relative w-14 h-14">
                    <div className="w-14 h-14 border-4 border-slate-100 border-t-[#ff8126] rounded-full animate-spin" />
                    <i className="fa-solid fa-plane absolute inset-0 m-auto text-[#ff8126] text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 animate-pulse">Searching best schedules...</p>
                    <p className="text-xs text-slate-400 mt-1">Comparing 500+ airlines for you</p>
                  </div>
                </div>

              ) : searchResults.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 py-16 px-6 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-plane-slash text-slate-300 text-2xl" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">No flights found</h4>
                  <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">Try changing your travel dates or look for connecting flights via another city.</p>
                </div>

              ) : (
                <div className="space-y-4">
                  
                  {/* ── SKYSCANNER SORT TABS ── */}
                  <div className="grid grid-cols-3 md:grid-cols-4 border border-slate-200 rounded-lg overflow-hidden bg-white select-none shadow-sm animate-in fade-in duration-200">
                    {/* Best */}
                    <button
                      type="button"
                      onClick={() => setSortBy('best')}
                      className={`flight-sort-tab-custom flex flex-col items-start p-3 text-left transition-all cursor-pointer border-r border-slate-200 ${
                        sortBy === 'best'
                          ? 'bg-[#072146] text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`text-[10px] font-bold tracking-wide uppercase ${sortBy === 'best' ? 'text-slate-300' : 'text-slate-500'}`}>Best</span>
                      {bestFlight && (
                        <>
                          <span className="text-[15px] md:text-[17px] font-extrabold mt-0.5">₹{bestFlight.price.toLocaleString('en-IN')}</span>
                          <span className={`text-[9px] ${sortBy === 'best' ? 'text-slate-300' : 'text-slate-400'} mt-0.5`}>{bestFlight.duration}</span>
                        </>
                      )}
                    </button>

                    {/* Cheapest */}
                    <button
                      type="button"
                      onClick={() => setSortBy('cheapest')}
                      className={`flight-sort-tab-custom flex flex-col items-start p-3 text-left transition-all cursor-pointer border-r border-slate-200 ${
                        sortBy === 'cheapest'
                          ? 'bg-[#072146] text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`text-[10px] font-bold tracking-wide uppercase ${sortBy === 'cheapest' ? 'text-slate-300' : 'text-slate-500'}`}>Cheapest</span>
                      {cheapestFlight && (
                        <>
                          <span className="text-[15px] md:text-[17px] font-extrabold mt-0.5">₹{cheapestFlight.price.toLocaleString('en-IN')}</span>
                          <span className={`text-[9px] ${sortBy === 'cheapest' ? 'text-slate-300' : 'text-slate-400'} mt-0.5`}>{cheapestFlight.duration}</span>
                        </>
                      )}
                    </button>

                    {/* Fastest */}
                    <button
                      type="button"
                      onClick={() => setSortBy('fastest')}
                      className={`flight-sort-tab-custom flex flex-col items-start p-3 text-left transition-all cursor-pointer border-r md:border-r-0 ${
                        sortBy === 'fastest'
                          ? 'bg-[#072146] text-white'
                          : 'bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`text-[10px] font-bold tracking-wide uppercase ${sortBy === 'fastest' ? 'text-slate-300' : 'text-slate-500'}`}>Fastest</span>
                      {fastestFlight && (
                        <>
                          <span className="text-[15px] md:text-[17px] font-extrabold mt-0.5">₹{fastestFlight.price.toLocaleString('en-IN')}</span>
                          <span className={`text-[9px] ${sortBy === 'fastest' ? 'text-slate-300' : 'text-slate-400'} mt-0.5`}>{fastestFlight.duration}</span>
                        </>
                      )}
                    </button>

                    {/* Sort Info */}
                    <div className="hidden md:flex flex-col justify-center items-end p-3 bg-white text-right">
                      <span className="text-[10px] text-slate-400 leading-none">Sort:</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 uppercase tracking-wide">
                        {sortBy === 'best' ? 'Best' : sortBy === 'cheapest' ? 'Cheapest' : 'Fastest'}
                      </span>
                    </div>
                  </div>

                  {/* ── FLIGHT CARDS LIST ── */}
                  <div className="space-y-[5px] mt-[5px]">
                    {sortedResults.slice(0, visibleFlightsCount).map((flight, idx) => (
                      <div
                        key={flight.id}
                        className={`flight-card-animate rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md border ${
                          flight.isSponsored ? 'border-[#ff6600]' : 'border-slate-200'
                        }`}
                        style={{ animationDelay: `${idx * 0.07}s` }}
                      >
                        {/* 1. Sponsored Header Panel */}
                        {flight.isSponsored && (
                          <div className="flight-card-banner-custom bg-[#ff6600] text-white flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded leading-none">AIX DEAL</span>
                              <span className="font-medium">Up to 20% off bookings (Code: FLYAIX) · Zero Convenience Fee</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-95">
                              <span>Sponsored <i className="fa-solid fa-circle-info text-[9px]" /></span>
                              <span className="font-bold border-l border-white/30 pl-2">More info</span>
                            </div>
                          </div>
                        )}

                        {/* 2. Emissions Sub-Header Pill */}
                        {flight.co2Reduction && !flight.isSponsored && (
                          <div className="flight-card-banner-custom bg-slate-50 border-b border-slate-100 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <i className="fa-solid fa-leaf text-emerald-600 shrink-0" />
                              <span>
                                This flight emits <strong className="text-emerald-700 font-bold">{flight.co2Reduction} less CO2e</strong> <span className="hidden sm:inline">than a typical flight</span>
                              </span>
                            </div>
                            <i className="fa-solid fa-circle-info text-slate-400 hover:text-slate-600 cursor-pointer shrink-0" />
                          </div>
                        )}

                        {/* 3. Main Flight Card Grid (Desktop Layout) */}
                        <div className="hidden md:flex flex-row">
                          {/* Left Details block (Airline + Schedule timelines) */}
                          <div className="flight-card-desktop-left-custom flex-1 flex flex-col justify-center">
                            
                            {/* Outbound schedule row */}
                            <div className="flight-card-desktop-row-custom flex items-center gap-4">
                              {/* Airline Brand Logo Only */}
                              <div className="w-[80px] shrink-0 flex items-center justify-start">
                                <AirlineLogo 
                                  code={flight.airlineCode}
                                  name={flight.airlineName}
                                  color={flight.logoColor}
                                  isMobile={false}
                                />
                              </div>

                              {/* Route details */}
                              <div className="flex-1 flex items-center justify-between max-w-[360px] gap-6">
                                <div className="text-left w-[65px]">
                                  <div className="text-xl font-medium text-slate-800 leading-none">{flight.departureTime}</div>
                                  <div className="text-xs text-slate-400 mt-1 uppercase font-normal tracking-wide">{flight.fromCode}</div>
                                </div>
                                <div className="flex-1 flex flex-col items-center">
                                  <span className="text-[10px] text-slate-400 font-normal mb-1">{flight.duration}</span>
                                  <div className="w-full flex items-center relative py-1">
                                    <div className="flex-1 h-[1.5px] bg-slate-300 relative">
                                      <i className="fa-solid fa-plane absolute top-1/2 right-0 text-slate-400 text-[10px]" style={{ transform: 'translate(50%, -50%) rotate(-45deg)' }} />
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-emerald-600 font-normal mt-1 uppercase tracking-wider">{flight.stops}</span>
                                </div>
                                <div className="text-right w-[65px]">
                                  <div className="text-xl font-medium text-slate-800 leading-none">{flight.arrivalTime}</div>
                                  <div className="text-xs text-slate-400 mt-1 uppercase font-normal tracking-wide">{flight.toCode}</div>
                                </div>
                              </div>
                            </div>

                            {/* Inbound return schedule row (if round-trip) */}
                            {flight.returnFlight && (
                              <div className="flight-card-desktop-row-custom flex items-center gap-4 border-t border-slate-100/70 pt-2.5 mt-2.5">
                                {/* Airline Brand Logo Only */}
                                <div className="w-[80px] shrink-0 flex items-center justify-start">
                                  <AirlineLogo 
                                    code={flight.airlineCode}
                                    name={flight.airlineName}
                                    color={flight.logoColor}
                                    isMobile={false}
                                  />
                                </div>

                                {/* Route details */}
                                <div className="flex-1 flex items-center justify-between max-w-[360px] gap-6">
                                  <div className="text-left w-[65px]">
                                    <div className="text-xl font-medium text-slate-800 leading-none">{flight.returnFlight.departureTime}</div>
                                    <div className="text-xs text-slate-400 mt-1 uppercase font-normal tracking-wide">{flight.returnFlight.fromCode}</div>
                                  </div>
                                  <div className="flex-1 flex flex-col items-center">
                                    <span className="text-[10px] text-slate-400 font-normal mb-1">{flight.returnFlight.duration}</span>
                                    <div className="w-full flex items-center relative py-1">
                                      <div className="flex-1 h-[1.5px] bg-slate-300 relative">
                                        <i className="fa-solid fa-plane absolute top-1/2 right-0 text-slate-400 text-[10px]" style={{ transform: 'translate(50%, -50%) rotate(-45deg)' }} />
                                      </div>
                                    </div>
                                    <span className="text-[10px] text-emerald-600 font-normal mt-1 uppercase tracking-wider">{flight.returnFlight.stops}</span>
                                  </div>
                                  <div className="text-right w-[65px]">
                                    <div className="text-xl font-medium text-slate-800 leading-none">{flight.returnFlight.arrivalTime}</div>
                                    <div className="text-xs text-slate-400 mt-1 uppercase font-normal tracking-wide">{flight.returnFlight.toCode}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Pricing CTA block */}
                          <div className="flight-card-desktop-right-custom w-[160px] border-l border-slate-200 flex flex-col justify-center items-end text-right relative shrink-0">
                            <div className="mb-3 mt-1">
                              <div className="text-[9px] text-slate-400 font-normal uppercase">{flight.dealsCount} deals from</div>
                              <div className="text-[18px] font-bold text-[#072146] leading-none mt-0.5">₹{flight.price.toLocaleString('en-IN')}</div>
                              <div className="text-[8px] text-slate-400 mt-0.5">₹{(flight.price * passengerMultiplier).toLocaleString('en-IN')} total</div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedFlightForFare(flight);
                                setSelectedFareClass('value');
                                setDrawerStep('options');
                                setPassengerName('');
                                setPassengerPhone('');
                                setPassengerEmail('');
                                setPassengerMessage('');
                                setFarePhoneError('');
                              }}
                              className="w-full bg-[#072146] hover:bg-[#003666] text-white font-semibold rounded-lg text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-200 cursor-pointer select-none"
                              style={{ borderRadius: '8px', paddingTop: '9px', paddingBottom: '9px', paddingLeft: '14px', paddingRight: '14px' }}
                            >
                              <span>Select</span>
                              <i className="fa-solid fa-arrow-right text-[9px]" />
                            </button>
                          </div>
                        </div>

                        {/* 4. Mobile View (Hidden on Desktop) */}
                        <div className="flight-card-mobile-container-custom md:hidden flex flex-col gap-2.5 relative">
                          {/* Outbound schedule row */}
                          <div className="flex items-center justify-between gap-3 mt-0.5">
                            {/* Airline Brand Logo Only */}
                            <div className="w-[60px] shrink-0 flex items-center justify-start">
                              <AirlineLogo 
                                code={flight.airlineCode}
                                name={flight.airlineName}
                                color={flight.logoColor}
                                isMobile={true}
                              />
                            </div>

                            <div className="text-left w-[50px]">
                              <div className="text-[16px] font-medium text-slate-800 leading-none">{flight.departureTime}</div>
                              <div className="text-[10px] text-slate-400 mt-1 uppercase font-normal leading-none">{flight.fromCode}</div>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                              <span className="text-[9px] text-slate-400 font-normal mb-0.5">{flight.duration}</span>
                              <div className="w-full flex items-center relative py-1">
                                <div className="flex-1 h-[1px] bg-slate-300 relative">
                                  <i className="fa-solid fa-plane absolute top-1/2 right-0 text-slate-400 text-[8px]" style={{ transform: 'translate(50%, -50%) rotate(-45deg)' }} />
                                </div>
                              </div>
                              <span className="text-[9px] text-emerald-600 font-normal uppercase tracking-wider leading-none mt-0.5">{flight.stops}</span>
                            </div>
                            <div className="text-right w-[50px]">
                              <div className="text-[16px] font-medium text-slate-800 leading-none">{flight.arrivalTime}</div>
                              <div className="text-[10px] text-slate-400 mt-1 uppercase font-normal leading-none">{flight.toCode}</div>
                            </div>
                          </div>

                          {/* Inbound return schedule row (if round-trip) */}
                          {flight.returnFlight && (
                            <div className="flex items-center justify-between gap-3 border-t border-slate-100/70 pt-2 mt-0.5">
                              {/* Airline Brand Logo Only */}
                              <div className="w-[60px] shrink-0 flex items-center justify-start">
                                <AirlineLogo 
                                  code={flight.airlineCode}
                                  name={flight.airlineName}
                                  color={flight.logoColor}
                                  isMobile={true}
                                />
                              </div>

                              <div className="text-left w-[50px]">
                                <div className="text-[16px] font-medium text-slate-800 leading-none">{flight.returnFlight.departureTime}</div>
                                <div className="text-[10px] text-slate-400 mt-1 uppercase font-normal leading-none">{flight.returnFlight.fromCode}</div>
                              </div>
                              <div className="flex-1 flex flex-col items-center">
                                <span className="text-[9px] text-slate-400 font-normal mb-0.5">{flight.returnFlight.duration}</span>
                                <div className="w-full flex items-center relative py-1">
                                  <div className="flex-1 h-[1px] bg-slate-300 relative">
                                    <i className="fa-solid fa-plane absolute top-1/2 right-0 text-slate-400 text-[8px]" style={{ transform: 'translate(50%, -50%) rotate(-45deg)' }} />
                                  </div>
                                </div>
                                <span className="text-[9px] text-emerald-600 font-normal uppercase tracking-wider leading-none mt-0.5">{flight.returnFlight.stops}</span>
                              </div>
                              <div className="text-right w-[50px]">
                                <div className="text-[16px] font-medium text-slate-800 leading-none">{flight.returnFlight.arrivalTime}</div>
                                <div className="text-[10px] text-slate-400 mt-1 uppercase font-normal leading-none">{flight.returnFlight.toCode}</div>
                              </div>
                            </div>
                          )}

                          {/* Mobile Price & CTA bottom row */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5">
                            <div>
                              <span className="text-[8px] text-slate-400 font-normal block uppercase leading-none">{flight.dealsCount} deals from</span>
                              <span className="text-[16px] font-bold text-[#072146] mt-0.5 inline-block">₹{flight.price.toLocaleString('en-IN')}</span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedFlightForFare(flight);
                                setSelectedFareClass('value');
                                setDrawerStep('options');
                                setPassengerName('');
                                setPassengerPhone('');
                                setPassengerEmail('');
                                setPassengerMessage('');
                                setFarePhoneError('');
                              }}
                              className="bg-[#072146] hover:bg-[#003666] text-white font-semibold rounded-lg text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:scale-[0.97] transition-all duration-200 select-none"
                              style={{ borderRadius: '8px', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '12px', paddingRight: '12px' }}
                            >
                              <span>Select</span>
                              <i className="fa-solid fa-arrow-right text-[9px]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Show More Flights Button */}
                  {sortedResults.length > visibleFlightsCount && (
                    <div className="flex justify-center mt-6 mb-2">
                      <button
                        type="button"
                        onClick={() => setVisibleFlightsCount(prev => prev + 10)}
                        style={{ borderRadius: '8px' }}
                        className="bg-white hover:bg-slate-50 text-[#072146] font-bold border border-slate-300 hover:border-slate-400 px-6 py-2.5 rounded-lg text-xs md:text-sm shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-2 select-none"
                      >
                        <span>Show More Flights</span>
                        <i className="fa-solid fa-angle-down text-[11px]" />
                      </button>
                    </div>
                  )}

                  {/* Footer note */}
                  <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-2 shadow-sm">
                    <i className="fa-solid fa-circle-info text-slate-400 text-[11px]" />
                    <p className="text-[10px] text-slate-400">Fares are subject to availability. Contact us for group bookings or special fares.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── EXCLUSIVE FLIGHT OFFERS ── */}
      <div className="container mx-auto px-4 mt-24">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Exclusive Flight Offers</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">Grab limited time discount codes on flights</p>
          </div>
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="offersSwiper"
        >
          {offers.map((o, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div 
                onClick={() => openModal('customize')}
                className="rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/50 hover:border-[#ff8126]/30 aspect-[2.86/1] relative group"
              >
                <img 
                  src={o.image} 
                  alt={o.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── POPULAR FLIGHT ROUTES ── */}
      <div className="container mx-auto px-4" style={{ marginTop: '20px' }}>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">Popular Flight Destinations</h2>
        <p className="text-slate-500 text-xs md:text-sm mb-6">Explore our top booked sectors to and from Kashmir</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setTo(`${dest.city} (${dest.code})`);
                if (from === `${dest.city} (${dest.code})`) {
                  setFrom(dest.city === 'Srinagar' ? 'Delhi (DEL)' : 'Srinagar (SXR)');
                }
                window.scrollTo({ top: 150, behavior: 'smooth' });
                setTimeout(() => {
                  handleSearch();
                }, 300);
              }}
              className="bg-white rounded-lg border border-slate-100 hover:border-[#ff8126]/30 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              {/* Card Image Header */}
              <div className="relative aspect-[2.4/1] overflow-hidden shrink-0 bg-slate-100">
                <img 
                  src={dest.image} 
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge */}
                {dest.badge && (
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#ff8126] text-white text-[10px] sm:text-[11px] font-bold py-1 px-3 sm:px-4 rounded shadow-sm uppercase tracking-wide">
                    {dest.badge}
                  </span>
                )}
                
                {/* Overlay Text */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between text-white">
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight leading-none">{dest.city}</h4>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-300 font-medium">{dest.country}</span>
                  </div>
                  <span className="bg-white/25 backdrop-blur-md text-white font-extrabold text-[10px] sm:text-[11px] py-1 px-3 sm:px-4 rounded border border-white/20 tracking-wider">
                    {dest.code}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex flex-col justify-between flex-1">
                {/* Detailed Meta (Skyscanner/MMT Style) */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-clock text-slate-400 text-[9px]" />
                    <span>{dest.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-plane-up text-slate-400 text-[9px]" />
                    <span>{dest.flightsPerWeek} flights/wk</span>
                  </div>
                </div>
                
                {/* Pricing and Action */}
                <div className="flex items-center justify-between border-t border-slate-100/70 pt-2.5">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Avg One-Way</span>
                    <span className="text-sm font-black text-[#ff8126]">{dest.price}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#ff8126]/10 text-[#ff8126] group-hover:bg-[#ff8126] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-[#ff8126]/10 group-hover:border-transparent">
                    <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY BOOK WITH US ── */}
      <div className="mb-24 py-12 bg-gradient-to-br from-orange-50/50 to-orange-100/30 border-y border-orange-100/50" style={{ marginTop: '20px' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-extrabold text-slate-900 mb-2">Why Book Flights With Twin Brothers?</h2>
          <p className="text-center text-slate-500 text-xs md:text-sm mb-8">We deliver reliability, transparent rates and local expertise</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItems.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-4 rounded-lg border border-slate-100 hover:border-[#ff8126]/20 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[#ff8126]/10 text-[#ff8126] flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${item.icon} text-base`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AIRLINES PARTNERS ── */}
      <div className="container mx-auto px-4" style={{ marginTop: '20px' }}>
        <h2 className="text-center text-xl md:text-2xl font-extrabold text-slate-900 mb-2">Airlines We Partner With</h2>
        <p className="text-center text-slate-500 text-xs md:text-sm mb-8">Instant pricing & real-time inventory from 500+ carriers</p>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 14,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
          className="partnersSwiper"
        >
          {airlines.map((a, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div 
                className="bg-white rounded-md border border-slate-100 hover:border-[#ff8126]/30 p-3 text-center hover:shadow-lg transition-all duration-300 group h-full flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-[#ff8126]/10 group-hover:border-[#ff8126]/20 text-slate-500 group-hover:text-[#ff8126] flex items-center justify-center mx-auto mb-2 transition-all duration-300">
                    <i className="fa-solid fa-plane text-xs group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-snug">{a.name}</h5>
                  <span className="text-[9px] text-[#ff8126] font-extrabold uppercase mt-0.5 tracking-wider block">Code: {a.code}</span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-1.5 pt-1.5 border-t border-slate-100/60 truncate italic">{a.tagline}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── CALL TO ACTION CONTACT PANEL ── */}
      <div className="container mx-auto px-4 mt-24 mb-16">
        <style dangerouslySetInnerHTML={{ __html: `
          .booking-support-card-custom {
            padding: 60px 48px !important;
          }
          @media (max-width: 768px) {
            .booking-support-card-custom {
              padding: 40px 24px !important;
            }
          }
        ` }} />
        <div className="booking-support-card-custom rounded-xl bg-[#111827] text-white border border-slate-800 relative overflow-hidden shadow-2xl">
          {/* Subtle glowing elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff8126]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="bg-[#ff8126]/10 border border-[#ff8126]/20 text-[#ff8126] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3.5">
              <i className="fa-solid fa-headset mr-1.5" /> Direct Booking Support
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-tight max-w-2xl text-white">Need Help Booking Your Flights?</h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
              Struggling with seat availability, complex itineraries, or need to book group flights? Get in touch with our booking experts to arrange special offline deals.
            </p>
            
            {/* Buttons: side-by-side on sm screens and larger, stacked on mobile */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-10">
              <a 
                href="tel:+916005242675" 
                className="bg-gradient-to-r from-[#ff8126] to-[#fd661e] hover:from-[#fd661e] hover:to-[#e8520a] text-white font-bold tracking-wider text-xs uppercase px-8 h-12 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/45 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 min-w-[220px]"
              >
                <i className="fa-solid fa-phone text-xs animate-pulse" />
                <span>Call +91-6005242675</span>
              </a>
              <button 
                onClick={() => openModal('customize')}
                className="bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/40 backdrop-blur-md text-white font-bold tracking-wider text-xs uppercase px-8 h-12 rounded-lg transition-all duration-300 shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/15 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 min-w-[220px]"
              >
                <i className="fa-solid fa-paper-plane text-xs" />
                <span>Request Custom Quote</span>
              </button>
            </div>

            {/* Bottom divider and highlights layout */}
            <div className="w-full border-t border-slate-800/80 pt-8 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-[#ff8126]/10 border border-[#ff8126]/20 flex items-center justify-center text-[#ff8126] shrink-0">
                    <i className="fa-solid fa-plane-circle-check text-sm" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">500+ Airlines</h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Domestic & International coverage</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-[#ff8126]/10 border border-[#ff8126]/20 flex items-center justify-center text-[#ff8126] shrink-0">
                    <i className="fa-solid fa-percent text-sm" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Exclusive Rates</h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Cheaper than standard online booking rates</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-[#ff8126]/10 border border-[#ff8126]/20 flex items-center justify-center text-[#ff8126] shrink-0">
                    <i className="fa-solid fa-clock-rotate-left text-sm" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">24/7 Support</h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Real-time local travel expert assistance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FARE OPTIONS DRAWER ── */}
      {selectedFlightForFare && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className={`fare-drawer-overlay ${selectedFlightForFare ? 'open' : ''}`}
            onClick={() => setSelectedFlightForFare(null)}
          />

          {/* Drawer Container */}
          <div className={`fare-drawer ${selectedFlightForFare ? 'open' : ''}`}>
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm md:text-base font-extrabold text-[#072146] mb-1">More Fare Options Available</h3>
                
                {/* Route details banner */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-blue-50 text-[#0062e3] font-bold text-[8.5px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Onwards Flight
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">
                    {selectedFlightForFare.fromCity} ({selectedFlightForFare.fromCode})
                    <i className="fa-solid fa-arrow-right text-[9px] mx-1.5 text-slate-400" />
                    {selectedFlightForFare.toCity} ({selectedFlightForFare.toCode})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    • {formatDisplayDate(depart)} • {selectedFlightForFare.airlineName} • {selectedFlightForFare.flightNo}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setSelectedFlightForFare(null)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 border-0 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4">
              
              {drawerStep === 'options' ? (
                <>
                  {/* Desktop cards layout */}
                  <div className="hidden md:grid grid-cols-3 gap-3 items-stretch">
                    {['value', 'classic', 'flex'].map((c: any) => {
                      const isSelected = selectedFareClass === c;
                      const farePrice = getFarePrice(selectedFlightForFare.price, c);
                      return (
                        <div 
                          key={c}
                          onClick={() => setSelectedFareClass(c)}
                          className={`border rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-2 border-[#0062e3] bg-[#f0f7ff]/20 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            {/* Card title & Radio */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-black text-slate-800 capitalize">{c}</span>
                              <input 
                                type="radio" 
                                name="fare_class_desktop" 
                                checked={isSelected}
                                onChange={() => setSelectedFareClass(c)}
                                className="fare-radio-custom"
                              />
                            </div>
                            
                            {/* Price */}
                            <div className="text-[15px] font-black text-[#0062e3]">
                              ₹{farePrice.toLocaleString('en-IN')}
                            </div>

                            {/* Features */}
                            {renderFareDetails(c, selectedFlightForFare.price)}
                          </div>

                          {/* Bottom CTA row */}
                          <div className="mt-4 pt-3 border-t border-slate-100 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookNowClick(c);
                              }}
                              className="w-full bg-[#ff8126] hover:bg-[#fd661e] text-white font-bold py-2 text-xs flex items-center justify-center border-0 cursor-pointer transition-all shadow-sm"
                              style={{ borderRadius: '8px' }}
                            >
                              <span>Book Now</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile cards layout */}
                  <div className="md:hidden flex flex-col gap-3">
                    {['value', 'classic', 'flex'].map((c: any) => {
                      const isSelected = selectedFareClass === c;
                      const farePrice = getFarePrice(selectedFlightForFare.price, c);
                      return (
                        <div 
                          key={c}
                          onClick={() => setSelectedFareClass(c)}
                          className={`border rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-2 border-[#0062e3] bg-[#f0f7ff]/20 shadow-sm' 
                              : 'border-slate-200'
                          }`}
                        >
                          <div>
                            {/* Card title & Radio */}
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-black text-slate-800 capitalize">{c}</span>
                              <input 
                                type="radio" 
                                name="fare_class_mobile" 
                                checked={isSelected}
                                onChange={() => setSelectedFareClass(c)}
                                className="fare-radio-custom"
                              />
                            </div>
                            
                            {/* Price */}
                            <div className="text-[14px] font-black text-[#0062e3]">
                              ₹{farePrice.toLocaleString('en-IN')}
                            </div>

                            {/* Features */}
                            {renderFareDetails(c, selectedFlightForFare.price)}
                          </div>

                          {/* Bottom CTA row */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookNowClick(c);
                              }}
                              className="w-full bg-[#ff8126] hover:bg-[#fd661e] text-white font-bold py-2 text-xs flex items-center justify-center border-0 cursor-pointer transition-all shadow-sm"
                              style={{ borderRadius: '8px' }}
                            >
                              <span>Book Now</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Step 2: Passenger Information Form */
                <div className="max-w-md mx-auto">
                  {/* Header info */}
                  <div className="p-3 bg-[#f0f7ff] rounded-xl border border-blue-100 mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-1">Selected Fare</div>
                      <div className="text-xs font-black text-slate-800 capitalize leading-none">{selectedFareClass} Class</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {selectedFlightForFare.fromCode} → {selectedFlightForFare.toCode} • {selectedFlightForFare.airlineName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-1">Total Cost</div>
                      <div className="text-sm font-black text-[#0062e3] leading-none">
                        ₹{getFarePrice(selectedFlightForFare.price, selectedFareClass).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[8.5px] text-slate-400 mt-0.5">incl. taxes</div>
                    </div>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-3">
                    Passenger Details
                  </h4>

                  <form onSubmit={handleFareSubmit} className="space-y-3.5">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter full name of lead passenger"
                        required
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#ff8126] focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none transition-all shadow-sm"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="Enter 10-digit mobile number"
                        required
                        value={passengerPhone}
                        onChange={handleFarePhoneChange}
                        onBlur={() => {
                          if (passengerPhone.length !== 10 && passengerPhone.length > 0) {
                            setFarePhoneError('Please enter a valid 10-digit number.');
                          } else {
                            setFarePhoneError('');
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#ff8126] focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none transition-all shadow-sm"
                      />
                      {farePhoneError && <small className="text-red-500 text-[10px] block mt-1">{farePhoneError}</small>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email (Optional)</label>
                      <input 
                        type="email" 
                        placeholder="Enter email address"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#ff8126] focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none transition-all shadow-sm"
                      />
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Special Requests (Optional)</label>
                      <textarea 
                        placeholder="Enter any additional requirements, e.g., meal preferences, wheelchair assistance, extra baggage..."
                        value={passengerMessage}
                        onChange={(e) => setPassengerMessage(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#ff8126] focus:bg-white rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none transition-all shadow-sm resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-3">
                      <button
                        type="button"
                        onClick={() => setDrawerStep('options')}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 text-xs border-0 cursor-pointer transition-colors"
                        style={{ borderRadius: '8px' }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingFare}
                        className="flex-[2] bg-gradient-to-r from-[#ff8126] to-[#fd661e] hover:from-[#fd661e] hover:to-[#e8520a] text-white font-bold py-2 text-xs border-0 cursor-pointer transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5"
                        style={{ borderRadius: '8px' }}
                      >
                        {isSubmittingFare ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Booking Inquiry</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </>
      )}

    </div>
  );
}
