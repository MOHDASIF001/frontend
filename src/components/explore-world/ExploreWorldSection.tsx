import React from 'react';
import { HeaderSection } from './HeaderSection';
import { DestinationCards } from './DestinationCards';
import { TravelDecorations } from './TravelDecorations';

export const ExploreWorldSection: React.FC = () => {
  return (
    <section
      id="explore-world"
      className="relative w-full py-8 sm:py-12 md:py-14 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden flex flex-col justify-between"
      aria-label="Explore World - Twin Brothers Holidays"
    >
      {/* Overlay + subtle grid pattern, matching the site's other navy hero sections */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />

      {/* Background Travel Decorative Elements */}
      <TravelDecorations />

      {/* Main Section Content Wrapper */}
      <div className="relative z-10 w-full max-w-[1450px] mx-auto flex flex-col items-center">
        {/* Section Top Header (Eyebrow, Title, Divider, Subtitle) */}
        <HeaderSection />

        {/* Destination Cards — side-by-side on desktop, stacked on mobile */}
        <DestinationCards />
      </div>
    </section>
  );
};

export default ExploreWorldSection;
