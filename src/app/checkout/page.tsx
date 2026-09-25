'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_BASE_URL, resolveAssetUrl } from '../../config';
import { parseRoomsParam, totalExtraChargePerNight } from '../../lib/occupancyPricing';

interface Room {
  id: number;
  room_name: string;
  room_image: string;
  price_room_only: number;
  benefits_room_only?: string;
  price_with_breakfast: number;
  benefits_with_breakfast?: string;
  price_with_dinner: number;
  benefits_with_dinner?: string;
  extra_bed_charge?: number;
  cnb_charge?: number;
}

interface HotelDetails {
  id: number;
  name: string;
  location: string;
  featured_image: string;
  featured_image_alt?: string;
  price_per_night: number;
  star_rating?: number;
  rooms?: Room[];
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters
  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const planType = searchParams.get('planType') || 'room_only';
  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  
  // Default checkout date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckOut = tomorrow.toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || defaultCheckOut;
  
  // Guest/room configuration selected on the search bar (adults, children,
  // and each child's age per requested room) - drives the automatic extra
  // bed (3rd+ adult / child above 12) and CNB (child 6-12) charge calculation.
  const roomsSelection = useMemo(() => parseRoomsParam(searchParams.get('rooms')), [searchParams]);
  const roomsCount = roomsSelection.length;
  const guestsCount = roomsSelection.reduce((sum, r) => sum + r.adults + r.children, 0);

  // States
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Form Fields
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showGst, setShowGst] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');

  // Mobile check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load Hotel Details
  useEffect(() => {
    if (hotelId) {
      setLoading(true);
      fetch(`${API_BASE_URL}/hotels.php?id=${hotelId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success' && data.data) {
            setHotel(data.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [hotelId]);

  // Helper Calculations
  const selectedRoom = hotel?.rooms?.find((r) => r.id.toString() === roomId) || hotel?.rooms?.[0];

  const getPriceByPlan = () => {
    if (!selectedRoom) return hotel?.price_per_night || 0;
    if (planType === 'with_breakfast') return selectedRoom.price_with_breakfast;
    if (planType === 'with_dinner') return selectedRoom.price_with_dinner;
    return selectedRoom.price_room_only;
  };

  const getPlanLabel = () => {
    if (planType === 'with_breakfast') return 'Room with Breakfast';
    if (planType === 'with_dinner') return 'Room with Breakfast & Dinner (MAP)';
    return 'Room Only';
  };

  const getInclusions = () => {
    if (!selectedRoom) return ['Standard accommodation'];
    const rawBenefits = 
      planType === 'with_breakfast' 
        ? selectedRoom.benefits_with_breakfast 
        : planType === 'with_dinner'
        ? selectedRoom.benefits_with_dinner
        : selectedRoom.benefits_room_only;
    
    if (rawBenefits) {
      return rawBenefits.split('\n').map((b) => b.trim()).filter(Boolean);
    }
    return [planType === 'with_breakfast' ? 'Daily buffet breakfast included' : planType === 'with_dinner' ? 'Breakfast and Dinner included' : 'Room stay only'];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getNightsCount = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    if (isNaN(diffTime) || diffTime <= 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = getNightsCount();
  const unitPrice = getPriceByPlan();
  const roomSubtotal = Math.round(unitPrice * roomsCount * nights);

  // Extra bed (3rd+ adult, or child above 12) + CNB (child 6-12) charges,
  // auto-calculated per night from the searched occupancy and this room
  // type's admin-configured rates, summed across all requested rooms.
  const extraChargePerNight = totalExtraChargePerNight(
    roomsSelection,
    selectedRoom?.extra_bed_charge || 0,
    selectedRoom?.cnb_charge || 0
  );
  const extraChargeSubtotal = Math.round(extraChargePerNight * nights);

  const subtotal = roomSubtotal + extraChargeSubtotal;
  const taxes = Math.round(subtotal * 0.05); // 5% Taxes & fees
  const grandTotal = Math.round(subtotal + taxes - discount);

  // Apply Promo Code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }
    if (code === 'KASHMIR20' || code === 'WELCOME10' || code === 'TWIN500') {
      let discVal = 500; // Flat ₹500 discount for TWIN500
      if (code === 'KASHMIR20') discVal = Math.round(subtotal * 0.2); // 20% off
      if (code === 'WELCOME10') discVal = Math.round(subtotal * 0.1); // 10% off
      
      setDiscount(discVal);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setDiscount(0);
    setPromoCode('');
    setPromoError('');
  };

  // Validate and submit Step 1 Form
  const handleContinueBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions to proceed';
    }

    if (showGst && !gstNumber.trim()) {
      newErrors.gstNumber = 'GSTIN number is required when GST Details is checked';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else {
      setErrors({});
      setShowPaymentModal(true);
    }
  };

  // UTR Payment verification
  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.length < 8) {
      setUtrError('Please enter a valid transaction UTR number (min 8 digits)');
    } else {
      setUtrError('');
      // Redirect to thank you page
      router.push(`/thank-you?hotel=${encodeURIComponent(hotel?.name || '')}&room=${encodeURIComponent(selectedRoom?.room_name || '')}&total=${grandTotal}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1140px] mx-auto px-4 w-full py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8126] mx-auto mb-4"></div>
        <p className="text-slate-500 font-bold">Loading booking summary details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-[1140px] mx-auto px-4 w-full py-24 text-center">
        <h3 className="font-extrabold text-[#094074] text-xl mb-2">Hotel Details Not Found</h3>
        <p className="text-slate-500 mb-6">We could not load the details of the selected hotel booking.</p>
        <button 
          onClick={() => router.push('/hotel/list')}
          className="px-6 py-2.5 bg-[#ff8126] hover:bg-orange-600 text-white font-extrabold rounded-lg border-none tracking-wider transition"
        >
          Return to Hotel Search
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] w-full min-h-screen px-[10px] sm:px-3 lg:px-4 pt-[76px] pb-[80px] sm:pb-6">
      <div className="max-w-[1140px] mx-auto">
        
        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-2 mb-[10px] text-xs lg:text-sm font-bold text-slate-400">
          <span className="text-[#ff8126] flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#ff8126] text-white flex items-center justify-center text-[10px]">1</span>
            Review and Travellers
          </span>
          <i className="fa-solid fa-chevron-right text-slate-300 text-[10px]"></i>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">2</span>
            Payment
          </span>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Review details & traveller forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Hotel Summary Card */}
            <div className="bg-white border border-slate-150 rounded-2xl py-4 sm:py-4 shadow-none flex flex-col sm:flex-row gap-4 mx-[10px] sm:mx-0" style={{ marginTop: '60px', marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px', paddingLeft: '10px', paddingRight: '10px' }}>
              <div className="w-full sm:w-[160px] rounded-xl overflow-hidden flex-shrink-0" style={{ height: isMobile ? '156px' : '120px' }}>
                <img 
                  src={hotel.featured_image ? resolveAssetUrl(hotel.featured_image.replace('../', '')) : '/images/default-hotel.jpg'}
                  alt={hotel.featured_image_alt || hotel.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start w-full">
                  <div className="min-w-0 flex-grow pr-4">
                    <h2 className="font-extrabold text-slate-800 mb-1 leading-tight" style={{ fontSize: '20px' }}>{hotel.name}</h2>
                    <div className="text-amber-500 text-xs mb-1.5">
                      {Array.from({ length: Math.floor(hotel.star_rating || 5) }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star mr-0.5"></i>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs font-semibold mb-3">
                      <i className="fa-solid fa-location-dot mr-1"></i>{hotel.location}
                    </p>
                  </div>
                  
                  {/* Change Hotel Link */}
                  <button 
                    onClick={() => router.push('/hotel/list')}
                    className="text-[#0066cc] hover:text-blue-800 font-normal hover:underline bg-transparent border-none p-0 cursor-pointer flex-shrink-0 mt-1"
                    style={{ fontSize: '10px' }}
                  >
                    [Change Hotel]
                  </button>
                </div>

                {/* Check In / Out Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-[5px] py-3 sm:p-3 grid grid-cols-3 text-center sm:text-left gap-2">
                  <div>
                    <small className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5">Check-In</small>
                    <span className="font-extrabold text-slate-800 text-xs block">{formatDate(checkIn)}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">02:00 PM</span>
                  </div>
                  <div className="border-l border-r border-slate-200 px-2">
                    <small className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5">Check-Out</small>
                    <span className="font-extrabold text-slate-800 text-xs block">{formatDate(checkOut)}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">12:00 PM</span>
                  </div>
                  <div>
                    <small className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider mb-0.5">Guest & Room</small>
                    <span className="font-extrabold text-slate-800 text-xs block">{guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{roomsCount} Room | {nights} Night</span>
                  </div>
                </div>
              </div>
            </div>            
            {/* Room Type Details Box */}
             <div className="bg-white border border-slate-150 rounded-2xl shadow-none overflow-hidden" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px' }}>
              <div className="bg-amber-50 py-3 flex justify-between items-center border-b border-amber-200" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2 mb-0" style={{ fontSize: isMobile ? '14px' : '18px' }}>
                  <i className="fa-solid fa-hotel text-slate-700" style={{ fontSize: isMobile ? '14px' : '18px' }}></i>
                  Room Type: <span className="text-slate-800">{selectedRoom?.room_name || 'Standard Room'}</span>
                </h3>
                
                {/* Change Room Link */}
                <button 
                  onClick={() => router.push(`/hotels-details?id=${hotelId}`)}
                  className="text-[#0066cc] hover:text-blue-800 font-normal hover:underline bg-transparent border-none p-0 cursor-pointer flex-shrink-0"
                  style={{ fontSize: '10px' }}
                >
                  [Change Room]
                </button>
              </div>
              
              <div className="py-4 sm:py-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-2" style={{ fontSize: isMobile ? '14px' : '16px' }}>Inclusions:</h5>
                <ul className="list-none pl-0 mb-4 space-y-1.5">
                  {getInclusions().map((inclusion, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <i className="fa-solid fa-circle-check text-green-500"></i>
                      {inclusion}
                    </li>
                  ))}
                </ul>

                <h5 className="font-bold text-slate-700 uppercase tracking-wider mb-1" style={{ fontSize: isMobile ? '14px' : '16px' }}>Cancellation Policy:</h5>
                <p className="text-slate-500 text-xs font-bold mb-0">
                  <i className="fa-solid fa-circle-info text-amber-500 mr-1.5"></i>
                  This booking is non-refundable. Cancellation or modification is not permitted.
                </p>
              </div>
            </div>
            {/* Traveller Form Box */}
            <form id="booking-form" onSubmit={handleContinueBooking} className="bg-white border border-slate-150 rounded-2xl shadow-none overflow-hidden" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px' }}>
              {/* Header Box */}
              <div className="bg-amber-50 py-3 flex flex-col border-b border-amber-200 animate-fade-in" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h3 className="font-extrabold text-slate-800 mb-0.5 flex items-center gap-2" style={{ fontSize: '18px' }}>
                  <i className="fa-solid fa-user-group text-slate-700"></i>
                  Guest Details
                </h3>
                <p className="text-slate-500 font-semibold mb-0" style={{ fontSize: '12px' }}>
                  Enter your details as per your Govt ID proof.
                </p>
              </div>

              <div className="p-4 flex flex-col gap-5" style={{ paddingLeft: isMobile ? '10px' : '20px', paddingRight: isMobile ? '10px' : '20px' }}>

                {/* Guest Fields (Adult 1) */}
                <div>
                  <div className="grid grid-cols-12 gap-3 mb-0">
                    <div className="col-span-4 sm:col-span-2">
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Title</label>
                      <select 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-select text-xs font-semibold border-slate-200 rounded-xl py-1.5 w-full focus:border-[#ff8126] focus:ring-0"
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Mrs.">Mrs.</option>
                      </select>
                    </div>
                    <div className="col-span-8 sm:col-span-5">
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">First Name (& Middle Name if any)</label>
                      <input 
                        type="text" 
                        placeholder="Enter First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`form-control text-xs font-semibold border-slate-200 rounded-xl py-1.5 w-full focus:border-[#ff8126] focus:ring-0 ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.firstName}</span>}
                    </div>
                    <div className="col-span-12 sm:col-span-5">
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`form-control text-xs font-semibold border-slate-200 rounded-xl py-1.5 w-full focus:border-[#ff8126] focus:ring-0 ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.lastName}</span>}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 mb-3.5" style={{ fontSize: '15px' }}>Contact Information</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Address */}
                    <div>
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Email Address</label>
                      <div className="relative flex items-center">
                        <input 
                          type="email" 
                          placeholder="Enter Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`form-control text-xs font-semibold border-slate-200 rounded-xl py-1.5 w-full pr-10 focus:border-[#ff8126] focus:ring-0 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        <i className="fa-regular fa-envelope text-slate-400 absolute right-3.5 text-sm pointer-events-none"></i>
                      </div>
                      {errors.email && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.email}</span>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Phone Number</label>
                      <div className="flex border border-slate-200 rounded-xl overflow-hidden items-center bg-white focus-within:border-[#ff8126]">
                        <select 
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="form-select text-xs font-semibold border-none rounded-none py-1.5 focus:ring-0 cursor-pointer bg-transparent"
                          style={{ width: '70px', paddingRight: '20px' }}
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+971">+971</option>
                        </select>
                        <div className="h-5 w-[1px] bg-slate-200"></div>
                        <input 
                          type="tel" 
                          placeholder="Enter Mobile Number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className={`form-control text-xs font-semibold border-none rounded-none py-1.5 focus:ring-0 flex-grow px-3 ${errors.mobile ? 'text-red-500' : ''}`}
                        />
                      </div>
                      {errors.mobile && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.mobile}</span>}
                    </div>
                  </div>
                </div>

                {/* GST Details Box */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="gstCheck"
                      checked={showGst}
                      onChange={(e) => setShowGst(e.target.checked)}
                      className="rounded text-[#ff8126] border-slate-200 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="gstCheck" className="text-slate-600 text-xs font-bold cursor-pointer select-none">
                      (+) GST Details <span className="text-slate-400 font-semibold">(Optional)</span>
                    </label>
                  </div>
                  
                  {showGst && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-slate-50 border border-slate-155 rounded-xl px-[5px] py-3 sm:p-3">
                      <div>
                        <label className="text-slate-500 text-xs font-bold mb-1.5 block">GSTIN Number</label>
                        <input 
                          type="text" 
                          placeholder="ENTER 15 DIGIT GSTIN"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                          maxLength={15}
                          className={`form-control text-xs font-semibold uppercase border-slate-200 rounded-lg py-2 ${errors.gstNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.gstNumber && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.gstNumber}</span>}
                      </div>
                      <div>
                        <label className="text-slate-500 text-xs font-bold mb-1.5 block">Company Name</label>
                        <input 
                          type="text" 
                          placeholder="ENTER COMPANY NAME"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="form-control text-xs font-semibold uppercase border-slate-200 rounded-lg py-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Agreement checkbox */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <input 
                      type="checkbox" 
                      id="termsCheck"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded text-[#ff8126] border-slate-200 focus:ring-0 mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="termsCheck" className="text-slate-500 text-xs font-semibold leading-tight cursor-pointer select-none">
                      I understand and agree to the rules of this fare, the <span className="text-[#ff8126] hover:underline font-bold">Terms & Conditions</span> and <span className="text-[#ff8126] hover:underline font-bold">Privacy Policy</span> of Twin Brothers Holidays.
                    </label>
                  </div>
                  {errors.agreeTerms && <span className="text-red-500 text-[10px] font-bold mt-2 block">{errors.agreeTerms}</span>}
                </div>

                {/* Continue Booking Button */}
                <div className="text-center border-t border-slate-100 pt-4" style={{ marginTop: '10px' }}>
                  <button 
                    type="submit"
                    className="bg-[#f25b22] hover:bg-orange-600 text-white font-extrabold transition-all border-none text-center shadow-lg shadow-orange-600/10 w-full sm:w-auto"
                    style={{ borderRadius: '8px', fontSize: '16px', letterSpacing: '1px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px' }}
                  >
                    Continue Booking
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Pricing & Promos Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-[66px]">
            
            {/* Price Details Card */}
            <div className="bg-white border border-slate-150 rounded-2xl shadow-none overflow-hidden" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px' }}>
              <div className="bg-amber-50 py-3 border-b border-amber-200" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2 mb-0" style={{ fontSize: '16px' }}>
                  <i className="fa-solid fa-calculator text-slate-700"></i>
                  Room Price Details
                </h3>
              </div>

              <div className="py-4 space-y-3 pt-4" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
                  <span>{roomsCount} Room x {nights} Night</span>
                  <span className="text-slate-800 font-bold">₹{roomSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {extraChargeSubtotal > 0 && (
                  <div className="flex justify-between items-center text-xs text-amber-600 font-semibold">
                    <span>Extra Bed / Child (CNB) Charges</span>
                    <span className="text-amber-700 font-bold">₹{extraChargeSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
                  <span>Taxes & fees (5%)</span>
                  <span className="text-slate-800 font-bold">₹{taxes.toLocaleString('en-IN')}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-green-600 font-bold">
                    <span>Promo Discount</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span className="font-black text-[#ff8126] text-sm uppercase">Grand Total</span>
                  <span className="font-black text-slate-900 text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Promos & Promo Codes Card */}
            <div className="bg-white border border-slate-150 rounded-2xl py-4 sm:py-4 shadow-none" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px', paddingLeft: '10px', paddingRight: '10px' }}>
              
              {/* Fake Claim Promo Stripe */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-[5px] py-3 sm:p-3 flex justify-between items-center gap-2 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-ticket text-amber-500 text-sm flex-shrink-0"></i>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-amber-800 block">Flat ₹500 Cashback</span>
                    <span className="text-[9px] text-slate-500 block leading-tight truncate">On booking above ₹5,000</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setPromoCode('TWIN500');
                    setDiscount(500);
                    setPromoApplied(true);
                    setPromoError('');
                  }}
                  disabled={promoApplied}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold text-[9px] tracking-wider transition border-none uppercase"
                  style={{ borderRadius: '6px' }}
                >
                  {promoApplied && promoCode === 'TWIN500' ? 'Applied' : 'Claim'}
                </button>
              </div>

              {/* Promo input form */}
              <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-2.5" style={{ fontSize: '14px' }}>Offers & Promo Codes</h3>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="ENTER PROMO CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="form-control text-xs font-semibold uppercase border-slate-200 rounded-lg py-2 focus:border-[#ff8126] focus:ring-0 flex-grow"
                />
                {promoApplied ? (
                  <button 
                    type="button"
                    onClick={handleRemovePromo}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-extrabold text-xs rounded-lg transition border-none whitespace-nowrap"
                  >
                    Remove
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#094074] font-extrabold text-xs rounded-lg transition border-none whitespace-nowrap"
                  >
                    Apply
                  </button>
                )}
              </form>
              
              {promoError && <span className="text-red-500 text-[10px] font-bold mt-1.5 block">{promoError}</span>}
              {promoApplied && (
                <span className="text-green-600 text-[10px] font-bold mt-1.5 block">
                  <i className="fa-solid fa-circle-check mr-1"></i>
                  Code {promoCode} successfully applied! Saving ₹{discount.toLocaleString('en-IN')}
                </span>
              )}
              
              <div className="mt-3.5 pt-2 border-t border-slate-100">
                <small className="text-slate-400 uppercase tracking-wide block mb-1" style={{ fontSize: '14px', fontWeight: 'bold' }}>Available codes to try:</small>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">KASHMIR20 (20% Off)</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">WELCOME10 (10% Off)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Payment Processing Modal (UPI Scanner UI) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-2xl max-w-[420px] w-full text-center relative animate-fade-in-up">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 bg-transparent border-none text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="font-extrabold text-[#094074] text-lg mb-1">UPI Payment Portal</h3>
            <p className="text-slate-400 text-xs font-semibold mb-4">Twin Brothers Holidays Secure Checkout</p>

            <div className="border border-slate-100 rounded-xl bg-slate-50 p-3 mb-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Amount Payable</span>
              <span className="font-black text-slate-900 text-2xl">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* QR Code Scanner Placeholder Card */}
            <div className="border border-slate-155 rounded-2xl p-4 bg-white flex flex-col items-center justify-center shadow-sm max-w-[240px] mx-auto mb-4">
              {/* Dummy QR Code Image using standard UI shape */}
              <div className="w-[180px] h-[180px] bg-slate-50 rounded-lg flex flex-col items-center justify-center p-2.5 relative border border-slate-100">
                <i className="fa-solid fa-qrcode text-slate-700 text-[120px] leading-none mb-1"></i>
                <div className="absolute inset-0 bg-[#ff8126]/5 rounded-lg flex items-center justify-center border border-dashed border-[#ff8126]/30 animate-pulse"></div>
                <span className="text-[8px] font-black text-[#ff8126] tracking-wider uppercase">Scan with any UPI App</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-[10.5px] text-slate-500 font-semibold mb-4 space-y-1.5 text-left max-w-[320px] mx-auto">
              <div className="flex items-start gap-1.5">
                <i className="fa-solid fa-circle-info text-[#ff8126] mt-0.5"></i>
                <span>Scan the QR code with GPay, PhonePe, Paytm or Bhim UPI app to pay.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <i className="fa-solid fa-circle-info text-[#ff8126] mt-0.5"></i>
                <span>After completing payment in your app, enter the **Transaction ID / UTR Number** below to verify.</span>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyPayment} className="text-left pt-2 border-t border-slate-100">
              <label className="text-slate-500 text-xs font-bold mb-1.5 block">12-Digit Transaction ID (UTR)</label>
              <input 
                type="text" 
                placeholder="ENTER UTR / TRANSACTION NUMBER"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={12}
                className={`form-control text-xs font-semibold border-slate-200 rounded-lg py-2 mb-1.5 focus:border-[#ff8126] focus:ring-0 ${utrError ? 'border-red-500' : ''}`}
              />
              {utrError && <span className="text-red-500 text-[10px] font-bold mb-3 block">{utrError}</span>}

              <button 
                type="submit"
                className="w-full py-2.5 bg-[#f25b22] hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition border-none text-center shadow-md shadow-orange-500/20"
              >
                Verify & Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

        {/* Bottom Fixed Booking Bar for Mobile View */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#222222] px-4 py-3 flex items-center justify-between z-50 rounded-t-2xl shadow-2xl border-t border-[#333333] sm:hidden">
          <div className="flex flex-col">
            <span className="text-white text-[10px] font-bold tracking-wide">
              {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'} | {nights} {nights === 1 ? 'Night' : 'Nights'} | {guestsCount} {guestsCount === 1 ? 'Guest' : 'Guests'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-white text-xl font-normal">₹{grandTotal.toLocaleString('en-IN')}</span>
              <i className="fa-solid fa-circle-info text-slate-400 text-xs cursor-pointer"></i>
            </div>
          </div>
          <button 
            type="submit" 
            form="booking-form"
            className="bg-[#f25b22] hover:bg-orange-600 text-white font-normal py-2.5 transition-all border-none shadow-lg shadow-orange-600/10 cursor-pointer"
            style={{ borderRadius: '24px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', fontSize: '14px' }}
          >
            Continue Booking
          </button>
        </div>
      </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1140px] mx-auto px-4 w-full py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff8126] mx-auto mb-4"></div>
        <p className="text-slate-500 font-bold">Loading payment portal...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
