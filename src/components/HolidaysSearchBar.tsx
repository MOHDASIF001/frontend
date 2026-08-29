'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const destinations = [
  { name: 'Kashmir', image: '/images/pahalgam_main.png' },
  { name: 'Ladakh', image: '/images/destinetion-ladhak.jpg' },
  { name: 'Kerala', image: '/images/Kerala_image.jpg' },
  { name: 'Himachal', image: '/images/Himachal.webp' },
  { name: 'Goa', image: '/images/dest_goa.png' },
  { name: 'Delhi', image: '/images/dest_delhi.png' },
  { name: 'Rajasthan', image: '/images/rajisthan.jpg' },
  { name: 'Uttarakhand', image: '/images/Uttarakhand.webp' },
  { name: 'Meghalaya', image: '/images/Meghalaya.jpg' },
];

export default function HolidaysSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFromDropdown, setSelectedFromDropdown] = useState(false);
  const [showError, setShowError] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) => d.name.toLowerCase().includes(q));
  }, [value]);

  const goToDestination = (name: string) => {
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '');
    router.push(`/holidays/${slug}-tours-packages/`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);

    if (!selectedFromDropdown) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }

    goToDestination(value);
  };

  const handleSelect = (name: string) => {
    setValue(name);
    setSelectedFromDropdown(true);
    setShowError(false);
    setIsOpen(false);
    goToDestination(name);
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center bg-white rounded-full overflow-hidden shadow-lg"
        style={{ padding: '6px' }}
      >
        <i className="fa-solid fa-magnifying-glass text-slate-400 ml-3" style={{ fontSize: '15px' }}></i>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSelectedFromDropdown(false);
            setShowError(false);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Enter Your Dream Destination!"
          className="flex-1 border-none outline-none bg-transparent text-slate-700 font-semibold"
          style={{ fontSize: '14px', padding: '10px 14px' }}
        />
        <button
          type="submit"
          className="text-white font-black uppercase tracking-wider border-none cursor-pointer flex-shrink-0"
          style={{ background: '#ff8126', fontSize: '13px', borderRadius: '999px', padding: '12px 28px' }}
        >
          Search
        </button>
      </form>

      {showError && (
        <div
          className="absolute left-1/2 flex items-center gap-2 rounded-full font-bold text-white"
          style={{
            bottom: 'calc(100% + 12px)',
            transform: 'translateX(-50%)',
            background: '#e23a3a',
            fontSize: '13px',
            padding: '9px 18px',
            whiteSpace: 'nowrap',
            boxShadow: '0 6px 18px rgba(226,58,58,0.35)',
            zIndex: 40,
          }}
        >
          <i className="fa-solid fa-circle-exclamation"></i>
          Please select destination
        </div>
      )}

      {isOpen && (
        <div
          className="absolute left-0 right-0 bg-white rounded-2xl overflow-hidden text-left"
          style={{ top: 'calc(100% + 8px)', boxShadow: '0 12px 32px rgba(0,0,0,0.18)', zIndex: 30 }}
        >
          <div className="flex items-center gap-2.5" style={{ padding: '14px 18px', borderBottom: '1px solid #eef1f5' }}>
            <span
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{ width: '28px', height: '28px', border: '1.5px solid #cbd5e1' }}
            >
              <i className="fa-solid fa-location-dot text-slate-400" style={{ fontSize: '11px' }}></i>
            </span>
            <span className="text-slate-900" style={{ fontSize: '14px' }}>
              <span className="font-black">Top Trending</span> <span className="font-semibold text-slate-500">Holiday Destinations</span>
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="text-slate-400 font-semibold" style={{ fontSize: '13px', padding: '16px 18px' }}>
              No destinations found.
            </p>
          ) : (
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {filtered.map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(dest.name)}
                  className="flex items-center gap-3 w-full text-left cursor-pointer border-none bg-transparent hover:bg-slate-50"
                  style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9' }}
                >
                  <div className="rounded-lg overflow-hidden flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-slate-900" style={{ fontSize: '15px' }}>{dest.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
