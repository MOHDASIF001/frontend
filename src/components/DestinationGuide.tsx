import React from 'react';
import Link from 'next/link';
import type { DestinationGuide as Guide } from '../lib/destinationGuides';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinbholidays.com';

export default function DestinationGuide({ guide }: { guide: Guide }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Holidays', item: `${siteUrl}/holidays` },
      { '@type': 'ListItem', position: 3, name: `${guide.name} Tour Packages`, item: `${siteUrl}/holidays/${guide.slug}` },
    ],
  };

  const eyebrow = 'font-bold uppercase';
  const eyebrowStyle = { fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' } as const;
  const h2 = 'font-black text-slate-900 mt-2 mb-4';
  const h2Style = { fontSize: '22px', lineHeight: '1.35' } as const;
  const body = { fontSize: '14px', lineHeight: '1.9' } as const;

  return (
    <div className="bg-[#f8fafc]" style={{ paddingTop: '8px', paddingBottom: '48px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <section style={{ paddingTop: '8px' }}>
          <span className={eyebrow} style={eyebrowStyle}>{guide.name} Travel Guide</span>
          <h2 className={h2} style={h2Style}>{guide.introHeading}</h2>
          {guide.intro.map((p, i) => (
            <p key={i} className="text-slate-600 font-medium" style={{ ...body, marginTop: i ? '14px' : 0 }}>{p}</p>
          ))}
        </section>

        {/* Places */}
        <section style={{ marginTop: '44px' }}>
          <h2 className={h2} style={h2Style}>{guide.placesHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guide.places.map((p) => (
              <article key={p.name} className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-black text-slate-900" style={{ fontSize: '17px' }}>{p.name}</h3>
                <p className="font-bold" style={{ fontSize: '12px', color: '#ff8126', marginTop: '2px' }}>{p.tagline}</p>
                <p className="text-slate-600 font-medium" style={{ fontSize: '13px', lineHeight: '1.75', marginTop: '10px' }}>{p.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Best time */}
        <section style={{ marginTop: '44px' }}>
          <h2 className={h2} style={h2Style}>{guide.seasonsHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guide.seasons.map((s) => (
              <div key={s.period} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="font-bold uppercase" style={{ fontSize: '11px', color: '#094074', letterSpacing: '1px' }}>{s.label}</p>
                <h3 className="font-black text-slate-900" style={{ fontSize: '17px', marginTop: '4px' }}>{s.period}</h3>
                <p className="text-slate-600 font-medium" style={{ fontSize: '13px', lineHeight: '1.75', marginTop: '8px' }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Routes */}
        <section style={{ marginTop: '44px' }}>
          <h2 className={h2} style={h2Style}>{guide.routesHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guide.routes.map((r) => (
              <div key={r.title} className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-black text-slate-900" style={{ fontSize: '16px' }}>{r.title}</h3>
                <p className="font-bold" style={{ fontSize: '12px', color: '#094074', marginTop: '6px' }}>{r.stops}</p>
                <p className="font-semibold text-slate-500" style={{ fontSize: '12px', marginTop: '2px' }}>{r.duration}</p>
                <p className="text-slate-600 font-medium" style={{ fontSize: '13px', lineHeight: '1.75', marginTop: '10px' }}>{r.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Things to do */}
        <section style={{ marginTop: '44px' }}>
          <h2 className={h2} style={h2Style}>{guide.thingsHeading}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {guide.things.map((t) => (
              <li key={t} className="text-slate-600 font-medium flex gap-3" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                <span aria-hidden="true" style={{ color: '#ff8126', fontWeight: 900 }}>&#10003;</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section
          className="rounded-2xl text-center"
          style={{ marginTop: '44px', padding: '32px 20px', background: 'linear-gradient(135deg, #094074, #05213d)' }}
        >
          <h2 className="font-black text-white" style={{ fontSize: '22px', lineHeight: '1.35' }}>
            Plan Your {guide.name} Trip With Twin Brothers Holidays
          </h2>
          <p className="font-medium" style={{ fontSize: '14px', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)', maxWidth: '640px', margin: '10px auto 0' }}>
            Tell us your dates, budget and group size and our team will build a {guide.name} itinerary around you,
            including hotels, cabs and sightseeing.
          </p>
          <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: '20px' }}>
            <Link
              href="/contact-us"
              className="font-bold"
              style={{ background: '#ff8126', color: '#fff', padding: '12px 26px', borderRadius: '999px', fontSize: '14px', textDecoration: 'none' }}
            >
              Get a Custom Itinerary
            </Link>
            <Link
              href="/holidays"
              className="font-bold"
              style={{ border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', padding: '12px 26px', borderRadius: '999px', fontSize: '14px', textDecoration: 'none' }}
            >
              Browse All Holiday Packages
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section style={{ marginTop: '44px' }}>
          <span className={eyebrow} style={eyebrowStyle}>FAQs</span>
          <h2 className={h2} style={h2Style}>{guide.name} Tour: Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {guide.faqs.map((f) => (
              <details key={f.question} className="bg-white rounded-2xl border border-slate-200 group" style={{ padding: '16px 20px' }}>
                <summary className="font-bold text-slate-900 cursor-pointer" style={{ fontSize: '15px', lineHeight: '1.5' }}>
                  {f.question}
                </summary>
                <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.8', marginTop: '10px' }}>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
