import React from 'react';
import SeoContentSection, { type SeoContent } from './SeoContentSection';
import FaqSection from './FaqSection';
import type { PageSeo } from '../lib/pageSeo';
import type { Faq } from '../lib/faqs';

// Written content + FAQs shown above the footer. Uses the admin's content when it has
// been set (Admin Panel -> Page SEO Content), otherwise the page's built-in copy.
export default function PageSeoContent({
  pageSeo,
  fallback,
  fallbackFaqs,
  eyebrow,
  subsectionLevel,
  faqTitle,
}: {
  pageSeo: PageSeo | null;
  fallback?: SeoContent;
  fallbackFaqs?: Faq[];
  eyebrow?: string;
  subsectionLevel?: 'h2' | 'h3';
  faqTitle?: string;
}) {
  const heading = pageSeo?.content_heading?.trim() || fallback?.heading || '';
  const faqs = pageSeo?.faqs?.length ? pageSeo.faqs : fallbackFaqs || [];

  return (
    <>
      {pageSeo?.content?.trim() ? (
        <div className="bg-white" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-bold uppercase" style={{ fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' }}>
              {eyebrow || 'Travel Guide'}
            </span>
            {heading && (
              <h2 className="font-black text-slate-900 mt-2 mb-4" style={{ fontSize: '22px', lineHeight: '1.35' }}>
                {heading}
              </h2>
            )}
            <div className="seo-rich" dangerouslySetInnerHTML={{ __html: pageSeo.content }} />
          </div>
        </div>
      ) : (
        <SeoContentSection
          content={fallback ? { ...fallback, heading } : undefined}
          eyebrow={eyebrow}
          subsectionLevel={subsectionLevel}
        />
      )}
      <FaqSection faqs={faqs} title={faqTitle} />
    </>
  );
}
