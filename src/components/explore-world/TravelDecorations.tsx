import React from 'react';

export const TravelDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. TOP-LEFT: Faint airplane with looping dotted flight path */}
      <div className="absolute top-6 left-4 sm:top-10 sm:left-10 opacity-30 md:opacity-40">
        <svg
          className="w-32 h-32 sm:w-44 sm:h-44 text-slate-400"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Looping flight path */}
          <path
            d="M 20 160 C 40 80, 140 60, 120 130 C 100 180, 30 140, 160 30"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            fill="none"
          />
          {/* Airplane silhouette */}
          <g transform="translate(152, 22) rotate(-40) scale(0.8)">
            <path
              d="M14 0L17 5L12 8L16 14L13 15L8 9L3 11L2 9L5 7L1 3L3 2L7 5L14 0Z"
              fill="#ffffff"
            />
          </g>
        </svg>
      </div>

      {/* 2. TOP-RIGHT: Subtle Hot-Air Balloon */}
      <div className="absolute top-10 right-6 sm:top-16 sm:right-16 opacity-25 md:opacity-35">
        <svg
          className="w-20 h-28 sm:w-28 sm:h-36 text-slate-400"
          viewBox="0 0 100 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Balloon outline */}
          <path
            d="M 50 10 C 20 10, 10 35, 10 60 C 10 80, 32 95, 42 105 L 58 105 C 68 95, 90 80, 90 60 C 90 35, 80 10, 50 10 Z"
            stroke="#ffffff"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Vertical balloon stripes */}
          <path
            d="M 50 10 C 35 30, 35 85, 44 105"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <path
            d="M 50 10 C 65 30, 65 85, 56 105"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          {/* Basket ropes & basket */}
          <line x1="44" y1="105" x2="44" y2="120" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="56" y1="105" x2="56" y2="120" stroke="#ffffff" strokeWidth="1.2" />
          <rect
            x="41"
            y="120"
            width="18"
            height="12"
            rx="2"
            stroke="#ffffff"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Dotted cloud path under balloon */}
          <path
            d="M 10 125 Q 50 135 90 120"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      {/* 3. BOTTOM: World Landmark Silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 opacity-15 pointer-events-none flex items-end justify-center overflow-hidden">
        <svg
          className="w-full h-full text-[#FFFFFF] object-cover"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mountain background silhouettes */}
          <path
            d="M 0 160 L 0 120 L 70 80 L 140 130 L 220 70 L 300 140 L 450 60 L 580 130 L 700 50 L 850 130 L 980 75 L 1100 135 L 1200 90 L 1200 160 Z"
            fill="#FFFFFF"
            opacity="0.1"
          />

          {/* Famous Landmarks Outline (Taj Mahal, Pagoda, Eiffel Tower, Big Ben, London Eye) */}
          <g fill="#FFFFFF" opacity="0.35">
            {/* Taj Mahal Silhouette (Left-Center) */}
            <g transform="translate(180, 65)">
              <path d="M 40 85 L 40 40 Q 40 20 60 20 Q 80 20 80 40 L 80 85 Z" />
              {/* Main Dome */}
              <path d="M 50 22 C 50 8, 70 8, 70 22 Z" />
              {/* Spire */}
              <line x1="60" y1="2" x2="60" y2="12" stroke="#FFFFFF" strokeWidth="2" />
              {/* Minarets */}
              <rect x="20" y="30" width="6" height="55" />
              <rect x="94" y="30" width="6" height="55" />
            </g>

            {/* Qutub Minar / Indian Tower (Far Left) */}
            <g transform="translate(80, 50)">
              <path d="M 15 95 L 20 10 L 26 10 L 31 95 Z" />
              <line x1="17" y1="35" x2="29" y2="35" stroke="#fff" strokeWidth="1" />
              <line x1="16" y1="65" x2="30" y2="65" stroke="#fff" strokeWidth="1" />
            </g>

            {/* Pagoda / Asian Temple (Center-Left) */}
            <g transform="translate(360, 55)">
              <path d="M 20 90 L 20 70 L 10 70 L 25 55 L 40 70 L 30 70 L 30 90 Z" />
              <path d="M 22 55 L 14 55 L 25 40 L 36 55 L 28 55 Z" />
              <path d="M 23 40 L 17 40 L 25 28 L 33 40 L 27 40 Z" />
            </g>

            {/* Big Ben Clock Tower (Center-Right) */}
            <g transform="translate(680, 45)">
              <rect x="20" y="30" width="20" height="75" />
              <path d="M 16 30 L 44 30 L 30 5 Z" />
              <circle cx="30" cy="45" r="4" fill="#fff" />
            </g>

            {/* London Eye / Ferris Wheel (Center-Right) */}
            <g transform="translate(560, 45)">
              <circle cx="40" cy="40" r="35" stroke="#FFFFFF" strokeWidth="3" fill="none" />
              <circle cx="40" cy="40" r="4" />
              <line x1="40" y1="40" x2="40" y2="78" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="40" y1="40" x2="20" y2="75" stroke="#FFFFFF" strokeWidth="2" />
              <line x1="40" y1="40" x2="60" y2="75" stroke="#FFFFFF" strokeWidth="2" />
            </g>

            {/* Eiffel Tower Silhouette (Right-Center) */}
            <g transform="translate(840, 35)">
              <path d="M 35 110 L 40 50 L 44 50 L 49 110 L 44 110 L 42 65 L 40 110 Z" />
              <path d="M 40 50 L 44 50 L 42 10 Z" />
              <line x1="33" y1="90" x2="51" y2="90" stroke="#FFFFFF" strokeWidth="3" />
              <line x1="37" y1="65" x2="47" y2="65" stroke="#FFFFFF" strokeWidth="2" />
            </g>

            {/* Modern Skyscrapers / Burj Al Arab Silhouette (Far Right) */}
            <g transform="translate(1000, 40)">
              <path d="M 10 100 Q 35 40 35 10 L 45 100 Z" />
              <rect x="55" y="25" width="22" height="75" />
              <polygon points="85,100 95,35 115,100" />
            </g>
          </g>

          {/* Bottom subtle blue wave */}
          <path
            d="M 0 145 Q 300 160 600 145 T 1200 150 L 1200 160 L 0 160 Z"
            fill="#FFFFFF"
            opacity="0.25"
          />
        </svg>
      </div>
    </div>
  );
};
