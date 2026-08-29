'use client';

import React, { useState, useMemo } from 'react';
import PackageCard, { PackageCardData } from './PackageCard';

interface Package extends PackageCardData {
  location_name?: string;
  category?: string;
  short_description?: string;
}

const sortOptions = [
  { value: 'default', label: 'Recommended' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

const priceOptions = [
  { value: 'all', label: 'All Prices' },
  { value: 'under20', label: 'Under ₹20,000' },
  { value: '20to40', label: '₹20,000 – ₹40,000' },
  { value: 'above40', label: 'Above ₹40,000' },
];

const durationOptions = [
  { value: 'all', label: 'All Durations' },
  { value: 'short', label: '1 – 3 Days' },
  { value: 'medium', label: '4 – 6 Days' },
  { value: 'long', label: '7+ Days' },
];

type FilterKey = 'sort' | 'type' | 'price' | 'duration' | 'flight' | 'themes';

export default function DestinationPackagesGrid({
  packages,
  destinationName,
  categories,
}: {
  packages: Package[];
  destinationName: string;
  /** Admin-controlled master category list (from api/categories.php), so the
   * "Package Type" filter always matches the same categories shown in the
   * /holidays hero, regardless of which ones this destination happens to have
   * packages in yet. Falls back to deriving from `packages` if omitted. */
  categories?: string[];
}) {
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [packageType, setPackageType] = useState('all');
  const [priceBucket, setPriceBucket] = useState('all');
  const [durationBucket, setDurationBucket] = useState('all');

  const packageTypes = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    const set = new Set<string>();
    packages.forEach((pkg) => {
      if (pkg.category && pkg.category.trim()) set.add(pkg.category.trim());
    });
    return Array.from(set);
  }, [packages, categories]);

  const resetAll = () => {
    setSortBy('default');
    setPackageType('all');
    setPriceBucket('all');
    setDurationBucket('all');
    setOpenFilter(null);
  };

  const toggleFilter = (key: FilterKey) => {
    setOpenFilter((prev) => (prev === key ? null : key));
  };

  const priceOf = (pkg: Package) =>
    pkg.discounted_price && Number(pkg.discounted_price) > 0 ? Number(pkg.discounted_price) : Number(pkg.price) || 0;

  const filteredSorted = useMemo(() => {
    let list = [...packages];

    if (packageType !== 'all') {
      list = list.filter((pkg) => (pkg.category || '').trim() === packageType);
    }

    if (priceBucket !== 'all') {
      list = list.filter((pkg) => {
        const p = priceOf(pkg);
        if (priceBucket === 'under20') return p < 20000;
        if (priceBucket === '20to40') return p >= 20000 && p <= 40000;
        if (priceBucket === 'above40') return p > 40000;
        return true;
      });
    }

    if (durationBucket !== 'all') {
      list = list.filter((pkg) => {
        const d = Number(pkg.duration_days) || 0;
        if (durationBucket === 'short') return d >= 1 && d <= 3;
        if (durationBucket === 'medium') return d >= 4 && d <= 6;
        if (durationBucket === 'long') return d >= 7;
        return true;
      });
    }

    if (sortBy === 'price_low') list.sort((a, b) => priceOf(a) - priceOf(b));
    if (sortBy === 'price_high') list.sort((a, b) => priceOf(b) - priceOf(a));

    return list;
  }, [packages, packageType, priceBucket, durationBucket, sortBy]);

  const filterIcons: Record<FilterKey, string> = {
    sort: 'fa-arrow-up-wide-short',
    type: 'fa-layer-group',
    price: 'fa-indian-rupee-sign',
    duration: 'fa-clock',
    flight: 'fa-plane',
    themes: 'fa-star',
  };

  const isFilterActive = (filterKey: FilterKey) => {
    if (filterKey === 'sort') return sortBy !== 'default';
    if (filterKey === 'type') return packageType !== 'all';
    if (filterKey === 'price') return priceBucket !== 'all';
    if (filterKey === 'duration') return durationBucket !== 'all';
    return false;
  };

  const FilterPill = ({ filterKey, label }: { filterKey: FilterKey; label: string }) => {
    const active = isFilterActive(filterKey);
    const isOpen = openFilter === filterKey;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleFilter(filterKey)}
          className="flex items-center gap-1 sm:gap-1.5 font-semibold cursor-pointer flex-shrink-0 whitespace-nowrap py-[5px] px-[9px] sm:py-[6px] sm:px-[10px]"
          style={{
            color: active || isOpen ? '#094074' : '#475569',
            background: active ? '#eaf1f8' : '#f8fafc',
            border: `1px solid ${active || isOpen ? '#094074' : '#e2e8f0'}`,
            borderRadius: '8px',
            transition: 'all 0.15s ease',
            fontSize: '10px',
          }}
        >
          <i className={`fa-solid ${filterIcons[filterKey]}`} style={{ fontSize: '9px', color: active || isOpen ? '#ff8126' : '#94a3b8' }}></i>
          {label}
          <i
            className="fa-solid fa-chevron-down"
            style={{ fontSize: '8px', color: active || isOpen ? '#094074' : '#94a3b8', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}
          ></i>
        </button>

      {openFilter === filterKey && (
        <div
          className="absolute left-0 bg-white rounded-xl overflow-hidden"
          style={{ top: 'calc(100% + 8px)', minWidth: '220px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', border: '1px solid #eef1f5', zIndex: 20 }}
        >
          {filterKey === 'sort' &&
            sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setSortBy(opt.value); setOpenFilter(null); }}
                className="w-full flex items-center justify-between text-left font-semibold cursor-pointer border-none"
                style={{ fontSize: '13px', padding: '10px 16px', background: sortBy === opt.value ? '#eaf1f8' : '#fff', color: sortBy === opt.value ? '#094074' : '#334155' }}
              >
                {opt.label}
                {sortBy === opt.value && <i className="fa-solid fa-check" style={{ fontSize: '11px', color: '#ff8126' }}></i>}
              </button>
            ))}

          {filterKey === 'type' && (
            packageTypes.length === 0 ? (
              <p className="text-slate-400 font-semibold" style={{ fontSize: '12px', padding: '12px 16px' }}>No package types available.</p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setPackageType('all'); setOpenFilter(null); }}
                  className="w-full flex items-center justify-between text-left font-semibold cursor-pointer border-none"
                  style={{ fontSize: '13px', padding: '10px 16px', background: packageType === 'all' ? '#eaf1f8' : '#fff', color: packageType === 'all' ? '#094074' : '#334155' }}
                >
                  All Types
                  {packageType === 'all' && <i className="fa-solid fa-check" style={{ fontSize: '11px', color: '#ff8126' }}></i>}
                </button>
                {packageTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setPackageType(type); setOpenFilter(null); }}
                    className="w-full flex items-center justify-between text-left font-semibold cursor-pointer border-none"
                    style={{ fontSize: '13px', padding: '10px 16px', background: packageType === type ? '#eaf1f8' : '#fff', color: packageType === type ? '#094074' : '#334155' }}
                  >
                    {type}
                    {packageType === type && <i className="fa-solid fa-check" style={{ fontSize: '11px', color: '#ff8126' }}></i>}
                  </button>
                ))}
              </>
            )
          )}

          {filterKey === 'price' &&
            priceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setPriceBucket(opt.value); setOpenFilter(null); }}
                className="w-full flex items-center justify-between text-left font-semibold cursor-pointer border-none"
                style={{ fontSize: '13px', padding: '10px 16px', background: priceBucket === opt.value ? '#eaf1f8' : '#fff', color: priceBucket === opt.value ? '#094074' : '#334155' }}
              >
                {opt.label}
                {priceBucket === opt.value && <i className="fa-solid fa-check" style={{ fontSize: '11px', color: '#ff8126' }}></i>}
              </button>
            ))}

          {filterKey === 'duration' &&
            durationOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setDurationBucket(opt.value); setOpenFilter(null); }}
                className="w-full flex items-center justify-between text-left font-semibold cursor-pointer border-none"
                style={{ fontSize: '13px', padding: '10px 16px', background: durationBucket === opt.value ? '#eaf1f8' : '#fff', color: durationBucket === opt.value ? '#094074' : '#334155' }}
              >
                {opt.label}
                {durationBucket === opt.value && <i className="fa-solid fa-check" style={{ fontSize: '11px', color: '#ff8126' }}></i>}
              </button>
            ))}

          {(filterKey === 'flight' || filterKey === 'themes') && (
            <p className="text-slate-400 font-semibold" style={{ fontSize: '12px', padding: '12px 16px' }}>
              Coming soon.
            </p>
          )}
        </div>
      )}
      </div>
    );
  };

  return (
    <div onClick={() => openFilter && setOpenFilter(null)}>
      {/* Filter bar */}
      <div
        className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 sm:gap-2 bg-white rounded-xl mb-6 overflow-x-auto sm:overflow-visible"
        style={{ border: '1px solid #eef1f5', padding: '8px 12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="hidden sm:flex items-center gap-1.5 font-black flex-shrink-0"
          style={{ fontSize: '9px', color: '#0f172a', paddingRight: '4px', borderRight: '1px solid #eef1f5', marginRight: '2px' }}
        >
          <i className="fa-solid fa-sliders" style={{ color: '#ff8126', fontSize: '10px' }}></i>
          Filters
        </span>
        <FilterPill filterKey="sort" label="Sort By" />
        <FilterPill filterKey="type" label="Package Type" />
        <FilterPill filterKey="price" label="Price" />
        <FilterPill filterKey="duration" label="Duration" />
        <FilterPill filterKey="flight" label="Flight" />
        <FilterPill filterKey="themes" label="Themes" />
        <button
          type="button"
          onClick={resetAll}
          className="flex items-center gap-1 font-bold cursor-pointer flex-shrink-0 sm:ml-auto whitespace-nowrap"
          style={{ fontSize: '10px', color: '#e23a3a', background: '#fef2f2', border: '1px solid #fde2e2', borderRadius: '8px', padding: '5px 9px' }}
        >
          <i className="fa-solid fa-rotate-left" style={{ fontSize: '9px' }}></i>
          Reset All
        </button>
      </div>

      {filteredSorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-150">
          <p className="text-slate-500 font-semibold">No {destinationName} packages match these filters.</p>
          <button
            type="button"
            onClick={resetAll}
            className="mt-3 inline-block font-bold hover:underline border-none bg-transparent cursor-pointer"
            style={{ color: '#094074' }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSorted.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} layout="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
