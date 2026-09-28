'use client';

import React, { useState } from 'react';
import { buildFaqSchema } from '../lib/schema';
import type { Faq } from '../lib/faqs';

interface FaqSectionProps {
  faqs: Faq[];
  title?: string;
  eyebrow?: string;
}

export default function FaqSection({ faqs, title = 'Frequently Asked Questions', eyebrow = 'FAQs' }: FaqSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const faqSchema = buildFaqSchema(faqs);

  return (
    <div className="bg-white" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <span className="font-bold uppercase" style={{ fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' }}>
          {eyebrow}
        </span>
        <h2 className="font-black text-slate-900 mt-2 mb-4 sm:mb-6" style={{ fontSize: '22px', lineHeight: '1.35' }}>
          {title}
        </h2>

        <div className="flex flex-col" style={{ gap: '12px' }}>
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
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
                    maxHeight: isOpen ? '600px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-in-out',
                  }}
                >
                  <p className="text-slate-600" style={{ fontSize: '13px', lineHeight: '1.7', padding: '0 18px 16px', whiteSpace: 'pre-line' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
