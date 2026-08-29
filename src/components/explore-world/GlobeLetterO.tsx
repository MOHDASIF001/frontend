'use client';
import React from 'react';

interface GlobeLetterOProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const GlobeLetterO: React.FC<GlobeLetterOProps> = ({
  className = '',
  color = '#FF6500',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center align-baseline relative mx-[0.02em] ${className}`}
      aria-label="O with globe"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-[0.82em] h-[0.82em] inline-block align-[-0.08em]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        strokeWidth="9"
      >
        {/* Outer Circle of the O */}
        <circle cx="50" cy="50" r="44" strokeWidth="10" />

        {/* Equator / Horizontal Latitudes */}
        <ellipse cx="50" cy="50" rx="44" ry="18" strokeWidth="6" strokeDasharray="none" />
        <line x1="6" y1="50" x2="94" y2="50" strokeWidth="6" />

        {/* Central Prime Meridian / Vertical Longitude */}
        <line x1="50" y1="6" x2="50" y2="94" strokeWidth="6" />
        <ellipse cx="50" cy="50" rx="20" ry="44" strokeWidth="6" />

        {/* Small continents hint */}
        <circle cx="34" cy="32" r="3.5" fill={color} stroke="none" />
        <circle cx="68" cy="38" r="4" fill={color} stroke="none" />
        <circle cx="42" cy="68" r="4.5" fill={color} stroke="none" />
        <circle cx="64" cy="65" r="3" fill={color} stroke="none" />
      </svg>
    </span>
  );
};
