'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cards = [
  {
    id: 'domestic',
    href: '/destinations?dest=domestic',
    src: '/images/Domerstic-cards.jpg',
    alt: 'Domestic travel destinations in India',
    label: 'Domestic',
    width: 1492,
    height: 968,
    overlayColor: '#FF6500',
    textGradient: 'linear-gradient(135deg, #0d3a94, #082663)',
  },
  {
    id: 'international',
    href: '/destinations?dest=international',
    src: '/images/internation-cards.jpg',
    alt: 'International travel destinations and holidays',
    label: 'International',
    width: 1465,
    height: 937,
    overlayColor: '#082663',
    textGradient: 'linear-gradient(135deg, #ff8126, #FF6500)',
  },
];

export const DestinationCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-[1040px] mx-auto px-4 my-4 md:my-8">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className="group relative block w-full overflow-hidden rounded-[31px] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/80 focus-visible:ring-offset-2"
          style={{ aspectRatio: `${card.width} / ${card.height}` }}
        >
          <Image
            src={card.src}
            alt={card.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 640px"
          />

          {/* Semi-transparent color overlay (fades in on hover/focus) */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 group-focus-visible:opacity-30 transition-opacity duration-300"
            style={{ backgroundColor: card.overlayColor }}
            aria-hidden="true"
          />

          {/* Centered hover label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h3
              className="font-black text-2xl sm:text-3xl md:text-4xl tracking-wide opacity-0 scale-[0.96] translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:scale-100 group-focus-visible:translate-y-0 transition-all duration-300"
              style={{
                backgroundImage: card.textGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {card.label.toUpperCase()}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};
