'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

const AirlineLogo = ({ code, name, className = "w-10 h-10 object-contain" }: { code: string; name: string; className?: string }) => {
  const [errorCount, setErrorCount] = useState(0);

  if (errorCount >= 2 || !code) {
    return (
      <div className="w-9 h-9 rounded-full bg-[#ff8126] text-white flex items-center justify-center font-bold text-[12px] shadow-sm uppercase shrink-0">
        {code ? code.slice(0, 2) : name ? name.slice(0, 2) : 'FL'}
      </div>
    );
  }

  const src = errorCount === 0 
    ? `https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${code}.svg`
    : `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${code}.svg`;

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setErrorCount(prev => prev + 1)}
    />
  );
};

export default function FlightBookingPage() {
  const router = useRouter();

  // Booking details loaded from localStorage
  const [flight, setFlight] = useState<any>(null);
  const [fareClass, setFareClass] = useState<string>('value');
  const [depart, setDepart] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [tripType, setTripType] = useState<string>('one-way');
  const [travelClass, setTravelClass] = useState<string>('Economy');
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Form states
  const [travellerTitle, setTravellerTitle] = useState<string>('Mr');
  const [travellerFirstName, setTravellerFirstName] = useState<string>('');
  const [travellerLastName, setTravellerLastName] = useState<string>('');
  const [travellerEmail, setTravellerEmail] = useState<string>('');
  const [travellerPhone, setTravellerPhone] = useState<string>('');
  const [frequentFlyer, setFrequentFlyer] = useState<string>('');
  const [showFrequentFlyer, setShowFrequentFlyer] = useState<boolean>(false);

  // Contact details states
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [useGST, setUseGST] = useState<boolean>(false);
  const [gstNumber, setGstNumber] = useState<string>('');
  const [gstCompany, setGstCompany] = useState<string>('');

  // Add-on states
  const [protectionOption, setProtectionOption] = useState<string>('none'); // 'none', 'cancellation', 'date_change', 'easefly'
  const [charityAmount, setCharityAmount] = useState<number>(0); // 0, 10, 20, 50, 100
  const [insuranceOption, setInsuranceOption] = useState<string>('none'); // 'none', 'acko'
  const [appliedCoupon, setAppliedCoupon] = useState<string>('BOOKNOW');
  const [couponInput, setCouponInput] = useState<string>('BOOKNOW');
  const [couponError, setCouponError] = useState<string>('');

  // Step & Add-ons Selection states
  const [checkoutStep, setCheckoutStep] = useState<string>('details'); // 'details', 'addons'
  const [activeAddonTab, setActiveAddonTab] = useState<string>('seats'); // 'seats', 'meals', 'baggage'
  const [selectedSeats, setSelectedSeats] = useState<Record<number, { seat: string; price: number }>>({});
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const selectedSeat = Object.values(selectedSeats).map(s => s.seat).join(', ') || null;
  const selectedSeatPrice = Object.values(selectedSeats).reduce((acc, s) => acc + s.price, 0);
  const [selectedMeals, setSelectedMeals] = useState<Record<string, { quantity: number; price: number }>>({});
  const [selectedBaggage, setSelectedBaggage] = useState<{ label: string; price: number } | null>(null);
  const [addonLounge, setAddonLounge] = useState<boolean>(false);
  const [addonPriority, setAddonPriority] = useState<boolean>(false);
  const [filterVeg, setFilterVeg] = useState<boolean>(true);
  const [filterNonVeg, setFilterNonVeg] = useState<boolean>(true);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isReturnExpanded, setIsReturnExpanded] = useState<boolean>(true);
  const [isHassleFreeExpanded, setIsHassleFreeExpanded] = useState<boolean>(true);

  // Payment Mode States
  const [paymentMethod, setPaymentMethod] = useState<string>('upi'); // 'upi', 'card', 'wallet', 'netbanking', 'emi', 'rewards', 'giftcard'
  const [qrGenerated, setQrGenerated] = useState<boolean>(false);
  const [qrCountdown, setQrCountdown] = useState<number>(300); // 5 mins
  const [sessionCountdown, setSessionCountdown] = useState<number>(600); // 10 mins
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentCardNumber, setPaymentCardNumber] = useState<string>('');
  const [paymentCardName, setPaymentCardName] = useState<string>('');
  const [paymentCardExpiry, setPaymentCardExpiry] = useState<string>('');
  const [paymentCardCVV, setPaymentCardCVV] = useState<string>('');
  const [paymentSelectedWallet, setPaymentSelectedWallet] = useState<string>('paytm');
  const [paymentSelectedBank, setPaymentSelectedBank] = useState<string>('sbi');
  const [paymentEmiOption, setPaymentEmiOption] = useState<string>('');
  const [paymentRewardsPhone, setPaymentRewardsPhone] = useState<string>('');
  const [paymentGiftCardNo, setPaymentGiftCardNo] = useState<string>('');
  const [paymentGiftCardPin, setPaymentGiftCardPin] = useState<string>('');
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState<boolean>(false);
  const [emiType, setEmiType] = useState<string>('credit'); // 'credit', 'nocost', 'debit'
  const [activeEmiStep, setActiveEmiStep] = useState<number>(1);
  const [emiSelectedBank, setEmiSelectedBank] = useState<string>('');
  const [emiSelectedTenure, setEmiSelectedTenure] = useState<number>(0);
  const [emiCardNo, setEmiCardNo] = useState<string>('');
  const [emiCardName, setEmiCardName] = useState<string>('');
  const [emiCardExpiryMonth, setEmiCardExpiryMonth] = useState<string>('');
  const [emiCardExpiryYear, setEmiCardExpiryYear] = useState<string>('');
  const [emiCardCVV, setEmiCardCVV] = useState<string>('');

  useEffect(() => {
    // Load booking details from localStorage
    try {
      const storedFlight = localStorage.getItem('booking_flight');
      const storedFareClass = localStorage.getItem('booking_fare_class');
      const storedDepart = localStorage.getItem('booking_depart');
      const storedReturnDate = localStorage.getItem('booking_return_date');
      const storedTripType = localStorage.getItem('booking_trip_type');
      const storedClass = localStorage.getItem('booking_class');
      const storedAdults = localStorage.getItem('booking_adults');
      const storedChildren = localStorage.getItem('booking_children');
      const storedInfants = localStorage.getItem('booking_infants');

      if (storedFlight) {
        setFlight(JSON.parse(storedFlight));
        setFareClass(storedFareClass || 'value');
        setDepart(storedDepart || '');
        setReturnDate(storedReturnDate || '');
        setTripType(storedTripType || 'one-way');
        setTravelClass(storedClass || 'Economy');
        setAdults(storedAdults ? parseInt(storedAdults) : 1);
        setChildren(storedChildren ? parseInt(storedChildren) : 0);
        setInfants(storedInfants ? parseInt(storedInfants) : 0);
      } else {
        // No flight in storage — load a demo flight for preview/testing
        const demoFlight = {
          id: 1,
          airlineName: 'Vistara',
          airlineCode: 'UK',
          flightNo: 'UK-813',
          logoColor: '#4b0082',
          rating: '4.7/5',
          luggage: '20kg check-in, 7kg cabin',
          departureTime: '06:15',
          arrivalTime: '07:55',
          duration: '1h 40m',
          stops: 'Non-stop',
          fromCode: 'DEL',
          toCode: 'SXR',
          fromCity: 'Delhi',
          toCity: 'Srinagar',
          price: 6500,
          dealsCount: 12,
          returnFlight: null,
        };
        setFlight(demoFlight);
        setFareClass('value');
        setDepart(new Date().toISOString().split('T')[0]);
        setTripType('one-way');
        setTravelClass('Economy');
        setAdults(1);
      }
    } catch (e) {
      console.error('Failed to parse flight booking info', e);
    }
    setIsLoaded(true);
  }, []);

  // Timer Effect for session expiration and QR code countdown
  useEffect(() => {
    let interval: any;
    if (checkoutStep === 'payment') {
      interval = setInterval(() => {
        setSessionCountdown((prev) => {
          if (prev <= 1) {
            // Automatic redirect to addons (seat selection) to prevent pricing mismatch
            setCheckoutStep('addons');
            setSelectedSeats({});
            setSelectedMeals({});
            setSelectedBaggage(null);
            setAddonLounge(false);
            setAddonPriority(false);
            setSessionExpired(false);
            setQrGenerated(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            alert('Your secure payment session has expired. Please select your seats and add-ons again.');
            return 600; // Reset countdown timer
          }
          return prev - 1;
        });

        setQrCountdown((prev) => {
          if (qrGenerated && prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkoutStep, qrGenerated]);

  const formatTimeMinutesSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#ff8126] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-[13px] font-semibold">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-sm">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-base mb-3" />
          <h2 className="text-[6.5px] font-bold text-slate-800 mb-1">No flight details found</h2>
          <p className="text-slate-500 text-[13px] mb-4">Redirecting you to flight search results page...</p>
          <div className="w-6 h-6 border-3 border-[#072146] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Helper to parse duration e.g. "04h 55m" -> minutes
  const parseDurationToMinutes = (durStr: string): number => {
    if (!durStr) return 120;
    const hrMatch = durStr.match(/(\d+)\s*h/i);
    const minMatch = durStr.match(/(\d+)\s*m/i);
    const hours = hrMatch ? parseInt(hrMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
    return hours * 60 + minutes;
  };

  // Helper to format minutes to "04h 55m"
  const formatMinutesToDuration = (totalMin: number): string => {
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
  };

  // Helper to add minutes to time and date
  const parseTimeAndDate = (timeStr: string, dateStr: string): Date => {
    const baseDate = dateStr ? new Date(dateStr) : new Date();
    if (timeStr) {
      const [hrs, mins] = timeStr.split(':').map(Number);
      baseDate.setHours(hrs || 0, mins || 0, 0, 0);
    }
    return baseDate;
  };

  // Helper to format Date object into Segment Date (e.g. Thu-28May2026)
  const formatSegmentDate = (dateObj: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[dateObj.getDay()]}-${dateObj.getDate()}${months[dateObj.getMonth()]}${dateObj.getFullYear()}`;
  };

  // Main Segment generation helper
  const getFlightSegments = () => {
    if (!flight) return [];

    const stopsStr = flight.stops || 'Non-stop';
    const isStop = stopsStr.toLowerCase().includes('stop') && !stopsStr.toLowerCase().includes('non-stop');

    // ✅ Use pre-computed segments from flights page if available AND it is a connecting flight
    if (isStop && flight.segments && flight.segments.length > 0) {
      return flight.segments;
    }
    let transitCode = '';
    if (isStop) {
      const match = stopsStr.match(/\((?:via\s+)?([A-Z]{3})\)/i);
      if (match) {
        transitCode = match[1].toUpperCase();
      } else {
        transitCode = 'LKO';
      }
    }

    const codeToCity: Record<string, string> = {
      DEL: 'New Delhi',
      BOM: 'Mumbai',
      LKO: 'Lucknow',
      BLR: 'Bengaluru',
      GOI: 'Goa',
      SXR: 'Srinagar',
      DXB: 'Dubai',
      CCU: 'Kolkata',
      MAA: 'Chennai',
      HYD: 'Hyderabad'
    };

    const getCity = (code: string) => codeToCity[code] || flight.toCity || 'Transit City';

    const baseDateObj = depart ? new Date(depart) : new Date();

    if (!isStop || !transitCode) {
      return [{
        type: 'flight',
        airlineName: flight.airlineName,
        airlineCode: flight.airlineCode,
        flightNo: flight.flightNo,
        aircraft: 'Boeing 737 (Narrow-body)',
        depTime: flight.departureTime,
        arrTime: flight.arrivalTime,
        depCode: flight.fromCode,
        depCity: flight.fromCity,
        arrCode: flight.toCode,
        arrCity: flight.toCity,
        duration: flight.duration,
        depTerminal: 'Terminal-1',
        arrTerminal: 'Terminal-3',
        depDate: formatSegmentDate(baseDateObj),
        arrDate: formatSegmentDate(baseDateObj),
      }];
    }

    // Connecting flight split logic (2 segments, 1 layover)
    const totalMinutes = parseDurationToMinutes(flight.duration);
    const seg1Min = Math.round(totalMinutes * 0.40);
    const layoverMin = Math.round(totalMinutes * 0.20);
    const seg2Min = totalMinutes - seg1Min - layoverMin;

    const seg1DurationStr = formatMinutesToDuration(seg1Min);
    const layoverDurationStr = formatMinutesToDuration(layoverMin);
    const seg2DurationStr = formatMinutesToDuration(seg2Min);

    const dep1DateObj = parseTimeAndDate(flight.departureTime, depart);
    const arr1DateObj = new Date(dep1DateObj.getTime() + seg1Min * 60 * 1000);
    const dep2DateObj = new Date(arr1DateObj.getTime() + layoverMin * 60 * 1000);
    const arr2DateObj = new Date(dep2DateObj.getTime() + seg2Min * 60 * 1000);

    const formatTime = (dateObj: Date) => {
      return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const flightNoMatch = flight.flightNo.match(/-(\d+)/);
    const baseNum = flightNoMatch ? parseInt(flightNoMatch[1]) : (parseInt(flight.flightNo.replace(/[^0-9]/g, '')) || 100);
    const flightNo1 = `${flight.airlineCode}-${baseNum}`;
    const flightNo2 = `${flight.airlineCode}-${baseNum + 1}`;

    return [
      {
        type: 'flight',
        airlineName: flight.airlineName,
        airlineCode: flight.airlineCode,
        flightNo: flightNo1,
        aircraft: 'Boeing 737 (Narrow-body)',
        depTime: flight.departureTime,
        arrTime: formatTime(arr1DateObj),
        depCode: flight.fromCode,
        depCity: flight.fromCity,
        arrCode: transitCode,
        arrCity: getCity(transitCode),
        duration: seg1DurationStr,
        depTerminal: 'Terminal -1',
        arrTerminal: 'Terminal-3',
        depDate: formatSegmentDate(dep1DateObj),
        arrDate: formatSegmentDate(arr1DateObj),
      },
      {
        type: 'layover',
        layoverDuration: layoverDurationStr,
        transitCity: getCity(transitCode),
        transitCode: transitCode,
      },
      {
        type: 'flight',
        airlineName: flight.airlineName,
        airlineCode: flight.airlineCode,
        flightNo: flightNo2,
        aircraft: 'Boeing 737 (Narrow-body)',
        depTime: formatTime(dep2DateObj),
        arrTime: flight.arrivalTime,
        depCode: transitCode,
        depCity: getCity(transitCode),
        arrCode: flight.toCode,
        arrCity: flight.toCity,
        duration: seg2DurationStr,
        depTerminal: 'Terminal -3',
        arrTerminal: 'Terminal-2',
        depDate: formatSegmentDate(dep2DateObj),
        arrDate: formatSegmentDate(arr2DateObj),
      }
    ];
  };

  const getReturnFlightSegments = () => {
    if (!flight || !flight.returnFlight) return [];

    const returnFlight = flight.returnFlight;
    const stopsStr = returnFlight.stops || 'Non-stop';
    const isStop = stopsStr.toLowerCase().includes('stop') && !stopsStr.toLowerCase().includes('non-stop');

    // ✅ Use pre-computed segments from flights page if available AND it is a connecting flight
    if (isStop && flight.returnFlight.segments && flight.returnFlight.segments.length > 0) {
      return flight.returnFlight.segments;
    }
    let transitCode = '';
    if (isStop) {
      const match = stopsStr.match(/\((?:via\s+)?([A-Z]{3})\)/i);
      if (match) {
        transitCode = match[1].toUpperCase();
      } else {
        transitCode = 'LKO';
      }
    }

    const codeToCity: Record<string, string> = {
      DEL: 'New Delhi',
      BOM: 'Mumbai',
      LKO: 'Lucknow',
      BLR: 'Bengaluru',
      GOI: 'Goa',
      SXR: 'Srinagar',
      DXB: 'Dubai',
      CCU: 'Kolkata',
      MAA: 'Chennai',
      HYD: 'Hyderabad'
    };

    const getCity = (code: string) => codeToCity[code] || returnFlight.toCity || 'Transit City';

    const baseDateObj = returnDate ? new Date(returnDate) : new Date();

    if (!isStop || !transitCode) {
      return [{
        type: 'flight',
        airlineName: flight.airlineName,
        airlineCode: flight.airlineCode,
        flightNo: returnFlight.flightNo,
        aircraft: 'Boeing 737 (Narrow-body)',
        depTime: returnFlight.departureTime,
        arrTime: returnFlight.arrivalTime,
        depCode: returnFlight.fromCode,
        depCity: returnFlight.fromCity,
        arrCode: returnFlight.toCode,
        arrCity: returnFlight.toCity,
        duration: returnFlight.duration,
        depTerminal: 'Terminal-1',
        arrTerminal: 'Terminal-3',
        depDate: formatSegmentDate(baseDateObj),
        arrDate: formatSegmentDate(baseDateObj),
      }];
    }

    const totalMinutes = parseDurationToMinutes(returnFlight.duration);
    const seg1Min = Math.round(totalMinutes * 0.40);
    const layoverMin = Math.round(totalMinutes * 0.20);
    const seg2Min = totalMinutes - seg1Min - layoverMin;

    const seg1DurationStr = formatMinutesToDuration(seg1Min);
    const layoverDurationStr = formatMinutesToDuration(layoverMin);
    const seg2DurationStr = formatMinutesToDuration(seg2Min);

    const dep1DateObj = parseTimeAndDate(returnFlight.departureTime, returnDate);
    const arr1DateObj = new Date(dep1DateObj.getTime() + seg1Min * 60 * 1000);
    const dep2DateObj = new Date(arr1DateObj.getTime() + layoverMin * 60 * 1000);
    const arr2DateObj = new Date(dep2DateObj.getTime() + seg2Min * 60 * 1000);

    const formatTime = (dateObj: Date) => {
      return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const flightNoMatch = returnFlight.flightNo.match(/-(\d+)/);
    const baseNum = flightNoMatch ? parseInt(flightNoMatch[1]) : (parseInt(returnFlight.flightNo.replace(/[^0-9]/g, '')) || 200);
    const flightNo1 = `${flight.airlineCode}-${baseNum}`;
    const flightNo2 = `${flight.airlineCode}-${baseNum + 1}`;

    return [
      {
        type: 'flight',
        airlineName: flight.airlineName,
        airlineCode: flight.airlineCode,
        flightNo: flightNo1,
        aircraft: 'Boeing 737 (Narrow-body)',
        depTime: returnFlight.departureTime,
        arrTime: formatTime(arr1DateObj),
        depCode: returnFlight.fromCode,
        depCity: returnFlight.fromCity,
        arrCode: transitCode,
        arrCity: getCity(transitCode),
        duration: seg1DurationStr,
        depTerminal: 'Terminal -1',
        arrTerminal: 'Terminal-3',
        depDate: formatSegmentDate(dep1DateObj),
        arrDate: formatSegmentDate(arr1DateObj),
      },
      {
        type: 'layover',
        layoverDuration: layoverDurationStr,
        transitCity: getCity(transitCode),
        transitCode: transitCode,
      },
      {
        type: 'flight',
        airlineName: flight.airlineName,
        airlineCode: flight.airlineCode,
        flightNo: flightNo2,
        aircraft: 'Boeing 737 (Narrow-body)',
        depTime: formatTime(dep2DateObj),
        arrTime: returnFlight.arrivalTime,
        depCode: transitCode,
        depCity: getCity(transitCode),
        arrCode: returnFlight.toCode,
        arrCity: returnFlight.toCity,
        duration: seg2DurationStr,
        depTerminal: 'Terminal -3',
        arrTerminal: 'Terminal-2',
        depDate: formatSegmentDate(dep2DateObj),
        arrDate: formatSegmentDate(arr2DateObj),
      }
    ];
  };

  const getSubtitle = () => {
    if (!flight) return '';
    const dateObj = depart ? new Date(depart) : new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = depart ? `${days[dateObj.getDay()]}-${dateObj.getDate()}${months[dateObj.getMonth()]}${dateObj.getFullYear()}` : '';
    return `${formattedDate} | ${flight.airlineName} • ${flight.departureTime}-${flight.arrivalTime} • ${travelClass} • ${flight.stops} • ${flight.duration}`;
  };

  const getReturnSubtitle = () => {
    if (!flight || !flight.returnFlight) return '';
    const dateObj = returnDate ? new Date(returnDate) : new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = returnDate ? `${days[dateObj.getDay()]}-${dateObj.getDate()}${months[dateObj.getMonth()]}${dateObj.getFullYear()}` : '';
    return `${formattedDate} | ${flight.airlineName} • ${flight.returnFlight.departureTime}-${flight.returnFlight.arrivalTime} • ${travelClass} • ${flight.returnFlight.stops} • ${flight.returnFlight.duration}`;
  };

  // Passenger counts
  const passengerMultiplier = adults + children + infants;

  // Price calculations
  const getFarePrice = (basePrice: number, fClass: string) => {
    if (fClass === 'classic') return Math.round(basePrice * 1.1);
    if (fClass === 'flex') return Math.round(basePrice * 1.2);
    return basePrice;
  };

  const baseFare = getFarePrice(flight.price, fareClass) * passengerMultiplier;
  const taxesAndFees = 1595 * passengerMultiplier; // standard mock taxes

  const protectionCosts: Record<string, number> = {
    none: 0,
    cancellation: 839,
    date_change: 658,
    easefly: 1020,
  };
  const protectionCost = protectionCosts[protectionOption] || 0;

  const insuranceCost = insuranceOption === 'acko' ? 249 * passengerMultiplier : 0;

  // Coupon Discounts
  const couponDiscounts: Record<string, number> = {
    BOOKNOW: 420,
    TBHFLY: 200,
    TBHBANK: 1000,
    TBHEMI: 952,
  };
  const discountAmount = appliedCoupon ? (couponDiscounts[appliedCoupon] || 0) : 0;

  // Calculate total meal cost
  const selectedMealsPrice = Object.values(selectedMeals).reduce(
    (acc, meal) => acc + meal.price * meal.quantity,
    0
  );

  // Calculate total baggage cost
  const selectedBaggagePrice = selectedBaggage ? selectedBaggage.price : 0;

  const addonLoungePrice = addonLounge ? 800 : 0;
  const addonPriorityPrice = addonPriority ? 498 * passengerMultiplier : 0;

  const grandTotal = baseFare + taxesAndFees + protectionCost + insuranceCost + charityAmount + selectedSeatPrice + selectedMealsPrice + selectedBaggagePrice + addonLoungePrice + addonPriorityPrice - discountAmount;

  // Format Dates
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const formatMockupDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const dayVal = String(date.getDate()).padStart(2, '0');
    const monthName = months[date.getMonth()];
    const yearVal = date.getFullYear();
    return `${dayName}-${dayVal}${monthName}${yearVal}`;
  };

  const handlePhoneValidation = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean.length > 10) return clean.slice(0, 10);
    return clean;
  };

  const handleCouponApply = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (['BOOKNOW', 'TBHFLY', 'TBHBANK', 'TBHEMI'].includes(code)) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid promo code. Please select from the offers list.');
    }
  };

  const handleCouponRemove = () => {
    setAppliedCoupon('');
    setCouponInput('');
    setCouponError('');
  };

  // Submit Inquiry Lead to backend DB
  const handleBookingSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Check validation
    if (checkoutStep === 'details') {
      if (!travellerFirstName || !travellerLastName) {
        alert('Please fill out the Lead Passenger name fields.');
        return;
      }
      
      if (contactPhone.length !== 10) {
        setPhoneError('Please enter a valid 10-digit mobile number.');
        return;
      }

      if (!contactEmail) {
        alert('Please enter a contact email address.');
        return;
      }

      if (!agreeTerms) {
        alert('You must agree to the Terms and Conditions.');
        return;
      }

      // Smooth transition to Add-ons step
      setCheckoutStep('addons');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const mealsList = Object.entries(selectedMeals)
      .filter(([_, val]) => val.quantity > 0)
      .map(([name, val]) => `${name} x${val.quantity} (+₹${val.price * val.quantity})`)
      .join(', ');

    // Detailed lead description packed inside message
    const detailedMessage = `Flight Booking Inquiry:
Route: ${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode})
Airline: ${flight.airlineName} (${flight.flightNo})
Timings: ${flight.departureTime} → ${flight.arrivalTime}
Flight Class: ${travelClass} | Fare Class: ${fareClass.toUpperCase()}
Travel Date: ${depart} ${tripType === 'round-trip' ? `| Return Date: ${returnDate}` : ''}
Passengers: ${adults} Adults, ${children} Children, ${infants} Infants

Lead Passenger:
Name: ${travellerTitle} ${travellerFirstName} ${travellerLastName}
Phone: ${travellerPhone || 'Same as contact'}
Email: ${travellerEmail || 'Same as contact'}
Frequent Flyer No: ${frequentFlyer || 'None'}

Add-ons Selection:
- Hassle-Free Journey Protection: ${protectionOption === 'none' ? 'None Selected' : protectionOption.toUpperCase()} (+₹${protectionCost})
- Travel Insurance: ${insuranceOption === 'acko' ? 'Yes, Secured' : 'No'} (+₹${insuranceCost})
- Charity Contribution (Twin Brothers Holidays Foundation): ₹${charityAmount}
- Seat Selection: ${selectedSeat ? `${selectedSeat} (+₹${selectedSeatPrice})` : 'None selected'}
- Pre-booked Meals: ${mealsList || 'None selected'}
- Extra Baggage: ${selectedBaggage ? `${selectedBaggage.label} (+₹${selectedBaggage.price})` : 'None selected'}
- Airport Lounge Access: ${addonLounge ? `Yes (+₹800)` : 'No'}
- Priority Boarding & Bag Tag: ${addonPriority ? `Yes (+₹${addonPriorityPrice})` : 'No'}

Pricing Summary:
- Base Fare: ₹${baseFare.toLocaleString('en-IN')}
- Taxes & Fees: ₹${taxesAndFees.toLocaleString('en-IN')}
- Seat Selection Cost: ₹${selectedSeatPrice.toLocaleString('en-IN')}
- Pre-booked Meals Cost: ₹${selectedMealsPrice.toLocaleString('en-IN')}
- Extra Baggage Cost: ₹${selectedBaggagePrice.toLocaleString('en-IN')}
- Airport Lounge Cost: ₹${addonLoungePrice.toLocaleString('en-IN')}
- Priority Boarding Cost: ₹${addonPriorityPrice.toLocaleString('en-IN')}
- Coupon Applied: ${appliedCoupon || 'None'} (Discount: -₹${discountAmount})
- Grand Total: ₹${grandTotal.toLocaleString('en-IN')}

Contact Info:
- Phone: +91-${contactPhone}
- Email: ${contactEmail}
${useGST ? `- GST Details: Company: ${gstCompany}, GSTIN: ${gstNumber}` : '- No GST requested'}`;

    const payload = {
      name: `${travellerFirstName} ${travellerLastName}`,
      phone: contactPhone,
      email: contactEmail,
      service_type: 'Flight Booking',
      pickup_location: `${flight.fromCity} (${flight.fromCode})`,
      drop_location: `${flight.toCity} (${flight.toCode})`,
      travel_date: depart,
      travel_date_end: tripType === 'round-trip' ? returnDate : '',
      passengers: passengerMultiplier,
      plan_type: `${travelClass} - ${fareClass.toUpperCase()} - Seat: ${selectedSeat || 'None'} - Grand Total: ₹${grandTotal}`,
      message: detailedMessage,
      source_page: 'nextjs_frontend_checkout_page'
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
        setCheckoutStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting your booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalPayment = async () => {
    setIsProcessingPayment(true);
    // Simulate secure payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      // Clear booking local storage
      localStorage.removeItem('booking_flight');
      localStorage.removeItem('booking_fare_class');
      localStorage.removeItem('booking_depart');
      localStorage.removeItem('booking_return_date');
      localStorage.removeItem('booking_trip_type');
      localStorage.removeItem('booking_class');
      localStorage.removeItem('booking_adults');
      localStorage.removeItem('booking_children');
      localStorage.removeItem('booking_infants');
      router.push('/thank-you');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12">
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .sticky-sidebar-scroll {
            max-height: calc(100vh - 90px) !important;
            overflow-y: auto !important;
            padding-right: 4px;
          }
          .sticky-sidebar-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .sticky-sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .sticky-sidebar-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .sticky-sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        }
        .cursor-red-ban {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2.5' stroke-linecap='round'><circle cx='12' cy='12' r='9'/><line x1='5.6' y1='5.6' x2='18.4' y2='18.4'/></svg>") 12 12, not-allowed !important;
        }
      `}} />
      {/* ── HEADER NAVIGATION BAR ── */}
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-b border-slate-200/80 py-3 px-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#2c2c2c] hover:text-[#ff8126] flex items-center gap-1 text-[20px] font-black tracking-tight decoration-0 cursor-pointer" style={{ fontFamily: '"Sour Gummy", sans-serif' }}>
              <span>TwinB</span>
              <span className="text-[#fd661e]">Holidays</span>
            </Link>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
              <i className="fa-solid fa-plane text-xs text-[#ff8126]" />
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Flight Checkout</span>
            </div>
          </div>
          <div className="text-[12.5px] text-slate-500 font-bold select-none">
            Booking Progress: <span className="text-[#ff8126] transition-all">
              {checkoutStep === 'details' && '1. Review Details'}
              {checkoutStep === 'addons' && '2. Customize Add-ons'}
              {checkoutStep === 'payment' && '3. Secure Payment'}
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <div 
        className="block md:hidden pt-10 pb-9 px-4 select-none relative z-20"
        style={{ background: 'linear-gradient(to right, #f25e0a, #ff8126)' }}
      >
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => {
              if (checkoutStep === 'addons') setCheckoutStep('details');
              else if (checkoutStep === 'payment') setCheckoutStep('addons');
              else router.back();
            }} 
            className="text-white border-0 bg-transparent cursor-pointer p-1 -ml-1 text-[17px] flex items-center justify-center"
          >
            <i className="fa-solid fa-arrow-left" />
          </button>
          <h1 className="text-white font-extrabold text-[17px]">
            {checkoutStep === 'details' && 'Flight Review'}
            {checkoutStep === 'addons' && 'Flight Customization'}
            {checkoutStep === 'payment' && 'Flight Payment'}
          </h1>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .book-layout-wrapper {
          padding-left: 5px !important;
          padding-right: 5px !important;
        }
        .book-flight-card-mobile {
          padding-left: 10px !important;
          padding-right: 10px !important;
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }
        @media (min-width: 768px) {
          .book-layout-wrapper {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}} />
{/* ── MAIN LAYOUT WRAPPER ── */}
      <div className="max-w-6xl mx-auto mt-[-24px] md:mt-3 book-layout-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ── LEFT COLUMN: FLIGHT & TRAVELLER DETAILS ── */}
          <div className="lg:col-span-2 space-y-3">
            
            {/* 1. FLIGHT DETAIL CONTAINER */}
            {/* Mobile Card Layout (hidden on desktop) */}
            <div className="block md:hidden bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative z-10 select-none font-sans mx-0 mt-[-36px] mb-4 book-flight-card-mobile">
              {/* Outbound Journey Header */}
              <div className="mb-2">
                <h2 className="text-[12.5px] font-extrabold text-[#0f172a] leading-tight">
                  {flight.fromCity} to {flight.toCity}
                </h2>
                <div className="flex items-center gap-2 mt-1 select-none">
                  <span className="text-[12px] text-slate-500 font-medium">{formatMockupDate(depart)}</span>
                  <span className="bg-[#e0effe] text-[#0062e3] text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Depart
                  </span>
                </div>
              </div>

              {/* Outbound Segments */}
              <div className="space-y-2.5">
                {getFlightSegments().map((seg: any, idx: number) => {
                  if (seg.type === 'layover') {
                    return (
                      <div key={`out-lay-${idx}`} className="relative flex items-center justify-center my-2 py-0.5 select-none">
                        {/* Dashed line across */}
                        <div className="absolute left-0 right-0 border-t border-dashed border-[#ffbf33] z-0" />
                        {/* Text bubble */}
                        <div className="bg-[#fffbeb] border border-amber-200 rounded-full px-4 py-1.5 text-center relative z-10 shadow-sm">
                          <span className="text-[10px] text-amber-800 font-extrabold leading-none flex items-center justify-center gap-1.5">
                            <i className="fa-solid fa-hourglass-half text-[9px] text-[#e0a81d]" />
                            <span>{seg.layoverDuration} layover in {seg.transitCity} ({seg.transitCode})</span>
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={`out-seg-${idx}`} className="space-y-2">
                      {/* Segment Info Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 flex items-center justify-center shrink-0">
                            <AirlineLogo code={seg.airlineCode} name={seg.airlineName} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="text-[14.5px] font-extrabold text-[#1e293b] leading-tight">
                              {seg.airlineName} | {seg.flightNo}
                            </div>
                            <div className="flex items-center gap-2 mt-1 select-none">
                              <span className="bg-[#f1f5f9] text-[#475569] text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                Saver
                              </span>
                              <span className="bg-[#f8fafc] border border-slate-100 text-slate-400 text-[9.5px] font-semibold px-2 py-0.5 rounded">
                                {seg.aircraft || 'Airbus A320 (Narrow-body)'}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Timeline Detail Box */}
                      <div className="flex items-start justify-between gap-4 mt-2 p-3 bg-[#f8fafc] border border-slate-100/80 rounded-2xl">
                        {/* Departure Info */}
                        <div className="w-[31%] text-left flex flex-col">
                          <span className="text-slate-400 text-[10.5px] font-bold mb-0.5 select-none">
                            {formatMockupDate(seg.depDate || depart)}
                          </span>
                          <div className="text-[17px] font-black text-slate-900 leading-tight font-sans">
                            {seg.depCode} {seg.depTime}
                          </div>
                          <span className="text-slate-700 text-[11.5px] font-bold mt-1 truncate">
                            {seg.depCity}
                          </span>
                          <span className="text-slate-400 text-[10.5px] font-medium leading-tight">
                            {seg.depTerminal || 'Terminal - 2'}
                          </span>
                        </div>

                        {/* Central Duration Timeline */}
                        <div className="flex-1 flex flex-col items-center select-none pt-1">
                          <span className="text-[10px] text-slate-500 font-extrabold mb-1 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.2 whitespace-nowrap">
                            {seg.duration}
                          </span>
                          <div className="w-full flex items-center justify-center relative py-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <div className="flex-1 border-t-2 border-dotted border-slate-300 mx-0.5" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#0062e3] shrink-0 z-10 flex items-center justify-center relative">
                              <div className="w-1 h-1 rounded-full bg-white" />
                            </div>
                            <div className="flex-1 border-t-2 border-dotted border-slate-300 mx-0.5" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          </div>
                        </div>

                        {/* Arrival Info */}
                        <div className="w-[31%] text-right flex flex-col items-end">
                          <span className="text-slate-400 text-[10.5px] font-bold mb-0.5 select-none">
                            {formatMockupDate(seg.arrDate || depart)}
                          </span>
                          <div className="text-[17px] font-black text-slate-900 leading-tight">
                            {seg.arrTime} {seg.arrCode}
                          </div>
                          <span className="text-slate-700 text-[11.5px] font-bold mt-1 truncate">
                            {seg.arrCity}
                          </span>
                          <span className="text-slate-400 text-[10.5px] font-medium leading-tight">
                            {seg.arrTerminal || 'Terminal - 1'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inbound Journey Header (For round trips) */}
              {flight.returnFlight && (
                <>
                  <div className="border-t border-slate-100 my-2 pt-2 select-none">
                    <h2 className="text-[12.5px] font-extrabold text-[#0f172a] leading-tight">
                      {flight.toCity} to {flight.fromCity}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-slate-500 font-medium">{formatMockupDate(returnDate)}</span>
                      <span className="bg-[#fef3c7] text-[#d97706] text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        Return
                      </span>
                    </div>
                  </div>

                  {/* Inbound Segments */}
                  <div className="space-y-2.5">
                    {getReturnFlightSegments().map((seg: any, idx: number) => {
                      if (seg.type === 'layover') {
                        return (
                          <div key={`ret-lay-${idx}`} className="relative flex items-center justify-center my-2 py-0.5 select-none">
                            {/* Dashed line across */}
                            <div className="absolute left-0 right-0 border-t border-dashed border-[#ffbf33] z-0" />
                            {/* Text bubble */}
                            <div className="bg-[#fffbeb] border border-amber-200 rounded-full px-4 py-1.5 text-center relative z-10 shadow-sm">
                              <span className="text-[10px] text-amber-800 font-extrabold leading-none flex items-center justify-center gap-1.5">
                                <i className="fa-solid fa-hourglass-half text-[9px] text-[#e0a81d]" />
                                <span>{seg.layoverDuration} layover in {seg.transitCity} ({seg.transitCode})</span>
                              </span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={`ret-seg-${idx}`} className="space-y-2">
                          {/* Segment Info Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                                <AirlineLogo code={seg.airlineCode} name={seg.airlineName} className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <div className="text-[14.5px] font-extrabold text-[#1e293b] leading-tight">
                                  {seg.airlineName} | {seg.flightNo}
                                </div>
                                <div className="flex items-center gap-2 mt-1 select-none">
                                  <span className="bg-[#f1f5f9] text-[#475569] text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                    Saver
                                  </span>
                                  <span className="bg-[#f8fafc] border border-slate-100 text-slate-400 text-[9.5px] font-semibold px-2 py-0.5 rounded">
                                    {seg.aircraft || 'Airbus A320 (Narrow-body)'}
                                  </span>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Timeline Detail Box */}
                          <div className="flex items-start justify-between gap-4 mt-2 p-3 bg-[#f8fafc] border border-slate-100/80 rounded-2xl">
                            {/* Departure Info */}
                            <div className="w-[31%] text-left flex flex-col">
                              <span className="text-slate-400 text-[10.5px] font-bold mb-0.5 select-none">
                                {formatMockupDate(seg.depDate || returnDate)}
                              </span>
                              <div className="text-[17px] font-black text-slate-900 leading-tight font-sans">
                                {seg.depCode} {seg.depTime}
                              </div>
                              <span className="text-slate-700 text-[11.5px] font-bold mt-1 truncate">
                                {seg.depCity}
                              </span>
                              <span className="text-slate-400 text-[10.5px] font-medium leading-tight">
                                {seg.arrTerminal || 'Terminal - 1'}
                              </span>
                            </div>

                            {/* Central Duration Timeline */}
                            <div className="flex-1 flex flex-col items-center select-none pt-1">
                              <span className="text-[10px] text-slate-500 font-extrabold mb-1 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.2 whitespace-nowrap">
                                {seg.duration}
                              </span>
                              <div className="w-full flex items-center justify-center relative py-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <div className="flex-1 border-t-2 border-dotted border-slate-300 mx-0.5" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#d97706] shrink-0 z-10 flex items-center justify-center relative">
                                  <div className="w-1 h-1 rounded-full bg-white" />
                                </div>
                                <div className="flex-1 border-t-2 border-dotted border-slate-300 mx-0.5" />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              </div>
                            </div>

                            {/* Arrival Info */}
                            <div className="w-[31%] text-right flex flex-col items-end">
                              <span className="text-slate-400 text-[10.5px] font-bold mb-0.5 select-none">
                                {formatMockupDate(seg.arrDate || returnDate)}
                              </span>
                              <div className="text-[17px] font-black text-slate-900 leading-tight">
                                {seg.arrTime} {seg.arrCode}
                              </div>
                              <span className="text-slate-700 text-[11.5px] font-bold mt-1 truncate">
                                {seg.arrCity}
                              </span>
                              <span className="text-slate-400 text-[10.5px] font-medium leading-tight">
                                {seg.arrTerminal || 'Terminal - 2'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Fare Rules and Baggage Links */}
              <div className="flex items-center gap-3.5 text-[12px] font-bold text-[#0062e3] border-t border-slate-100 pt-2 mt-2 select-none">
                <span className="cursor-pointer hover:underline">Fare Rules</span>
                <span className="text-slate-300 font-normal">|</span>
                <span className="cursor-pointer hover:underline">Baggage</span>
              </div>
            </div>

            {/* Desktop Card Layout (hidden on mobile) */}
            <div className="hidden md:block">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div 
                  className={`bg-[#fff4ec] px-4 border-b border-orange-100/50 ${checkoutStep === 'payment' ? '' : 'py-0.5'}`}
                  style={checkoutStep === 'payment' ? { paddingTop: '10px', paddingBottom: '6px' } : undefined}
                >
                  {checkoutStep === 'payment' ? (
                    <h2 className="font-bold text-slate-800" style={{ fontSize: '17.5px' }}>Booking Summary</h2>
                  ) : (
                    <h2 className="text-[14px] font-bold text-slate-800" style={{ display: 'inline-block', transform: 'scale(0.5)', transformOrigin: 'left center' }}>Flight Detail</h2>
                  )}
                </div>

                <div 
                  className="px-3 space-y-3" 
                  style={{ 
                    paddingTop: '6px', 
                    paddingBottom: checkoutStep === 'payment' ? '10px' : '6px' 
                  }}
                >
                  {/* Outbound Journey Card */}
                  <div className="border border-slate-200 rounded-lg bg-white px-3 py-1.5">
                    {/* Header Row */}
                    <div 
                      className="flex items-center justify-between cursor-pointer pb-1 border-b border-slate-100"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                          <AirlineLogo code={flight.airlineCode} name={flight.airlineName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900 leading-tight" style={{ display: 'inline-block', transform: 'scale(0.5)', transformOrigin: 'left center' }}>
                            {flight.fromCity} to {flight.toCity}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium" style={{ marginTop: '-5px' }}>
                            {getSubtitle()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <i className={`fa-solid fa-chevron-down text-slate-500 text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Segments list */}
                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        {getFlightSegments().map((seg: any, idx: number) => {
                          if (seg.type === 'layover') {
                            return (
                              <div key={idx} className="relative flex items-center justify-center my-5">
                                <div className="w-full border-t border-slate-100" />
                                <span className="absolute bg-[#f0f5fa] text-[#072146] text-[11px] font-medium px-4 py-1.5 rounded-full border border-slate-200/50 shadow-sm leading-none flex items-center gap-1">
                                  <span>Change of planes | </span>
                                  <strong>{seg.layoverDuration}</strong>
                                  <span> Layover in </span>
                                  <strong>{seg.transitCity} ({seg.transitCode})</strong>
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start pt-1">
                              {/* Col 1: Airline info */}
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 flex items-center justify-center shrink-0 bg-slate-50 rounded border border-slate-100 mt-0.5">
                                  <AirlineLogo code={seg.airlineCode} name={seg.airlineName} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                  <h4 className="text-[9px] font-normal text-slate-800 leading-tight" style={{ display: 'inline-block', transform: 'scale(0.5)', transformOrigin: 'left center' }}>
                                    {seg.airlineName}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                    {seg.flightNo}
                                  </p>
                                  <p className="text-[11px] text-slate-400 font-medium leading-tight">
                                    {seg.aircraft}
                                  </p>
                                  <div className="mt-2">
                                    <span className="bg-[#eaeaea] text-[#333333] text-[9.5px] font-normal px-1.5 py-0.5 rounded uppercase tracking-wider">
                                      {fareClass.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Col 2: Departure */}
                              <div>
                                <div className="text-[13.5px] font-bold text-slate-900 leading-none">
                                  {seg.depTime}
                                </div>
                                <div className="text-[12px] font-bold text-slate-800 mt-1">
                                  {seg.depCity} ({seg.depCode})
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                  {seg.depDate}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  {seg.depTerminal}
                                </div>
                              </div>

                              {/* Col 3: Visual Timeline */}
                              <div className="flex flex-col items-center justify-center text-center">
                                <span className="text-[11px] text-slate-400 font-medium mb-0.5">
                                  {seg.duration}
                                </span>
                                
                                <div className="flex items-center justify-center w-full max-w-[120px] relative py-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                  <div className="flex-1 h-[1.5px] bg-slate-200" />
                                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center -mx-1 shrink-0 z-10">
                                    <i className="fa-solid fa-plane text-[9px] text-slate-400 transform -rotate-45" />
                                  </div>
                                  <div className="flex-1 h-[1.5px] bg-slate-200" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                </div>
                              </div>

                              {/* Col 4: Arrival */}
                              <div>
                                <div className="text-[13.5px] font-bold text-slate-900 leading-none">
                                  {seg.arrTime}
                                </div>
                                <div className="text-[12px] font-bold text-slate-800 mt-1">
                                  {seg.arrCity} ({seg.arrCode})
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                  {seg.arrDate}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  {seg.arrTerminal}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Fare Rules and Baggage allowance */}
                        {!flight.returnFlight && (
                          <div className="flex items-center gap-4 text-[11px] font-normal text-slate-400 border-t border-slate-100 pt-1.5 mt-1">
                            <span className="cursor-pointer hover:text-blue-600 transition-colors uppercase tracking-wider">
                              Fare Rules
                            </span>
                            <span className="cursor-pointer hover:text-blue-600 transition-colors uppercase tracking-wider">
                              Baggage
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Return Journey Card */}
                  {flight.returnFlight && (
                    <div className="border border-slate-200 rounded-lg bg-white px-3 py-1.5 mt-3">
                      {/* Header Row */}
                      <div 
                        className="flex items-center justify-between cursor-pointer pb-1 border-b border-slate-100"
                        onClick={() => setIsReturnExpanded(!isReturnExpanded)}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 flex items-center justify-center shrink-0">
                            <AirlineLogo code={flight.returnFlight.airlineCode} name={flight.returnFlight.airlineName} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-slate-900 leading-tight" style={{ display: 'inline-block', transform: 'scale(0.5)', transformOrigin: 'left center' }}>
                              {flight.toCity} to {flight.fromCity}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium" style={{ marginTop: '-5px' }}>
                              {formatDisplayDate(returnDate)} • Return Journey
                            </p>
                          </div>
                        </div>
                        <div>
                          <i className={`fa-solid fa-chevron-down text-slate-500 text-sm transition-transform duration-300 ${isReturnExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* Segments list */}
                      {isReturnExpanded && (
                        <div className="mt-3 space-y-3">
                          {getReturnFlightSegments().map((seg: any, idx: number) => {
                            if (seg.type === 'layover') {
                              return (
                                <div key={idx} className="relative flex items-center justify-center my-5">
                                  <div className="w-full border-t border-slate-100" />
                                  <span className="absolute bg-[#f0f5fa] text-[#072146] text-[11px] font-medium px-4 py-1.5 rounded-full border border-slate-200/50 shadow-sm leading-none flex items-center gap-1">
                                    <span>Change of planes | </span>
                                    <strong>{seg.layoverDuration}</strong>
                                    <span> Layover in </span>
                                    <strong>{seg.transitCity} ({seg.transitCode})</strong>
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start pt-1">
                                {/* Col 1: Airline info */}
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 flex items-center justify-center shrink-0 bg-slate-50 rounded border border-slate-100 mt-0.5">
                                    <AirlineLogo code={seg.airlineCode} name={seg.airlineName} className="w-full h-full object-contain" />
                                  </div>
                                  <div>
                                    <h4 className="text-[9px] font-normal text-slate-800 leading-tight" style={{ display: 'inline-block', transform: 'scale(0.5)', transformOrigin: 'left center' }}>
                                      {seg.airlineName}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                      {seg.flightNo}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium leading-tight">
                                      {seg.aircraft}
                                    </p>
                                    <div className="mt-2">
                                      <span className="bg-[#eaeaea] text-[#333333] text-[9.5px] font-normal px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        {fareClass.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Col 2: Departure */}
                                <div>
                                  <div className="text-[13.5px] font-bold text-slate-900 leading-none">
                                    {seg.depTime}
                                  </div>
                                  <div className="text-[12px] font-bold text-slate-800 mt-1">
                                    {seg.depCity} ({seg.depCode})
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                    {seg.depDate}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-medium">
                                    {seg.depTerminal}
                                  </div>
                                </div>

                                {/* Col 3: Visual Timeline */}
                                <div className="flex flex-col items-center justify-center text-center">
                                  <span className="text-[11px] text-slate-400 font-medium mb-0.5">
                                    {seg.duration}
                                  </span>
                                  
                                  <div className="flex items-center justify-center w-full max-w-[120px] relative py-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    <div className="flex-1 h-[1.5px] bg-slate-200" />
                                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center -mx-1 shrink-0 z-10">
                                      <i className="fa-solid fa-plane text-[9px] text-slate-400 transform -rotate-45" />
                                    </div>
                                    <div className="flex-1 h-[1.5px] bg-slate-200" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                  </div>
                                </div>

                                {/* Col 4: Arrival */}
                                <div>
                                  <div className="text-[13.5px] font-bold text-slate-900 leading-none">
                                    {seg.arrTime}
                                  </div>
                                  <div className="text-[12px] font-bold text-slate-800 mt-1">
                                    {seg.arrCity} ({seg.arrCode})
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                    {seg.arrDate}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-medium">
                                    {seg.arrTerminal}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fare Rules and Baggage allowance for Desktop round trip */}
                  {flight.returnFlight && (
                    <div className="flex items-center gap-4 text-[11px] font-normal text-slate-400 border-t border-slate-100 pt-1.5 mt-3 select-none">
                      <span className="cursor-pointer hover:text-blue-600 transition-colors uppercase tracking-wider">
                        Fare Rules
                      </span>
                      <span className="cursor-pointer hover:text-blue-600 transition-colors uppercase tracking-wider">
                        Baggage
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {checkoutStep === 'details' ? (
              <>
                {/* 2. HASSLE-FREE JOURNEYS GUARANTEED */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative" style={{ marginTop: '20px' }}>
                  <div 
                    className="bg-[#fbf3ff] px-4 py-2.5 border-b border-purple-100/50 flex items-center justify-between relative cursor-pointer select-none"
                    onClick={() => setIsHassleFreeExpanded(!isHassleFreeExpanded)}
                  >
                    <div>
                      <h3 className="font-extrabold text-[#2d004d] leading-none" style={{ fontSize: '15px' }}>
                        Hassle-Free Journeys Guaranteed.
                      </h3>
                      <p className="text-slate-500 font-normal leading-none" style={{ fontSize: '11.7px', marginTop: '1px' }}>
                        Select Exclusive Services to Enjoy Smooth &amp; Seamless Journeys Like Never Before!
                      </p>
                    </div>

                    <div className="flex items-center gap-3.5 pr-8">
                      {/* Custom CSS Ribbon hanging off the top */}
                      <div 
                        className="absolute top-0 right-[42px] bg-gradient-to-b from-[#ec4899] to-[#be185d] text-white text-center shadow-sm z-10"
                        style={{ 
                          width: '32px', 
                          height: '42px',
                          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
                          paddingTop: '6px',
                          paddingBottom: '8px'
                        }}
                      >
                        <div className="text-[6.5px] font-bold tracking-wider leading-none">FLAT</div>
                        <div className="text-[11.5px] font-black leading-none my-0.5">40%</div>
                        <div className="text-[6.5px] font-bold tracking-wider leading-none">OFF</div>
                      </div>
                      
                      <i className={`fa-solid fa-chevron-down text-slate-500 text-sm transition-transform duration-300 ${isHassleFreeExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isHassleFreeExpanded && (
                    <div className="p-3.5 flex flex-col">
                      {/* Option 1: Free Cancellation */}
                      <div 
                        onClick={() => setProtectionOption(protectionOption === 'cancellation' ? 'none' : 'cancellation')}
                        className={`border rounded-xl px-3 flex items-center gap-3.5 cursor-pointer transition-all bg-gradient-to-r from-[#e0f2fe]/40 via-[#e0f2fe]/10 to-white hover:shadow-sm ${
                          protectionOption === 'cancellation' 
                            ? 'border-[#0084ff] shadow-md shadow-blue-50/20' 
                            : 'border-slate-200/80'
                        }`}
                        style={{ paddingTop: '3px', paddingBottom: '3px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px', marginTop: '10px' }}
                      >
                        <div className="flex items-center justify-center shrink-0">
                          <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            protectionOption === 'cancellation' ? 'border-[#0084ff] bg-[#0084ff]' : 'border-slate-300 bg-white'
                          }`}>
                            {protectionOption === 'cancellation' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        
                        <svg className="w-7 h-7 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746v6.2c0 4.145-2.73 7.828-6.8 9.212l-1.034.354-1.034-.354c-4.07-1.384-6.8-5.067-6.8-9.212V4.9zm8.834 8.293l4-4a1 1 0 10-1.414-1.414L10 11.086 8.414 9.5a1 1 0 00-1.414 1.414l2.25 2.25a1 1 0 001.414 0z" clipRule="evenodd" />
                        </svg>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800" style={{ fontSize: '11.5px' }}>Free Cancellation for Any Reason</span>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 line-through mr-1.5">₹1398</span>
                              <span className="font-bold text-slate-900" style={{ fontSize: '12.5px' }}>₹839</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-normal">
                            Instant refund of approx <span className="text-slate-700">₹5,813</span> on cancellations 24 hrs before departure. <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Check T&amp;Cs</span>
                          </p>
                        </div>
                      </div>

                      {/* Option 2: Free Date Change */}
                      <div 
                        onClick={() => setProtectionOption(protectionOption === 'date_change' ? 'none' : 'date_change')}
                        className={`border rounded-xl px-3 flex items-center gap-3.5 cursor-pointer transition-all bg-gradient-to-r from-[#fff1f2]/40 via-[#fff1f2]/10 to-white hover:shadow-sm ${
                          protectionOption === 'date_change' 
                            ? 'border-[#f43f5e] shadow-md shadow-rose-50/20' 
                            : 'border-slate-200/80'
                        }`}
                        style={{ paddingTop: '3px', paddingBottom: '3px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
                      >
                        <div className="flex items-center justify-center shrink-0">
                          <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            protectionOption === 'date_change' ? 'border-[#f43f5e] bg-[#f43f5e]' : 'border-slate-300 bg-white'
                          }`}>
                            {protectionOption === 'date_change' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>

                        <svg className="w-7 h-7 text-rose-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800" style={{ fontSize: '11.5px' }}>Free Date Change</span>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 line-through mr-1.5">₹1096</span>
                              <span className="font-bold text-slate-900" style={{ fontSize: '12.5px' }}>₹658</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-normal">
                            Modify your travel dates before 24 Hrs of departure, absolutely free of charge. <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Check T&amp;Cs</span>
                          </p>
                        </div>
                      </div>

                      {/* Option 3: EaseFly */}
                      <div 
                        onClick={() => setProtectionOption(protectionOption === 'easefly' ? 'none' : 'easefly')}
                        className={`border rounded-xl px-3 flex items-center gap-3.5 cursor-pointer transition-all bg-gradient-to-r from-[#faf5ff]/40 via-[#faf5ff]/10 to-white hover:shadow-sm ${
                          protectionOption === 'easefly' 
                            ? 'border-[#a855f7] shadow-md shadow-purple-50/20' 
                            : 'border-slate-200/80'
                        }`}
                        style={{ paddingTop: '3px', paddingBottom: '3px', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}
                      >
                        <div className="flex items-center justify-center shrink-0">
                          <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            protectionOption === 'easefly' ? 'border-[#a855f7] bg-[#a855f7]' : 'border-slate-300 bg-white'
                          }`}>
                            {protectionOption === 'easefly' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>

                        <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
                          <i className="fa-solid fa-shield text-[#f59e0b] text-2xl" />
                          <i className="fa-solid fa-plane text-[#0062e3] text-[10px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800" style={{ fontSize: '11.5px' }}>Flexi Protect (Free Cancellation + Free Date Change)</span>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 line-through mr-1.5">₹1699</span>
                              <span className="font-bold text-slate-900" style={{ fontSize: '12.5px' }}>₹1,020</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-normal">
                            Enjoy instant refunds on canceled flights or change your travel date for free. <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Check T&amp;Cs</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. CHARITY: PRESERVE HERITAGE */}
                <div className="bg-[#f2faf5] rounded-2xl border border-[#d1ebd9] shadow-sm overflow-hidden p-4" style={{ marginTop: '15px', marginBottom: '15px' }}>
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 leading-none" style={{ fontSize: '13.5px' }}>
                        Help us preserve India's Heritage &amp; Green Spaces!
                      </h4>
                      <p className="text-slate-500 font-normal leading-normal" style={{ fontSize: '11px', marginTop: '4px' }}>
                        Support the Twin Brothers Holidays Foundation and donate to maintain greenery &amp; cleanliness across parks and ASI monuments for future generations.
                        <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer ml-1.5 whitespace-nowrap">Know More</span>
                      </p>

                      {/* Donation options */}
                      <div className="flex flex-wrap gap-2.5 mt-3.5 items-center">
                        {[10, 20, 50, 100].map((amt) => {
                          const isActive = charityAmount === amt;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setCharityAmount(isActive ? 0 : amt)}
                              className={`border cursor-pointer transition-all hover:shadow-sm ${
                                isActive 
                                  ? 'border-[#10b981] bg-white text-emerald-800 font-extrabold shadow-sm' 
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 font-medium'
                              }`}
                              style={{ 
                                fontSize: '11.5px', 
                                padding: '4.5px 15px', 
                                borderRadius: '50px',
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              ₹ <span className="font-bold">{amt}</span>
                            </button>
                          );
                        })}
                        {charityAmount > 0 && (
                          <button
                            type="button"
                            onClick={() => setCharityAmount(0)}
                            className="text-red-500 text-[11px] font-bold uppercase hover:underline ml-1.5 border-0 bg-transparent cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 hidden sm:flex items-center justify-center">
                      <img 
                        src="/images/charity_plant.png" 
                        alt="Preserve Heritage" 
                        className="object-contain"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. TRAVELLERS DETAILS */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <div className="bg-[#fff4ec] border-b border-orange-100 px-3 py-2 flex items-center justify-between gap-1.5 select-none">
                    <div className="font-extrabold text-slate-900 shrink-0" style={{ fontSize: '12.5px' }}>
                      Travellers Details
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-right justify-end" style={{ fontSize: '9px', lineHeight: '1.1' }}>
                      <i className="fa-regular fa-id-card text-[10px] text-slate-400 shrink-0" />
                      <span>Name should be same as in government ID proof</span>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-4 bg-white">
                    {/* Collapsible Box wrapper */}
                    <div className="bg-white overflow-hidden mt-[5px]">
                      <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between bg-white border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          {/* Checkbox indicator */}
                          <div className="w-[18px] h-[18px] bg-[#ff8126] rounded flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-check text-white text-[10px]" />
                          </div>
                          <span className="font-bold text-slate-900" style={{ fontSize: '13px' }}>Adult 1</span>
                        </div>
                      </div>

                      <div className="p-3 space-y-3 sm:p-4 sm:space-y-4 bg-white">
                        <div className="grid grid-cols-6 gap-2 sm:gap-4">
                          <div className="col-span-1">
                            <select
                              value={travellerTitle}
                              onChange={(e) => setTravellerTitle(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all cursor-pointer h-9"
                              style={{ fontSize: '11.5px', borderRadius: '4px' }}
                            >
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Ms">Ms</option>
                            </select>
                          </div>

                          <div className="col-span-3">
                            <input 
                              type="text" 
                              placeholder="Enter First Name"
                              required
                              value={travellerFirstName}
                              onChange={(e) => setTravellerFirstName(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all h-9"
                              style={{ fontSize: '11.5px', borderRadius: '4px' }}
                            />
                          </div>

                          <div className="col-span-2">
                            <input 
                              type="text" 
                              placeholder="Enter Last Name"
                              required
                              value={travellerLastName}
                              onChange={(e) => setTravellerLastName(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all h-9"
                              style={{ fontSize: '11.5px', borderRadius: '4px' }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                          <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1" style={{ fontSize: '10.5px' }}>Email Id (Optional)</label>
                            <input 
                              type="email" 
                              placeholder="Enter Email Id"
                              value={travellerEmail}
                              onChange={(e) => setTravellerEmail(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all h-9"
                              style={{ fontSize: '11.5px', borderRadius: '4px' }}
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1" style={{ fontSize: '10.5px' }}>Contact Number (Optional)</label>
                            <input 
                              type="tel" 
                              placeholder="Enter Contact Number"
                              value={travellerPhone}
                              onChange={(e) => setTravellerPhone(handlePhoneValidation(e.target.value))}
                              className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all h-9"
                              style={{ fontSize: '11.5px', borderRadius: '4px' }}
                            />
                          </div>
                        </div>

                        {/* Add-ons Footer within collapsible wrapper */}
                        <div className="border-t border-dashed border-slate-200 pt-2.5 -mx-3 -mb-3 px-3 py-2.5 bg-[#f8fafc]" style={{ marginTop: '10px' }}>
                          <div className="text-left">
                            <div className="font-bold text-slate-700 leading-none" style={{ fontSize: '11px' }}>Add-ons (Optional)</div>
                            <div className="text-slate-500 font-normal leading-normal mt-1" style={{ fontSize: '11px' }}>
                              Pre-booked meals, Seats and Baggage are 30% cheaper than on-board price.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. CONTACT DETAILS */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ marginTop: '20px', marginBottom: '15px' }}>
                  {/* Header block with solid brand orange background */}
                  <div className="bg-[#ff8126] px-3 text-white" style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <div className="w-[18px] h-[18px] bg-white rounded flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-address-book text-[#ff8126] text-[10px]" />
                        </div>
                        <span className="font-extrabold text-white" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Details</span>
                      </div>
                      <p className="text-white/80 font-normal leading-tight mt-0.5" style={{ fontSize: '10.5px', paddingLeft: '26px' }}>Your ticket &amp; flight details will be shared here</p>
                    </div>
                  </div>

                  <div className="pt-2 pb-2 px-4 sm:pt-3 sm:pb-2.5 sm:px-5 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                      {/* Email Address */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1" style={{ fontSize: '11px' }}>
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="email" 
                            placeholder="Enter Email Address"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 pl-3 pr-8 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all h-9"
                            style={{ fontSize: '11.5px', borderRadius: '4px' }}
                          />
                          <i className="fa-regular fa-envelope absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]" />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1" style={{ fontSize: '11px' }}>
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex border border-slate-200 focus-within:border-[#ff8126] transition-all h-9 bg-white" style={{ borderRadius: '4px' }}>
                          {/* Country selector */}
                          <div className="flex items-center gap-1.5 px-2 bg-white shrink-0 border-r border-slate-200">
                            <span className="text-[12px]">🇮🇳</span>
                            <i className="fa-solid fa-caret-down text-[8px] text-slate-500" />
                            <span className="font-extrabold text-slate-800 text-[11.5px] ml-0.5">+91</span>
                          </div>
                          {/* Input field */}
                          <div className="flex-1 relative">
                            <input 
                              type="tel" 
                              placeholder="Enter Mobile no."
                              required
                              value={contactPhone}
                              onChange={(e) => {
                                const val = handlePhoneValidation(e.target.value);
                                setContactPhone(val);
                                if (val.length === 10) setPhoneError('');
                              }}
                              className="w-full h-full bg-white pl-3 pr-8 py-1.5 text-slate-800 focus:outline-none"
                              style={{ fontSize: '11.5px' }}
                            />
                            <i className="fa-solid fa-phone absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]" />
                          </div>
                        </div>
                        {phoneError && <small className="text-red-500 text-[11px] block mt-1">{phoneError}</small>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="my-4 px-1">
                  <label className="cursor-pointer select-none" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="sr-only" 
                    />
                    {/* Custom Checkbox indicator */}
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 border transition-all ${
                      agreeTerms ? 'bg-[#ff8126] border-[#ff8126]' : 'bg-white border-slate-300'
                    }`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {agreeTerms && <i className="fa-solid fa-check text-white text-[10px]" />}
                    </div>
                    <span className="text-[11px] text-slate-700 leading-normal font-normal">
                      I understand and agree to the rules, <span className="text-[#ff8126] hover:text-orange-600 cursor-pointer">Privacy Policy</span>, <span className="text-[#ff8126] hover:text-orange-600 cursor-pointer">User Agreement</span> and <span className="text-[#ff8126] hover:text-orange-600 cursor-pointer">Terms Conditions</span> of Twin Brothers Holidays
                    </span>
                  </label>
                </div>

                {/* GST Option Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm my-4" style={{ padding: '5px' }}>
                  <label className="cursor-pointer select-none" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      checked={useGST}
                      onChange={(e) => setUseGST(e.target.checked)}
                      className="sr-only"
                    />
                    {/* Custom Checkbox indicator */}
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 border transition-all ${
                      useGST ? 'bg-[#ff8126] border-[#ff8126]' : 'bg-white border-slate-300'
                    }`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {useGST && <i className="fa-solid fa-check text-white text-[10px]" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800" style={{ fontSize: '11.5px' }}>
                        Use GST for this booking (OPTIONAL)
                      </div>
                      <div className="text-slate-400 font-normal leading-normal mt-0.5" style={{ fontSize: '10.5px' }}>
                        To claim credit of GST charged by airlines / Twin Brothers Holidays, please enter your company's GST number
                      </div>
                    </div>
                  </label>
                  
                  {useGST && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 transition-all duration-300">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Enter Company GSTIN"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all"
                          style={{ fontSize: '11.5px', borderRadius: '4px' }}
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="Enter Registered Company Name"
                          value={gstCompany}
                          onChange={(e) => setGstCompany(e.target.value)}
                          className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 focus:outline-none focus:border-[#ff8126] transition-all"
                          style={{ fontSize: '11.5px', borderRadius: '4px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions for Desktop */}
                <div className="hidden lg:flex items-center justify-center w-full">
                  <button
                    onClick={() => handleBookingSubmit()}
                    disabled={isSubmitting}
                    className="bg-[#ff8126] hover:bg-[#fd661e] text-white font-extrabold text-[13px] uppercase tracking-wider px-8 rounded-lg border-0 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-w-[200px]"
                    style={{ borderRadius: '8px', paddingTop: '14px', paddingBottom: '14px', marginBottom: '20px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <span>Continue Booking</span>
                    )}
                  </button>
                </div>
              </>
            ) : checkoutStep === 'addons' ? (
              <div className="space-y-4">
                {/* 1. CHARITY: PRESERVE HERITAGE */}
                <div className="bg-[#f2faf5] rounded-2xl border border-[#d1ebd9] shadow-sm overflow-hidden p-4" style={{ marginTop: '15px', marginBottom: '15px' }}>
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 leading-none" style={{ fontSize: '13.5px' }}>
                        Help us preserve India's Heritage &amp; Green Spaces!
                      </h4>
                      <p className="text-slate-500 font-normal leading-normal" style={{ fontSize: '11px', marginTop: '4px' }}>
                        Support the Twin Brothers Holidays Foundation and donate to maintain greenery &amp; cleanliness across parks and ASI monuments for future generations.
                        <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer ml-1.5 whitespace-nowrap">Know More</span>
                      </p>

                      {/* Donation options */}
                      <div className="flex flex-wrap gap-2.5 mt-3.5 items-center">
                        {[10, 20, 50, 100].map((amt) => {
                          const isActive = charityAmount === amt;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setCharityAmount(isActive ? 0 : amt)}
                              className={`border cursor-pointer transition-all hover:shadow-sm ${
                                isActive 
                                  ? 'border-[#10b981] bg-white text-emerald-800 font-extrabold shadow-sm' 
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 font-medium'
                              }`}
                              style={{ 
                                fontSize: '11.5px', 
                                padding: '4.5px 15px', 
                                borderRadius: '50px',
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              ₹ <span className="font-bold">{amt}</span>
                            </button>
                          );
                        })}
                        {charityAmount > 0 && (
                          <button
                            type="button"
                            onClick={() => setCharityAmount(0)}
                            className="text-red-500 text-[11px] font-bold uppercase hover:underline ml-1.5 border-0 bg-transparent cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 hidden sm:flex items-center justify-center">
                      <img 
                        src="/images/charity_plant.png" 
                        alt="Preserve Heritage" 
                        className="object-contain"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. TRAVELLER DETAILS SUMMARY CARD */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative" style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <div className="bg-[#fff4ec] border-b border-orange-100 px-4 py-2 flex items-center justify-between relative h-10">
                    <div className="font-extrabold text-slate-900" style={{ fontSize: '12.5px' }}>
                      Traveller Details
                    </div>
                    
                    {/* Angle Wedge Edit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutStep('details');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="absolute right-0 top-0 bottom-0 bg-[#ff8126] hover:bg-orange-600 text-white font-extrabold text-[12px] flex items-center justify-center transition-colors h-full px-5 border-0 cursor-pointer"
                      style={{
                        clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0% 100%)',
                        paddingLeft: '22px'
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-4 bg-white grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <span className="block text-slate-500 font-bold text-[10.5px] uppercase tracking-wider">Email</span>
                      <span className="block text-slate-700 font-medium text-[12.5px] mt-1 break-all">{contactEmail || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-bold text-[10.5px] uppercase tracking-wider">Contact No.</span>
                      <span className="block text-slate-700 font-medium text-[12.5px] mt-1">{contactPhone ? `+91-${contactPhone}` : '—'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-bold text-[10.5px] uppercase tracking-wider">Adult ({adults})</span>
                      <span className="block text-slate-700 font-medium text-[12.5px] mt-1">
                        {travellerFirstName ? `${travellerTitle} ${travellerFirstName} ${travellerLastName}` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-bold text-[10.5px] uppercase tracking-wider">Child ({children})</span>
                      <span className="block text-slate-700 font-medium text-[12.5px] mt-1">—</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-bold text-[10.5px] uppercase tracking-wider">Infant ({infants})</span>
                      <span className="block text-slate-700 font-medium text-[12.5px] mt-1">—</span>
                    </div>
                  </div>
                </div>

                {/* 3. ADD-ONS SELECTOR CONTAINER */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
                  {/* Tab Navigation & Skip Link */}
                  <div className="flex border-b border-slate-100 pb-2 mb-4 items-center justify-between">
                    <div className="flex justify-around flex-1 max-w-xl">
                      <button
                        type="button"
                        onClick={() => setActiveAddonTab('seats')}
                        className={`flex items-center gap-2 pb-2.5 px-3 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
                          activeAddonTab === 'seats'
                            ? 'border-[#ff8126] text-[#ff8126]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <i className="fa-solid fa-chair text-sm" />
                        <span>Seat</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveAddonTab('meals')}
                        className={`flex items-center gap-2 pb-2.5 px-3 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
                          activeAddonTab === 'meals'
                            ? 'border-[#ff8126] text-[#ff8126]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <i className="fa-solid fa-utensils text-sm" />
                        <span>Meal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveAddonTab('baggage')}
                        className={`flex items-center gap-2 pb-2.5 px-3 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
                          activeAddonTab === 'baggage'
                            ? 'border-[#ff8126] text-[#ff8126]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <i className="fa-solid fa-suitcase text-sm" />
                        <span>Baggage</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveAddonTab('popular')}
                        className={`flex items-center gap-2 pb-2.5 px-3 font-bold text-[13px] border-b-2 transition-all cursor-pointer ${
                          activeAddonTab === 'popular'
                            ? 'border-[#ff8126] text-[#ff8126]'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <i className="fa-solid fa-ticket text-sm" />
                        <span>Popular Add Ons</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookingSubmit()}
                      className="text-[#ff8126] hover:text-orange-700 font-normal transition-colors border-0 bg-transparent cursor-pointer shrink-0 pb-2"
                      style={{ fontSize: '11px' }}
                    >
                      Skip to Payment
                    </button>
                  </div>

                  {/* Tab Content 1: SEATS */}
                  {activeAddonTab === 'seats' && (
                    <div className="space-y-4">
                      {/* Grid Split Pane: Left Info and Legends vs Right Cabin Map */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* ── LEFT PANEL: Segment pills, Flight, passenger details, and legends ── */}
                        <div className="lg:col-span-5 space-y-4">
                          
                          {/* Segment Pills */}
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                const outboundFlightSegments = getFlightSegments().filter((s: any) => s.type === 'flight');
                                const returnFlightSegments = getReturnFlightSegments().filter((s: any) => s.type === 'flight');
                                const allFlightSegments = [...outboundFlightSegments, ...returnFlightSegments];

                                return allFlightSegments.map((seg, sIdx) => {
                                  const isActive = activeSegmentIndex === sIdx;
                                  return (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => setActiveSegmentIndex(sIdx)}
                                      className={`border text-[10.5px] font-normal transition-all cursor-pointer ${
                                        isActive
                                          ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border-transparent text-white shadow-sm'
                                          : 'bg-white border-[#16213e] text-[#16213e] hover:bg-slate-50'
                                      }`}
                                      style={{ padding: '5px 11px', borderRadius: '20px' }}
                                    >
                                      {seg.depCode} – {seg.arrCode}
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>

                          {/* Airline Info Box */}
                          {(() => {
                            const outboundFlightSegments = getFlightSegments().filter((s: any) => s.type === 'flight');
                            const returnFlightSegments = getReturnFlightSegments().filter((s: any) => s.type === 'flight');
                            const allFlightSegments = [...outboundFlightSegments, ...returnFlightSegments];
                            const activeSeg = allFlightSegments[activeSegmentIndex] || allFlightSegments[0] || { airlineName: flight?.airlineName, airlineCode: flight?.airlineCode, flightNo: flight?.flightNo };

                            return (
                              <div className="flex items-center gap-3 py-2 select-none">
                                <AirlineLogo code={activeSeg.airlineCode} name={activeSeg.airlineName} className="w-10 h-10 object-contain shrink-0" />
                                <div>
                                  <h5 className="font-bold text-[#1c1c1c] text-[18px] leading-tight">{activeSeg.airlineName}</h5>
                                  <p className="text-[13px] text-[#4b4b4b] font-medium leading-none mt-1">{activeSeg.flightNo}</p>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Passenger Selection Table / Card matching reference image */}
                          <div className="border border-[#e2e8f0] rounded-[8px] overflow-hidden bg-white max-w-[320px] shadow-sm select-none">
                            <div className="divide-y divide-[#e2e8f0]">
                              {Array.from({ length: adults }, (_, idx) => {
                                const seatInfo = selectedSeats[activeSegmentIndex];
                                const seatCode = seatInfo?.seat || null;
                                const seatPrice = seatInfo?.price || 0;

                                return (
                                  <div key={idx} className="flex items-center justify-between px-4 py-3 bg-[#f8f9fa]">
                                    <span className="text-[14px] font-medium text-[#1c1c1c]">Adult {idx + 1}</span>
                                    <div className="flex items-center gap-4">
                                      {seatCode ? (
                                        <span className="bg-[#00a03d] text-white font-bold px-2 py-0.5 rounded-[4px] text-[12px] uppercase tracking-wide">
                                          {seatCode},
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 font-normal text-[12px]">Not Selected</span>
                                      )}
                                      <span className="font-bold text-[#1c1c1c] text-[14px] min-w-[50px] text-right">
                                        {seatCode ? `₹ ${seatPrice}` : '—'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="flex items-center justify-between px-4 py-3 bg-white font-bold text-[14px]">
                              <span className="text-[#1c1c1c]">Total Fare</span>
                              <span className="text-right text-[#1c1c1c] font-extrabold">
                                ₹{selectedSeats[activeSegmentIndex]?.price || 0}
                              </span>
                            </div>
                          </div>

                          {/* Legend / Seat Types Section */}
                          <div className="pt-4 space-y-4 select-none">
                            <h5 className="font-bold text-[#1c1c1c] flex items-center gap-2" style={{ fontSize: '12.8px' }}>
                              {/* Custom Outline Seat SVG */}
                              <svg className="w-5 h-5 text-[#4b4b4b] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 6V15C7 15.5523 7.44772 16 8 16H16C16.5523 16 17 15.5523 17 15V6C17 5.44772 16.5523 5 16 5H8C7.44772 5 7 5.44772 7 6Z" />
                                <path d="M7 11H17" />
                                <path d="M10 16V20" />
                                <path d="M14 16V20" />
                                <path d="M8 20H16" />
                              </svg>
                              <span>Seat Type</span>
                            </h5>
                            
                            {/* Color Grid */}
                            <div className="grid grid-cols-3 gap-y-3.5 gap-x-2 text-[#1c1c1c] font-medium" style={{ fontSize: '9.6px' }}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#94ecc0] border border-[#22c55e] rounded-[4px] shrink-0" />
                                <span>Free</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#bfdbfe] border border-[#93c5fd] rounded-[4px] shrink-0" />
                                <span>₹0-200</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#3a9cf6] border border-[#2563eb] rounded-[4px] shrink-0" />
                                <span>₹201-400</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#c084fc] border border-[#a855f7] rounded-[4px] shrink-0" />
                                <span>₹401-500</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#fcd34d] border border-[#fbbf24] rounded-[4px] shrink-0" />
                                <span>₹501-1200</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#fecaca] border border-[#fca5a5] rounded-[4px] shrink-0" />
                                <span>₹1201-1399</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#ddd6fe] border border-[#c084fc] rounded-[4px] shrink-0" />
                                <span>₹1400-1499</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-[#fbcfe8] border border-[#f472b6] rounded-[4px] shrink-0" />
                                <span>Above ₹1500</span>
                              </div>
                            </div>

                            {/* Features Row */}
                            <div className="pt-2 grid grid-cols-3 gap-x-2 gap-y-2 text-[#1c1c1c] font-medium" style={{ fontSize: '9.6px' }}>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border border-[#e2e8f0] rounded-[4px] flex items-center justify-center font-bold text-[10px] text-[#1c1c1c] bg-white shrink-0">XL</div>
                                <span>Extra Legroom</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border border-[#e2e8f0] rounded-[4px] bg-white shrink-0 relative overflow-hidden">
                                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#a1a1a1]"></div>
                                </div>
                                <span>Non Reclining</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border border-[#e2e8f0] rounded-[4px] bg-white shrink-0 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-[12px] h-[12px] bg-[#ef4444]" style={{ borderBottomLeftRadius: '100%' }}></div>
                                </div>
                                <span>Exit Row Seats</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── RIGHT PANEL: Scrollable Airplane Cabin Map ── */}
                        <div className="lg:col-span-7 flex flex-col items-center">
                          {/* Scrollable Airplane Container with Cream/Beige Background */}
                          <div className="w-full max-h-[550px] overflow-y-auto overflow-x-hidden bg-[#f5f4f0] rounded-xl border border-slate-200 shadow-inner py-6 px-4">
                            
                            {/* Unified Airplane Shape Container */}
                            <div className="w-full max-w-[340px] mx-auto relative flex flex-col items-center select-none">
                              
                              {/* 1. Airplane Nose (Part of Scrollable Body) */}
                              <div className="w-[260px] bg-white border-x-[6px] border-t-[6px] border-b-2 border-slate-300 rounded-t-[130px] pt-8 pb-3 flex flex-col items-center relative z-20">
                                {/* Arched Cockpit Window Panels matching the screenshots */}
                                <svg viewBox="0 0 100 50" className="w-32 h-14 mb-2">
                                  <path d="M 22,40 A 30,30 0 0,1 33,21" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" fill="none" />
                                  <path d="M 38,18 A 30,30 0 0,1 48,15" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" fill="none" />
                                  <path d="M 52,15 A 30,30 0 0,1 62,18" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" fill="none" />
                                  <path d="M 67,21 A 30,30 0 0,1 78,40" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" fill="none" />
                                </svg>
                                {/* Front direction label */}
                                <span className="font-extrabold text-slate-800 tracking-widest uppercase" style={{ fontSize: '11px' }}>FRONT</span>
                              </div>

                              {/* 2. Top Exits Row */}
                              <div className="w-[260px] bg-white border-x-[6px] border-slate-300 py-2 flex justify-between items-center relative z-20" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                                {/* Left green EXIT box */}
                                <div className="bg-[#008000] text-white font-black text-[11.5px] py-0.5 rounded-[2px] select-none" style={{ paddingLeft: '5px', paddingRight: '5px' }}>EXIT</div>
                                {/* Right green EXIT box */}
                                <div className="bg-[#008000] text-white font-black text-[11.5px] py-0.5 rounded-[2px] select-none" style={{ paddingLeft: '5px', paddingRight: '5px' }}>EXIT</div>
                              </div>

                              {/* 3. Column Headers Row */}
                              <div className="w-[260px] bg-white border-x-[6px] border-slate-300 grid grid-cols-[24px_30px_30px_30px_16px_30px_30px_30px_24px] items-center justify-items-center relative z-20 py-1">
                                {/* Spacer */}
                                <div />
                                {/* Column Labels */}
                                <div className="text-[13px] font-black text-slate-400">A</div>
                                <div className="text-[13px] font-black text-slate-400">B</div>
                                <div className="text-[13px] font-black text-slate-400">C</div>
                                {/* Aisle Spacer */}
                                <div />
                                <div className="text-[13px] font-black text-slate-400">D</div>
                                <div className="text-[13px] font-black text-slate-400">E</div>
                                <div className="text-[13px] font-black text-slate-400">F</div>
                                {/* Spacer */}
                                <div />
                              </div>

                              {/* 4. Cabin Fuselage Body containing the rows */}
                              <div className="w-[260px] bg-white border-x-[6px] border-slate-300 pt-[5px] pb-3 relative z-10 flex flex-col items-center">
                                <div className="space-y-[5px] w-full">
                                  {(() => {
                                    // Precise 30-Row Seat Map Database matching user images
                                    const SEAT_ROWS_DATA: Array<{
                                      row: number;
                                      isExit?: boolean;
                                      isXL?: boolean;
                                      seats: Record<string, { price?: number; isOccupied?: boolean }>;
                                    }> = [
                                      { row: 1, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 2, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 3, seats: { A: { price: 800 }, B: { price: 800 }, C: { price: 800 }, D: { price: 800 }, E: { price: 800 }, F: { price: 800 } } },
                                      { row: 4, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 800 }, E: { price: 800 }, F: { price: 800 } } },
                                      { row: 5, seats: { A: { price: 800 }, B: { price: 800 }, C: { price: 800 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 6, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 450 }, E: { price: 450 }, F: { price: 450 } } },
                                      { row: 7, seats: { A: { isOccupied: true }, B: { price: 450 }, C: { price: 450 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 8, seats: { A: { price: 450 }, B: { price: 450 }, C: { price: 450 }, D: { price: 450 }, E: { price: 450 }, F: { isOccupied: true } } },
                                      { row: 9, seats: { A: { price: 450 }, B: { price: 450 }, C: { price: 450 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 10, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 450 }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 11, seats: { A: { isOccupied: true }, B: { price: 350 }, C: { price: 350 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 12, isExit: true, isXL: true, seats: { A: { price: 1200 }, B: { price: 1200 }, C: { price: 1200 }, D: { price: 1200 }, E: { price: 1200 }, F: { price: 1200 } } },
                                      { row: 13, isExit: true, isXL: true, seats: { A: { price: 1200 }, B: { price: 1200 }, C: { price: 1200 }, D: { price: 1200 }, E: { price: 1200 }, F: { price: 1200 } } },
                                      { row: 14, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 15, seats: { A: { price: 450 }, B: { price: 350 }, C: { price: 350 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 16, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 17, seats: { A: { price: 450 }, B: { price: 350 }, C: { price: 350 }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 18, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 19, seats: { A: { price: 450 }, B: { price: 350 }, C: { price: 350 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 20, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 21, seats: { A: { isOccupied: true }, B: { price: 350 }, C: { price: 350 }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 22, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 23, seats: { A: { price: 450 }, B: { price: 350 }, C: { price: 350 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 24, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { price: 350 }, F: { price: 450 } } },
                                      { row: 25, seats: { A: { price: 450 }, B: { price: 0 }, C: { price: 350 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 26, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { price: 0 }, F: { price: 0 } } },
                                      { row: 27, seats: { A: { price: 450 }, B: { price: 0 }, C: { price: 350 }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 28, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { price: 350 }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 29, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { price: 350 }, D: { price: 350 }, E: { isOccupied: true }, F: { isOccupied: true } } },
                                      { row: 30, seats: { A: { isOccupied: true }, B: { isOccupied: true }, C: { isOccupied: true }, D: { isOccupied: true }, E: { isOccupied: true }, F: { isOccupied: true } } }
                                    ];

                                    const getSeatColorClass = (price: number, isSelected: boolean, isOccupied: boolean) => {
                                      if (isOccupied) return 'bg-[#d1d5db] border-slate-400 text-slate-500 cursor-red-ban';
                                      if (isSelected) return 'bg-[#ff8126] border-[#ea580c] text-white shadow-sm';

                                      if (price === 0) return 'bg-[#94ecc0] border-[#22c55e] hover:bg-[#86efac]';
                                      if (price <= 350) return 'bg-[#3a9cf6] border-[#2563eb] hover:bg-[#1d9bf0]';
                                      if (price <= 450) return 'bg-[#df3cc3] border-[#a855f7] hover:bg-[#d926b5]';
                                      if (price <= 800) return 'bg-[#f3be6a] border-[#d97706] hover:bg-[#f5c67a]';
                                      if (price <= 1200) return 'bg-[#f3be6a] border-[#d97706] hover:bg-[#f5c67a]';
                                      return 'bg-[#df3cc3] border-[#a855f7] hover:bg-[#d926b5]';
                                    };

                                    return SEAT_ROWS_DATA.map((rowObj) => {
                                      const rowNum = rowObj.row;

                                      return (
                                        <React.Fragment key={rowNum}>
                                          {/* EXIT lines above Row 12 and 13 */}
                                          {(rowNum === 12 || rowNum === 13) && (
                                            <div className="flex justify-between items-center px-4 py-1 select-none w-full border-y border-dashed border-slate-200/60 my-1 bg-[#fcfcfc]">
                                              <div className="flex items-center gap-1">
                                                <span className="text-[#a1a1a1] text-[9px] font-bold">&lt;&lt;</span>
                                                <span className="text-[9px] tracking-widest font-black text-slate-400 uppercase">EXIT</span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                <span className="text-[9px] tracking-widest font-black text-slate-400 uppercase">EXIT</span>
                                                <span className="text-[#a1a1a1] text-[9px] font-bold">&gt;&gt;</span>
                                              </div>
                                            </div>
                                          )}

                                          {/* Individual Row Grid Container */}
                                          <div className="grid grid-cols-[24px_30px_30px_30px_16px_30px_30px_30px_24px] items-center justify-items-center w-full relative" style={{ marginTop: '5px' }}>
                                            
                                            {/* Physical Slanted Wings flanking Row 12 & 13 */}
                                            {rowNum === 12 && (
                                              <>
                                                {/* Left Wing (sticks out to the left) */}
                                                <div 
                                                  className="absolute left-[-26px] top-[-36px] w-6 h-[128px] bg-[#d8d8d8] border border-slate-400 rounded-l-md flex items-center justify-center pointer-events-none z-30" 
                                                  style={{ 
                                                    clipPath: 'polygon(100% 0, 0 35%, 0 65%, 100% 100%)',
                                                  }}
                                                >
                                                  <span className="text-[6.5px] text-slate-600 font-extrabold uppercase tracking-tighter select-none leading-none" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                                                    seat over wing
                                                  </span>
                                                </div>
                                                {/* Right Wing (sticks out to the right) */}
                                                <div 
                                                  className="absolute right-[-26px] top-[-36px] w-6 h-[128px] bg-[#d8d8d8] border border-slate-400 rounded-r-md flex items-center justify-center pointer-events-none z-30" 
                                                  style={{ 
                                                    clipPath: 'polygon(0 0, 100% 35%, 100% 65%, 0 100%)',
                                                  }}
                                                >
                                                  <span className="text-[6.5px] text-slate-600 font-extrabold uppercase tracking-tighter select-none leading-none" style={{ writingMode: 'vertical-lr' }}>
                                                    seat over wing
                                                  </span>
                                                </div>
                                              </>
                                            )}

                                            {/* 1. Left Row Label */}
                                            <div className="text-[11px] font-extrabold text-slate-400 select-none">{rowNum}</div>

                                            {/* 2. Seat A, B, C */}
                                            {['A', 'B', 'C'].map((col) => {
                                              const seatId = `${rowNum}${col}`;
                                              const seatData = rowObj.seats[col] || { price: 250 };
                                              const price = seatData.price !== undefined ? seatData.price : 250;
                                              const isXL = rowObj.isXL || false;
                                              const isOccupied = seatData.isOccupied || false;
                                              const isSelected = selectedSeats[activeSegmentIndex]?.seat === seatId;
                                              const colorClass = getSeatColorClass(price, isSelected, isOccupied);

                                              return (
                                                <button
                                                  key={col}
                                                  type="button"
                                                  onClick={() => {
                                                    if (isOccupied) return;
                                                    setSelectedSeats(prev => {
                                                      const updated = { ...prev };
                                                      if (isSelected) {
                                                        delete updated[activeSegmentIndex];
                                                      } else {
                                                        updated[activeSegmentIndex] = { seat: seatId, price };
                                                      }
                                                      return updated;
                                                    });
                                                  }}
                                                  className={`w-[25px] h-[25px] border text-[9px] font-extrabold transition-all relative overflow-hidden p-0 flex items-center justify-center shadow-sm group ${isOccupied ? '' : 'cursor-pointer'} ${colorClass}`}
                                                  style={{ borderRadius: '2px' }}
                                                  title={`${seatId} - ₹${price}`}
                                                >
                                                  {isXL && !isOccupied && !isSelected && (
                                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ef4444]" style={{ borderBottomLeftRadius: '100%' }} />
                                                  )}
                                                  {isSelected ? (
                                                    <i className="fa-solid fa-check text-white text-[11px] font-black" />
                                                  ) : isOccupied ? (
                                                    <span className="text-[11px] font-bold text-slate-400">X</span>
                                                  ) : isXL ? (
                                                    <span className="text-[9px] font-black text-slate-700">XL</span>
                                                  ) : (
                                                    <span className="opacity-0">.</span>
                                                  )}
                                                </button>
                                              );
                                            })}

                                            {/* 3. Aisle Space */}
                                            <div className="w-full h-full" />

                                            {/* 4. Seat D, E, F */}
                                            {['D', 'E', 'F'].map((col) => {
                                              const seatId = `${rowNum}${col}`;
                                              const seatData = rowObj.seats[col] || { price: 250 };
                                              const price = seatData.price !== undefined ? seatData.price : 250;
                                              const isXL = rowObj.isXL || false;
                                              const isOccupied = seatData.isOccupied || false;
                                              const isSelected = selectedSeats[activeSegmentIndex]?.seat === seatId;
                                              const colorClass = getSeatColorClass(price, isSelected, isOccupied);

                                              return (
                                                <button
                                                  key={col}
                                                  type="button"
                                                  onClick={() => {
                                                    if (isOccupied) return;
                                                    setSelectedSeats(prev => {
                                                      const updated = { ...prev };
                                                      if (isSelected) {
                                                        delete updated[activeSegmentIndex];
                                                      } else {
                                                        updated[activeSegmentIndex] = { seat: seatId, price };
                                                      }
                                                      return updated;
                                                    });
                                                  }}
                                                  className={`w-[25px] h-[25px] border text-[9px] font-extrabold transition-all relative overflow-hidden p-0 flex items-center justify-center shadow-sm group ${isOccupied ? '' : 'cursor-pointer'} ${colorClass}`}
                                                  style={{ borderRadius: '2px' }}
                                                  title={`${seatId} - ₹${price}`}
                                                >
                                                  {isXL && !isOccupied && !isSelected && (
                                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ef4444]" style={{ borderBottomLeftRadius: '100%' }} />
                                                  )}
                                                  {isSelected ? (
                                                    <i className="fa-solid fa-check text-white text-[11px] font-black" />
                                                  ) : isOccupied ? (
                                                    <span className="text-[11px] font-bold text-slate-400">X</span>
                                                  ) : isXL ? (
                                                    <span className="text-[9px] font-black text-slate-700">XL</span>
                                                  ) : (
                                                    <span className="opacity-0">.</span>
                                                  )}
                                                </button>
                                              );
                                            })}

                                            {/* 5. Right Row Label */}
                                            <div className="text-[11px] font-extrabold text-slate-400 select-none">{rowNum}</div>
                                          </div>

                                          {/* Bottom Exit signs just below Row 30 */}
                                          {rowNum === 30 && (
                                            <div className="grid grid-cols-[24px_30px_30px_30px_16px_30px_30px_30px_24px] items-center justify-items-center w-full mt-2 relative z-20">
                                              <div className="bg-[#008000] text-white font-black text-[11.5px] py-0.5 rounded-[2px] select-none justify-self-start" style={{ paddingLeft: '5px', paddingRight: '5px', marginLeft: '5px' }}>EXIT</div>
                                              <div className="col-span-7" />
                                              <div className="bg-[#008000] text-white font-black text-[11.5px] py-0.5 rounded-[2px] select-none justify-self-end" style={{ paddingLeft: '5px', paddingRight: '5px', marginRight: '5px' }}>EXIT</div>
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>

                              {/* 4. Airplane Tail (Part of Scrollable Body) */}
                              <div className="w-[260px] bg-white border-x-2 border-b-2 border-slate-300 rounded-b-[60px] py-4 flex items-center justify-center relative z-20">
                                <div className="w-1/3 h-1 bg-slate-300 rounded-full" />
                              </div>

                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Tab Content 2: MEALS */}
                  {activeAddonTab === 'meals' && (
                    <div className="space-y-4">
                      {/* Top Filters Row */}
                      {(() => {
                        const outboundFlightSegments = getFlightSegments().filter((s: any) => s.type === 'flight');
                        const returnFlightSegments = getReturnFlightSegments().filter((s: any) => s.type === 'flight');
                        const allFlightSegments = [...outboundFlightSegments, ...returnFlightSegments];
                        const activeSeg = allFlightSegments[activeSegmentIndex] || allFlightSegments[0] || { depCode: 'DEL', arrCode: 'BOM' };
                        const segmentLabel = `${activeSeg.depCode}-${activeSeg.arrCode}`;

                        return (
                          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 select-none">
                            {/* Segment selector */}
                            <div className="text-white font-extrabold text-[10.5px] uppercase tracking-wider bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" style={{ borderRadius: '20px', padding: '6px 14px' }}>
                              {segmentLabel}
                            </div>
                            
                            {/* Filter Toggles */}
                            <div className="flex items-center gap-4 text-[11px] font-bold text-[#1c1c1c]">
                              <div className="flex items-center gap-2">
                                <span>Non Veg</span>
                                <button
                                  type="button"
                                  onClick={() => setFilterNonVeg(!filterNonVeg)}
                                  className={`w-9 h-5 relative transition-colors border-0 cursor-pointer ${
                                    filterNonVeg ? 'bg-[#ff8126]' : 'bg-slate-200'
                                  }`}
                                  style={{ borderRadius: '10px' }}
                                >
                                  <div
                                    className={`w-4 h-4 bg-white absolute top-0.5 transition-all ${
                                      filterNonVeg ? 'left-[18px]' : 'left-[2px]'
                                    }`}
                                    style={{ borderRadius: '50%' }}
                                  />
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span>Veg</span>
                                <button
                                  type="button"
                                  onClick={() => setFilterVeg(!filterVeg)}
                                  className={`w-9 h-5 relative transition-colors border-0 cursor-pointer ${
                                    filterVeg ? 'bg-[#ff8126]' : 'bg-slate-200'
                                  }`}
                                  style={{ borderRadius: '10px' }}
                                >
                                  <div
                                    className={`w-4 h-4 bg-white absolute top-0.5 transition-all ${
                                      filterVeg ? 'left-[18px]' : 'left-[2px]'
                                    }`}
                                    style={{ borderRadius: '50%' }}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Meals list grid scrollable */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[350px] overflow-y-auto pr-1">
                        {[
                          {
                            name: 'Vegan meal',
                            type: 'veg',
                            price: 400,
                            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: '6E Eats choice of the day and beverage (Veg)',
                            type: 'veg',
                            price: 400,
                            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: 'Veg Biryani',
                            type: 'veg',
                            price: 400,
                            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: 'Paneer Tikka Sandwich',
                            type: 'veg',
                            price: 400,
                            image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: 'Jain meal',
                            type: 'veg',
                            price: 400,
                            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: 'Diabetic Veg',
                            type: 'veg',
                            price: 400,
                            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: 'India By IndiGo regional favourite and beverage',
                            type: 'veg',
                            price: 400,
                            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: '6E Eats choice of the day and beverage (Non Veg)',
                            type: 'nonveg',
                            price: 500,
                            image: 'https://images.unsplash.com/photo-1601894128485-76a48a60be0b?w=150&auto=format&fit=crop&q=60'
                          },
                          {
                            name: 'Chicken Junglee',
                            type: 'nonveg',
                            price: 450,
                            image: 'https://images.unsplash.com/photo-1601894128485-76a48a60be0b?w=150&auto=format&fit=crop&q=60'
                          }
                        ]
                          .filter((meal) => {
                            if (meal.type === 'veg') return filterVeg;
                            if (meal.type === 'nonveg') return filterNonVeg;
                            return true;
                          })
                          .map((meal) => {
                            const quantity = selectedMeals[meal.name]?.quantity || 0;
                            const cleanDisplayName = meal.name.replace(' (Veg)', '').replace(' (Non Veg)', '');
                            return (
                              <div
                                key={meal.name}
                                className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0"
                              >
                                <div className="flex gap-3 items-center">
                                  {/* Meal image */}
                                  <img
                                    src={meal.image}
                                    alt={cleanDisplayName}
                                    className="w-[84px] h-[56px] rounded-[4px] object-cover shrink-0 bg-slate-100 border border-slate-200/50"
                                  />
                                  
                                  {/* Title and Price */}
                                  <div>
                                    <h5 className="text-slate-800 leading-tight mb-1 max-w-[160px] sm:max-w-[200px]" style={{ fontSize: '10.5px', fontWeight: 'bold' }}>
                                      {cleanDisplayName}
                                    </h5>
                                    
                                    <div className="flex items-center gap-1.5">
                                      {/* Veg / Non veg square dot */}
                                      {meal.type === 'veg' ? (
                                        <div className="w-[11px] h-[11px] border border-green-600 flex items-center justify-center rounded-[2px] bg-white shrink-0">
                                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                                        </div>
                                      ) : (
                                        <div className="w-[11px] h-[11px] border border-[#a23c3c] flex items-center justify-center rounded-[2px] bg-white shrink-0">
                                          <div className="w-1.5 h-1.5 bg-[#a23c3c] rounded-full" />
                                        </div>
                                      )}
                                      <span className="font-normal text-slate-900 text-[12.5px]">
                                        ₹ {meal.price}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center border border-slate-300 rounded-[4px] h-[26px] bg-white shrink-0" style={{ fontSize: '11px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (quantity > 0) {
                                        setSelectedMeals((prev) => ({
                                          ...prev,
                                          [meal.name]: { quantity: quantity - 1, price: meal.price }
                                        }));
                                      }
                                    }}
                                    className="w-6 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 border-r border-slate-200 bg-transparent cursor-pointer font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center font-bold text-slate-800">
                                    {quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedMeals((prev) => ({
                                        ...prev,
                                        [meal.name]: { quantity: quantity + 1, price: meal.price }
                                      }));
                                    }}
                                    className="w-6 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 border-l border-slate-200 bg-transparent cursor-pointer font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Tab Content 3: BAGGAGE */}
                  {activeAddonTab === 'baggage' && (
                    <div className="space-y-4">
                      {/* Top Filters Row */}
                      {(() => {
                        const outboundFlightSegments = getFlightSegments().filter((s: any) => s.type === 'flight');
                        const returnFlightSegments = getReturnFlightSegments().filter((s: any) => s.type === 'flight');
                        const allFlightSegments = [...outboundFlightSegments, ...returnFlightSegments];
                        const activeSeg = allFlightSegments[activeSegmentIndex] || allFlightSegments[0] || { depCode: 'DEL', arrCode: 'BOM' };
                        const segmentLabel = `${activeSeg.depCode}-${activeSeg.arrCode}`;

                        return (
                          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 select-none">
                            {/* Segment selector */}
                            <div className="text-white font-extrabold text-[10.5px] px-3.5 py-1 uppercase tracking-wider bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" style={{ borderRadius: '20px', padding: '6px 14px' }}>
                              {segmentLabel}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Baggage list grid scrollable */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-h-[350px] overflow-y-auto pr-1">
                        {(() => {
                          const renderLuggageIcon = (type: string) => {
                            switch (type) {
                              case 'red-duffel':
                                return (
                                  <svg viewBox="0 0 48 32" className="w-[45px] h-[32px] shrink-0" style={{ color: '#e57373' }}>
                                    <rect x="8" y="10" width="32" height="20" rx="4" fill="currentColor" />
                                    <path d="M16 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" stroke="#c62828" strokeWidth="2" fill="none" />
                                    <rect x="14" y="10" width="3" height="20" fill="#c62828" />
                                    <rect x="31" y="10" width="3" height="20" fill="#c62828" />
                                  </svg>
                                );
                              case 'green-backpack':
                                return (
                                  <svg viewBox="0 0 32 36" className="w-[36px] h-[40px] shrink-0" style={{ color: '#4db6ac' }}>
                                    <path d="M6 10v20a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V10a8 8 0 0 0-16 0z" fill="currentColor" />
                                    <rect x="10" y="22" width="12" height="12" rx="2" fill="#ffd700" />
                                    <rect x="8" y="12" width="16" height="4" fill="#006666" />
                                  </svg>
                                );
                              case 'blue-duffel':
                                return (
                                  <svg viewBox="0 0 48 32" className="w-[45px] h-[32px] shrink-0" style={{ color: '#4fc3f7' }}>
                                    <rect x="8" y="10" width="32" height="20" rx="4" fill="currentColor" />
                                    <path d="M16 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" stroke="#0288d1" strokeWidth="2" fill="none" />
                                    <rect x="14" y="10" width="3" height="20" fill="#0288d1" />
                                    <rect x="31" y="10" width="3" height="20" fill="#0288d1" />
                                  </svg>
                                );
                              case 'brown-suitcase':
                                return (
                                  <svg viewBox="0 0 32 40" className="w-[36px] h-[42px] shrink-0" style={{ color: '#8d6e63' }}>
                                    <rect x="6" y="12" width="20" height="24" rx="3" fill="currentColor" />
                                    <path d="M12 12V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" stroke="#4e342e" strokeWidth="2" fill="none" />
                                    <rect x="10" y="36" width="3" height="4" rx="1" fill="#4e342e" />
                                    <rect x="19" y="36" width="3" height="4" rx="1" fill="#4e342e" />
                                  </svg>
                                );
                              case 'yellow-suitcase':
                                return (
                                  <svg viewBox="0 0 32 40" className="w-[36px] h-[42px] shrink-0" style={{ color: '#ffd54f' }}>
                                    <rect x="6" y="12" width="20" height="24" rx="3" fill="currentColor" />
                                    <path d="M12 12V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" stroke="#ffb300" strokeWidth="2" fill="none" />
                                    <rect x="10" y="36" width="3" height="4" rx="1" fill="#ffb300" />
                                    <rect x="19" y="36" width="3" height="4" rx="1" fill="#ffb300" />
                                  </svg>
                                );
                              case 'yellow-suitcase-backpack':
                                return (
                                  <div className="relative w-[45px] h-[42px] shrink-0">
                                    <svg viewBox="0 0 32 40" className="w-[32px] h-[38px] absolute bottom-0 left-0" style={{ color: '#ffd54f' }}>
                                      <rect x="6" y="12" width="20" height="24" rx="3" fill="currentColor" />
                                      <path d="M12 12V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" stroke="#ffb300" strokeWidth="2" fill="none" />
                                    </svg>
                                    <svg viewBox="0 0 32 36" className="w-[18px] h-[20px] absolute bottom-0 right-0" style={{ color: '#4db6ac' }}>
                                      <path d="M6 10v20a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V10a8 8 0 0 0-16 0z" fill="currentColor" />
                                    </svg>
                                  </div>
                                );
                              case 'yellow-suitcase-duffel':
                                return (
                                  <div className="relative w-[45px] h-[42px] shrink-0">
                                    <svg viewBox="0 0 32 40" className="w-[32px] h-[38px] absolute bottom-0 left-0" style={{ color: '#ffd54f' }}>
                                      <rect x="6" y="12" width="20" height="24" rx="3" fill="currentColor" />
                                      <path d="M12 12V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" stroke="#ffb300" strokeWidth="2" fill="none" />
                                    </svg>
                                    <svg viewBox="0 0 48 32" className="w-[22px] h-[15px] absolute bottom-0 right-0" style={{ color: '#4fc3f7' }}>
                                      <rect x="8" y="10" width="32" height="20" rx="4" fill="currentColor" />
                                    </svg>
                                  </div>
                                );
                              case 'double-yellow-suitcase':
                                return (
                                  <div className="relative w-[45px] h-[42px] shrink-0">
                                    <svg viewBox="0 0 32 40" className="w-[30px] h-[36px] absolute bottom-0 left-0" style={{ color: '#ffd54f' }}>
                                      <rect x="6" y="12" width="20" height="24" rx="3" fill="currentColor" />
                                      <path d="M12 12V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" stroke="#ffb300" strokeWidth="2" fill="none" />
                                    </svg>
                                    <svg viewBox="0 0 32 40" className="w-[24px] h-[30px] absolute bottom-0 right-0" style={{ color: '#ffe082' }}>
                                      <rect x="6" y="12" width="20" height="24" rx="3" fill="currentColor" />
                                      <path d="M12 12V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v8" stroke="#ffb300" strokeWidth="2" fill="none" />
                                    </svg>
                                  </div>
                                );
                              default:
                                return null;
                            }
                          };

                          return [
                            { weight: '3 Kg', label: 'Additional 3 kg Extra Baggage', price: 1900, iconType: 'red-duffel' },
                            { weight: '5 Kg', label: 'Additional 5 kg Extra Baggage', price: 2850, iconType: 'green-backpack' },
                            { weight: '10 Kg', label: 'Additional 10 kg Extra Baggage', price: 4600, iconType: 'blue-duffel' },
                            { weight: '15 Kg', label: 'Additional 15 kg Extra Baggage', price: 6850, iconType: 'brown-suitcase' },
                            { weight: '20 Kg', label: 'Additional 20 kg Extra Baggage', price: 12100, iconType: 'yellow-suitcase' },
                            { weight: '25 Kg', label: 'Additional 25 kg Extra Baggage', price: 15100, iconType: 'yellow-suitcase-backpack' },
                            { weight: '30 Kg', label: 'Additional 30 kg Extra Baggage', price: 18100, iconType: 'yellow-suitcase-duffel' },
                            { weight: '40 Kg', label: 'Additional 40 kg Extra Baggage', price: 22100, iconType: 'double-yellow-suitcase' }
                          ].map((pack) => {
                            const quantity = selectedBaggage?.label === pack.label ? 1 : 0;
                            return (
                              <div
                                key={pack.label}
                                className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0"
                              >
                                <div className="flex gap-3 items-center">
                                  {/* Baggage Icon */}
                                  <div className="w-[50px] flex items-center justify-center shrink-0">
                                    {renderLuggageIcon(pack.iconType)}
                                  </div>
                                  
                                  {/* Title and Price */}
                                  <div>
                                    <h5 className="text-slate-800 leading-tight mb-1" style={{ fontSize: '10.5px', fontWeight: 'bold' }}>
                                      {pack.weight}
                                    </h5>
                                    <span className="font-normal text-slate-900 text-[12.5px]">
                                      ₹ {pack.price}
                                    </span>
                                  </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center border border-slate-300 rounded-[4px] h-[26px] bg-white shrink-0" style={{ fontSize: '11px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (quantity > 0) {
                                        setSelectedBaggage(null);
                                      }
                                    }}
                                    className="w-6 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 border-r border-slate-200 bg-transparent cursor-pointer font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="w-8 text-center font-bold text-slate-800">
                                    {quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedBaggage({ label: pack.label, price: pack.price });
                                    }}
                                    className="w-6 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 border-l border-slate-200 bg-transparent cursor-pointer font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Tab Content 4: POPULAR ADD ONS */}
                  {activeAddonTab === 'popular' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                        
                        {/* Card 1: Travel Insurance */}
                        {(() => {
                          const isSelected = insuranceOption === 'acko';
                          return (
                            <div className="bg-[#f5f9fd] border border-[#e1edf8] rounded-[12px] flex justify-between gap-4 items-start shadow-sm" style={{ padding: '8px 16px', minHeight: '140px' }}>
                              {/* Left Content column */}
                              <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                                <div>
                                  {/* Title row */}
                                  <h5 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5 leading-none">
                                    <span>Travel Insurance</span>
                                  </h5>

                                  {/* Description */}
                                  <p className="text-[11.5px] text-slate-600 leading-normal mt-2.5">
                                    Secure your trip with Travel Insurance at just ₹ 249
                                  </p>
                                </div>
                                
                                {/* Add / Remove Button */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setInsuranceOption(isSelected ? 'none' : 'acko')}
                                    className={`font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#ff8126] hover:bg-[#fd661e] text-white border-0'
                                        : 'border border-[#ff8126] text-[#ff8126] bg-transparent hover:bg-orange-50/40'
                                    }`}
                                    style={{ borderRadius: '20px', padding: '5px 12px' }}
                                  >
                                    {isSelected ? 'Added' : 'Add'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Right Illustration */}
                              <svg viewBox="0 0 100 100" className="w-[84px] h-[84px] shrink-0">
                                <circle cx="50" cy="50" r="40" fill="#e8f0fe" />
                                {/* Two travelers silhouette */}
                                <circle cx="42" cy="35" r="7" fill="#1c1c3a" />
                                <path d="M42 42v18M42 47L35 55M42 47L49 55" stroke="#1c1c3a" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="58" cy="38" r="6" fill="#4a5568" />
                                <path d="M58 44v14M58 49L52 56M58 49L64 56" stroke="#4a5568" strokeWidth="3" strokeLinecap="round" />
                                {/* Shield with plus */}
                                <path d="M50 50 L62 55 V68 C62 76 50 82 50 84 C50 82 38 76 38 68 V55 Z" fill="#ff8126" />
                                <circle cx="50" cy="65" r="6" fill="white" />
                                <path d="M50 62v6M47 65h6" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                            </div>
                          );
                        })()}

                        {/* Card 2: Fast Forward (Priority Boarding) */}
                        {(() => {
                          const isSelected = addonPriority;
                          const outboundFlightSegments = getFlightSegments().filter((s: any) => s.type === 'flight');
                          const returnFlightSegments = getReturnFlightSegments().filter((s: any) => s.type === 'flight');
                          const allFlightSegments = [...outboundFlightSegments, ...returnFlightSegments];
                          const activeSeg = allFlightSegments[activeSegmentIndex] || allFlightSegments[0] || { depCode: 'DEL', arrCode: 'BOM' };
                          const segmentLabel = `${activeSeg.depCode} – ${activeSeg.arrCode}`;
                          
                          return (
                            <div className="bg-[#f5f9fd] border border-[#e1edf8] rounded-[12px] flex justify-between gap-4 items-start shadow-sm" style={{ padding: '8px 16px', minHeight: '140px' }}>
                              {/* Left Content column */}
                              <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                                <div>
                                  {/* Segment Indicator inside Card */}
                                  <div className="text-[#ff8126] font-bold text-[11px] uppercase tracking-wider mb-1 leading-none">
                                    {segmentLabel}
                                  </div>
                                  
                                  {/* Title row */}
                                  <h5 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5 leading-none">
                                    <i className="fa-solid fa-angles-right text-[#ff8126] text-xs" />
                                    <span>Fast Forward</span>
                                  </h5>
                                  
                                  {/* Description */}
                                  <p className="text-[11.5px] text-slate-600 leading-normal mt-2.5">
                                    Fast forward – Priority Checkin and Boarding ₹498 / Guest
                                  </p>
                                </div>
                                
                                {/* Add / Remove Button */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setAddonPriority(!isSelected)}
                                    className={`font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#ff8126] hover:bg-[#fd661e] text-white border-0'
                                        : 'border border-[#ff8126] text-[#ff8126] bg-transparent hover:bg-orange-50/40'
                                    }`}
                                    style={{ borderRadius: '20px', padding: '5px 12px' }}
                                  >
                                    {isSelected ? 'Added' : 'Add'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Right Illustration */}
                              <svg viewBox="0 0 100 100" className="w-[84px] h-[84px] shrink-0">
                                <circle cx="50" cy="50" r="40" fill="#eef2f6" />
                                {/* Airplane silhouette in background */}
                                <path d="M35 48 L65 48 M50 33 L50 63 M45 40 L55 56" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                                {/* Traveler with suitcase */}
                                <circle cx="48" cy="38" r="6" fill="#1e293b" />
                                <path d="M48 44v16M48 48l-6 8M48 48l6 8" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                                <rect x="58" y="46" width="10" height="15" rx="1.5" fill="#ff8126" />
                                <path d="M63 46V41" stroke="#475569" strokeWidth="1.8" fill="none" />
                              </svg>
                            </div>
                          );
                        })()}

                        {/* Card 3: Free Medical Refund Policy */}
                        {(() => {
                          const isSelected = protectionOption === 'medical';
                          return (
                            <div className="bg-[#f5f9fd] border border-[#e1edf8] rounded-[12px] flex justify-between gap-4 items-start shadow-sm" style={{ padding: '8px 16px', minHeight: '140px' }}>
                              {/* Left Content column */}
                              <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                                <div>
                                  {/* Title row */}
                                  <h5 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5 leading-none">
                                    <i className="fa-solid fa-shield-halved text-[#ff8126]" />
                                    <span>Free Medical Refund Policy</span>
                                  </h5>
                                  
                                  {/* Description */}
                                  <p className="text-[11.5px] text-slate-600 leading-normal mt-2.5">
                                    Get full airline refund, if you cancel tickets due to <span className="font-bold text-slate-800">illness or sickness</span>. <span className="text-[#ff8126] cursor-pointer hover:underline">T&Cs</span>
                                  </p>
                                </div>
                                
                                {/* Add / Remove Button */}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setProtectionOption(isSelected ? 'none' : 'medical')}
                                    className={`font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#ff8126] hover:bg-[#fd661e] text-white border-0'
                                        : 'border border-[#ff8126] text-[#ff8126] bg-transparent hover:bg-orange-50/40'
                                    }`}
                                    style={{ borderRadius: '20px', padding: '5px 12px' }}
                                  >
                                    {isSelected ? 'Added' : 'Add'}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Right Illustration */}
                              <svg viewBox="0 0 100 100" className="w-[84px] h-[84px] shrink-0">
                                <circle cx="50" cy="50" r="40" fill="#ecfdf5" />
                                {/* Phone outline */}
                                <rect x="42" y="25" width="20" height="38" rx="3" fill="none" stroke="#64748b" strokeWidth="2.5" />
                                {/* Medical Shield */}
                                <path d="M52 33 L60 37 V44 C60 48 56 52 52 54 C48 52 44 48 44 44 V37 Z" fill="#ef4444" />
                                <path d="M52 38v6M49 41h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                {/* Person walking */}
                                <circle cx="34" cy="48" r="5" fill="#1e293b" />
                                <path d="M34 53v12M34 56l-4 6M34 56l4 6" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                          );
                        })()}

                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation actions at the bottom of Step 2 */}
                <div className="flex items-center justify-center pt-2" style={{ marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => handleBookingSubmit()}
                    disabled={isSubmitting}
                    className="bg-[#ff8126] hover:bg-[#fd661e] text-white font-extrabold uppercase tracking-wider border-0 cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    style={{ borderRadius: '8px', padding: '11.5px 30.5px', fontSize: '12.5px', minWidth: '192px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <span>Proceed to Payment</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Step (Step 3) */
              <div className="space-y-4 font-sans">

                {/* 2. TRAVELLER DETAILS SUMMARY */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ marginTop: '20px' }}>
                  <div className="bg-[#fff4ec] px-4 border-b border-orange-100/50" style={{ paddingTop: '10px', paddingBottom: '6px' }}>
                    <h3 className="font-bold text-slate-800" style={{ fontSize: '12.5px' }}>
                      Traveller Details
                    </h3>
                  </div>
                  
                  <div className="p-4 bg-slate-50/20">
                    <div className="bg-white rounded-md border border-slate-200/80 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <span className="block text-slate-500 font-medium text-[13px] mb-1">E-mail</span>
                          <span className="block text-slate-700 font-semibold text-[13.5px] mt-0.5 break-all">
                            {contactEmail || '—'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="block text-slate-500 font-medium text-[13px] mb-1">Contact No.</span>
                          <span className="block text-slate-700 font-semibold text-[13.5px] mt-0.5">
                            {contactPhone ? `+91-${contactPhone}` : '—'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="block text-slate-500 font-medium text-[13px] mb-1">Adult (1)</span>
                          <span className="block text-slate-700 font-semibold text-[13.5px] mt-0.5">
                            {travellerTitle} {travellerFirstName} {travellerLastName}
                          </span>
                        </div>

                        <div>
                          <span className="block text-slate-500 font-medium text-[13px] mb-1">Child (0)</span>
                          <span className="block text-slate-700 font-semibold text-[13.5px] mt-0.5">
                            —
                          </span>
                        </div>

                        <div>
                          <span className="block text-slate-500 font-medium text-[13px] mb-1">Infant (0)</span>
                          <span className="block text-slate-700 font-semibold text-[13.5px] mt-0.5">
                            —
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. WALLET LOGIN BANNER */}
                <div 
                  className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 flex items-center justify-between"
                  style={{ paddingTop: '10px', paddingBottom: '10px', marginTop: '15px', marginBottom: '15px' }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-wallet text-[#ff8126] text-[20px]" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-medium leading-tight" style={{ fontSize: '15.5px' }}>
                        You have to login to use your <strong className="font-extrabold text-slate-900" style={{ fontSize: '15.5px' }}>wallet amount</strong>
                      </h4>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => alert("Login feature is a mockup display.")}
                    className="bg-[#ff8126] hover:bg-[#fd661e] text-white font-normal text-[11px] uppercase tracking-wide border-0 cursor-pointer shadow-sm hover:shadow-md transition-all shrink-0"
                    style={{ padding: '6px 16px', borderRadius: '4px' }}
                  >
                    LOG IN
                  </button>
                </div>

                {/* 4. PAYMENT MODE CONTROLLER */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between select-none">
                    <div className="font-bold text-slate-800" style={{ fontSize: '15px' }}>
                      Payment Mode
                    </div>
                    {/* Expiry Clock Countdown */}
                    <div className="flex items-center gap-1.5 bg-red-50 text-red-600 font-medium text-[12.5px] border border-red-200/50 rounded-full py-1 px-3.5">
                      <i className="fa-regular fa-clock text-[13px] text-red-500" />
                      <span>The session will expire in: <span className="font-bold text-red-600">{formatTimeMinutesSeconds(sessionCountdown)}</span></span>
                    </div>
                  </div>

                  {sessionExpired ? (
                    <div className="p-8 text-center bg-white space-y-3 font-sans">
                      <i className="fa-solid fa-hourglass-end text-red-500 text-3xl animate-bounce" />
                      <h4 className="font-extrabold text-slate-900 text-[15px]">Booking Session Expired</h4>
                      <p className="text-slate-500 text-[12px] max-w-xs mx-auto leading-relaxed">
                        Your secure session has expired to release seats back to the airline inventory. Please restart the checkout process.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutStep('details');
                          setSessionCountdown(600);
                          setSessionExpired(false);
                          setQrGenerated(false);
                        }}
                        className="bg-[#ff8126] text-white font-bold text-[11px] py-2 border-0 cursor-pointer shadow animate-pulse"
                        style={{ borderRadius: '4px', paddingLeft: '10px', paddingRight: '10px' }}
                      >
                        Restart Booking
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 min-h-[350px]">
                      
                      {/* Left Sidebar Menu */}
                      <div className="md:col-span-4 bg-slate-50/50 border-r border-slate-200/60 divide-y divide-slate-100">
                        {[
                          { id: 'upi', label: 'UPI', desc: 'Make Online Payments Directly from Bank', icon: 'fa-mobile-screen-button' },
                          { id: 'card', label: 'Credit/Debit/ATM Cards', desc: 'Use VISA, Mastercard, American Express etc.', icon: 'fa-credit-card' },
                          { id: 'wallet', label: 'Wallets', desc: 'Choose Mobikwik, Payzapp, PhonePe or Amazon', icon: 'fa-wallet' },
                          { id: 'netbanking', label: 'Net Banking', desc: 'All Major banks are supported', icon: 'fa-building-columns' },
                          { id: 'rewards', label: 'Pay with Rewards', desc: 'Check Your Rewards', icon: 'fa-award' },
                          { id: 'giftcard', label: 'Gift Card', desc: 'Pay with GiftCard', icon: 'fa-gift' }
                        ].map((method) => {
                          const isActive = paymentMethod === method.id;
                          return (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => setPaymentMethod(method.id)}
                              className={`w-full text-left px-4 flex gap-3 transition-all cursor-pointer relative z-10 ${
                                !isActive ? 'hover:bg-slate-50/50' : ''
                              }`}
                              style={{ 
                                paddingTop: '6px', 
                                paddingBottom: '6px', 
                                backgroundColor: isActive ? '#ffffff' : 'transparent',
                                borderLeft: isActive ? '4px solid #ff8126' : '4px solid transparent',
                                borderBottom: '1px solid #cbd5e1',
                                borderTop: 'none',
                                borderRight: 'none'
                              }}
                            >
                              <div className="mt-0.5 shrink-0">
                                <i className={`fa-solid ${method.icon} text-[15px] ${isActive ? 'text-[#ff8126]' : 'text-slate-400'}`} />
                              </div>
                              <div>
                                <h5 className={`font-bold leading-tight ${isActive ? 'text-[#ff8126]' : 'text-slate-800'}`} style={{ fontSize: '12px' }}>
                                  {method.label}
                                </h5>
                                <p className="text-[12px] text-slate-400 font-normal leading-normal mt-0.5">
                                  {method.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Detail Pane */}
                      <div className="md:col-span-8 p-5 bg-white flex flex-col justify-between">
                        
                        {/* TAB CONTENT: UPI */}
                        {paymentMethod === 'upi' && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-extrabold text-slate-800 tracking-wide select-none" style={{ fontSize: '13px' }}>
                                Pay Via QR Code
                              </h4>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-center">
                              {/* QR Image Generator wrapper */}
                              <div className="flex flex-col items-center">
                                <div className="border border-slate-200/80 rounded-xl p-3 bg-white shadow-sm w-36 h-36 flex items-center justify-center relative overflow-hidden">
                                  {qrGenerated ? (
                                    <>
                                      <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <rect x="0" y="0" width="22" height="22" fill="#072146" />
                                        <rect x="2" y="2" width="18" height="18" fill="white" />
                                        <rect x="5" y="5" width="12" height="12" fill="#ff8126" />
                                        
                                        <rect x="78" y="0" width="22" height="22" fill="#072146" />
                                        <rect x="80" y="2" width="18" height="18" fill="white" />
                                        <rect x="83" y="5" width="12" height="12" fill="#ff8126" />
                                        
                                        <rect x="0" y="78" width="22" height="22" fill="#072146" />
                                        <rect x="2" y="80" width="18" height="18" fill="white" />
                                        <rect x="5" y="83" width="12" height="12" fill="#ff8126" />

                                        <rect x="36" y="36" width="28" height="28" fill="#072146" rx="4" />
                                        <path d="M50 42 L55 52 L45 52 Z" fill="#ff8126" />

                                        <rect x="30" y="10" width="8" height="8" fill="#1e293b" />
                                        <rect x="42" y="4" width="4" height="12" fill="#1e293b" />
                                        <rect x="50" y="12" width="12" height="4" fill="#ff8126" />
                                        <rect x="68" y="18" width="6" height="6" fill="#1e293b" />
                                        <rect x="30" y="74" width="8" height="8" fill="#1e293b" />
                                        <rect x="42" y="82" width="12" height="4" fill="#ff8126" />
                                        <rect x="58" y="74" width="6" height="10" fill="#1e293b" />
                                        <rect x="78" y="30" width="8" height="8" fill="#1e293b" />
                                        <rect x="84" y="42" width="4" height="12" fill="#1e293b" />
                                        <rect x="78" y="60" width="10" height="4" fill="#ff8126" />
                                        <rect x="10" y="30" width="6" height="8" fill="#1e293b" />
                                        <rect x="18" y="42" width="4" height="12" fill="#ff8126" />
                                        <rect x="4" y="60" width="12" height="4" fill="#1e293b" />
                                      </svg>
                                      {qrCountdown === 0 && (
                                        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-2 text-center select-none font-sans z-25">
                                          <i className="fa-solid fa-triangle-exclamation text-red-500 text-base" />
                                          <span className="text-[12px] font-bold text-slate-800 mt-1">Expired</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setQrCountdown(300);
                                            }}
                                            className="text-[12px] font-bold text-[#ff8126] hover:underline border-0 bg-transparent mt-1 cursor-pointer"
                                          >
                                            Regenerate
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-10 filter blur-[3px]">
                                        <rect x="0" y="0" width="25" height="25" fill="black" />
                                        <rect x="75" y="0" width="25" height="25" fill="black" />
                                        <rect x="0" y="75" width="25" height="25" fill="black" />
                                        <rect x="30" y="30" width="40" height="40" fill="black" />
                                      </svg>
                                      <div className="absolute inset-0 bg-[#072146]/5 rounded-lg flex items-center justify-center p-1.5">
                                        <i className="fa-solid fa-qrcode text-[#072146]/60 text-5xl" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="mt-2.5">
                                  {qrGenerated ? (
                                    <div className="text-[12px] text-slate-500 font-medium">
                                      QR Code Valid for: <span className="font-mono text-red-600 font-bold">{formatTimeMinutesSeconds(qrCountdown)}</span>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setQrGenerated(true);
                                        setQrCountdown(300);
                                      }}
                                      className="bg-[#ff8126] hover:bg-[#fd661e] text-white font-extrabold uppercase tracking-wide border-0 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] transition-all"
                                      style={{ borderRadius: '6px', padding: '6.5px 14px', fontSize: '13px' }}
                                    >
                                      Generate QR Code
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* QR Scanning Guide instructions */}
                              <div className="flex-1 space-y-3 font-sans select-none text-slate-700">
                                <h5 className="font-extrabold text-slate-800" style={{ fontSize: '12px' }}>
                                  How to pay through QR works?
                                </h5>
                                <ul className="space-y-1.5 list-none p-0 m-0 font-medium leading-relaxed font-semibold" style={{ fontSize: '12px' }}>
                                  <li className="flex items-start gap-2">
                                    <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[12px] font-black shrink-0">1</span>
                                    <span>Open UPI App in your phone</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9.5px] font-black shrink-0">2</span>
                                    <span>Scan this QR code in your UPI App</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9.5px] font-black shrink-0">3</span>
                                    <span>Proceed to payment &amp; enter UPI PIN</span>
                                  </li>
                                </ul>
                                
                                <div className="pt-1.5 select-none">
                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                    We accepting all UPI apps
                                  </div>
                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    <div className="bg-[#fff] border border-slate-200/80 rounded text-[9px] font-black tracking-tight text-[#00b9f5] flex items-center select-none" style={{ padding: '2px' }}>
                                      Paytm
                                    </div>
                                    <div className="bg-[#fff] border border-slate-200/80 rounded text-[9px] font-black text-[#5f259f] flex items-center select-none" style={{ padding: '2px' }}>
                                      PhonePe
                                    </div>
                                    <div className="bg-[#fff] border border-slate-200/80 rounded text-[9px] font-black text-[#4285f4] flex items-center select-none" style={{ padding: '2px' }}>
                                      Google Pay
                                    </div>
                                    <div className="bg-[#fff] border border-slate-200/80 rounded text-[9px] font-black text-slate-800 flex items-center select-none" style={{ padding: '2px' }}>
                                      BHIM
                                    </div>
                                    <span className="text-[10.5px] text-slate-400 font-extrabold">+ more</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-100 pt-3 select-none">
                              <h5 className="font-extrabold text-slate-800 text-[14px]">
                                Total Fare: <span className="text-[#ff8126]">₹{grandTotal.toLocaleString('en-IN')}</span>
                              </h5>
                            </div>

                            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 flex items-center gap-1.5 justify-around flex-wrap text-[10px] font-bold text-slate-500 uppercase tracking-wide select-none">
                              <span>How it works?</span>
                              <span className="text-slate-300">|</span>
                              <span className="text-[#ff8126]">Enter registered VPA</span>
                              <i className="fa-solid fa-angles-right text-slate-300 text-[9px]" />
                              <span>Check payment request</span>
                              <i className="fa-solid fa-angles-right text-slate-300 text-[9px]" />
                              <span>Approve payment</span>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-normal font-normal select-none">
                              By Continuing, you agree to the Rules, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Privacy Policy</span>, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">User Agreement</span> and <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Terms &amp; Conditions</span> of Twin Brothers Holidays
                            </p>
                          </div>
                        )}

                        {/* TAB CONTENT: CREDIT/DEBIT CARDS */}
                        {paymentMethod === 'card' && (
                          <div className="space-y-4 font-sans text-slate-700 select-none">
                            <div className="space-y-3.5 max-w-xl">
                              
                              {/* Card Number */}
                              <div>
                                <label className="block text-[12px] font-bold text-slate-800 mb-1">
                                  Enter Your Card No.
                                </label>
                                <div className="border border-slate-200 rounded focus-within:border-[#ff8126] transition-all bg-white h-10 flex items-center px-3">
                                  <input 
                                    type="text"
                                    placeholder="ENTER CARD NUMBER"
                                    maxLength={19}
                                    value={paymentCardNumber}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/[^0-9]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                                      setPaymentCardNumber(val);
                                    }}
                                    autoComplete="off"
                                    data-lpignore="true"
                                    className="w-full h-full bg-transparent focus:outline-none text-[12px] font-medium text-slate-800 placeholder-slate-350"
                                  />
                                </div>
                              </div>

                              {/* Expiry and CVV */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[12px] font-bold text-slate-800 mb-1">
                                    Valid Through (MM/YY)
                                  </label>
                                  <div className="relative border border-slate-200 rounded focus-within:border-[#ff8126] transition-all bg-white h-10 flex items-center px-3">
                                    <input 
                                      type="text"
                                      placeholder="MM/YY"
                                      maxLength={5}
                                      value={paymentCardExpiry}
                                      onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                        if (val.length >= 2) {
                                          val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                                        }
                                        setPaymentCardExpiry(val);
                                      }}
                                      autoComplete="off"
                                      data-lpignore="true"
                                      className="w-full h-full bg-transparent focus:outline-none text-[12px] font-medium text-slate-800 placeholder-slate-350"
                                    />
                                    <i className="fa-solid fa-circle-info absolute right-3 text-slate-400 text-[13px]" />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[12px] font-bold text-slate-800 mb-1">
                                    CVV
                                  </label>
                                  <div className="relative border border-slate-200 rounded focus-within:border-[#ff8126] transition-all bg-white h-10 flex items-center px-3">
                                    <input 
                                      type="password"
                                      placeholder="CVV"
                                      maxLength={3}
                                      value={paymentCardCVV}
                                      onChange={(e) => setPaymentCardCVV(e.target.value.replace(/[^0-9]/g, ''))}
                                      autoComplete="new-password"
                                      data-lpignore="true"
                                      className="w-full h-full bg-transparent focus:outline-none text-[12px] font-medium text-slate-800 font-mono placeholder-slate-350"
                                    />
                                    <i className="fa-solid fa-circle-info absolute right-3 text-slate-400 text-[13px]" />
                                  </div>
                                </div>
                              </div>

                              {/* Card Holder Name */}
                              <div>
                                <label className="block text-[12px] font-bold text-slate-800 mb-1">
                                  Enter Card Holder Name.
                                </label>
                                <div className="border border-slate-200 rounded focus-within:border-[#ff8126] transition-all bg-white h-10 flex items-center px-3">
                                  <input 
                                    type="text"
                                    placeholder="Name On The Card"
                                    value={paymentCardName}
                                    onChange={(e) => setPaymentCardName(e.target.value)}
                                    autoComplete="off"
                                    data-lpignore="true"
                                    className="w-full h-full bg-transparent focus:outline-none text-[12px] font-medium text-slate-800 placeholder-slate-350"
                                  />
                                </div>
                              </div>

                              {/* Checkbox */}
                              <div className="flex items-center gap-2 pt-1 select-none">
                                <input type="checkbox" id="save_card_checkbox" className="accent-[#ff8126] cursor-pointer" />
                                <label htmlFor="save_card_checkbox" className="text-[12px] text-slate-600 font-medium cursor-pointer">
                                  Save this card for faster checkout
                                </label>
                              </div>
                            </div>

                            {/* Total Fare and Make Payment Button */}
                            <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <div className="text-[15px] font-bold text-slate-900">
                                  Total Fare : <span className="text-[18px] font-extrabold text-slate-900">₹ {grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                                  (Include ₹. 420 Conv fee)
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleFinalPayment}
                                disabled={!paymentCardNumber || !paymentCardName || !paymentCardExpiry || !paymentCardCVV}
                                className="bg-[#ff8126] hover:bg-[#fd661e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-[12.5px] uppercase tracking-wide border-0 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                                style={{ 
                                  paddingTop: '5px', 
                                  paddingBottom: '5px', 
                                  paddingLeft: '10px', 
                                  paddingRight: '10px', 
                                  borderRadius: '4px' 
                                }}
                              >
                                Make Payment
                              </button>
                            </div>

                            {/* Trust and Disclaimer footnotes */}
                            <div className="space-y-2.5 pt-3">
                              <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-semibold">
                                <i className="fa-solid fa-lock text-[11px] text-slate-400" />
                                <span>We use 128-bit secure encryption providing you a SAFE payment environment</span>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-normal font-normal">
                                By Continuing, you agree to the Rules, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Privacy Policy</span>, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">User Agreement</span> and <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Terms &amp; Conditions</span> of Twin Brothers Holidays
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: WALLETS */}
                        {paymentMethod === 'wallet' && (
                          <div className="space-y-4 font-sans text-slate-700 select-none">
                            <div>
                              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-3" style={{ fontSize: '11px' }}>
                                SELECT YOUR WALLET
                              </h4>
                            </div>

                            {/* Wallets 2-column grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                              {[
                                { id: 'mobikwik', label: 'MobiKwik', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><circle cx="12" cy="12" r="11" fill="#00539c"/><path d="M6 16V8H8.5L12 12.5L15.5 8H18V16H15.5V11L12 15.5L8.5 11V16H6Z" fill="white"/></svg>
                                )},
                                { id: 'payzapp', label: 'PayZapp', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="4" fill="#007aff"/><path d="M7 6H13C15 6 16.5 7.5 16.5 9.5C16.5 11.5 15 13 13 13H9V18H7V6ZM9 8V11H13C14 11 14.5 10.5 14.5 9.5C14.5 8.5 14 8 13 8H9Z" fill="white"/><circle cx="17" cy="17" r="4" fill="#ed1c24"/></svg>
                                )},
                                { id: 'phonepe', label: 'PhonePe', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="5" fill="#5f259f"/><path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM14 15H10V17H8V9H14C15.66 9 17 10.34 17 12C17 13.66 15.66 15 14 15ZM10 11V13H14C14.55 13 15 12.55 15 12C15 11.45 14.55 11 14 11H10Z" fill="white"/></svg>
                                )},
                                { id: 'amazon', label: 'Amazon', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="4" fill="#131921"/><path d="M7.5 15C8.5 15 9.5 14.5 10 13.5C10.5 14.5 11.5 15 12.5 15C14 15 15 14 15 12.5V8.5H13.5V12C13.5 12.8 13 13.3 12.2 13.3C11.5 13.3 11 12.8 11 12V8.5H9.5V12C9.5 12.8 9 13.3 8.2 13.3C7.5 13.3 7 12.8 7 12V8.5H5.5V12.5C5.5 14 6.5 15 7.5 15Z" fill="#ff9900"/><path d="M5.5 17.5C8 19.5 14 19.5 16.5 17.5" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                )},
                                { id: 'bajaj', label: 'Bajaj Pay', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><circle cx="12" cy="12" r="11" fill="#0054a6"/><path d="M8 6H13C15 6 16 7 16 8.5C16 9.5 15.5 10.5 14.5 11C15.5 11.5 16.5 12.5 16.5 14C16.5 15.5 15 17 13 17H8V6ZM10 8V10.5H12.5C13 10.5 13.5 10 13.5 9.25C13.5 8.5 13 8 12.5 8H10ZM10 12.5V15H13C13.5 15 14 14.5 14 13.75C14 13 13.5 12.5 13 12.5H10Z" fill="white"/></svg>
                                )}
                              ].map((w) => {
                                const isSelected = paymentSelectedWallet === w.id;
                                return (
                                  <div
                                    key={w.id}
                                    onClick={() => setPaymentSelectedWallet(w.id)}
                                    className={`border rounded p-3 flex items-center gap-3.5 cursor-pointer transition-all hover:bg-slate-50 ${
                                      isSelected ? 'border-[#ff8126] bg-orange-50/10' : 'border-slate-200'
                                    }`}
                                  >
                                    {/* Custom Radio Circle */}
                                    <div className="shrink-0 flex items-center justify-center">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                        isSelected ? 'border-[#ff8126]' : 'border-slate-300'
                                      }`}>
                                        {isSelected && (
                                          <div className="w-2 h-2 rounded-full bg-[#ff8126]" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Brand Logo representation */}
                                    {w.logo}

                                    {/* Wallet Name */}
                                    <span className="font-bold text-[13px] text-slate-800">
                                      {w.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Total Fare and Make Payment button */}
                            <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <div className="text-[15px] font-bold text-slate-900">
                                  Total Fare : <span className="text-[18px] font-extrabold text-slate-900">₹ {grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                                  (Include Rs. 420 Conv fee)
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleFinalPayment}
                                disabled={!paymentSelectedWallet}
                                className="bg-[#ff8126] hover:bg-[#fd661e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-[12.5px] uppercase tracking-wide border-0 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                                style={{ 
                                  paddingTop: '5px', 
                                  paddingBottom: '5px', 
                                  paddingLeft: '10px', 
                                  paddingRight: '10px', 
                                  borderRadius: '4px' 
                                }}
                              >
                                Make Payment
                              </button>
                            </div>

                            {/* Footnotes */}
                            <div className="space-y-2.5 pt-3">
                              <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-semibold">
                                <i className="fa-solid fa-lock text-[11px] text-slate-400" />
                                <span>We use 128-bit secure encryption providing you a SAFE payment environment</span>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-normal font-normal">
                                By Continuing, you agree to the Rules, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Privacy Policy</span>, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">User Agreement</span> and <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Terms &amp; Conditions</span> of Twin Brothers Holidays
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: NET BANKING */}
                        {paymentMethod === 'netbanking' && (
                          <div className="space-y-4 font-sans text-slate-700 select-none">
                            <div>
                              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-3" style={{ fontSize: '11px' }}>
                                SELECT POPULAR BANKS
                              </h4>
                            </div>

                            {/* Popular Banks 2-column grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                              {[
                                { id: 'sbi', label: 'State Bank of India', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><circle cx="12" cy="12" r="9" fill="#008ecf"/><rect x="10.8" y="12" width="2.4" height="9" fill="white"/><circle cx="12" cy="12" r="3" fill="white"/></svg>
                                )},
                                { id: 'hdfc', label: 'HDFC Bank', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="3" fill="#004c8f"/><rect x="5" y="5" width="14" height="14" fill="white"/><rect x="8" y="8" width="8" height="8" fill="#004c8f"/><rect x="10.8" y="2" width="2.4" height="6" fill="#ed1c24"/><rect x="10.8" y="16" width="2.4" height="6" fill="#ed1c24"/><rect x="2" y="10.8" width="6" height="2.4" fill="#ed1c24"/><rect x="16" y="10.8" width="6" height="2.4" fill="#ed1c24"/></svg>
                                )},
                                { id: 'icici', label: 'ICICI Bank', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><circle cx="12" cy="12" r="11" fill="#f58220"/><path d="M10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9C10.9 9 10 8.1 10 7Z" fill="white"/><path d="M9 11H13V18H15V19H9V18H11V12H9V11Z" fill="white"/><path d="M7 6C8.5 4.5 10.5 4 12 4C15 4 18 6 18 10C18 14 15 17 12 19C10 19 8.5 17.5 7.5 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                )},
                                { id: 'axis', label: 'Axis Bank', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="4" fill="#97144d"/><path d="M6 18L12 6L18 18H14L12 11L10 18H6Z" fill="white"/></svg>
                                )},
                                { id: 'kotak', label: 'Kotak Mahindra Bank', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><circle cx="12" cy="12" r="11" fill="#003366"/><path d="M8 6H10V18H8V6Z" fill="#ed1c24"/><path d="M10 12L15 6H17.5L12.5 12L18 18H15.5L10 12Z" fill="#ed1c24"/><path d="M12 12H14V18H12V12Z" fill="white"/></svg>
                                )},
                                { id: 'jk', label: 'Jammu and kashmir Bank', logo: (
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M12 2L19 9H5L12 2Z" fill="#009639"/><path d="M12 22L5 15H19L12 22Z" fill="#ed1c24"/><circle cx="12" cy="12" r="3" fill="#004c8f"/></svg>
                                )}
                              ].map((b) => {
                                const isSelected = paymentSelectedBank === b.id;
                                return (
                                  <div
                                    key={b.id}
                                    onClick={() => setPaymentSelectedBank(b.id)}
                                    className={`border rounded flex items-center gap-3.5 cursor-pointer transition-all hover:bg-slate-50 ${
                                      isSelected ? 'border-[#ff8126] bg-orange-50/10' : 'border-slate-200'
                                    }`}
                                    style={{ paddingTop: '5px', paddingBottom: '5px', paddingLeft: '12px', paddingRight: '12px' }}
                                  >
                                    {/* Custom Radio Circle */}
                                    <div className="shrink-0 flex items-center justify-center">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                        isSelected ? 'border-[#ff8126]' : 'border-slate-300'
                                      }`}>
                                        {isSelected && (
                                          <div className="w-2 h-2 rounded-full bg-[#ff8126]" />
                                        )}
                                      </div>
                                    </div>

                                    {/* Brand Logo representation */}
                                    {b.logo}

                                    {/* Bank Name */}
                                    <span className="font-bold text-slate-800" style={{ fontSize: '9px' }}>
                                      {b.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* SELECT OTHER BANKS Custom Dropdown */}
                            <div className="max-w-2xl font-sans mt-5 relative select-none">
                              <label className="block font-bold text-slate-400 uppercase tracking-wider mb-2" style={{ fontSize: '11px' }}>
                                SELECT OTHER BANKS
                              </label>
                              
                              {/* Dropdown Button */}
                              <div 
                                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                                className={`border rounded px-3 h-10 flex items-center justify-between cursor-pointer transition-all bg-white hover:border-[#ff8126] ${
                                  isBankDropdownOpen ? 'border-[#ff8126] shadow-sm' : 'border-slate-200'
                                }`}
                              >
                                <span className="font-bold text-slate-800 text-[11px]">
                                  {paymentSelectedBank && ['sbi','hdfc','icici','axis','kotak','jk','pnb','bob','union','canara'].includes(paymentSelectedBank)
                                    ? [
                                        { id: 'sbi', label: 'State Bank of India' },
                                        { id: 'hdfc', label: 'HDFC Bank' },
                                        { id: 'icici', label: 'ICICI Bank' },
                                        { id: 'axis', label: 'Axis Bank' },
                                        { id: 'kotak', label: 'Kotak Mahindra Bank' },
                                        { id: 'jk', label: 'Jammu and kashmir Bank' },
                                        { id: 'pnb', label: 'Punjab National Bank' },
                                        { id: 'bob', label: 'Bank of Baroda' },
                                        { id: 'union', label: 'Union Bank of India' },
                                        { id: 'canara', label: 'Canara Bank' }
                                      ].find(b => b.id === paymentSelectedBank)?.label || 'Select Bank'
                                    : 'Select'
                                  }
                                </span>
                                <i className={`fa-solid fa-chevron-down text-slate-400 transition-transform duration-200 text-xs ${
                                  isBankDropdownOpen ? 'rotate-180' : ''
                                }`} />
                              </div>

                              {/* Dropdown Options Overlay */}
                              {isBankDropdownOpen && (
                                <>
                                  {/* Invisible backdrop to close on click outside */}
                                  <div 
                                    className="fixed inset-0 z-40 cursor-default"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsBankDropdownOpen(false);
                                    }}
                                  />
                                  
                                  {/* Options Panel */}
                                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded shadow-lg max-h-56 overflow-y-auto z-50 py-1 transition-all">
                                    {[
                                      { id: 'sbi', label: 'State Bank of India' },
                                      { id: 'hdfc', label: 'HDFC Bank' },
                                      { id: 'icici', label: 'ICICI Bank' },
                                      { id: 'axis', label: 'Axis Bank' },
                                      { id: 'kotak', label: 'Kotak Mahindra Bank' },
                                      { id: 'jk', label: 'Jammu and kashmir Bank' },
                                      { id: 'pnb', label: 'Punjab National Bank' },
                                      { id: 'bob', label: 'Bank of Baroda' },
                                      { id: 'union', label: 'Union Bank of India' },
                                      { id: 'canara', label: 'Canara Bank' }
                                    ].map((b) => {
                                      const isSelected = paymentSelectedBank === b.id;
                                      return (
                                        <div
                                          key={b.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setPaymentSelectedBank(b.id);
                                            setIsBankDropdownOpen(false);
                                          }}
                                          className={`px-3 py-2 text-[11px] font-bold cursor-pointer transition-colors flex items-center justify-between ${
                                            isSelected 
                                              ? 'bg-orange-50 text-[#ff8126]' 
                                              : 'text-slate-700 hover:bg-slate-50'
                                          }`}
                                        >
                                          <span>{b.label}</span>
                                          {isSelected && <i className="fa-solid fa-check text-xs text-[#ff8126]" />}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Total Fare and Make Payment button */}
                            <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <div className="text-[15px] font-bold text-slate-900">
                                  Total Fare : <span className="text-[18px] font-extrabold text-slate-900">₹ {grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                                  (Include Rs. 420 Conv fee)
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleFinalPayment}
                                disabled={!paymentSelectedBank}
                                className="bg-[#ff8126] hover:bg-[#fd661e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-[12.5px] uppercase tracking-wide border-0 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                                style={{ 
                                  paddingTop: '5px', 
                                  paddingBottom: '5px', 
                                  paddingLeft: '10px', 
                                  paddingRight: '10px', 
                                  borderRadius: '4px' 
                                }}
                              >
                                Make Payment
                              </button>
                            </div>

                            {/* Footnotes */}
                            <div className="space-y-2.5 pt-3">
                              <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-semibold">
                                <i className="fa-solid fa-lock text-[11px] text-slate-400" />
                                <span>We use 128-bit secure encryption providing you a SAFE payment environment</span>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-normal font-normal">
                                By Continuing, you agree to the Rules, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Privacy Policy</span>, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">User Agreement</span> and <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Terms &amp; Conditions</span> of Twin Brothers Holidays
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: EMI */}
                        {paymentMethod === 'emi' && (
                          <div className="space-y-4 font-sans text-slate-700 select-none">
                            {/* Title */}
                            <div>
                              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-3 select-none" style={{ fontSize: '11px' }}>
                                SELECT BANKS
                              </h4>
                            </div>

                            {/* Pills selection */}
                            <div className="flex gap-2 mb-4 flex-wrap">
                              {[
                                { id: 'credit', label: 'Credit Card' },
                                { id: 'nocost', label: 'No Cost EMI' },
                                { id: 'debit', label: 'Debit Card EMI' }
                              ].map((p) => {
                                const isActive = emiType === p.id;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setEmiType(p.id)}
                                    className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer ${
                                      isActive 
                                        ? 'bg-[#007aff] border-[#007aff] text-white' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                  >
                                    {p.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* STEP 1: Choose your Bank */}
                            <div className="border border-slate-100 rounded-lg overflow-hidden bg-white mb-3">
                              <div 
                                onClick={() => setActiveEmiStep(activeEmiStep === 1 ? 0 : 1)}
                                className="flex items-center justify-between p-3.5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[11px] ${
                                    emiSelectedBank ? 'bg-green-600' : 'bg-[#39b54a]'
                                  }`}>
                                    1
                                  </div>
                                  <div>
                                    <span className="font-bold text-[13px] text-slate-800">Choose your Bank</span>
                                    <span className="text-[10px] text-slate-400 font-medium ml-2 hidden sm:inline">
                                      You must have its debit/credit card
                                    </span>
                                  </div>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${
                                  activeEmiStep === 1 ? 'rotate-180' : ''
                                }`} />
                              </div>

                              {activeEmiStep === 1 && (
                                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 px-3 bg-white scrollbar-thin">
                                  {[
                                    { id: 'hdfc', label: 'HDFC', logo: (
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="3" fill="#004c8f"/><rect x="5" y="5" width="14" height="14" fill="white"/><rect x="8" y="8" width="8" height="8" fill="#004c8f"/><rect x="10.8" y="2" width="2.4" height="6" fill="#ed1c24"/><rect x="10.8" y="16" width="2.4" height="6" fill="#ed1c24"/><rect x="2" y="10.8" width="6" height="2.4" fill="#ed1c24"/><rect x="16" y="10.8" width="6" height="2.4" fill="#ed1c24"/></svg>
                                    )},
                                    { id: 'dbs', label: 'DBS', logo: (
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="4" fill="#ff0000"/><path d="M12 4L16 12L12 20L8 12L12 4Z" fill="white"/><circle cx="12" cy="12" r="2" fill="#ff0000"/></svg>
                                    )},
                                    { id: 'icici', label: 'ICICI', logo: (
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0"><circle cx="12" cy="12" r="11" fill="#f58220"/><path d="M10 7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9C10.9 9 10 8.1 10 7Z" fill="white"/><path d="M9 11H13V18H15V19H9V18H11V12H9V11Z" fill="white"/><path d="M7 6C8.5 4.5 10.5 4 12 4C15 4 18 6 18 10C18 14 15 17 12 19C10 19 8.5 17.5 7.5 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                    )},
                                    { id: 'idfc', label: 'IDFC FIRST Bank', logo: (
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="4" fill="#800020"/><path d="M6 6H10V18H6V6ZM12 6H18V9H15V18H12V6Z" fill="white"/></svg>
                                    )},
                                    { id: 'bajaj', label: 'BajajFinserv', logo: (
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0"><circle cx="12" cy="12" r="11" fill="#0054a6"/><path d="M6 18L12 6L18 18H15L12 12L9 18H6Z" fill="white"/></svg>
                                    )},
                                    { id: 'axis', label: 'Axis', logo: (
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0"><rect width="24" height="24" rx="4" fill="#97144d"/><path d="M6 18L12 6L18 18H14L12 11L10 18H6Z" fill="white"/></svg>
                                    )},
                                    { id: 'hsbc', label: 'HSBC', logo: (
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M4 12L10 6H14L20 12L14 18H10L4 12Z" fill="#ff0000"/><path d="M10 6L12 12L14 6H10ZM10 18L12 12L14 18H10Z" fill="white"/></svg>
                                    )}
                                  ].map((b) => {
                                    const isSelected = emiSelectedBank === b.id;
                                    return (
                                      <div
                                        key={b.id}
                                        onClick={() => {
                                          setEmiSelectedBank(b.id);
                                          setActiveEmiStep(2);
                                        }}
                                        className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/50"
                                      >
                                        <div className="flex items-center gap-3.5">
                                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                                            isSelected ? 'border-[#007aff]' : 'border-slate-300'
                                          }`}>
                                            {isSelected && (
                                              <div className="w-2.5 h-2.5 rounded-full bg-[#007aff]" />
                                            )}
                                          </div>
                                          {b.logo}
                                          <span className="font-bold text-[13px] text-slate-800">{b.label}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* STEP 2: Choose EMI Tenure */}
                            <div className="border border-slate-100 rounded-lg overflow-hidden bg-white mb-3">
                              <div 
                                onClick={() => {
                                  if (emiSelectedBank) {
                                    setActiveEmiStep(activeEmiStep === 2 ? 0 : 2);
                                  }
                                }}
                                className={`flex items-center justify-between p-3.5 transition-colors ${
                                  emiSelectedBank ? 'cursor-pointer bg-slate-50/50 hover:bg-slate-50' : 'cursor-not-allowed bg-slate-50/20 opacity-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[11px] ${
                                    emiSelectedTenure ? 'bg-green-600' : 'bg-[#39b54a]'
                                  }`}>
                                    2
                                  </div>
                                  <div>
                                    <span className="font-bold text-[13px] text-slate-800">Choose EMI Tenure</span>
                                    <span className="text-[10px] text-slate-400 font-medium ml-2 hidden sm:inline">
                                      Check interest rates and monthly installment beforehand
                                    </span>
                                  </div>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${
                                  activeEmiStep === 2 ? 'rotate-180' : ''
                                }`} />
                              </div>

                              {activeEmiStep === 2 && emiSelectedBank && (
                                <div className="p-3 bg-white overflow-x-auto">
                                  <table className="w-full text-left border-collapse text-[11px] font-sans min-w-[500px]">
                                    <thead>
                                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-semibold">
                                        <th className="py-2.5 font-bold uppercase tracking-wide">Select</th>
                                        <th className="py-2.5 font-bold uppercase tracking-wide">Tenure</th>
                                        <th className="py-2.5 font-bold uppercase tracking-wide">Principal Amount</th>
                                        <th className="py-2.5 font-bold uppercase tracking-wide">Effective Interest</th>
                                        <th className="py-2.5 font-bold uppercase tracking-wide text-center">Monthly Installments</th>
                                        <th className="py-2.5 font-bold uppercase tracking-wide text-right">Effective Interest paid to bank</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {[
                                        { months: 3, rate: 13, divisor: 3, multiplier: 1.0218 },
                                        { months: 6, rate: 13, divisor: 6, multiplier: 1.0382 },
                                        { months: 9, rate: 15, divisor: 9, multiplier: 1.0635 },
                                        { months: 12, rate: 15, divisor: 12, multiplier: 1.0831 }
                                      ].map((row) => {
                                        const totalEMI = Math.round(grandTotal * row.multiplier);
                                        const monthlyInstallment = Number(((grandTotal * (1 + (row.rate / 100) * (row.months / 12))) / row.divisor).toFixed(2));
                                        const interestPaid = Number((monthlyInstallment * row.divisor - grandTotal).toFixed(2));
                                        const isSelected = emiSelectedTenure === row.months;
                                        return (
                                          <tr 
                                            key={row.months}
                                            onClick={() => {
                                              setEmiSelectedTenure(row.months);
                                              setActiveEmiStep(3);
                                            }}
                                            className="hover:bg-slate-50/50 cursor-pointer text-slate-700 transition-colors"
                                          >
                                            <td className="py-3">
                                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                                isSelected ? 'border-[#007aff]' : 'border-slate-300'
                                              }`}>
                                                {isSelected && (
                                                  <div className="w-2.5 h-2.5 rounded-full bg-[#007aff]" />
                                                )}
                                              </div>
                                            </td>
                                            <td className="py-3 font-bold text-slate-800 text-[12px]">{row.months}</td>
                                            <td className="py-3 font-semibold">Rs {grandTotal}</td>
                                            <td className="py-3 font-semibold">{row.rate}%(p.a.)</td>
                                            <td className="py-3 font-extrabold text-slate-800 text-center text-[12px]">Rs {monthlyInstallment.toLocaleString('en-IN')}</td>
                                            <td className="py-3 font-bold text-slate-800 text-right text-[11px]">Rs {interestPaid.toLocaleString('en-IN')}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            {/* STEP 3: Enter Card Details */}
                            <div className="border border-slate-100 rounded-lg overflow-hidden bg-white mb-3">
                              <div 
                                onClick={() => {
                                  if (emiSelectedBank && emiSelectedTenure) {
                                    setActiveEmiStep(activeEmiStep === 3 ? 0 : 3);
                                  }
                                }}
                                className={`flex items-center justify-between p-3.5 transition-colors ${
                                  (emiSelectedBank && emiSelectedTenure) ? 'cursor-pointer bg-slate-50/50 hover:bg-slate-50' : 'cursor-not-allowed bg-slate-50/20 opacity-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[11px] ${
                                    (emiCardNo && emiCardName && emiCardExpiryMonth && emiCardExpiryYear && emiCardCVV) ? 'bg-green-600' : 'bg-[#39b54a]'
                                  }`}>
                                    3
                                  </div>
                                  <div>
                                    <span className="font-bold text-[13px] text-slate-800">Enter Card Details</span>
                                    <span className="text-[10px] text-slate-400 font-medium ml-2 hidden sm:inline">
                                      Fill up correct details of your debit/credit card
                                    </span>
                                  </div>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${
                                  activeEmiStep === 3 ? 'rotate-180' : ''
                                }`} />
                              </div>

                              {activeEmiStep === 3 && emiSelectedBank && emiSelectedTenure && (
                                <div className="p-4 bg-white space-y-4 max-w-lg">
                                  {/* Card Number Input */}
                                  <div>
                                    <label className="block text-[11.5px] font-semibold text-slate-700 mb-1.5">
                                      Enter Your Card No.
                                    </label>
                                    <input 
                                      type="text"
                                      placeholder="xxxx-xxxx-xxxx-xxxx"
                                      value={emiCardNo}
                                      onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, '');
                                        v = v.slice(0, 16);
                                        const matches = v.match(/\d{4,16}/g);
                                        const match = (matches && matches[0]) || '';
                                        const parts = [];
                                        for (let i=0, len=match.length; i<len; i+=4) {
                                          parts.push(match.substring(i, i+4));
                                        }
                                        if (parts.length > 0) {
                                          setEmiCardNo(parts.join('-'));
                                        } else {
                                          setEmiCardNo(v);
                                        }
                                      }}
                                      className="w-full border border-slate-200 rounded-md px-3 h-10 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#ff8126] placeholder:text-slate-300 placeholder:font-medium"
                                    />
                                  </div>

                                  {/* Card Holder Name */}
                                  <div>
                                    <label className="block text-[11.5px] font-semibold text-slate-700 mb-1.5">
                                      Enter Card Holder Name.
                                    </label>
                                    <input 
                                      type="text"
                                      placeholder="Card Holder Name"
                                      value={emiCardName}
                                      onChange={(e) => setEmiCardName(e.target.value)}
                                      className="w-full border border-slate-200 rounded-md px-3 h-10 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#ff8126] placeholder:text-slate-300 placeholder:font-medium"
                                    />
                                  </div>

                                  {/* Expiry Date and CVV */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-[11.5px] font-semibold text-slate-700 mb-1.5">
                                        Expiry Date
                                      </label>
                                      <div className="grid grid-cols-2 gap-2">
                                        <select
                                          value={emiCardExpiryMonth}
                                          onChange={(e) => setEmiCardExpiryMonth(e.target.value)}
                                          className="border border-slate-200 rounded-md px-2 h-10 text-[13px] font-bold text-slate-800 bg-white focus:outline-none focus:border-[#ff8126]"
                                        >
                                          <option value="">Month</option>
                                          {Array.from({ length: 12 }, (_, i) => {
                                            const m = (i + 1).toString().padStart(2, '0');
                                            return <option key={m} value={m}>{m}</option>;
                                          })}
                                        </select>
                                        <select
                                          value={emiCardExpiryYear}
                                          onChange={(e) => setEmiCardExpiryYear(e.target.value)}
                                          className="border border-slate-200 rounded-md px-2 h-10 text-[13px] font-bold text-slate-800 bg-white focus:outline-none focus:border-[#ff8126]"
                                        >
                                          <option value="">Year</option>
                                          {Array.from({ length: 15 }, (_, i) => {
                                            const y = (new Date().getFullYear() + i).toString();
                                            return <option key={y} value={y}>{y}</option>;
                                          })}
                                        </select>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[11.5px] font-semibold text-slate-700 mb-1.5">
                                        CVV
                                      </label>
                                      <div className="relative">
                                        <input 
                                          type="password"
                                          placeholder="CVV"
                                          value={emiCardCVV}
                                          onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                                            setEmiCardCVV(v);
                                          }}
                                          className="w-full border border-slate-200 rounded-md pl-3 pr-10 h-10 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#ff8126]"
                                        />
                                        <div className="absolute right-3 top-2.5 text-slate-300 pointer-events-none">
                                          <i className="fa-solid fa-credit-card text-base" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Total Fare and Make Payment button */}
                            <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <div className="text-[15px] font-bold text-slate-900">
                                  Total Fare : <span className="text-[18px] font-extrabold text-slate-900">₹ {grandTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                                  (Include Rs. 420 Conv fee)
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleFinalPayment}
                                disabled={
                                  !emiSelectedBank || 
                                  !emiSelectedTenure || 
                                  !emiCardNo || 
                                  !emiCardName || 
                                  !emiCardExpiryMonth || 
                                  !emiCardExpiryYear || 
                                  !emiCardCVV
                                }
                                className="bg-[#ff8126] hover:bg-[#fd661e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-[12.5px] uppercase tracking-wide border-0 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                                style={{ 
                                  paddingTop: '5px', 
                                  paddingBottom: '5px', 
                                  paddingLeft: '10px', 
                                  paddingRight: '10px', 
                                  borderRadius: '4px' 
                                }}
                              >
                                Make Payment
                              </button>
                            </div>

                            {/* Footnotes */}
                            <div className="space-y-2.5 pt-3">
                              <div className="flex items-center gap-2 text-[10.5px] text-slate-400 font-semibold">
                                <i className="fa-solid fa-lock text-[11px] text-slate-400" />
                                <span>We use 128-bit secure encryption providing you a SAFE payment environment</span>
                              </div>

                              <p className="text-[10px] text-slate-400 leading-normal font-normal">
                                By Continuing, you agree to the Rules, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Privacy Policy</span>, <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">User Agreement</span> and <span className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer decoration-solid">Terms &amp; Conditions</span> of Twin Brothers Holidays
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: PAY WITH REWARDS */}
                        {paymentMethod === 'rewards' && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-extrabold text-slate-800 tracking-wide select-none" style={{ fontSize: '13px' }}>
                                Pay with Rewards Program
                              </h4>
                            </div>

                            <div className="space-y-3 font-sans max-w-sm">
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1 select-none">
                                  Registered Mobile Number
                                </label>
                                <div className="border border-slate-200 rounded-md focus-within:border-[#ff8126] transition-all bg-white h-9">
                                  <input 
                                    type="tel"
                                    placeholder="Enter Registered Mobile Number"
                                    maxLength={10}
                                    value={paymentRewardsPhone}
                                    onChange={(e) => setPaymentRewardsPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full h-full bg-transparent px-3 py-1.5 focus:outline-none text-[12px] font-medium text-slate-800"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (paymentRewardsPhone.length !== 10) {
                                    alert("Please enter a valid 10-digit mobile number.");
                                    return;
                                  }
                                  alert("Checking rewards balance for: " + paymentRewardsPhone);
                                }}
                                className="bg-[#ff8126] hover:bg-[#fd661e] text-white font-extrabold text-[10.5px] uppercase tracking-wide border-0 cursor-pointer shadow-sm hover:shadow"
                                style={{ borderRadius: '6px', padding: '7.5px 16px' }}
                              >
                                Check Rewards Balance
                              </button>
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: GIFT CARD */}
                        {paymentMethod === 'giftcard' && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-extrabold text-slate-800 tracking-wide select-none" style={{ fontSize: '13px' }}>
                                Pay with Gift Card
                              </h4>
                            </div>

                            <div className="space-y-3 font-sans max-w-sm">
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1 select-none">
                                  Gift Card Number
                                </label>
                                <div className="border border-slate-200 rounded-md focus-within:border-[#ff8126] transition-all bg-white h-9">
                                  <input 
                                    type="text"
                                    placeholder="Enter 16-Digit Gift Card Number"
                                    value={paymentGiftCardNo}
                                    onChange={(e) => setPaymentGiftCardNo(e.target.value.toUpperCase())}
                                    className="w-full h-full bg-transparent px-3 py-1.5 focus:outline-none text-[12px] font-medium text-slate-800"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1 select-none">
                                  Gift Card PIN
                                </label>
                                <div className="border border-slate-200 rounded-md focus-within:border-[#ff8126] transition-all bg-white h-9">
                                  <input 
                                    type="password"
                                    placeholder="Enter 6-Digit PIN"
                                    maxLength={6}
                                    value={paymentGiftCardPin}
                                    onChange={(e) => setPaymentGiftCardPin(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full h-full bg-transparent px-3 py-1.5 focus:outline-none text-[12px] font-medium text-slate-800 font-mono"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (!paymentGiftCardNo || !paymentGiftCardPin) {
                                    alert("Please fill out both the card number and PIN.");
                                    return;
                                  }
                                  alert("Applying Gift Card: " + paymentGiftCardNo);
                                }}
                                className="bg-[#ff8126] hover:bg-[#fd661e] text-white font-extrabold text-[10.5px] uppercase tracking-wide border-0 cursor-pointer shadow-sm hover:shadow"
                                style={{ borderRadius: '6px', padding: '7.5px 16px' }}
                              >
                                Apply Gift Card
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Primary Tab Payment Trigger button */}
                        {paymentMethod !== 'rewards' && paymentMethod !== 'upi' && paymentMethod !== 'card' && paymentMethod !== 'wallet' && paymentMethod !== 'netbanking' && (
                          <div className="pt-6 border-t border-slate-100 mt-6 select-none">
                            <button
                              type="button"
                              onClick={handleFinalPayment}
                              disabled={
                                (paymentMethod === 'upi' && !qrGenerated) ||
                                (paymentMethod === 'card' && (!paymentCardNumber || !paymentCardName || !paymentCardExpiry || !paymentCardCVV)) ||
                                (paymentMethod === 'wallet' && !paymentSelectedWallet) ||
                                (paymentMethod === 'netbanking' && !paymentSelectedBank) ||
                                (paymentMethod === 'emi' && !paymentEmiOption) ||
                                (paymentMethod === 'giftcard' && (!paymentGiftCardNo || !paymentGiftCardPin))
                              }
                              className="w-full bg-[#ff8126] hover:bg-[#fd661e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-[13px] uppercase tracking-wider rounded-lg border-0 cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                              style={{ borderRadius: '8px', paddingTop: '11px', paddingBottom: '11px' }}
                            >
                              {paymentMethod === 'upi' && qrGenerated ? (
                                <>
                                  <i className="fa-solid fa-lock text-xs" />
                                  <span>Proceed to payment &amp; enter UPI PIN</span>
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-lock text-xs" />
                                  <span>Pay ₹ {grandTotal.toLocaleString('en-IN')}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* ── RIGHT COLUMN: SIDEBAR ── */}
          <div className="space-y-3 lg:sticky lg:top-[70px] sticky-sidebar-scroll">
            
            {/* 1. PRICE SUMMARY */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#fff4ec] border-b border-orange-100/50 px-4 flex items-center justify-between" style={{ paddingTop: '11px', paddingBottom: '11px' }}>
                <div className="font-extrabold text-slate-900" style={{ fontSize: '14px' }}>Price Summary</div>
                <div className="flex items-center gap-3 text-slate-800" style={{ fontSize: '11.5px' }}>
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-user text-slate-700 text-[10px]" />
                    <span className="font-bold">{adults}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-child text-slate-700 text-[10px]" />
                    <span className="font-bold">{children}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-baby text-slate-700 text-[10px]" />
                    <span className="font-bold">{infants}</span>
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Row 1: Base Fare */}
                <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                  <span>Adult x {adults}</span>
                  <span className="font-bold text-slate-800">₹{baseFare.toLocaleString('en-IN')}</span>
                </div>

                {/* Row 2: Taxes */}
                <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                  <span>Total Taxes +</span>
                  <span className="font-bold text-slate-800">₹{taxesAndFees.toLocaleString('en-IN')}</span>
                </div>

                {/* Row 3: Discount */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between px-4 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span className="text-slate-700">Discount</span>
                    <span className="font-bold text-emerald-600">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Row 4: Protection Plan */}
                {protectionCost > 0 && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>
                      {protectionOption === 'cancellation' && 'Free Cancellation for Any Reason'}
                      {protectionOption === 'date_change' && 'Free Date Change'}
                      {protectionOption === 'easefly' && 'Free Cancellation & Reschedule'}
                    </span>
                    <span className="font-bold text-slate-800">₹{protectionCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Row 5: Heritage Contribution */}
                {charityAmount > 0 && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>Heritage Contribution</span>
                    <span className="font-bold text-slate-800">₹{charityAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Row 6: Insurance */}
                {insuranceCost > 0 && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>Travel Insurance</span>
                    <span className="font-bold text-slate-800">₹{insuranceCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Row 7: Seat Selection */}
                {selectedSeatPrice > 0 && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>Seat Selection ({selectedSeat})</span>
                    <span className="font-bold text-slate-800">₹{selectedSeatPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Row 8: Pre-booked Meals */}
                {selectedMealsPrice > 0 && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>Pre-booked Meals</span>
                    <span className="font-bold text-slate-800">₹{selectedMealsPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Row 9: Extra Baggage */}
                {selectedBaggagePrice > 0 && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>Extra Baggage</span>
                    <span className="font-bold text-slate-800">₹{selectedBaggagePrice.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Row 9.1: Airport Lounge */}
                {addonLounge && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>Airport Lounge Access</span>
                    <span className="font-bold text-slate-800">₹800</span>
                  </div>
                )}

                {/* Row 9.2: Priority Boarding */}
                {addonPriority && (
                  <div className="flex items-center justify-between px-4 text-slate-700 hover:bg-slate-50/40 transition-colors" style={{ fontSize: '12px', paddingTop: '10px', paddingBottom: '10px' }}>
                    <span>Priority Boarding &amp; Bag Tag</span>
                    <span className="font-bold text-slate-800">₹{addonPriorityPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Grand Total Row */}
                <div className="flex items-center justify-between px-4 bg-[#fffaf5] transition-colors border-t border-slate-100" style={{ fontSize: '14.5px', paddingTop: '13px', paddingBottom: '13px' }}>
                  <span className="font-extrabold text-[#e05a00]">Grand Total</span>
                  <span className="font-black text-[#e05a00]">₹ {grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* 2. OFFERS & PROMO CODE */}
            {checkoutStep !== 'payment' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ marginTop: '20px' }}>
                <div className="bg-[#fff7ed] border-b border-orange-100 px-3 flex items-center justify-between" style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <span className="font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5" style={{ fontSize: '13px' }}>
                    <i className="fa-solid fa-tag text-[#ff8126]" style={{ fontSize: '13px' }} />
                    <span>Offers &amp; Promo Code</span>
                  </span>
                </div>

                <div className="px-4 py-2 space-y-4">
                  {/* Apply coupon input */}
                  <form onSubmit={handleCouponApply} className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon}
                        className="w-full bg-slate-50 border border-slate-200 uppercase disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ 
                          height: '26px', 
                          fontSize: '10px', 
                          fontWeight: 'bold', 
                          color: '#1e293b', 
                          padding: '0 8px', 
                          borderRadius: '4px' 
                        }}
                      />
                    </div>
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleCouponRemove}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold border border-red-200 cursor-pointer transition-colors"
                        style={{ 
                          borderRadius: '4px', 
                          height: '26px', 
                          fontSize: '10px', 
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-[#072146] hover:bg-[#003666] text-white font-extrabold border-0 cursor-pointer transition-colors"
                        style={{ 
                          borderRadius: '4px', 
                          height: '26px', 
                          fontSize: '10px', 
                          padding: '0 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        Apply
                      </button>
                    )}
                  </form>

                  {couponError && <small className="text-red-500 block font-medium -mt-1.5" style={{ fontSize: '10.5px' }}>{couponError}</small>}

                  {appliedCoupon && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg" style={{ marginTop: '10px', paddingTop: '6px', paddingBottom: '6px' }}>
                      <span className="font-bold text-emerald-800 block mb-0.5 uppercase tracking-wide" style={{ fontSize: '11.5px' }}>
                        Success Applied
                      </span>
                      <span className="text-emerald-700 leading-normal block" style={{ fontSize: '11.5px' }}>
                        Congratulations! Coupon <strong className="text-emerald-900">{appliedCoupon}</strong> giving ₹{discountAmount} discount has been applied successfully.
                      </span>
                    </div>
                  )}

                  {/* Promo Coupon list cards */}
                  <div className="space-y-3.5 border-t border-slate-100 pt-2">
                    {[
                      { code: 'BOOKNOW', desc: 'Get Rs.420 OFF on your flight booking.' },
                      { code: 'TBHFLY', desc: 'ZERO Convenience Fees. Saves Rs.200 off bookings.' },
                      { code: 'TBHBANK', desc: 'Use select bank debit/credit cards and get up to Rs.1000 OFF.' },
                      { code: 'TBHEMI', desc: 'Pay via No Cost EMI and get Rs.952 OFF.' }
                    ].map((coupon) => {
                      const isSelected = appliedCoupon === coupon.code;
                      return (
                        <div
                          key={coupon.code}
                          onClick={() => {
                            setAppliedCoupon(isSelected ? '' : coupon.code);
                            setCouponInput(isSelected ? '' : coupon.code);
                            setCouponError('');
                          }}
                          className={`border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected 
                              ? 'border-2 border-[#ff8126] bg-[#fff7ed]/20' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          style={{ paddingTop: '8px', paddingBottom: '3px', paddingLeft: '8px', paddingRight: '8px', marginBottom: '10px' }}
                        >
                          <div className="mt-0.5">
                            <input 
                              type="radio" 
                              name="promo_group"
                              checked={isSelected}
                              onChange={() => {}}
                              className="cursor-pointer accent-[#ff8126]"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800" style={{ fontSize: '11px' }}>{coupon.code}</span>
                              <span className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider hover:text-orange-600">T&amp;C Apply</span>
                            </div>
                            <p className="text-[13px] text-slate-500 mt-1 leading-normal">
                              {coupon.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[13px] font-bold text-[#ff8126] hover:underline cursor-pointer">
                      View All Coupons
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar Continue button */}
            {checkoutStep !== 'payment' && (
              <div className="hidden lg:block">
                <button
                  onClick={handleBookingSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#ff8126] hover:bg-[#fd661e] text-white font-extrabold text-[13px] uppercase tracking-wider rounded-lg border-0 cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  style={{ borderRadius: '8px', paddingTop: '14px', paddingBottom: '14px' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <span>{checkoutStep === 'details' ? 'Continue Booking' : 'Proceed to Payment'}</span>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ── MOBILE STICKY BOTTOM ACTION BAR ── */}
      {checkoutStep !== 'payment' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] px-4 py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.15)] z-40 flex items-center justify-between gap-4 font-sans select-none">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Grand Total</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[15.5px] font-black text-white">₹{grandTotal.toLocaleString('en-IN')}</span>
              <i className="fa-solid fa-circle-info text-slate-400 text-[10.5px] cursor-pointer" onClick={() => alert(`Base Fare: ₹${baseFare.toLocaleString('en-IN')}\nTaxes & Fees: ₹${taxesAndFees.toLocaleString('en-IN')}\nAdd-ons: ₹${(selectedSeatPrice + selectedMealsPrice + selectedBaggagePrice + protectionCost + charityAmount + insuranceCost).toLocaleString('en-IN')}\nDiscount: -₹${discountAmount.toLocaleString('en-IN')}`)} />
            </div>
          </div>
          <button
            onClick={handleBookingSubmit}
            disabled={isSubmitting}
            className="bg-[#f25e0a] hover:bg-[#e05307] text-white font-extrabold text-[12.5px] uppercase tracking-wider border-0 cursor-pointer shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1 shrink-0"
            style={{ padding: '3px 8px', borderRadius: '4px' }}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{checkoutStep === 'details' ? 'Continue Booking' : 'Proceed to Payment'}</span>
            )}
          </button>
        </div>
      )}
      {/* Fullscreen Flight Circle Loading Spinner */}
      {(isSubmitting || isProcessingPayment) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center z-[99999] font-sans">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Spinning dotted circle path */}
            <div className="absolute inset-2 border-4 border-dashed border-[#ff8126]/30 rounded-full animate-[spin_20s_linear_infinite]" />
            {/* Double solid color spinning border rings */}
            <div className="absolute inset-0 border-[3px] border-t-[#ff8126] border-b-[#ff8126]/20 border-r-transparent border-l-transparent rounded-full animate-spin" />
            <div className="absolute inset-4 border-[2px] border-b-[#fd661e] border-t-[#fd661e]/20 border-l-transparent border-r-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]" />
            
            {/* Sliding airplane travelling along the circular path */}
            <div className="absolute animate-[spin_4s_linear_infinite] w-full h-full flex items-start justify-center">
              <i className="fa-solid fa-plane text-[#ff8126] text-[22px] transform -rotate-45 -translate-y-1" />
            </div>

            {/* Stationary center icon representing departure */}
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-plane-departure text-[#ff8126] text-2xl animate-pulse" />
            </div>
          </div>
          <h3 className="text-white font-extrabold text-[16px] mt-8 tracking-wider text-center px-4">
            {isProcessingPayment ? "Processing Secure Payment..." : "Securing Your Flight Booking..."}
          </h3>
          <p className="text-slate-300 text-[12px] mt-2 text-center max-w-[320px] leading-relaxed px-4">
            {isProcessingPayment 
              ? "We are verifying your transaction. Please do not refresh or press back." 
              : "We are submitting your reservation details to the airline. Please wait."}
          </p>
        </div>
      )}

    </div>
  );
}
