'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';

// Define TS interfaces
interface Hotel {
  id: number;
  name: string;
  slug: string;
  location: string;
  city: string;
  featured_image: string;
  gallery?: string[];
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

// 1. Loading Skeleton Component
function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-4 mb-4 flex flex-col md:flex-row gap-4 animate-pulse shadow-sm">
      <div className="w-full md:w-[280px] h-[220px] bg-slate-200 rounded-2xl flex-shrink-0"></div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="flex gap-2 mb-3">
            <div className="h-6 bg-slate-200 rounded w-16"></div>
            <div className="h-6 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-4 md:mt-0">
          <div className="space-y-2 w-1/3">
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            <div className="h-7 bg-slate-200 rounded w-full"></div>
          </div>
          <div className="h-10 bg-slate-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
}

// Map database amenities text into clean representations
function getAmenityLabel(amenity: string) {
  const name = amenity.trim().toLowerCase();
  if (name.includes('wifi') || name.includes('internet')) return 'wifi';
  if (name.includes('ac') || name.includes('air condition')) return 'ac';
  if (name.includes('parking')) return 'parking';
  if (name.includes('pool') || name.includes('swimming')) return 'swimming pool';
  if (name.includes('gym') || name.includes('fitness')) return 'gym';
  if (name.includes('restaurant') || name.includes('food') || name.includes('dining')) return 'restaurant';
  if (name.includes('room service')) return 'room service';
  if (name.includes('bar')) return 'bar';
  if (name.includes('spa')) return 'spa';
  return name;
}

// Format Location Breadcrumb: Srinagar > Dal Lake > Boulevard Road
const formatLocationBreadcrumb = (loc: string, city: string) => {
  const cleanCity = city || 'Kashmir';
  const parts = [cleanCity];
  if (loc) {
    const locParts = loc.split(',').map(p => p.trim());
    locParts.forEach(p => {
      if (p.toLowerCase() !== cleanCity.toLowerCase() && !parts.includes(p)) {
        parts.push(p);
      }
    });
  }
  return parts.slice(0, 3).join(' > ');
};

// Format Date to dd/mm/yyyy
const formatDateMockup = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Price Brackets definition matching the screenshot
const priceRanges = [
  { label: '₹ 1 - ₹ 2,000', min: 1, max: 2000 },
  { label: '₹ 2,001 - ₹ 4,000', min: 2001, max: 4000 },
  { label: '₹ 4,001 - ₹ 8,000', min: 4001, max: 8000 },
  { label: '₹ 8,001 - ₹ 20,000', min: 8001, max: 20000 },
  { label: '₹ 20,001 - ₹ 30,000', min: 20001, max: 30000 },
  { label: 'Above ₹ 30,000', min: 30001, max: 999999 },
];

interface ListingHotelCardProps {
  hotel: Hotel;
  detailsQuery: string;
}

function ListingHotelCard({ hotel, detailsQuery }: ListingHotelCardProps) {
  // Real, admin-uploaded photos (from the hotel's gallery, or its featured
  // image when no gallery has been added yet). Only falls back to a generic
  // stock photo if the hotel genuinely has no image at all in the DB.
  const rotatedImages = hotel.gallery && hotel.gallery.length > 0
    ? hotel.gallery.map((g) => (g.startsWith('http') ? g : `/${g.replace(/^\.\.\//, '')}`))
    : hotel.featured_image
      ? [`/${hotel.featured_image.replace(/^\.\.\//, '')}`]
      : ['/images/hotels/hotel_exterior_1.png'];

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? rotatedImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === rotatedImages.length - 1 ? 0 : prev + 1));
  };

  const starCount = Math.floor(hotel.star_rating || 3);
  const amenities = hotel.amenities ? hotel.amenities.split(',').slice(0, 5) : [];

  return (
    <div 
      className="group bg-white rounded-3xl border border-slate-150 p-2 shadow-sm hover:shadow-md transition duration-300 flex flex-col md:flex-row gap-4 relative w-full"
      style={{ marginBottom: '10px' }}
    >
      {/* 1. Left Column: Image swiper */}
      <div className="w-full md:w-[240px] h-[200px] md:h-[190px] bg-slate-100 rounded-2xl overflow-hidden relative flex-shrink-0">
        <Image 
          src={rotatedImages[activeImgIdx]} 
          alt={hotel.name ? hotel.name.replaceAll('&amp;', '&') : ''}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          unoptimized
        />
        {/* Navigation arrows + dots — only when the hotel actually has more than one real photo */}
        {rotatedImages.length > 1 && (
          <>
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              <button
                type="button"
                onClick={handlePrevImage}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition pointer-events-auto cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition pointer-events-auto cursor-pointer"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
              {rotatedImages.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${dotIdx === activeImgIdx ? 'bg-white' : 'bg-white/40'}`}
                ></span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. Middle Column: Info Details */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0 pr-0 md:pr-4">
        <div className="min-w-0">
          {/* Star Rating indicator */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-amber-500 text-[10px] flex gap-0.5">
              {Array.from({ length: starCount }).map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </span>
          </div>

          {/* Green Indicator Pill next to Hotel Name (Mockup specific) */}
          <h3 className="font-extrabold mb-1 leading-tight flex items-center gap-1.5 min-w-0">
            <span className="inline-block w-1 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
            <Link 
              href={`/hotels-details/${hotel.slug}${detailsQuery}`}
              className="hover:text-[#ff8126] transition truncate no-underline"
              style={{ 
                textDecoration: 'none', 
                fontSize: '15px', 
                fontWeight: 'bold',
                color: '#094074' 
              }}
            >
              {hotel.name ? hotel.name.replaceAll('&amp;', '&') : ''}
            </Link>
          </h3>

          {/* Breadcrumb Area links (City > Area) */}
          <div className="text-[11px] text-blue-500 font-bold mb-1.5 truncate">
            <span className="hover:underline cursor-pointer">{formatLocationBreadcrumb(hotel.location, hotel.city)}</span>
          </div>

          {/* Landmark Distance indicator */}
          <p className="text-[11px] text-slate-400 font-bold mb-3 truncate">
            <i className="fa-solid fa-location-dot text-slate-400 mr-1"></i>
            0.5 Km From center of {hotel.city}
          </p>

          {/* couple & kids badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="px-2 py-0.5 border border-slate-200 rounded-md text-[9px] font-black text-slate-550 uppercase tracking-wide bg-slate-50/50">
              Couple Friendly
            </span>
            <span className="px-2 py-0.5 border border-slate-200 rounded-md text-[9px] font-black text-slate-555 uppercase tracking-wide bg-slate-50/50">
              Free wifi
            </span>
          </div>

          {/* Amenities summary bullet path */}
          {amenities.length > 0 && (
            <p className="text-[10px] text-slate-500 font-bold leading-normal truncate">
              {amenities.map((am, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-slate-300 mx-1 font-normal">&bull;</span>}
                  <span>{getAmenityLabel(am)}</span>
                </span>
              ))}
              {hotel.amenities && hotel.amenities.split(',').length > 5 && (
                <span className="text-[#ff8126] font-extrabold ml-1">
                  <span className="text-slate-300 mx-1 font-normal">&bull;</span>+ {hotel.amenities.split(',').length - 5} More
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* 3. Right Column: Price / CTA */}
      <div className="w-full md:w-44 flex flex-col justify-end items-end border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 flex-shrink-0">

        {/* Pricing & CTA block */}
        <div className="text-end w-full mt-4 md:mt-0 flex flex-col items-end">

          {/* Main price */}
          <div className="text-2xl font-black text-slate-900 leading-none">
            ₹{(Number(hotel.price_per_night) || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-1">
            / night
          </div>

          {/* CTA button (Pill shaped, orange) */}
          <Link
            href={`/hotels-details/${hotel.slug}${detailsQuery}`}
            className="mt-3.5 w-[120px] ml-auto bg-[#ff8126] hover:bg-orange-600 text-white font-black text-xs uppercase rounded-full tracking-wider transition text-center block no-underline hover:no-underline"
            style={{ textDecoration: 'none', paddingTop: '10px', paddingBottom: '10px' }}
          >
            View Rooms
          </Link>
        </div>

      </div>
    </div>
  );
}

function HotelListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters
  const location = searchParams.get('location') || 'Srinagar';
  const checkIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const checkOut = searchParams.get('checkOut') || (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  })();
  const roomsRaw = searchParams.get('rooms') || '[{"adults":2,"children":0,"childAges":[]}]';

  const rooms = useMemo(() => {
    try {
      const parsed = JSON.parse(roomsRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((r: { adults: number; children: number; childAges?: number[] }) => ({
          adults: r.adults,
          children: r.children,
          childAges: Array.isArray(r.childAges) ? r.childAges : [],
        }));
      }
      return [{ adults: 2, children: 0, childAges: [] }];
    } catch (e) {
      return [{ adults: 2, children: 0, childAges: [] }];
    }
  }, [roomsRaw]);

  const totalGuests = rooms.reduce((acc: number, curr: { adults: number; children: number }) => acc + curr.adults + curr.children, 0);

  // Carries the searched dates + guest/child-age configuration forward to the
  // hotel details page so room prices there can auto-apply extra bed / CNB charges.
  const detailsQuery = `?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&rooms=${encodeURIComponent(roomsRaw)}`;

  // Interactive Search States (matching HotelSearchHero logic)
  const [searchLocation, setSearchLocation] = useState(location);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [checkInDate, setCheckInDate] = useState(checkIn);
  const [checkOutDate, setCheckOutDate] = useState(checkOut);
  const [roomsList, setRoomsList] = useState<{ adults: number; children: number; childAges: number[] }[]>(rooms);

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const locationPickerRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const checkInInputRef = useRef<HTMLInputElement>(null);
  const checkOutInputRef = useRef<HTMLInputElement>(null);

  // Sync search states when URL parameters change
  useEffect(() => {
    setSearchLocation(location);
    setSelectedLocation(location);
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    setRoomsList(rooms);
  }, [location, checkIn, checkOut, rooms]);

  const totalRoomsListGuests = roomsList.reduce((acc, r) => acc + r.adults + r.children, 0);

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: '--', monthYear: '---', weekday: '---' };
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthYear = `${months[date.getMonth()]}'${date.getFullYear()}`;
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return { day, monthYear, weekday: weekdays[date.getDay()] };
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDateString = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

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
        const list = [...roomsList];
        list[index].adults = 3;
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

    if (type === 'children') {
      const ages = [...(list[index].childAges || [])];
      while (ages.length < list[index].children) ages.push(5);
      while (ages.length > list[index].children) ages.pop();
      list[index].childAges = ages;
    }

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

  // States
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Filter & Sort States
  const [hotelSearchInput, setHotelSearchInput] = useState('');
  const [lowestPriceGuarantee, setLowestPriceGuarantee] = useState(false);
  const [lastMinuteDeals, setLastMinuteDeals] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [starRatings, setStarRatings] = useState<number[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedHotelChains, setSelectedHotelChains] = useState<string[]>([]);
  const [showAllPropertyTypes, setShowAllPropertyTypes] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Promo banner — admin-controlled via Admin Panel → Sliders / Offers
  // (Slider Position = "Hotels Page"). Shows the first active one, if any.
  interface PromoBanner {
    title?: string;
    subtitle?: string;
    image: string;
    button_text?: string;
    button_link?: string;
  }
  const [promoBanner, setPromoBanner] = useState<PromoBanner | null>(null);

  // Mobile Bottom Sheet toggle states
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Auto-suggest suggestions sync
  const uniqueDbLocations = Array.from(
    new Set(hotels.map(hotelSearchLocation).filter(Boolean))
  );

  const matchedLocations = uniqueDbLocations.filter((loc) =>
    loc.toLowerCase().includes(searchLocation.trim().toLowerCase())
  );
  const matchedHotels = hotels.filter((h) =>
    h.name.toLowerCase().includes(searchLocation.trim().toLowerCase())
  );

  const searchLocationRef = useRef(searchLocation);
  const selectedLocationRef = useRef(selectedLocation);
  const showLocationPickerRef = useRef(showLocationPicker);
  const hotelsRef = useRef(hotels);

  useEffect(() => {
    searchLocationRef.current = searchLocation;
    selectedLocationRef.current = selectedLocation;
    showLocationPickerRef.current = showLocationPicker;
    hotelsRef.current = hotels;
  });

  const validateAndSnapLocation = () => {
    const currentSearch = searchLocationRef.current.trim();
    const currentSelected = selectedLocationRef.current;
    const currentHotels = hotelsRef.current;

    if (!currentSearch) {
      setSearchLocation(currentSelected);
      return;
    }
    const uniqueDbLocs = Array.from(
      new Set(currentHotels.map(hotelSearchLocation).filter(Boolean))
    );
    const matchedLoc = uniqueDbLocs.find(
      (loc) => loc.toLowerCase() === currentSearch.toLowerCase()
    );
    if (matchedLoc) {
      setSearchLocation(matchedLoc);
      setSelectedLocation(matchedLoc);
      return;
    }
    const matchedH = currentHotels.find(
      (h) => h.name.toLowerCase() === currentSearch.toLowerCase()
    );
    if (matchedH) {
      setSearchLocation(matchedH.name);
      setSelectedLocation(hotelSearchLocation(matchedH));
      return;
    }
    const queryLower = currentSearch.toLowerCase();
    const matchedL = uniqueDbLocs.filter((loc) =>
      loc.toLowerCase().includes(queryLower)
    );
    const matchedHot = currentHotels.filter((h) =>
      h.name.toLowerCase().includes(queryLower)
    );
    if (matchedL.length > 0) {
      setSearchLocation(matchedL[0]);
      setSelectedLocation(matchedL[0]);
    } else if (matchedHot.length > 0) {
      setSearchLocation(matchedHot[0].name);
      setSelectedLocation(hotelSearchLocation(matchedHot[0]));
    } else {
      setSearchLocation(currentSelected);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationPickerRef.current && !locationPickerRef.current.contains(event.target as Node)) {
        if (showLocationPickerRef.current) {
          setShowLocationPicker(false);
          validateAndSnapLocation();
        }
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      location: selectedLocation,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      rooms: JSON.stringify(roomsList)
    });
    router.push(`/hotel/list?${queryParams.toString()}`);
  };

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    const urlPriceRanges = searchParams.get('priceRanges');
    const urlStars = searchParams.get('starRatings');
    const urlSort = searchParams.get('sort');
    const urlLowest = searchParams.get('lowestPrice');
    const urlLast = searchParams.get('lastMinute');
    const urlSearchInput = searchParams.get('searchName');
    const urlPage = searchParams.get('page');

    if (urlPriceRanges) setSelectedPriceRanges(urlPriceRanges.split(',').map(Number));
    if (urlStars) setStarRatings(urlStars.split(',').map(Number));
    if (urlSort) setSortBy(urlSort);
    if (urlLowest) setLowestPriceGuarantee(urlLowest === 'true');
    if (urlLast) setLastMinuteDeals(urlLast === 'true');
    if (urlSearchInput) setHotelSearchInput(urlSearchInput);
    if (urlPage) setCurrentPage(Number(urlPage));
  }, [searchParams]);

  // Fetch hotels matching location
  const fetchHotels = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/hotels.php?location=${encodeURIComponent(location)}`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      if (data.status === 'success') {
        setHotels(data.data || []);
      } else {
        throw new Error(data.message || 'API error');
      }
    } catch (err) {
      console.error('Fetch hotels error:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [location]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/sliders.php?position=hotels`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
          setPromoBanner(data.data[0]);
        }
      })
      .catch((err) => console.error('Error fetching hotel promo banner:', err));
  }, []);

  // Dynamically calculate filter counts based on the loaded hotels list from backend
  const filterCounts = useMemo(() => {
    const counts = {
      star5: 0,
      star4: 0,
      star3: 0,
      propHotel: 0,
      propInn: 0,
      propResort: 0,
      propPalace: 0,
      propLodge: 0,
      chainLalit: 0,
      chainHyatt: 0,
      chainTreebo: 0,
      chainFab: 0,
      chainOyo: 0,
    };

    hotels.forEach((h) => {
      const rating = Math.floor(h.star_rating || 3);
      if (rating === 5) counts.star5++;
      else if (rating === 4) counts.star4++;
      else if (rating === 3) counts.star3++;

      const nameLower = h.name.toLowerCase();
      if (nameLower.includes('resort') || nameLower.includes('retreat') || nameLower.includes('spa')) {
        counts.propResort++;
      } else if (nameLower.includes('inn')) {
        counts.propInn++;
      } else if (nameLower.includes('palace')) {
        counts.propPalace++;
      } else if (nameLower.includes('lodge')) {
        counts.propLodge++;
      } else {
        counts.propHotel++;
      }

      if (nameLower.includes('lalit')) counts.chainLalit++;
      if (nameLower.includes('hyatt')) counts.chainHyatt++;
      if (nameLower.includes('treebo')) counts.chainTreebo++;
      if (nameLower.includes('fabhotel') || nameLower.includes('fab')) counts.chainFab++;
      if (nameLower.includes('oyo')) counts.chainOyo++;
    });

    return counts;
  }, [hotels]);

  // Client Side Filtering & Sorting based on EaseMyTrip mockup
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    // Filter by name/location input search text
    if (hotelSearchInput.trim() !== '') {
      const query = hotelSearchInput.toLowerCase();
      result = result.filter(
        (h) => h.name.toLowerCase().includes(query) || hotelSearchLocation(h).toLowerCase().includes(query)
      );
    }

    // Filter by Price range brackets
    if (selectedPriceRanges.length > 0) {
      result = result.filter((h) => {
        return selectedPriceRanges.some((idx) => {
          const range = priceRanges[idx];
          return h.price_per_night >= range.min && h.price_per_night <= range.max;
        });
      });
    }

    // Filter by Star Rating
    if (starRatings.length > 0) {
      result = result.filter((h) => starRatings.includes(Math.floor(h.star_rating || 3)));
    }

    // Filter by Lowest Price Guarantee (simulate by rating >= 4 or featured)
    if (lowestPriceGuarantee) {
      result = result.filter((h) => (h.star_rating || 3) >= 4);
    }

    // Filter by Last Minute Deals (simulate by price <= 6000)
    if (lastMinuteDeals) {
      result = result.filter((h) => h.price_per_night <= 6000);
    }

    // Filter by Property Type (mock keywords match)
    if (selectedPropertyTypes.length > 0) {
      result = result.filter((h) => {
        return selectedPropertyTypes.some((type) => {
          const nameLower = h.name.toLowerCase();
          if (type === 'Hotel') return nameLower.includes('hotel') || (!nameLower.includes('resort') && !nameLower.includes('palace') && !nameLower.includes('inn') && !nameLower.includes('lodge'));
          if (type === 'Resort') return nameLower.includes('resort') || nameLower.includes('retreat') || nameLower.includes('spa');
          if (type === 'Inn') return nameLower.includes('inn');
          if (type === 'Palace') return nameLower.includes('palace');
          if (type === 'Lodge') return nameLower.includes('lodge');
          return false;
        });
      });
    }

    // Filter by Hotel Chain (mock keywords match)
    if (selectedHotelChains.length > 0) {
      result = result.filter((h) => {
        return selectedHotelChains.some((chain) => {
          const nameLower = h.name.toLowerCase();
          if (chain === 'The Lalit Hotels') return nameLower.includes('lalit');
          if (chain === 'Hyatt Hotels & Resorts') return nameLower.includes('hyatt');
          if (chain === 'Treebo Hotels') return nameLower.includes('treebo');
          if (chain === 'Fabhotels') return nameLower.includes('fabhotel') || nameLower.includes('fab');
          if (chain === 'Oyo') return nameLower.includes('oyo');
          return false;
        });
      });
    }

    // Sorting logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price_per_night - a.price_per_night);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.star_rating || 3) - (a.star_rating || 3));
    }

    return result;
  }, [hotels, hotelSearchInput, selectedPriceRanges, starRatings, lowestPriceGuarantee, lastMinuteDeals, selectedPropertyTypes, selectedHotelChains, sortBy]);

  // Sync state back to URL query parameters on filter/pagination changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('location', location);
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    params.set('rooms', JSON.stringify(rooms));

    if (selectedPriceRanges.length > 0) params.set('priceRanges', selectedPriceRanges.join(','));
    if (starRatings.length > 0) params.set('starRatings', starRatings.join(','));
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    if (lowestPriceGuarantee) params.set('lowestPrice', 'true');
    if (lastMinuteDeals) params.set('lastMinute', 'true');
    if (hotelSearchInput.trim() !== '') params.set('searchName', hotelSearchInput);
    if (currentPage > 1) params.set('page', String(currentPage));

    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [location, checkIn, checkOut, rooms, selectedPriceRanges, starRatings, lowestPriceGuarantee, lastMinuteDeals, hotelSearchInput, sortBy, currentPage]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedPriceRanges([]);
    setStarRatings([]);
    setSelectedPropertyTypes([]);
    setSelectedHotelChains([]);
    setShowAllPropertyTypes(false);
    setSortBy('relevance');
    setLowestPriceGuarantee(false);
    setLastMinuteDeals(false);
    setHotelSearchInput('');
    setCurrentPage(1);
  };

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleHotelChain = (chain: string) => {
    setSelectedHotelChains((prev) =>
      prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]
    );
    setCurrentPage(1);
  };

  const togglePriceRange = (index: number) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setCurrentPage(1);
  };

  const toggleStarRating = (star: number) => {
    setStarRatings((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
    setCurrentPage(1);
  };

  // Pagination details
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#f5f6f9] min-h-screen text-slate-800 pb-16" style={{ paddingTop: '56px' }}>
      
      {/* 1. Sky Blue / Dark Blue Gradient Horizontal Search Bar summary (Exact Mockup) */}
      <div 
        className="text-white py-3 px-4 shadow-md sticky top-[56px] z-40 border-b border-white/10"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', marginBottom: '24px' }}
      >
        <form onSubmit={handleSearchSubmit}>
          <div className="w-full mx-auto flex flex-col lg:flex-row items-center gap-3" style={{ maxWidth: '1140px', marginLeft: 'auto', marginRight: 'auto' }}>
            
            {/* Main search form inputs aligned in a row */}
            <div className="flex-1 w-full grid grid-cols-2 lg:flex lg:flex-row gap-2.5">
              
              {/* Destination Search Box */}
              <div 
                ref={locationPickerRef}
                className="bg-white rounded-lg px-3 py-1 flex justify-between items-center text-slate-700 w-full lg:flex-[2.2] lg:min-w-[200px] relative cursor-pointer"
                onClick={() => setShowLocationPicker(true)}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase leading-tight">City name, Location or Specific hotel</span>
                  <input
                    type="text"
                    className="block w-full bg-transparent border-0 p-0 font-extrabold text-xs text-slate-800 focus:outline-none focus:ring-0 leading-tight mt-0.5"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLocationPicker(true);
                    }}
                    placeholder="Search city, area or hotel..."
                  />
                </div>
                <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs ml-2 flex-shrink-0"></i>

                {showLocationPicker && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl p-3 border border-slate-200 z-50 min-w-[280px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {matchedLocations.map((loc) => (
                        <div 
                          key={loc}
                          className="px-2 py-1.5 rounded-lg hover:bg-slate-50 font-bold text-[11px] text-slate-700 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSearchLocation(loc);
                            setSelectedLocation(loc);
                            setShowLocationPicker(false);
                          }}
                        >
                          <i className="fa-solid fa-location-dot text-[#ff8126] text-xs"></i>
                          <div className="flex flex-col">
                            <span>{loc}</span>
                            <span className="text-[9px] text-slate-400 font-medium">city</span>
                          </div>
                        </div>
                      ))}
                      {matchedHotels.map((h) => (
                        <div 
                          key={h.id}
                          className="px-2 py-1.5 rounded-lg hover:bg-slate-50 font-bold text-[11px] text-slate-700 cursor-pointer flex items-center gap-2"
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
                        <span className="text-[10px] text-slate-400 block p-2">No matches found.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Check-In */}
              <div 
                className="bg-white rounded-lg px-3 py-1 flex justify-between items-center text-slate-700 w-full lg:flex-[1.2] lg:min-w-[120px] relative cursor-pointer"
                onClick={() => checkInInputRef.current?.showPicker()}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base font-black text-[#ff8126] leading-none tracking-tight">
                    {formatDateDisplay(checkInDate).day}
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-0.5">Check-In</span>
                    <span className="font-extrabold text-[9px] text-slate-800 uppercase leading-none">
                      {formatDateDisplay(checkInDate).monthYear}
                    </span>
                  </div>
                </div>
                <i className="fa-regular fa-calendar text-slate-400 text-xs ml-2 flex-shrink-0"></i>
                <input 
                  ref={checkInInputRef}
                  type="date"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={checkInDate}
                  min={formatDateString(today)}
                  onChange={(e) => {
                    setCheckInDate(e.target.value);
                    const ci = new Date(e.target.value);
                    const co = new Date(checkOutDate);
                    if (co <= ci) {
                      const nextDay = new Date(ci);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setCheckOutDate(formatDateString(nextDay));
                    }
                  }}
                />
              </div>

              {/* Check-Out */}
              <div 
                className="bg-white rounded-lg px-3 py-1 flex justify-between items-center text-slate-700 w-full lg:flex-[1.2] lg:min-w-[120px] relative cursor-pointer"
                onClick={() => checkOutInputRef.current?.showPicker()}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base font-black text-[#ff8126] leading-none tracking-tight">
                    {formatDateDisplay(checkOutDate).day}
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] text-slate-400 font-bold uppercase leading-none mb-0.5">Check-Out</span>
                    <span className="font-extrabold text-[9px] text-slate-800 uppercase leading-none">
                      {formatDateDisplay(checkOutDate).monthYear}
                    </span>
                  </div>
                </div>
                <i className="fa-regular fa-calendar text-slate-400 text-xs ml-2 flex-shrink-0"></i>
                <input 
                  ref={checkOutInputRef}
                  type="date"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={checkOutDate}
                  min={checkInDate ? formatDateString(new Date(new Date(checkInDate).getTime() + 86400000)) : formatDateString(tomorrow)}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>

              {/* Rooms & Guests */}
              <div 
                className="bg-white rounded-lg px-3 py-1 flex justify-between items-center text-slate-700 w-full lg:flex-[1.8] lg:min-w-[160px] relative cursor-pointer"
                onClick={() => setShowGuestPicker(!showGuestPicker)}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase leading-tight">Rooms/Guests</span>
                  <span className="block font-black text-xs truncate text-slate-800 leading-tight mt-0.5">
                    {roomsList.length} Room, {totalRoomsListGuests} Guests
                  </span>
                </div>
                <i className="fa-solid fa-chevron-down text-slate-400 text-xs ml-2 flex-shrink-0"></i>

                {showGuestPicker && (
                  <div 
                    ref={guestPickerRef}
                    className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl p-4 border border-slate-200 z-50 min-w-[280px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="max-h-60 overflow-y-auto space-y-3.5 pr-1">
                      {roomsList.map((room, idx) => (
                        <div className="border-b last:border-b-0 pb-3 last:pb-0" key={idx}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-extrabold text-[11px] text-slate-700">Room {idx + 1}:</span>
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
                              <div className="font-bold text-[11px] text-slate-800">Adult</div>
                              <div className="text-[9px] text-slate-400 font-bold">(Above 12 years)</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                className="w-7 h-7 rounded border border-slate-250 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                disabled={room.adults <= 1}
                                onClick={() => handleUpdateRoomCount(idx, 'adults', room.adults - 1)}
                              >
                                -
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{room.adults}</span>
                              <button 
                                type="button" 
                                className="w-7 h-7 rounded border border-slate-250 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                onClick={() => handleUpdateRoomCount(idx, 'adults', room.adults + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold text-[11px] text-slate-800">Child</div>
                              <div className="text-[9px] text-slate-400 font-bold">(Below 12 years)</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                className="w-7 h-7 rounded border border-slate-250 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
                                disabled={room.children <= 0}
                                onClick={() => handleUpdateRoomCount(idx, 'children', room.children - 1)}
                              >
                                -
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{room.children}</span>
                              <button
                                type="button"
                                className="w-7 h-7 rounded border border-slate-250 flex items-center justify-center font-extrabold text-slate-650 hover:bg-slate-100"
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
                                  <span className="text-[10px] font-bold text-slate-400">Age of Child {cIdx + 1}</span>
                                  <select
                                    className="border border-slate-250 rounded text-[11px] font-bold px-1.5 py-1"
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

                    <div className="mt-3 pt-2.5 border-t border-slate-150 flex justify-between items-center">
                      <button
                        type="button"
                        className="text-[#ff8126] hover:text-[#e6701b] font-extrabold text-[10px] uppercase tracking-wider"
                        onClick={handleAddRoom}
                      >
                        + Add Room
                      </button>
                      <button
                        type="button"
                        className="bg-[#ff8126] hover:bg-[#e6701b] text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider"
                        onClick={() => setShowGuestPicker(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modify Search button */}
            <button 
              type="submit" 
              className="w-full lg:w-auto text-white font-extrabold text-xs tracking-wider transition-all duration-200 uppercase text-center cursor-pointer flex-shrink-0 flex items-center justify-center gap-2 border-0 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #ff8126 0%, #ff5e00 100%)',
                padding: '10px 28px',
                borderRadius: '10px',
                boxShadow: 'none',
              }}
            >
              <span>Modify Search</span>
            </button>

          </div>
        </form>
      </div>

      <div className="w-full mx-auto px-4 mt-6" style={{ maxWidth: '1140px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* 2. Left Sidebar (Filters) */}
          <div 
            className="hidden lg:block w-[280px] flex-shrink-0 lg:border-r lg:border-[#008cff]/80 thin-scrollbar"
            style={{ 
              paddingLeft: '10px', 
              paddingRight: '10px',
              position: 'sticky',
              top: '128px',
              maxHeight: 'calc(100vh - 148px)',
              overflowY: 'auto',
              overscrollBehavior: 'contain'
            }}
          >
            

            {/* Filters panel */}
            <div 
              className="bg-white rounded-2xl border border-slate-100 py-5 shadow-sm"
              style={{ paddingLeft: '10px', paddingRight: '10px' }}
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <span className="font-extrabold text-sm text-slate-800">Filters</span>
                <button 
                  type="button" 
                  onClick={handleResetFilters} 
                  className="text-xs font-bold text-blue-500 hover:underline focus:outline-none"
                >
                  Reset
                </button>
              </div>

              {/* Toggles: Lowest Price Guarantee & Last Minute Deals */}
              <div className="space-y-4 mb-6">
                
                {/* Lowest Price Guarantee */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 leading-tight">Lowest Price Guarantee</span>
                      <span className="block text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">Hotels cheaper than anywhere</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLowestPriceGuarantee(!lowestPriceGuarantee);
                      setCurrentPage(1);
                    }}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${lowestPriceGuarantee ? 'bg-[#ff8126]' : 'bg-slate-200'}`}
                    style={{ borderRadius: '9999px', boxShadow: 'none' }}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform bg-white ring-0 transition duration-200 ease-in-out ${lowestPriceGuarantee ? 'translate-x-5' : 'translate-x-0'}`}
                      style={{ borderRadius: '9999px', boxShadow: 'none' }}
                    />
                  </button>
                </div>

                {/* Last Minute Deals */}
                <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 text-sm">
                      <i className="fa-solid fa-hourglass-half"></i>
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 leading-tight">Last Minute Deals</span>
                      <span className="block text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">Upto 60% off</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLastMinuteDeals(!lastMinuteDeals);
                      setCurrentPage(1);
                    }}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${lastMinuteDeals ? 'bg-[#ff8126]' : 'bg-slate-200'}`}
                    style={{ borderRadius: '9999px', boxShadow: 'none' }}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform bg-white ring-0 transition duration-200 ease-in-out ${lastMinuteDeals ? 'translate-x-5' : 'translate-x-0'}`}
                      style={{ borderRadius: '9999px', boxShadow: 'none' }}
                    />
                  </button>
                </div>

              {/* Price Filter range checkboxes (Exact Brackets) */}
              <div className="mb-6 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-900 mb-4 select-none" style={{ fontSize: '16px', fontWeight: 'bold' }}>Price</h4>
                <div className="space-y-3.5">
                  {priceRanges.map((range, idx) => {
                    const isChecked = selectedPriceRanges.includes(idx);
                    return (
                      <div 
                        key={idx} 
                        onClick={() => togglePriceRange(idx)}
                        className="flex items-center gap-3.5 cursor-pointer select-none group w-full"
                      >
                        <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                          {isChecked && <i className="fa-solid fa-check text-[10px] font-bold"></i>}
                        </div>
                        <span className="text-slate-800 leading-normal" style={{ fontSize: '13px', fontWeight: 'normal' }}>{range.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Star rating filter */}
              <div className="mb-2 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-900 mb-4 select-none" style={{ fontSize: '16px', fontWeight: 'bold' }}>Star Rating</h4>
                <div className="space-y-3.5">
                  {[5, 4, 3].map((star) => {
                    const isChecked = starRatings.includes(star);
                    const count = star === 5 ? filterCounts.star5 : star === 4 ? filterCounts.star4 : filterCounts.star3;
                    return (
                      <div 
                        key={star} 
                        onClick={() => toggleStarRating(star)}
                        className="flex items-center justify-between cursor-pointer select-none group w-full"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                            {isChecked && <i className="fa-solid fa-check text-[10px] font-bold"></i>}
                          </div>
                          <span className="text-slate-800 leading-normal" style={{ fontSize: '13px', fontWeight: 'normal' }}>{star} Star</span>
                        </div>
                        <span className="text-slate-400 leading-normal mr-1" style={{ fontSize: '13px', fontWeight: 'normal' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Property Type Filter */}
              <div className="mb-6 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-900 mb-4 select-none" style={{ fontSize: '16px', fontWeight: 'bold' }}>Property Type</h4>
                <div className="space-y-3.5">
                  {[
                    { label: 'Hotel', count: filterCounts.propHotel },
                    { label: 'Inn', count: filterCounts.propInn },
                    { label: 'Resort', count: filterCounts.propResort },
                    { label: 'Palace', count: filterCounts.propPalace },
                    { label: 'Lodge', count: filterCounts.propLodge },
                    { label: 'Homestay', count: 12 },
                    { label: 'Guest House', count: 8 },
                    { label: 'Villa', count: 6 },
                    { label: 'Cottage', count: 5 },
                    { label: 'Camp', count: 4 },
                    { label: 'Hostel', count: 3 },
                    { label: 'Boat', count: 2 },
                    { label: 'Apartment', count: 7 },
                    { label: 'Farm House', count: 1 },
                    { label: 'Treehouse', count: 2 },
                    { label: 'Tent', count: 3 },
                    { label: 'Chalet', count: 1 },
                    { label: 'Mansion', count: 1 }
                  ].slice(0, showAllPropertyTypes ? 18 : 5).map((item) => {
                    const isChecked = selectedPropertyTypes.includes(item.label);
                    return (
                      <div 
                        key={item.label} 
                        onClick={() => togglePropertyType(item.label)}
                        className="flex items-center justify-between cursor-pointer select-none group w-full"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                            {isChecked && <i className="fa-solid fa-check text-[10px] font-bold"></i>}
                          </div>
                          <span className="text-slate-800 leading-normal" style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.label}</span>
                        </div>
                        <span className="text-slate-400 leading-normal mr-1" style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.count}</span>
                      </div>
                    );
                  })}
                </div>
                <div 
                  onClick={() => setShowAllPropertyTypes(!showAllPropertyTypes)}
                  className="text-blue-500 text-[13px] font-semibold cursor-pointer hover:underline mt-4 inline-block select-none"
                >
                  {showAllPropertyTypes ? 'Show Less' : 'Show 13 more'}
                </div>
              </div>

              {/* Hotel Chain Filter */}
              <div className="mb-2 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-900 mb-4 select-none" style={{ fontSize: '16px', fontWeight: 'bold' }}>Hotel Chain</h4>
                <div className="space-y-3.5">
                  {[
                    { label: 'The Lalit Hotels', count: filterCounts.chainLalit },
                    { label: 'Hyatt Hotels & Resorts', count: filterCounts.chainHyatt },
                    { label: 'Treebo Hotels', count: filterCounts.chainTreebo },
                    { label: 'Fabhotels', count: filterCounts.chainFab },
                    { label: 'Oyo', count: filterCounts.chainOyo }
                  ].map((item) => {
                    const isChecked = selectedHotelChains.includes(item.label);
                    return (
                      <div 
                        key={item.label} 
                        onClick={() => toggleHotelChain(item.label)}
                        className="flex items-center justify-between cursor-pointer select-none group w-full"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-[18px] h-[18px] rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${isChecked ? 'bg-[#ff8126] border-[#ff8126] text-white' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                            {isChecked && <i className="fa-solid fa-check text-[10px] font-bold"></i>}
                          </div>
                          <span className="text-slate-800 leading-normal" style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.label}</span>
                        </div>
                        <span className="text-slate-400 leading-normal mr-1" style={{ fontSize: '13px', fontWeight: 'normal' }}>{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            </div>
          </div>

          {/* 3. Listings Column */}
          <div className="flex-1 min-w-0">
            
            {/* Stats Panel & Sort Dropdown */}
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-2">
                <div ref={sortDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="border border-slate-200 text-xs font-normal text-slate-700 bg-white focus:outline-none cursor-pointer transition flex items-center gap-1.5 select-none animate-fade-in"
                    style={{ borderRadius: '7px', boxShadow: 'none', padding: '5px 12px' }}
                  >
                    <span>
                      {sortBy === 'relevance' && 'Popularity'}
                      {sortBy === 'price-asc' && 'Price: Low to High'}
                      {sortBy === 'price-desc' && 'Price: High to Low'}
                      {sortBy === 'rating' && 'Rating: High to Low'}
                    </span>
                    <i className={`fa-solid fa-chevron-down text-[9px] text-slate-400 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`}></i>
                  </button>

                  {showSortDropdown && (
                    <div 
                      className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 py-1.5 z-40"
                      style={{ borderRadius: '7px', boxShadow: 'none' }}
                    >
                      {[
                        { value: 'relevance', label: 'Popularity' },
                        { value: 'price-asc', label: 'Price: Low to High' },
                        { value: 'price-desc', label: 'Price: High to Low' },
                        { value: 'rating', label: 'Rating: High to Low' },
                      ].map((item) => (
                        <div
                          key={item.value}
                          onClick={() => {
                            setSortBy(item.value);
                            setCurrentPage(1);
                            setShowSortDropdown(false);
                          }}
                          className={`px-3 py-2 text-xs font-normal cursor-pointer transition flex items-center justify-between ${
                            sortBy === item.value 
                              ? 'text-[#ff8126] bg-orange-50/30' 
                              : 'text-slate-650 hover:bg-slate-50'
                          }`}
                        >
                          <span>{item.label}</span>
                          {sortBy === item.value && (
                            <i className="fa-solid fa-check text-[#ff8126] text-[10px]"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Promo Banner — admin-controlled (Admin Panel → Sliders / Offers → Slider Position: "Hotels Page") */}
            {promoBanner && (
              <a
                href={promoBanner.button_link || undefined}
                className="mb-4 rounded-2xl overflow-hidden relative w-full block"
                style={{ minHeight: '90px', textDecoration: 'none' }}
              >
                <img
                  src={promoBanner.image.startsWith('http') ? promoBanner.image : `/${promoBanner.image.replace(/^\.\.\//, '')}`}
                  alt={promoBanner.title || 'Special offer'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(9,64,116,0.92) 0%, rgba(21,123,176,0.8) 100%)' }}
                ></div>
                <div className="relative p-4 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    {promoBanner.title && (
                      <h4 className="font-extrabold text-sm md:text-base leading-tight text-white">
                        {promoBanner.title}
                      </h4>
                    )}
                    {promoBanner.subtitle && (
                      <p className="text-[10px] md:text-xs opacity-90 mt-1 font-semibold text-slate-200">
                        {promoBanner.subtitle}
                      </p>
                    )}
                  </div>
                  {promoBanner.button_text && (
                    <span
                      className="font-bold text-white flex-shrink-0"
                      style={{ background: '#ff8126', borderRadius: '999px', padding: '9px 20px', fontSize: '12px' }}
                    >
                      {promoBanner.button_text}
                    </span>
                  )}
                </div>
              </a>
            )}

            {/* Main Listings Stream */}
            {isLoading ? (
              <div>
                <HotelCardSkeleton />
                <HotelCardSkeleton />
                <HotelCardSkeleton />
              </div>
            ) : isError ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm my-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">Failed to Fetch Hotels</h3>
                <p className="text-slate-400 text-xs font-bold max-w-sm mx-auto mb-5 leading-normal">
                  We encountered an error connecting to our database server. Please check your connection and try again.
                </p>
                <button 
                  type="button" 
                  onClick={fetchHotels} 
                  className="bg-[#ff8126] hover:bg-orange-650 text-white font-black text-xs uppercase px-6 py-3 rounded-xl tracking-wider transition focus:outline-none"
                >
                  Retry Search
                </button>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm my-6">
                <div className="w-16 h-16 bg-orange-50 text-[#ff8126] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fa-regular fa-calendar-times"></i>
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">No Hotels Match Filters</h3>
                <p className="text-slate-400 text-xs font-bold max-w-sm mx-auto mb-5 leading-normal">
                  Try adjusting your price brackets or modify filter toggles to search other nearby accommodations.
                </p>
                <button 
                  type="button" 
                  onClick={handleResetFilters} 
                  className="bg-[#ff8126] hover:bg-orange-655 text-white font-black text-xs uppercase px-6 py-3 rounded-xl tracking-wider transition focus:outline-none"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div>
                  {paginatedHotels.map((hotel) => (
                    <ListingHotelCard key={hotel.id} hotel={hotel} detailsQuery={detailsQuery} />
                  ))}
                </div>

                {/* 4. Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-8">
                    <button 
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
                    >
                      <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button 
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center transition border ${isActive ? 'bg-[#ff8126] border-[#ff8126] text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button 
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
                    >
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>

      {/* 5. Mobile Sticky Bottom Action Bar (hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl py-3 px-4 flex gap-4">
        <button 
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className="flex-1 py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-2 font-black text-xs text-slate-700 tracking-wider transition hover:bg-slate-50"
        >
          <i className="fa-solid fa-sliders text-[#ff8126]"></i>
          FILTERS
          {(starRatings.length > 0 || selectedPriceRanges.length > 0 || lowestPriceGuarantee || lastMinuteDeals || hotelSearchInput !== '') && (
            <span className="w-2 h-2 rounded-full bg-[#ff8126]"></span>
          )}
        </button>
        <button 
          type="button"
          onClick={() => setIsSortSheetOpen(true)}
          className="flex-1 py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-2 font-black text-xs text-slate-700 tracking-wider transition hover:bg-slate-50"
        >
          <i className="fa-solid fa-arrow-up-wide-short text-[#ff8126]"></i>
          SORT BY
        </button>
      </div>

      {/* 6. Mobile Filters Bottom Sheet Modal */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 flex flex-col justify-between transition-all duration-300">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-5">
                <span className="font-black text-sm text-slate-850 uppercase tracking-wide">Filters</span>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={handleResetFilters} 
                    className="text-xs font-bold text-[#ff8126]"
                  >
                    Reset
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsFilterSheetOpen(false)}
                    className="text-slate-400 hover:text-slate-650"
                  >
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
              </div>

              {/* Toggles: Lowest Price Guarantee & Last Minute Deals */}
              <div className="space-y-4 mb-6">
                
                {/* Lowest Price Guarantee */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 leading-tight">Lowest Price Guarantee</span>
                      <span className="block text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">Hotels cheaper than anywhere</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setLowestPriceGuarantee(!lowestPriceGuarantee);
                      setCurrentPage(1);
                    }}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${lowestPriceGuarantee ? 'bg-[#ff8126]' : 'bg-slate-200'}`}
                    style={{ borderRadius: '9999px', boxShadow: 'none' }}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform bg-white ring-0 transition duration-200 ease-in-out ${lowestPriceGuarantee ? 'translate-x-5' : 'translate-x-0'}`}
                      style={{ borderRadius: '9999px', boxShadow: 'none' }}
                    />
                  </button>
                </div>

                {/* Last Minute Deals */}
                <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 text-sm">
                      <i className="fa-solid fa-hourglass-half"></i>
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 leading-tight">Last Minute Deals</span>
                      <span className="block text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">Upto 60% off</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setLastMinuteDeals(!lastMinuteDeals);
                      setCurrentPage(1);
                    }}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${lastMinuteDeals ? 'bg-[#ff8126]' : 'bg-slate-200'}`}
                    style={{ borderRadius: '9999px', boxShadow: 'none' }}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform bg-white ring-0 transition duration-200 ease-in-out ${lastMinuteDeals ? 'translate-x-5' : 'translate-x-0'}`}
                      style={{ borderRadius: '9999px', boxShadow: 'none' }}
                    />
                  </button>
                </div>

              </div>

              {/* Price Filter range checkboxes */}
              <div className="mb-6 border-t border-slate-100 pt-4">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3">Price</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {priceRanges.map((range, idx) => (
                    <label key={idx} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-650 border border-slate-150 rounded-xl p-2.5 hover:bg-slate-50 transition">
                      <input 
                        type="checkbox" 
                        checked={selectedPriceRanges.includes(idx)}
                        onChange={() => togglePriceRange(idx)}
                        className="accent-[#ff8126] w-4 h-4 rounded"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Star rating filter */}
              <div className="mb-6 border-t border-slate-50 pt-4">
                <h4 className="font-extrabold text-xs text-slate-850 uppercase tracking-wider mb-3">Star Rating</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <label key={star} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-650 border border-slate-150 rounded-xl p-2.5 hover:bg-slate-50 transition">
                      <input 
                        type="checkbox" 
                        checked={starRatings.includes(star)}
                        onChange={() => toggleStarRating(star)}
                        className="accent-[#ff8126] w-4 h-4 rounded"
                      />
                      <span>{star} Star</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setIsFilterSheetOpen(false)}
              className="w-full bg-[#ff8126] hover:bg-orange-650 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider transition mt-4"
            >
              Apply & Show Results ({filteredHotels.length})
            </button>
          </div>
        </div>
      )}

      {/* 7. Mobile Sort Bottom Sheet Modal */}
      {isSortSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 transition-all duration-300">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <span className="font-black text-sm text-slate-850 uppercase tracking-wide">Sort Options</span>
              <button 
                type="button" 
                onClick={() => setIsSortSheetOpen(false)}
                className="text-slate-400 hover:text-slate-650"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-1">
              {[
                { value: 'relevance', label: 'Popularity' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'rating', label: 'Star Rating: High to Low' },
              ].map((opt) => (
                <button 
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.value);
                    setCurrentPage(1);
                    setIsSortSheetOpen(false);
                  }}
                  className={`w-full py-3.5 px-3 text-left font-extrabold text-xs rounded-xl flex items-center justify-between transition ${sortBy === opt.value ? 'bg-orange-50 text-[#ff8126]' : 'text-slate-655 hover:bg-slate-50'}`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.value && <i className="fa-solid fa-check text-xs"></i>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// 8. Default Suspense Export Page
export default function HotelListPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#f5f6f9] min-h-screen text-slate-800 pb-16 pt-[72px] overflow-x-hidden">
        <div className="bg-[#157bb0] py-3 px-4 shadow-md">
          <div className="w-full mx-auto px-4 flex items-center justify-between" style={{ maxWidth: '1140px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="h-6 bg-white/20 rounded w-1/3 animate-pulse"></div>
            <div className="h-10 bg-white/20 rounded w-28 animate-pulse"></div>
          </div>
        </div>
        <div className="w-full mx-auto px-4 mt-6" style={{ maxWidth: '1140px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="hidden lg:block w-[280px] h-96 bg-white border rounded-2xl animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-14 bg-white border rounded-2xl animate-pulse"></div>
              <HotelCardSkeleton />
              <HotelCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    }>
      <HotelListContent />
    </Suspense>
  );
}
