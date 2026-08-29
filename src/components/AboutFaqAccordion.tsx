'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function AboutFaqAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How do I book a trip?',
      answer: 'You can book a trip through our website by selecting your destination, travel dates, and preferred accommodation. Follow the step-by-step process to complete your booking, or use the Customize Package button and our team will build an itinerary for you.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellations made at least 30 days before departure receive a full refund. Cancellations between 15-29 days receive a 50% refund. No refunds for cancellations within 14 days of departure.',
    },
    {
      question: 'Do you offer travel insurance?',
      answer: 'Yes, we offer comprehensive travel insurance options that you can add during the booking process. Coverage includes trip cancellation, medical emergencies, and lost luggage.',
    },
    {
      question: 'What items are included in packages?',
      answer: 'Most of our packages include accommodation, sightseeing transfers, breakfasts, and local guiding. Details are specified on each tour package page under inclusions.',
    },
    {
      question: 'Are customized tour packages possible?',
      answer: "Absolutely. Clicking the 'Customize Package' button in the menu lets you share your requirements, and our travel specialists will design a custom itinerary tailored specifically for you.",
    },
  ];

  return (
    <div className="flex flex-col" style={{ gap: '12px' }}>
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={faq.question}
            className="bg-white border border-slate-200 overflow-hidden"
            style={{ borderRadius: '12px' }}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-3 text-left border-none bg-transparent cursor-pointer"
              style={{ padding: '16px 18px' }}
            >
              <span className="font-bold text-slate-900" style={{ fontSize: '14px' }}>
                {faq.question}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff8126"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div
              style={{
                maxHeight: isOpen ? '300px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out',
              }}
            >
              <p className="text-slate-600" style={{ fontSize: '13px', lineHeight: '1.7', padding: '0 18px 16px' }}>
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
