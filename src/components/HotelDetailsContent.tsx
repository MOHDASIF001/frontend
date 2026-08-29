'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useModals } from '../context/ModalContext';
import { API_BASE_URL } from '../config';
import { parseRoomsParam, totalExtraChargePerNight } from '../lib/occupancyPricing';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

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
  max_guests?: number;
}

interface HotelDetails {
  id: number;
  name: string;
  slug?: string;
  location: string;
  featured_image: string;
  price_per_night: number;
  star_rating?: number;
  description?: string;
  short_description?: string;
  amenities?: string;
  rooms?: Room[];
  gallery?: string[];
}

export function HotelDetailsContent({ initialId }: { initialId?: string } = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = searchParams.get('id');
  const id = queryId || initialId || null;
  const { openModal } = useModals();

  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [similarHotels, setSimilarHotels] = useState<HotelDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('rooms');
  const [selectedRoom, setSelectedRoom] = useState<{
    roomId: number;
    planType: 'room_only' | 'with_breakfast' | 'with_dinner';
    price: number;
    roomName: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      fetchHotelDetails(id);
    }
  }, [id]);

  useEffect(() => {
    // Legacy ?id= links (old bookmarks, external links) get normalized to the
    // canonical SEO-friendly /hotels-details/{slug} URL once we know the slug.
    if (queryId && hotel?.slug) {
      const rest = new URLSearchParams(searchParams.toString());
      rest.delete('id');
      const qs = rest.toString();
      router.replace(`/hotels-details/${hotel.slug}${qs ? `?${qs}` : ''}`);
    }
  }, [queryId, hotel?.slug]);

  useEffect(() => {
    if (hotel && hotel.rooms && hotel.rooms.length > 0) {
      const firstRoom = hotel.rooms[0];
      let planType: 'room_only' | 'with_breakfast' | 'with_dinner' = 'room_only';
      let price = firstRoom.price_room_only;
      if (!price || price <= 0) {
        planType = 'with_breakfast';
        price = firstRoom.price_with_breakfast;
      }
      if (!price || price <= 0) {
        planType = 'with_dinner';
        price = firstRoom.price_with_dinner;
      }
      if (price && price > 0) {
        setSelectedRoom({
          roomId: firstRoom.id,
          planType,
          price,
          roomName: firstRoom.room_name
        });
      }
    }
  }, [hotel]);

  // The guest/room configuration set on the search bar (adults, children,
  // child ages per requested room) - drives the automatic extra bed / CNB
  // charge calculation shown on the room cards below and passed to checkout.
  const roomsSelection = parseRoomsParam(searchParams.get('rooms'));
  const roomsSelectionRaw = JSON.stringify(roomsSelection);

  const handleCheckoutRedirect = (roomId: number, planType: string, price: number) => {
    if (!hotel) return;
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';

    const query = new URLSearchParams({
      hotelId: hotel.id.toString(),
      roomId: roomId.toString(),
      planType: planType,
      price: price.toString(),
      checkIn: checkIn,
      checkOut: checkOut,
      rooms: roomsSelectionRaw
    });
    window.open(`/checkout?${query.toString()}`, '_blank');
  };

  const fetchSimilarHotels = async (currentId: string, currentLocation: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels.php`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        const currentCity = currentLocation ? currentLocation.split(',')[0].trim().toLowerCase() : '';
        
        // Filter out current hotel
        const filtered = data.data.filter((h: any) => String(h.id) !== String(currentId));
        
        // Sort: hotels in same city first
        const sorted = filtered.sort((a: any, b: any) => {
          const aCity = a.location ? a.location.split(',')[0].trim().toLowerCase() : '';
          const bCity = b.location ? b.location.split(',')[0].trim().toLowerCase() : '';
          if (aCity === currentCity && bCity !== currentCity) return -1;
          if (bCity === currentCity && aCity !== currentCity) return 1;
          return 0;
        });

        setSimilarHotels(sorted.slice(0, 6)); // show top 6 similar properties
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHotelDetails = async (hotelId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/hotels.php?id=${hotelId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setHotel(data.data);
        if (data.data) {
          fetchSimilarHotels(hotelId, data.data.location || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1140px] mx-auto px-4 w-full py-16 text-center flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff8126]" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-[1140px] mx-auto px-4 w-full py-16 text-center">
        <h3 className="text-lg font-bold text-slate-800">Hotel not found.</h3>
      </div>
    );
  }

  // Pre-configured custom hotel images list
  const realHotelImages = [
    '/images/hotels/hotel_exterior_1.png',
    '/images/hotels/hotel_room_1.png',
    '/images/hotels/hotel_lobby_1.png',
    '/images/hotels/hotel_resort_1.png'
  ];

  const idAsNum = typeof hotel.id === 'number' ? hotel.id : parseInt(String(hotel.id || '0'), 10);
  const startImgIndex = (idAsNum || 0) % realHotelImages.length;

  const galleryList = hotel.gallery && hotel.gallery.length > 0 
    ? hotel.gallery 
    : [
        realHotelImages[startImgIndex],
        realHotelImages[(startImgIndex + 1) % realHotelImages.length],
        realHotelImages[(startImgIndex + 2) % realHotelImages.length]
      ];

  const thumb1 = galleryList[0];
  const thumb2 = galleryList[1] || galleryList[0];

  const amenitiesList = hotel.amenities ? hotel.amenities.split(',') : [];
  const rating = hotel.star_rating || 5;

  return (
    <>
      {/* Hotel Details Hero Card Section */}
      <div className="max-w-[1140px] mx-auto px-0 lg:px-4 w-full" style={{ marginTop: '80px' }}>
        <div className="hidden lg:block bg-white border border-slate-150 px-4 shadow-none" style={{ borderRadius: '17px', paddingTop: '10px', paddingBottom: '10px' }}>
          <div>
            {/* Header (Desktop) */}
            <div className="hidden lg:flex items-start mb-4">
              <div>
                <h1 className="font-extrabold text-slate-800 inline-block mb-0 mr-2" style={{ fontSize: '25px' }}>{hotel.name}</h1>
                <span className="text-amber-500 text-sm">
                  {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star mr-0.5"></i>
                  ))}
                  {rating - Math.floor(rating) > 0 && (
                    <i className="fa-solid fa-star-half-stroke"></i>
                  )}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 ml-2">HOTEL</span>
                <p className="text-slate-400 text-xs font-semibold mb-0 mt-1">
                  <i className="fa-solid fa-location-dot mr-1"></i>
                  {hotel.location} &nbsp; 
                  <span
                    className="text-[#ff8126] hover:underline font-bold ml-1 cursor-pointer"
                    onClick={() => scrollToSection('location')}
                  >
                    View on map
                  </span>
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5" id="hotel-gallery">
              {/* Left Column: Swiper Gallery */}
              <div className="lg:col-span-6 hotel-hero-main-col relative h-[288px]">
                <Swiper
                  modules={[Navigation]}
                  loop={galleryList.length > 1}
                  navigation={{
                    prevEl: '.hotel-prev-arrow',
                    nextEl: '.hotel-next-arrow',
                  }}
                  className="hotelHeroSwiper h-full rounded-xl"
                >
                  {galleryList.map((img, index) => {
                    const imgSrc = img.startsWith('http') ? img : `/${img.replace(/^\//, '')}`;
                    return (
                      <SwiperSlide key={index}>
                        <div 
                          onClick={() => {
                            setPhotoIndex(index);
                            setLightboxOpen(true);
                          }} 
                          className="cursor-pointer h-full w-full"
                        >
                          <img 
                            src={imgSrc} 
                            alt={hotel.name} 
                            className="rounded h-full w-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                  
                  {/* Custom Navigation Arrows to prevent duplicate rendering */}
                  <div className="hotel-prev-arrow">
                    <i className="fa-solid fa-chevron-left"></i>
                  </div>
                  <div className="hotel-next-arrow">
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </Swiper>
              </div>

              {/* Middle Column: Small Images */}
              <div className="lg:col-span-2 hidden lg:block hotel-hero-thumbs-col h-[288px]">
                <div className="flex flex-col gap-2 h-full">
                  {thumb1 && (
                    <div 
                      onClick={() => {
                        setPhotoIndex(0);
                        setLightboxOpen(true);
                      }} 
                      className="h-1/2 cursor-pointer rounded-lg overflow-hidden"
                    >
                      <img 
                        src={thumb1.startsWith('http') ? thumb1 : `/${thumb1.replace(/^\//, '')}`} 
                        alt="Detail 1"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {thumb2 && (
                    <div 
                      onClick={() => {
                        setPhotoIndex(1);
                        setLightboxOpen(true);
                      }} 
                      className="relative h-1/2 cursor-pointer rounded-lg overflow-hidden"
                    >
                      <img 
                        src={thumb2.startsWith('http') ? thumb2 : `/${thumb2.replace(/^\//, '')}`} 
                        alt="Detail 2"
                        className="h-full w-full object-cover"
                      />
                      <div 
                        className="bg-black/50 text-white absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <span className="text-xs text-center font-bold">VIEW PHOTOS</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Room Quick Info Card */}
              <div className="lg:col-span-4 hidden lg:block hotel-hero-info-col h-[288px]">
                <div className="p-4 h-full flex flex-col justify-between border border-slate-150 bg-white shadow-none" style={{ borderRadius: '11px' }}>
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <h5 className="font-extrabold text-[#094074] mb-1 truncate" style={{ fontSize: '13px' }}>
                          {hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0].room_name : 'Standard Room'}
                        </h5>
                        <p className="text-xs text-slate-400 font-semibold mb-2">{hotel.rooms && hotel.rooms.length > 0 ? (hotel.rooms[0].max_guests || 2) : 2} x Guest | 1 x Room</p>
                        <p className="text-green-600 text-xs font-bold mb-2">
                          <i className="fa-regular fa-circle-check mr-1.5"></i> Free Cancellation
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <h3 className="font-extrabold text-slate-900" style={{ fontSize: '18px', fontWeight: 'bold' }}>₹ {Math.round(hotel.price_per_night || 0).toLocaleString('en-IN')}</h3>
                        <p className="text-green-600 text-[11px] font-bold mb-0">
                          <i className="fa-solid fa-check mr-1"></i> Book with ₹0
                        </p>
                      </div>
                    </div>

                    <div className="my-1 border-t border-slate-100 pt-3">
                      <div className="grid grid-cols-2 gap-1.5">
                        {amenitiesList.slice(0, 5).map((am, idx) => (
                          <div key={idx} className="min-w-0">
                            <small className="text-slate-450 text-[11px] font-semibold text-truncate block truncate">
                              <i className="fa-solid fa-check-circle text-green-500 mr-1.5"></i>
                              {am.trim()}
                            </small>
                          </div>
                        ))}
                        <div className="col-span-1">
                          <span 
                            style={{ cursor: 'pointer' }}
                            onClick={() => scrollToSection('overview')}
                            className="text-xs text-[#ff8126] font-bold hover:underline"
                          >
                            + More Amenities
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-3">
                    <button 
                      className="px-3 border border-[#094074] text-[#094074] hover:bg-slate-50 font-extrabold text-[11px] uppercase tracking-wider transition flex-grow text-center whitespace-nowrap"
                      style={{ borderRadius: '8px', paddingTop: '10px', paddingBottom: '10px' }}
                      onClick={() => scrollToSection('rooms')}
                    >
                      Select Rooms
                    </button>
                    <button 
                      className="px-3 bg-[#ff8126] hover:bg-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider transition flex-grow text-center border-none whitespace-nowrap"
                      style={{ borderRadius: '8px', paddingTop: '10px', paddingBottom: '10px' }}
                      onClick={() => openModal('hotel', {
                        hotelName: hotel.name,
                        roomName: hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0].room_name : 'Standard Room',
                        price: hotel.price_per_night,
                        planType: 'Room Only'
                      })}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Info Container */}
              <div className="moile-hero-banner-section-text p-0 lg:hidden mt-2">
                <div className="bg-white border-t border-b border-slate-100 relative shadow-none p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-extrabold text-slate-800 mb-1" style={{ fontSize: '17px' }}>
                        {hotel.name}
                      </h5>
                      <span className="text-amber-500 text-xs">
                        {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                          <i key={i} className="fa fa-star mr-1"></i>
                        ))}
                      </span>
                      <span className="badge bg-light text-primary border border-primary ms-2" style={{ fontSize: '10px' }}>HOTEL</span>
                    </div>
                  </div>

                  <div className="flex items-start mb-2">
                    <i className="fa fa-map-marker-alt text-slate-400 mr-2 mt-1 text-[13px]"></i>
                    <p className="text-slate-550 text-xs font-semibold leading-tight mb-0">
                      {hotel.location}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Mobile Hero View (Full Bleed Image Slider + Title Card + Details) */}
        <div className="block lg:hidden w-full">
          {/* Full-Bleed Image Swiper */}
          <div className="relative w-full h-[250px] overflow-hidden">
            <Swiper
              modules={[Navigation]}
              loop={galleryList.length > 1}
              navigation={{
                prevEl: '.mobile-hotel-prev-arrow',
                nextEl: '.mobile-hotel-next-arrow',
              }}
              className="h-full w-full"
            >
              {galleryList.map((img, index) => {
                const imgSrc = img.startsWith('http') ? img : `/${img.replace(/^\//, '')}`;
                return (
                  <SwiperSlide key={index}>
                    <div 
                      onClick={() => {
                        setPhotoIndex(index);
                        setLightboxOpen(true);
                      }} 
                      className="cursor-pointer h-full w-full"
                    >
                      <img 
                        src={imgSrc} 
                        alt={hotel.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
              
              {/* Custom Navigation Arrows */}
              <div className="mobile-hotel-prev-arrow absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </div>
              <div className="mobile-hotel-next-arrow absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </div>
            </Swiper>

            {/* Back button overlay */}
            <div 
              onClick={() => window.history.back()} 
              className="absolute top-4 left-4 z-20 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </div>

            {/* Share and edit button overlays */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <div className="bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                <i className="fa-solid fa-share-nodes"></i>
              </div>
              <div className="bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>

            {/* Image Count Badge */}
            <div 
              onClick={() => {
                setPhotoIndex(0);
                setLightboxOpen(true);
              }}
              className="absolute bottom-4 right-4 z-20 bg-black/60 rounded text-white text-[10px] font-black border border-white/40 cursor-pointer hover:bg-black/85 transition-all" 
              style={{ padding: '4px 8px' }}
            >
              + {galleryList.length} more
            </div>
          </div>

          {/* Title & Info Card */}
          <div className="bg-white rounded-t-3xl border-t border-slate-150 px-4 relative" style={{ marginTop: '-10px', paddingTop: '15px', paddingBottom: '15px', zIndex: 10 }}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-200 uppercase">Hotel</span>
                  <span className="text-amber-500 text-xs">
                    {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                      <i key={i} className="fa-solid fa-star mr-0.5"></i>
                    ))}
                  </span>
                </div>
                <h1 className="font-extrabold text-slate-800 mb-1 leading-tight whitespace-nowrap truncate" style={{ fontSize: '20px', marginTop: '15px' }}>{hotel.name}</h1>
                <p className="text-slate-400 text-[11px] font-semibold mb-0 flex items-center gap-1 flex-wrap">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{hotel.location}</span>
                  <span
                    className="text-[#ff8126] hover:underline font-bold ml-1 cursor-pointer"
                    onClick={() => scrollToSection('location')}
                  >
                    View on map
                  </span>
                </p>
              </div>
            </div>

            {/* Dates & Guests Block */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {/* Dates Box */}
              <div className="border border-slate-150 rounded-lg p-2 bg-slate-50/50 flex items-center gap-1.5 min-w-0">
                <i className="fa-regular fa-calendar text-[#ff8126] text-sm flex-shrink-0"></i>
                <div className="min-w-0 flex-1">
                  <small className="text-slate-400 block font-bold text-[8px] uppercase leading-none mb-0.5 whitespace-nowrap truncate">Dates</small>
                  <span className="text-slate-800 text-[10px] font-black whitespace-nowrap truncate block">13 Jul - 14 Jul 2026</span>
                </div>
              </div>
              {/* Guests Box */}
              <div className="border border-slate-150 rounded-lg p-2 bg-slate-50/50 flex items-center gap-1.5 min-w-0">
                <i className="fa-regular fa-user text-[#ff8126] text-sm flex-shrink-0"></i>
                <div className="min-w-0 flex-1">
                  <small className="text-slate-400 block font-bold text-[8px] uppercase leading-none mb-0.5 whitespace-nowrap truncate">Guests & Rooms</small>
                  <span className="text-slate-800 text-[10px] font-black whitespace-nowrap truncate block">2 Guests, 1 Room</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Child Navbar Tabs */}
      <div className="max-w-[1140px] mx-auto px-0 lg:px-4 w-full sticky top-[56px] z-30 bg-white mt-3 lg:mt-0" style={{ marginBottom: '0px' }}>
        {/* Desktop Tabs */}
        <div className="hidden lg:flex bg-white rounded-md border border-slate-150 p-1 shadow-none">
          <div className="flex-1 text-center py-1.5 font-bold text-slate-450 border-r border-slate-150 cursor-pointer hover:text-slate-700 transition text-[10px]" onClick={() => scrollToSection('rooms')}>Rooms</div>
          <div className="flex-1 text-center py-1.5 font-bold text-slate-450 border-r border-slate-150 cursor-pointer hover:text-slate-700 transition text-[10px]" onClick={() => scrollToSection('overview')}>Overview</div>
          <div className="flex-1 text-center py-1.5 font-bold text-slate-450 border-r border-slate-150 cursor-pointer hover:text-slate-700 transition text-[10px]" onClick={() => scrollToSection('amenities')}>Amenities</div>
          <div className="flex-1 text-center py-1.5 font-bold text-slate-450 border-r border-slate-150 cursor-pointer hover:text-slate-700 transition text-[10px]" onClick={() => scrollToSection('location')}>Location</div>
          <div className="flex-1 text-center py-1.5 font-bold text-slate-450 cursor-pointer hover:text-slate-700 transition text-[10px]" onClick={() => scrollToSection('policies')}>Booking Policy</div>
        </div>

        {/* Mobile Tabs (Pill style matching reference design) */}
        <div className="flex lg:hidden bg-white p-2 border-b border-slate-150 overflow-x-auto flex-nowrap scrollbar-none">
          {[
            { id: 'rooms', label: 'Rooms' },
            { id: 'overview', label: 'Overview' },
            { id: 'amenities', label: 'Amenities' },
            { id: 'location', label: 'Location' },
            { id: 'policies', label: 'Details' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToSection(tab.id);
                }}
                className={`flex-shrink-0 text-[10px] font-bold rounded-md transition-all border-none ${
                  isActive 
                    ? 'bg-[#1a85e8] text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
                style={{ paddingLeft: '5px', paddingRight: '5px', paddingTop: '6px', paddingBottom: '6px', marginRight: '10px', borderRadius: '6px' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body Content Container */}
      <div className="max-w-[1140px] mx-auto px-2 lg:px-4 w-full pt-6 pb-24 lg:pb-6">
        {/* Rooms Section */}
        <div id="rooms" className="mb-8 scroll-mt-20">
          <h3 className="font-extrabold text-slate-800" style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '15px', marginBottom: '5px' }}>Available Rooms</h3>
          {hotel.rooms && hotel.rooms.length > 0 ? (
            <div className="flex flex-col gap-5">
              {hotel.rooms.map(room => {
                // Auto-computed extra bed (3rd+ adult, or child above 12) / CNB
                // (child aged 6-12) charge for this room type, per night, based
                // on the adults/children/child-ages selected on the search bar.
                const extraPerNight = totalExtraChargePerNight(
                  roomsSelection,
                  room.extra_bed_charge || 0,
                  room.cnb_charge || 0
                );
                return (
                <div key={room.id} className="border border-slate-150 overflow-hidden bg-slate-50 shadow-none mx-[2px]" style={{ borderRadius: '17px' }}>
                  
                  {/* Grid layout containing both desktop header and plans */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                    
                    {/* Desktop Room Header (Left column, hidden on mobile) */}
                    <div className="hidden md:flex md:col-span-3 px-4 py-2 flex-col justify-between border-r border-slate-200 bg-white">
                      <div>
                        <h4 className="font-extrabold text-slate-800 mb-2" style={{ fontSize: '18px' }}>{room.room_name}</h4>
                        <div className="rounded-lg overflow-hidden my-3" style={{ height: '180px' }}>
                          <img 
                            src={room.room_image ? `/${room.room_image.replace('../', '')}` : '/images/default-hotel.jpg'} 
                            alt={room.room_name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <span className="inline-block px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase align-self-start self-start">Capacity: {room.max_guests || 2} Guests</span>
                    </div>

                    {/* Mobile Room Header (Hidden on desktop) */}
                    <div className="block md:hidden bg-white p-3 border-b border-slate-150">
                      <div className="flex gap-3">
                        {/* Image Thumbnail */}
                        <div className="w-[100px] h-[75px] rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={room.room_image ? `/${room.room_image.replace('../', '')}` : '/images/default-hotel.jpg'} 
                            alt={room.room_name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Title & Key Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-start py-0.5">
                          <h4 className="font-extrabold text-slate-800 mb-1.5 leading-tight truncate" style={{ fontSize: '18px' }}>{room.room_name}</h4>
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-black uppercase self-start">
                            Capacity: {room.max_guests || 2} Guests
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Plans Grid Column */}
                    <div className="md:col-span-9 bg-white">
                      {/* Plan: Room Only */}
                      {room.price_room_only > 0 && (
                        <div 
                          onClick={() => setSelectedRoom({
                            roomId: room.id,
                            planType: 'room_only',
                            price: room.price_room_only,
                            roomName: room.room_name
                          })}
                          className={`px-4 py-3 border-b border-slate-100 flex justify-between items-center cursor-pointer transition-all ${
                            selectedRoom?.roomId === room.id && selectedRoom?.planType === 'room_only' 
                              ? 'bg-orange-50/20' 
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Selection Dot (Radio Circle) */}
                            <div className="flex-shrink-0">
                              {selectedRoom?.roomId === room.id && selectedRoom?.planType === 'room_only' ? (
                                <div className="w-5 h-5 rounded-full border-2 border-[#ff8126] flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff8126]"></div>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-extrabold text-[#094074] mb-1" style={{ fontSize: '16px' }}>Room Only</h5>
                              <ul className="list-none pl-0 mb-0 text-slate-450 text-[10px] font-bold space-y-1">
                                {(room.benefits_room_only || 'Room only stay').split('\n').map((b, i) => b.trim() && (
                                    <li key={i} className="flex items-center gap-1">
                                      <i className="fa fa-check-circle text-green-500 text-[11px]"></i>{b.trim()}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 flex flex-col items-end">
                            <div className="text-xl font-black text-slate-900 leading-none">₹{Math.round(room.price_room_only || 0).toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-1">
                              + ₹{Math.round(room.price_room_only * 0.05).toLocaleString('en-IN')} taxes & fees
                            </div>
                            {extraPerNight > 0 && (
                              <div className="text-[10px] text-amber-600 font-bold mt-0.5">
                                + ₹{Math.round(extraPerNight).toLocaleString('en-IN')} extra bed / child charges
                              </div>
                            )}
                            <button 
                              className="hidden md:block bg-[#ff8126] hover:bg-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider transition border-none text-center whitespace-nowrap mt-2"
                              style={{ borderRadius: '8px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '14px', paddingRight: '14px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckoutRedirect(room.id, 'room_only', room.price_room_only);
                              }}
                            >
                              Book Room
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Plan: Room with Breakfast */}
                      {room.price_with_breakfast > 0 && (
                        <div 
                          onClick={() => setSelectedRoom({
                            roomId: room.id,
                            planType: 'with_breakfast',
                            price: room.price_with_breakfast,
                            roomName: room.room_name
                          })}
                          className={`px-4 py-3 border-b border-slate-100 flex justify-between items-center cursor-pointer transition-all ${
                            selectedRoom?.roomId === room.id && selectedRoom?.planType === 'with_breakfast' 
                              ? 'bg-orange-50/20' 
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Selection Dot (Radio Circle) */}
                            <div className="flex-shrink-0">
                              {selectedRoom?.roomId === room.id && selectedRoom?.planType === 'with_breakfast' ? (
                                <div className="w-5 h-5 rounded-full border-2 border-[#ff8126] flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff8126]"></div>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-extrabold text-[#094074] mb-1" style={{ fontSize: '16px' }}>Room with Breakfast</h5>
                              <ul className="list-none pl-0 mb-0 text-slate-450 text-[10px] font-bold space-y-1">
                                {(room.benefits_with_breakfast || 'Stay with daily breakfast').split('\n').map((b, i) => b.trim() && (
                                    <li key={i} className="flex items-center gap-1">
                                      <i className="fa fa-check-circle text-green-500 text-[11px]"></i>{b.trim()}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 flex flex-col items-end">
                            <div className="text-xl font-black text-slate-900 leading-none">₹{Math.round(room.price_with_breakfast || 0).toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-1">
                              + ₹{Math.round(room.price_with_breakfast * 0.05).toLocaleString('en-IN')} taxes & fees
                            </div>
                            {extraPerNight > 0 && (
                              <div className="text-[10px] text-amber-600 font-bold mt-0.5">
                                + ₹{Math.round(extraPerNight).toLocaleString('en-IN')} extra bed / child charges
                              </div>
                            )}
                            <button 
                              className="hidden md:block bg-[#ff8126] hover:bg-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider transition border-none text-center whitespace-nowrap mt-2"
                              style={{ borderRadius: '8px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '14px', paddingRight: '14px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckoutRedirect(room.id, 'with_breakfast', room.price_with_breakfast);
                              }}
                            >
                              Book Room
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Plan: Room with Dinner & Breakfast */}
                      {room.price_with_dinner > 0 && (
                        <div 
                          onClick={() => setSelectedRoom({
                            roomId: room.id,
                            planType: 'with_dinner',
                            price: room.price_with_dinner,
                            roomName: room.room_name
                          })}
                          className={`px-4 py-3 flex justify-between items-center cursor-pointer transition-all ${
                            selectedRoom?.roomId === room.id && selectedRoom?.planType === 'with_dinner' 
                              ? 'bg-orange-50/20' 
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Selection Dot (Radio Circle) */}
                            <div className="flex-shrink-0">
                              {selectedRoom?.roomId === room.id && selectedRoom?.planType === 'with_dinner' ? (
                                <div className="w-5 h-5 rounded-full border-2 border-[#ff8126] flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff8126]"></div>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                              )}
                            </div>
                            <div>
                              <h5 className="font-extrabold text-[#094074] mb-1" style={{ fontSize: '16px' }}>Room with Breakfast & Dinner (MAP)</h5>
                              <ul className="list-none pl-0 mb-0 text-slate-450 text-[10px] font-bold space-y-1">
                                {(room.benefits_with_dinner || 'Breakfast & Dinner included').split('\n').map((b, i) => b.trim() && (
                                    <li key={i} className="flex items-center gap-1">
                                      <i className="fa fa-check-circle text-green-500 text-[11px]"></i>{b.trim()}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 flex flex-col items-end">
                            <div className="text-xl font-black text-slate-900 leading-none">₹{Math.round(room.price_with_dinner || 0).toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-1">
                              + ₹{Math.round(room.price_with_dinner * 0.05).toLocaleString('en-IN')} taxes & fees
                            </div>
                            {extraPerNight > 0 && (
                              <div className="text-[10px] text-amber-600 font-bold mt-0.5">
                                + ₹{Math.round(extraPerNight).toLocaleString('en-IN')} extra bed / child charges
                              </div>
                            )}
                            <button 
                              className="hidden md:block bg-[#ff8126] hover:bg-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider transition border-none text-center whitespace-nowrap mt-2"
                              style={{ borderRadius: '8px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '14px', paddingRight: '14px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckoutRedirect(room.id, 'with_dinner', room.price_with_dinner);
                              }}
                            >
                              Book Room
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center bg-white rounded-3xl border border-slate-150 shadow-sm">
              <p className="text-slate-400 font-bold mb-0">No specific rooms found. Please contact support to book directly.</p>
            </div>
          )}
        </div>

        {/* Overview & Amenities Section */}
        <div id="overview" className="mb-8 border-t border-slate-100 pt-5 scroll-mt-20">
          <h3 className="font-extrabold mb-3 text-slate-800" style={{ fontSize: '20px', fontWeight: 'bold' }}>Overview & Amenities</h3>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed" style={{ lineHeight: '1.8' }}>
            {hotel.description || 'Welcome to a luxurious stay in the heart of Jammu & Kashmir. Offering scenic mountain views, modern facilities, and premium guest amenities for a comfortable vacation.'}
          </p>

          <h4 id="amenities" className="font-extrabold text-slate-800 mt-5 mb-3 scroll-mt-20" style={{ fontSize: '20px', fontWeight: 'bold' }}>Features & Amenities</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenitiesList.map((am, i) => (
              <div key={i} className="min-w-0">
                <div className="text-slate-500 text-xs font-semibold truncate flex items-center gap-1.5">
                  <i className="fa-solid fa-check text-green-500"></i>
                  {am.trim()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location / Map Section */}
        <div id="location" className="mb-8 border-t border-slate-100 pt-5 scroll-mt-20">
          <h3 className="font-extrabold mb-3 text-slate-800" style={{ fontSize: '20px', fontWeight: 'bold' }}>Location / Map</h3>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-none mb-3" style={{ height: '350px' }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel.name + ', ' + hotel.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Policies Section */}
        <div id="policies" className="mb-3 border-t border-slate-100 pt-5 scroll-mt-20">
          <h3 className="font-extrabold mb-3 text-slate-800" style={{ fontSize: '20px', fontWeight: 'bold' }}>Booking Policies</h3>
          <ul className="text-slate-500 text-xs font-semibold space-y-1.5 list-disc pl-4" style={{ lineHeight: '1.8' }}>
            <li>Standard check-in time is 12:00 PM and check-out is 11:00 AM.</li>
            <li>Free cancellation is available up to 48 hours prior to check-in date.</li>
            <li>Government-issued ID proofs are mandatory at the time of check-in.</li>
            <li>Refunds on eligible cancellations are processed within 7-10 working days.</li>
          </ul>
        </div>

        {/* Similar Properties Section */}
        {similarHotels.length > 0 && (
          <div id="similar-properties" className="mt-8 border-t border-slate-100 pt-5" style={{ marginBottom: '20px' }}>
            <h3 className="font-extrabold mb-4 text-slate-800" style={{ fontSize: '20px', fontWeight: 'bold' }}>Similar Properties</h3>
            
            {/* Horizontal Scroll container */}
            <div className="overflow-x-auto pb-4 flex gap-4 flex-nowrap scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {similarHotels.map((h) => {
                const ratingStars = h.star_rating || 5;
                const price = h.price_per_night || 0;

                // Real, admin-uploaded photo — gallery first image, then the
                // featured image, then (only if the hotel genuinely has no
                // image at all in the DB) a generic stock photo.
                const idNum = typeof h.id === 'number' ? h.id : parseInt(String(h.id || '0'), 10);
                const startImgIndex = (idNum || 0) % realHotelImages.length;
                const hotelImage = h.gallery && h.gallery.length > 0
                  ? `/${h.gallery[0].replace(/^\.\.\//, '')}`
                  : h.featured_image
                    ? `/${h.featured_image.replace('../', '')}`
                    : realHotelImages[startImgIndex];

                return (
                  <a 
                    key={h.id} 
                    href={`/hotels-details/${h.slug}`}
                    className="flex-shrink-0 w-[280px] bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-none flex flex-col justify-between text-inherit hover:border-[#ff8126] transition cursor-pointer"
                    style={{ textDecoration: 'none' }}
                  >
                    <div>
                      {/* Image */}
                      <div className="h-[150px] w-full overflow-hidden relative">
                        <img 
                          src={hotelImage} 
                          alt={h.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1 gap-1">
                          <h4 className="font-extrabold text-slate-800 truncate flex-1 mb-0" style={{ fontSize: '20px', textDecoration: 'none' }} title={h.name}>{h.name}</h4>
                          <span className="text-amber-500 text-[10px] flex-shrink-0 flex items-center">
                            {Array.from({ length: Math.floor(ratingStars) }).map((_, i) => (
                              <i key={i} className="fa-solid fa-star mr-0.5"></i>
                            ))}
                          </span>
                        </div>
                        
                        <p className="text-slate-400 text-[10px] font-semibold truncate mb-3" title={h.location}>
                          <i className="fa-solid fa-location-dot mr-1"></i>{h.location}
                        </p>
                        
                        <div className="flex justify-end items-center mt-2">
                          <div className="text-right">
                            <div className="font-extrabold text-slate-800 text-sm leading-none">₹{Math.round(price || 0).toLocaleString('en-IN')}</div>
                            <div className="text-[8px] text-slate-400 font-bold mt-1">/ night</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Native React Lightbox Overlay Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 flex flex-col justify-between p-4" 
          style={{ zIndex: 10000 }}
        >
          {/* Lightbox Header */}
          <div className="flex justify-between items-center text-white w-full p-2 border-b border-slate-800">
            <span className="text-xs font-bold">{photoIndex + 1} / {galleryList.length}</span>
            <button 
              className="bg-transparent border-none text-white text-xl p-0 cursor-pointer" 
              onClick={() => setLightboxOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Lightbox Main Image & Arrows */}
          <div 
            className="flex-grow flex items-center justify-center relative w-full" 
            style={{ minHeight: 0 }}
          >
            {/* Left Prev Arrow */}
            <button 
              className="bg-transparent border-none text-white absolute left-0 text-2xl p-4 cursor-pointer"
              style={{ zIndex: 10002 }}
              onClick={() => setPhotoIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1))}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <img 
              src={galleryList[photoIndex].startsWith('http') ? galleryList[photoIndex] : `/${galleryList[photoIndex].replace(/^\//, '')}`} 
              alt="Lightbox View" 
              className="img-fluid rounded shadow-lg object-contain" 
              style={{ maxHeight: '70vh', maxWidth: '90vw' }}
            />

            {/* Right Next Arrow */}
            <button 
              className="bg-transparent border-none text-white absolute right-0 text-2xl p-4 cursor-pointer"
              style={{ zIndex: 10002 }}
              onClick={() => setPhotoIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1))}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Lightbox Thumbnail Selector Bar */}
          <div 
            className="flex justify-center gap-2 overflow-auto py-2 border-t border-slate-800 w-full"
            style={{ maxHeight: '90px' }}
          >
            {galleryList.map((img, i) => {
              const thumbSrc = img.startsWith('http') ? img : `/${img.replace(/^\//, '')}`;
              return (
                <div 
                  key={i} 
                  className={`rounded overflow-hidden border cursor-pointer ${photoIndex === i ? 'border-[#ff8126] border-2' : 'border-transparent'}`}
                  style={{ width: '60px', height: '45px', flexShrink: 0 }}
                  onClick={() => setPhotoIndex(i)}
                >
                  <img src={thumbSrc} className="w-full h-full object-cover" alt="Thumbnail" />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Mobile Sticky Bottom Booking Bar */}
      <div className="block lg:hidden fixed z-40 rounded-t-2xl px-4 shadow-[0_-4px_15px_rgba(0,0,0,0.2)]" style={{ bottom: '0px', left: '0px', right: '0px', margin: '0px', paddingTop: '12px', paddingBottom: '12px', background: 'linear-gradient(135deg, #0a2540 0%, #001020 100%)' }}>
        <div className="flex justify-between items-center max-w-[1140px] mx-auto">
          <div className="text-left min-w-0 pr-2">
            <div className="text-xl font-extrabold text-white leading-none">
              ₹{Math.round(selectedRoom ? selectedRoom.price : (hotel.price_per_night || 0)).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-white/70 font-semibold mt-1">
              + ₹{Math.round((selectedRoom ? selectedRoom.price : (hotel.price_per_night || 0)) * 0.05).toLocaleString('en-IN')} Taxes & fees
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (selectedRoom) {
                handleCheckoutRedirect(selectedRoom.roomId, selectedRoom.planType, selectedRoom.price);
              } else {
                scrollToSection('rooms');
              }
            }}
            className="px-8 bg-[#f25b22] hover:bg-orange-600 text-white font-extrabold transition-all border-none text-center flex-shrink-0"
            style={{ minWidth: '130px', paddingTop: '5px', paddingBottom: '5px', borderRadius: '8px', fontSize: '16px', letterSpacing: '1px' }}
          >
            {selectedRoom ? 'Continue' : 'Select Room'}
          </button>
        </div>
      </div>
    </>
  );
}
