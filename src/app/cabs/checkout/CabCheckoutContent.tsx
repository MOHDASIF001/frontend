'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const TAXI_IMAGES = ['/images/cab.jpg', '/images/cab-blue.jpeg', '/images/cab-white.jpeg'];

export default function CabCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cabId = Number(searchParams.get('cabId') || 0);
  const cabName = searchParams.get('name') || 'Cab';
  const vehicleType = searchParams.get('vehicleType') || 'Sedan';
  const finalPrice = Math.round(Number(searchParams.get('price') || 2000));
  const pickup = searchParams.get('pickup') || 'Pickup Location';
  const drop = searchParams.get('drop') || 'Drop Location';
  const pickupDate = searchParams.get('pickupDate') || new Date().toISOString().split('T')[0];
  const pickupTime = searchParams.get('pickupTime') || '10:00';
  const image = TAXI_IMAGES[cabId % TAXI_IMAGES.length];

  // Form fields
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showGst, setShowGst] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');

  const [readBeforeOpen, setReadBeforeOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'part' | 'full'>('part');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const grandTotal = finalPrice;
  const partPaymentAmount = Math.round(finalPrice * 0.25);
  const kmChargeText = 'Rs. 15.5/km after 1299 km';
  const luggageBags = 2;

  const formatScheduled = (dateStr: string, timeStr: string) => {
    if (!dateStr) return '';
    const d = new Date(`${dateStr}T${timeStr || '00:00'}`);
    if (isNaN(d.getTime())) return '';
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()} ${hours}:${mm} ${ampm}`;
  };

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

    if (!pickupAddress.trim()) newErrors.pickupAddress = 'Exact pick-up location is required';
    if (!dropAddress.trim()) newErrors.dropAddress = 'Exact drop location is required';

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions to proceed';
    }

    if (showGst && !gstNumber.trim()) {
      newErrors.gstNumber = 'GSTIN number is required when GST Details is checked';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else {
      setErrors({});
      setShowPaymentModal(true);
    }
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.length < 8) {
      setUtrError('Please enter a valid transaction UTR number (min 8 digits)');
    } else {
      setUtrError('');
      router.push(`/thank-you?cab=${encodeURIComponent(cabName)}&total=${grandTotal}`);
    }
  };

  return (
    <div className="bg-[#f8fafc] w-full min-h-screen px-[10px] sm:px-3 lg:px-4 pt-[76px] pb-[80px] sm:pb-6">

      {/* Mobile-only header bar (replaces the numbered stepper on small screens) */}
      <div
        className="lg:hidden flex items-center gap-3 -mx-[10px] px-4"
        style={{ background: 'linear-gradient(90deg, #094074, #05213d)', marginTop: '-16px', paddingTop: '14px', paddingBottom: '14px' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="text-white border-none bg-transparent cursor-pointer"
          style={{ fontSize: '16px' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-white font-black mb-0" style={{ fontSize: '15px' }}>Cab Review &amp; Traveller</h1>
      </div>

      <div className="max-w-[1140px] mx-auto">

        {/* Stepper Progress Bar (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2 mb-[10px] text-xs lg:text-sm font-bold text-slate-400">
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

          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Trip Summary Card (Desktop) */}
            <div className="hidden lg:block bg-white border border-slate-150 rounded-2xl py-4 shadow-none" style={{ marginTop: '60px', paddingLeft: '10px', paddingRight: '10px' }}>
              <p className="font-extrabold text-slate-800 mb-3" style={{ fontSize: '15px' }}>
                Pickup: {formatScheduled(pickupDate, pickupTime)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-[160px] h-[120px] rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center">
                  <img src={image} alt={cabName} className="w-full h-full object-contain p-2" />
                  <span
                    className="absolute bottom-0 left-0 right-0 text-white text-center font-bold uppercase"
                    style={{ fontSize: '10px', background: 'linear-gradient(135deg, #094074, #05213d)', paddingTop: '4px', paddingBottom: '4px' }}
                  >
                    {vehicleType}
                  </span>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Pickup</span>
                    <span className="font-extrabold text-slate-800 text-sm">{pickup}</span>
                  </div>
                  <i className="fa-solid fa-arrow-right text-slate-400 mx-3"></i>
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Drop-Off</span>
                    <span className="font-extrabold text-slate-800 text-sm">{drop}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Car Model</span>
                  <span className="font-bold text-[#094074] text-xs">{cabName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Km Charges</span>
                  <span className="font-bold text-[#094074] text-xs">{kmChargeText}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Fuel Type</span>
                  <span className="font-bold text-[#094074] text-xs">Diesel/Petrol</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Extra</span>
                  <span className="font-bold text-[#094074] text-xs">{luggageBags} Luggage Bags | 4 Seats | AC</span>
                </div>
              </div>
            </div>

            {/* Trip Summary Card (Mobile compact) */}
            <div className="lg:hidden bg-white border border-slate-150 rounded-2xl p-3">
              <h2 className="font-black text-slate-900 mb-0.5" style={{ fontSize: '16px' }}>{pickup} <i className="fa-solid fa-arrow-right text-slate-400 mx-1" style={{ fontSize: '12px' }}></i> {drop}</h2>
              <p className="text-slate-400 font-semibold mb-3" style={{ fontSize: '11px' }}>
                Pickup : {formatScheduled(pickupDate, pickupTime)}
              </p>

              <div className="flex gap-3 pb-3 border-b border-slate-100">
                <div className="w-[64px] h-[52px] rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center">
                  <img src={image} alt={cabName} className="w-full h-full object-contain p-1" />
                </div>
                <div className="min-w-0">
                  <span
                    className="inline-block text-white font-bold rounded-md mb-1"
                    style={{ fontSize: '9px', background: '#1d91f2', paddingLeft: '6px', paddingRight: '6px', paddingTop: '1px', paddingBottom: '1px' }}
                  >
                    {vehicleType}
                  </span>
                  <div className="font-black text-slate-900 truncate" style={{ fontSize: '14px' }}>{cabName}</div>
                  <div className="text-slate-500 font-semibold" style={{ fontSize: '11px' }}>4 Seat | {luggageBags} Luggage | 1299 Km | AC</div>
                </div>
              </div>

              <div className="pt-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500 font-semibold" style={{ fontSize: '12px' }}>
                    <i className="fa-solid fa-gauge-high" style={{ color: '#094074', fontSize: '11px' }}></i> Km Charges
                  </span>
                  <span className="font-bold text-slate-800" style={{ fontSize: '12px' }}>1299 km Included after that 15.5/km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500 font-semibold" style={{ fontSize: '12px' }}>
                    <i className="fa-solid fa-gas-pump" style={{ color: '#094074', fontSize: '11px' }}></i> Fuel Type
                  </span>
                  <span className="font-bold text-slate-800" style={{ fontSize: '12px' }}>Diesel/Petrol</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500 font-semibold" style={{ fontSize: '12px' }}>
                    <i className="fa-solid fa-circle-check" style={{ color: '#1fae5c', fontSize: '11px' }}></i> Free Cancellation
                  </span>
                  <span className="font-bold text-slate-800" style={{ fontSize: '12px' }}>before 24 hours from the journey time.</span>
                </div>
              </div>
            </div>

            {/* Read Before You Book (Mobile compact trigger) */}
            <div className="lg:hidden bg-white border border-slate-150 rounded-2xl p-3 flex items-center justify-between">
              <h3 className="font-black text-slate-900 mb-0" style={{ fontSize: '15px' }}>Read Before You Book!</h3>
              <button
                type="button"
                onClick={() => setReadBeforeOpen(!readBeforeOpen)}
                className="text-white font-bold border-none cursor-pointer"
                style={{ background: '#1d91f2', fontSize: '11px', borderRadius: '999px', paddingLeft: '14px', paddingRight: '14px', paddingTop: '5px', paddingBottom: '5px' }}
              >
                {readBeforeOpen ? 'Hide' : 'View'}
              </button>
            </div>

            {/* Traveller Form Box */}
            <form id="cab-booking-form" onSubmit={handleContinueBooking} className="bg-white border border-slate-150 rounded-2xl shadow-none overflow-hidden" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px' }}>
              <div className="bg-amber-50 py-3 flex flex-col border-b border-amber-200" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                <h3 className="font-extrabold text-slate-800 mb-0.5 flex items-center gap-2" style={{ fontSize: '18px' }}>
                  <i className="fa-solid fa-user-group text-slate-700"></i>
                  Travellers Details
                </h3>
                <p className="text-slate-500 font-semibold mb-0" style={{ fontSize: '12px' }}>
                  Enter your details as per your Govt ID proof.
                </p>
              </div>

              <div className="p-4 flex flex-col gap-3" style={{ paddingLeft: isMobile ? '10px' : '20px', paddingRight: isMobile ? '10px' : '20px' }}>

                {/* Title */}
                <div>
                  <label className="lg:hidden text-slate-900 text-[12px] font-bold mb-1.5 block">Gender</label>
                  <div className="flex gap-2 mb-3">
                    {['Mr.', 'Ms.', 'Mrs.'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTitle(t)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-full border cursor-pointer transition ${title === t ? 'border-[#1d91f2] text-[#1d91f2] bg-blue-50' : 'border-slate-200 text-slate-500 bg-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">First Name</label>
                      <input
                        type="text"
                        placeholder="Enter First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`form-control text-xs font-semibold border-slate-200 rounded-xl py-1.5 w-full focus:border-[#ff8126] focus:ring-0 ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.firstName}</span>}
                    </div>
                    <div>
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

                {/* Contact Info */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 mb-3.5" style={{ fontSize: '15px' }}>Contact Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Email</label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          placeholder="Enter Your Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`form-control text-xs font-semibold border-slate-200 rounded-xl py-1.5 w-full pr-10 focus:border-[#ff8126] focus:ring-0 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        <i className="fa-regular fa-envelope text-slate-400 absolute right-3.5 text-sm pointer-events-none"></i>
                      </div>
                      {errors.email && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.email}</span>}
                    </div>

                    <div>
                      <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Phone</label>
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
                          placeholder="Enter Mobile No"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className={`form-control text-xs font-semibold border-none rounded-none py-1.5 focus:ring-0 flex-grow px-3 ${errors.mobile ? 'text-red-500' : ''}`}
                        />
                      </div>
                      {errors.mobile && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.mobile}</span>}
                    </div>
                  </div>
                  <p className="text-slate-400 text-[10px] font-semibold mt-2">
                    Your booking details will be sent to this email address and mobile number.
                  </p>
                </div>

                {/* Trip Details */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 mb-3.5" style={{ fontSize: '15px' }}>Trip Details</h4>

                  <div className="mb-3">
                    <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Pick-Up Address</label>
                    <input
                      type="text"
                      placeholder="Enter Exact Pickup Location"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className={`form-control text-xs font-semibold border-slate-200 rounded-xl py-2 w-full focus:border-[#ff8126] focus:ring-0 ${errors.pickupAddress ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setPickupAddress(pickup)}
                      className="mt-1.5 text-left w-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg py-1.5 px-2.5 border-none cursor-pointer transition"
                    >
                      {pickup}
                    </button>
                    {errors.pickupAddress && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.pickupAddress}</span>}
                  </div>

                  <div>
                    <label className="text-slate-900 text-[12px] font-bold mb-0.5 block">Drop-Off Address</label>
                    <input
                      type="text"
                      placeholder="Enter Exact Drop Location"
                      value={dropAddress}
                      onChange={(e) => setDropAddress(e.target.value)}
                      className={`form-control text-xs font-semibold border-slate-200 rounded-xl py-2 w-full focus:border-[#ff8126] focus:ring-0 ${errors.dropAddress ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setDropAddress(drop)}
                      className="mt-1.5 text-left w-full bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg py-1.5 px-2.5 border-none cursor-pointer transition"
                    >
                      {drop}
                    </button>
                    {errors.dropAddress && <span className="text-red-500 text-[10px] font-bold mt-1 block">{errors.dropAddress}</span>}
                  </div>

                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <p className="text-[#094074] text-xs font-semibold mb-0">
                      Please enter pick-up and drop locations within <span className="font-black">3-4 km</span> of your searched location for a smooth, hassle-free experience.
                    </p>
                  </div>
                </div>

                {/* GST Details */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="gstCheck"
                      checked={showGst}
                      onChange={(e) => setShowGst(e.target.checked)}
                      className="rounded text-[#ff8126] border-slate-200 focus:ring-0 cursor-pointer mt-0.5"
                    />
                    <label htmlFor="gstCheck" className="text-slate-600 text-xs font-bold cursor-pointer select-none">
                      Use GST for this booking <span className="text-slate-400 font-semibold">(Optional)</span>
                      <span className="text-slate-400 font-semibold block mt-0.5" style={{ fontSize: '10px' }}>
                        To claim credit of GST charged by Cab Vendor/Twin Brothers Holidays, please enter your company&apos;s GST number
                      </span>
                    </label>
                  </div>

                  {showGst && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-slate-50 border border-slate-155 rounded-xl p-3">
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

                {/* Agreement */}
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
                      I understand and agree to the rules of this fare, and the <span className="text-[#ff8126] hover:underline font-bold">Terms &amp; Conditions</span> of Twin Brothers Holidays.
                    </label>
                  </div>
                  {errors.agreeTerms && <span className="text-red-500 text-[10px] font-bold mt-2 block">{errors.agreeTerms}</span>}
                </div>

                {/* Continue Button (desktop) */}
                <div className="text-center border-t border-slate-100 pt-4 hidden sm:block" style={{ marginTop: '10px' }}>
                  <button
                    type="submit"
                    className="bg-[#f25b22] hover:bg-orange-600 text-white font-extrabold transition-all border-none text-center shadow-lg shadow-orange-600/10"
                    style={{ borderRadius: '8px', fontSize: '16px', letterSpacing: '1px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px' }}
                  >
                    Continue Booking
                  </button>
                </div>
              </div>
            </form>

            {/* Read Before You Book */}
            <div className="bg-white border border-slate-150 rounded-2xl shadow-none overflow-hidden" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px' }}>
              <button
                type="button"
                onClick={() => setReadBeforeOpen(!readBeforeOpen)}
                className="hidden lg:flex w-full bg-slate-50 py-3 items-center justify-between border-none cursor-pointer"
                style={{ paddingLeft: '10px', paddingRight: '10px' }}
              >
                <h3 className="font-extrabold text-slate-800 mb-0" style={{ fontSize: '16px' }}>Read Before You Book</h3>
                <i className={`fa-solid fa-chevron-down text-slate-500 transition-transform ${readBeforeOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {readBeforeOpen && (
                <div className="p-4" style={{ paddingLeft: isMobile ? '10px' : '20px', paddingRight: isMobile ? '10px' : '20px' }}>

                  {/* Driver and Cab Details */}
                  <div className="border border-slate-100 rounded-xl p-4 mb-4 bg-slate-50">
                    <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Driver and Cab Details</h4>
                    <h5 className="font-bold text-slate-800 text-xs mb-1">Cab Category</h5>
                    <p className="text-slate-500 text-xs font-semibold mb-3">
                      The booking will be for a cab type {vehicleType}. We do not commit to providing any preferred cab model (e.g., Indica, Swift, Xylo, Ertiga).
                    </p>
                    <h5 className="font-bold text-slate-800 text-xs mb-1">Driver Details</h5>
                    <p className="text-slate-500 text-xs font-semibold mb-0">
                      The driver&apos;s details will be shared up to 1 hour prior to departure. In case the driver or cab is different from the one communicated, please do not board and contact us immediately.
                    </p>
                  </div>

                  {/* Inclusions & Exclusion */}
                  <div className="border border-slate-100 rounded-xl p-4 mb-4">
                    <h4 className="font-black text-slate-900 mb-3" style={{ fontSize: '15px' }}>Inclusions &amp; Exclusion</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {[
                        'Car will be of any model in car category you choose',
                        'After 1299, per kilometer charge (Rs. 15.5) will be applicable.',
                        'Driver Daily allowance 750',
                        'Fare includes Vehicle & Fuel charges, One Pickup & Drop, 30 min. break.',
                        'Waiting Charges: (Driver shall wait for 45 minutes at pickup location. Post that) 120/hr',
                        'Night Charges Amount: Rs 250 (Applicable between 10 pm to 6 am)',
                        'Toll and State Tax not included, to be paid, wherever applicable.',
                        'Parking & Airport Entry (not included in bill) to be paid wherever applicable.',
                      ].map((line, i) => (
                        <p key={i} className="text-slate-500 text-xs font-semibold flex items-start gap-1.5 mb-0">
                          <i className="fa-solid fa-circle text-slate-300 mt-1.5" style={{ fontSize: '4px' }}></i>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="border border-slate-100 rounded-xl p-4 mb-4 bg-green-50/40">
                    <h4 className="font-black text-[#1fae5c] mb-3" style={{ fontSize: '15px' }}>Cancellation policy</h4>
                    {[
                      'If cancelled before 6 hours from the journey time, no retention applicable (Free Cancellation).',
                      'If cancelled within 6 hours of time from the journey time 50% or max. 1000 Rs. retention applicable.',
                      'In case of no show or cancellation after pick up time 100% retention applicable',
                      'Free cancellation within 30 min of booking.',
                      'In case of a natural calamity, agitation, strike, traffic jam, or road blockage, we will not be held responsible for any delays or cancellations.',
                      'Twin Brothers Holidays reserves the right to modify or cancel bookings at any point.',
                      'To cancel your booking, submit a cancellation request via the MyBookings section on our website.',
                    ].map((line, i) => (
                      <p key={i} className="text-slate-600 text-xs font-semibold flex items-start gap-1.5 mb-1.5">
                        <span className="text-slate-400">•</span>
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Important Information */}
                  <div className="border border-slate-100 rounded-xl p-4">
                    <h4 className="font-black text-[#ff8126] mb-3" style={{ fontSize: '15px' }}>Important Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                      {[
                        { h: 'Hilly areas', p: 'AC will remain switched off in hilly regions or when the vehicle is stationary.' },
                        { h: 'Luggage policy', p: 'Compact has space for 2 large bags. Depending on the number of passengers, luggage can be adjusted in the seating area with the driver’s consent.' },
                        { h: 'Stops', p: 'This is a point-to-point booking, and only one stop for meals is included.' },
                        { h: 'Waiting charges', p: 'The driver will wait for up to 45 minutes from the scheduled pickup time. Post this, your trip may be canceled without any refund.' },
                        { h: 'Night charges', p: 'Post 10 PM to 6 AM, an additional night charge (Rs 250/night) will be applicable. These charges should be directly paid to the driver.' },
                        { h: 'Extra kilometers', p: 'Once you exceed your kms limits, you will be charged extra kms as applicable.' },
                        { h: '', p: 'Distance will be calculated from point to point.' },
                        { h: 'Delays', p: 'Due to traffic or any unavoidable reason, pickup may be delayed by up to 30 minutes.' },
                        { h: 'Other charges', p: 'Small pets are allowed only if informed prior after booking. A pet cleaning fee may be charged by the taxi operator (minimum Rs.300) depending on the distance of travelling. Extra Pickup/Drop Charge Amount: 150 Rs. /person with extra km charges. You need to pay toll tax, state tax or other similar taxes directly to the driver if not mentioned in Inclusions/Highlights.' },
                        { h: 'Additional information', p: 'You are responsible for managing your travel schedule; Twin Brothers Holidays is not liable for delays or missed connections. Toll, state tax, and other receipts should be obtained directly from the driver, as invoices for these are issued by the cab vendor only. Cab availability, fuel type, and possible delays (e.g., CNG refills or traffic) depend on circumstances and may vary.' },
                      ].map((item, i) => (
                        <div key={i} className="mb-3">
                          {item.h && <h5 className="font-bold text-slate-800 text-xs mb-1">{item.h}</h5>}
                          <p className="text-slate-500 text-xs font-semibold flex items-start gap-1.5 mb-0">
                            <i className="fa-solid fa-circle text-slate-300 mt-1.5" style={{ fontSize: '4px' }}></i>
                            {item.p}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4 sticky top-[66px]" style={{ marginTop: isMobile ? '0px' : '60px' }}>

            {/* Free Cancellation strip (Desktop only — shown in mobile trip summary instead) */}
            <div className="hidden lg:flex bg-white border border-slate-150 rounded-2xl p-4 items-start gap-2.5">
              <i className="fa-solid fa-shield-heart text-[#1fae5c] mt-0.5"></i>
              <p className="text-xs font-semibold text-slate-700 mb-0">
                <span className="text-[#1fae5c] font-black">Free Cancellation</span> before 24 hours from the journey time.
              </p>
            </div>

            {/* Grand Total (Desktop only — shown in mobile sticky bar instead) */}
            <div className="hidden lg:flex bg-white border border-slate-150 rounded-2xl p-4 items-center justify-between">
              <span className="font-black text-slate-900" style={{ fontSize: '18px' }}>Grand Total</span>
              <span className="font-black text-slate-900" style={{ fontSize: '20px' }}>&#8377;{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Payment Options */}
            <div className="bg-white border border-slate-150 rounded-2xl p-2" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px' }}>
              <div
                onClick={() => setPaymentMode('part')}
                className={`rounded-xl p-3 flex items-center justify-between cursor-pointer mb-2 transition ${paymentMode === 'part' ? 'bg-blue-50 border border-[#1d91f2]' : 'border border-transparent'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMode === 'part' ? 'border-[#1d91f2]' : 'border-slate-300'}`}>
                    {paymentMode === 'part' && <span className="w-2 h-2 rounded-full bg-[#1d91f2]"></span>}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Make part payment now</span>
                    <span className="text-slate-400 text-[11px] font-semibold">Pay the rest to the driver</span>
                  </div>
                </div>
                <span className="font-black text-slate-900 text-sm">&#8377;{partPaymentAmount.toLocaleString('en-IN')}</span>
              </div>

              <div
                onClick={() => setPaymentMode('full')}
                className={`rounded-xl p-3 flex items-center justify-between cursor-pointer transition ${paymentMode === 'full' ? 'bg-blue-50 border border-[#1d91f2]' : 'border border-transparent'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMode === 'full' ? 'border-[#1d91f2]' : 'border-slate-300'}`}>
                    {paymentMode === 'full' && <span className="w-2 h-2 rounded-full bg-[#1d91f2]"></span>}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">Make full payment now</span>
                </div>
                <span className="font-black text-slate-900 text-sm">&#8377;{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                type="submit"
                form="cab-booking-form"
                className="w-full mt-3 text-white font-black uppercase tracking-wider border-none cursor-pointer"
                style={{ background: '#ff8126', paddingTop: '13px', paddingBottom: '13px', borderRadius: '999px', fontSize: '14px' }}
              >
                Continue to Payment
              </button>
            </div>

            {/* Coupon Code */}
            <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden" style={{ marginLeft: isMobile ? '10px' : '0px', marginRight: isMobile ? '10px' : '0px' }}>
              <div className="py-3 px-4" style={{ background: 'linear-gradient(90deg, #fff3eb, #eef6ff)' }}>
                <h3 className="font-black text-slate-900 mb-0" style={{ fontSize: '15px' }}>Enter Coupon Code</h3>
              </div>
              <div className="p-4">
                <div className="border border-slate-200 rounded-xl px-3 py-2.5 flex items-center justify-between mb-2">
                  <span className="font-black text-slate-800 text-sm">TWINBCAB</span>
                  <span className="text-red-500 text-xs font-bold cursor-pointer hover:underline">Remove</span>
                </div>
                <p className="text-[#1fae5c] text-xs font-semibold mb-3">
                  Congratulations! Instant Discount of Rs. 300 has been applied successfully.
                </p>
                <div className="border border-[#1d91f2] bg-blue-50 rounded-xl p-3 flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full border-2 border-[#1d91f2] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#1d91f2]"></span>
                  </span>
                  <div>
                    <span className="font-black text-slate-800 text-sm block">TWINBCAB</span>
                    <span className="text-slate-500 text-xs font-semibold">TWINBCAB Get Up to Rs.300 off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Processing Modal (UPI Scanner UI) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-2xl max-w-[420px] w-full text-center relative">

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
              <span className="font-black text-slate-900 text-2xl">&#8377;{(paymentMode === 'part' ? partPaymentAmount : grandTotal).toLocaleString('en-IN')}</span>
            </div>

            <div className="border border-slate-155 rounded-2xl p-4 bg-white flex flex-col items-center justify-center shadow-sm max-w-[240px] mx-auto mb-4">
              <div className="w-[180px] h-[180px] bg-slate-50 rounded-lg flex flex-col items-center justify-center p-2.5 relative border border-slate-100">
                <i className="fa-solid fa-qrcode text-slate-700 text-[120px] leading-none mb-1"></i>
                <div className="absolute inset-0 bg-[#ff8126]/5 rounded-lg flex items-center justify-center border border-dashed border-[#ff8126]/30"></div>
                <span className="text-[8px] font-black text-[#ff8126] tracking-wider uppercase">Scan with any UPI App</span>
              </div>
            </div>

            <div className="text-[10.5px] text-slate-500 font-semibold mb-4 space-y-1.5 text-left max-w-[320px] mx-auto">
              <div className="flex items-start gap-1.5">
                <i className="fa-solid fa-circle-info text-[#ff8126] mt-0.5"></i>
                <span>Scan the QR code with GPay, PhonePe, Paytm or Bhim UPI app to pay.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <i className="fa-solid fa-circle-info text-[#ff8126] mt-0.5"></i>
                <span>After completing payment in your app, enter the Transaction ID / UTR Number below to verify.</span>
              </div>
            </div>

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
                Verify &amp; Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Fixed Booking Bar for Mobile View */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#222222] px-4 py-3 flex items-center justify-between z-50 rounded-t-2xl shadow-2xl border-t border-[#333333] sm:hidden">
        <div className="flex flex-col">
          <span className="text-white text-[10px] font-bold tracking-wide">Grand Total</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-white text-xl font-normal">&#8377;{grandTotal.toLocaleString('en-IN')}</span>
            <i className="fa-solid fa-circle-info text-slate-400 text-xs"></i>
          </div>
        </div>
        <button
          type="submit"
          form="cab-booking-form"
          className="bg-[#f25b22] hover:bg-orange-600 text-white font-normal py-2.5 transition-all border-none shadow-lg shadow-orange-600/10 cursor-pointer"
          style={{ borderRadius: '24px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', fontSize: '14px' }}
        >
          Continue Booking
        </button>
      </div>
    </div>
  );
}
