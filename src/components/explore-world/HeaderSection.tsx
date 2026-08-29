import React from 'react';
import { MapPin } from 'lucide-react';
import { GlobeLetterO } from './GlobeLetterO';

export const HeaderSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center select-none relative z-10 px-4 pt-4 pb-0 md:pb-4">
      {/* 1. TOP EYEBROW */}
      <div className="inline-flex items-center gap-2 mb-0 sm:mb-1">
        <span className="font-script text-2xl sm:text-3xl md:text-4xl text-[#FF6500] font-normal tracking-wide transform -rotate-1">
          Start Your Journey
        </span>

        {/* Airplane & Dotted Flight Trail */}
        <div className="relative inline-flex items-center ml-1">
          <svg
            className="w-12 h-6 sm:w-16 sm:h-8 text-[#FF6500] overflow-visible"
            viewBox="0 0 60 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dotted curve trail */}
            <path
              d="M2 22 C 15 28, 25 10, 42 12"
              stroke="#FF6500"
              strokeWidth="2"
              strokeDasharray="3 3"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            {/* Airplane icon */}
            <g transform="translate(38, 4) rotate(15)">
              <path
                d="M14 0L17 5L12 8L16 14L13 15L8 9L3 11L2 9L5 7L1 3L3 2L7 5L14 0Z"
                fill="#FF6500"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* 2. MAIN HEADING */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-1 sm:mb-2">
        <span className="text-white mr-2 md:mr-3">Explore</span>
        <span className="text-[#FF6500] inline-flex items-center">
          W<GlobeLetterO color="#FF6500" />rld
        </span>
      </h1>

      {/* 3. LOCATION DIVIDER */}
      <div className="flex items-center justify-center gap-2 my-0 sm:my-3 w-full max-w-[260px] sm:max-w-[320px]">
        {/* Left Orange Line with dot */}
        <div className="flex-1 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6500]" />
          <div className="h-[2px] w-full bg-[#FF6500]" />
        </div>

        {/* Center Navy Pin Icon */}
        <div className="p-1 rounded-full bg-white shadow-sm border border-[#082663]/10 text-[#082663]">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#082663]" strokeWidth={2.2} />
        </div>

        {/* Right Orange Line with dot */}
        <div className="flex-1 flex items-center">
          <div className="h-[2px] w-full bg-[#FF6500]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6500]" />
        </div>
      </div>

      {/* 4. SUBTITLE */}
      <p className="text-white/75 font-medium text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-1">
        Choose your perfect travel experience and create unforgettable memories
      </p>
    </div>
  );
};
