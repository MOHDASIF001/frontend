import React from 'react';
import Link from 'next/link';
import AboutFaqAccordion from '../../components/AboutFaqAccordion';
import { API_BASE_URL } from '../../config';

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=about-us.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "About Us - Twin Brothers Holidays",
      description: "Learn more about Twin Brothers Holidays — holidays, hotels, cabs and activities across India and beyond.",
    };
  }
}

const services = [
  { label: 'Holidays', desc: 'Curated multi-day packages across India & beyond', icon: 'fa-umbrella-beach', href: '/holidays' },
  { label: 'Hotels', desc: 'Handpicked stays from budget to luxury', icon: 'fa-hotel', href: '/hotel' },
  { label: 'Cabs', desc: 'Reliable local & outstation taxi service', icon: 'fa-taxi', href: '/cabs' },
  { label: 'Activities', desc: 'Real, bookable local experiences', icon: 'fa-person-hiking', href: '/activities' },
  { label: 'Group Tours', desc: 'Fixed-departure trips for groups & families', icon: 'fa-people-group', href: '/group-tours' },
];

const destinations = [
  'Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Yousmarg', 'Leh', 'Manali', 'Munnar', 'Goa', 'Dubai',
];

export default function AboutUsPage() {
  return (
    <div className="bg-[#f8fafc]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#094074] to-[#05213d] text-white relative overflow-hidden">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '56px' }}>
          <span
            className="inline-block font-bold rounded-full mb-4"
            style={{ fontSize: '11px', color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 16px', letterSpacing: '1px' }}
          >
            ABOUT TWIN BROTHERS HOLIDAYS
          </span>
          <h1 className="font-black" style={{ fontSize: '30px', lineHeight: '1.25', maxWidth: '620px' }}>
            Traveller-first, destination by destination — planning trips that feel effortless.
          </h1>
          <p className="text-white/75 font-semibold mt-4" style={{ fontSize: '14px', lineHeight: '1.8', maxWidth: '580px' }}>
            We&apos;re a travel company building holiday packages, hotel stays, cabs and local activities
            across India and beyond — with deep, ground-level expertise in destinations like Kashmir, one
            idea guiding all of it: you shouldn&apos;t need to be a local to travel like one.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {services.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center gap-2 font-bold text-white"
                style={{ fontSize: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '8px 16px', textDecoration: 'none' }}
              >
                <i className={`fa-solid ${s.icon}`} style={{ color: '#ff8126' }}></i>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Who we are */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '16px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative" style={{ minHeight: '320px' }}>
            <img
              src="/images/hero-img-4.jpg"
              alt="Twin Brothers Holidays team on a Kashmir trip"
              className="w-full h-full object-cover"
              style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(9,64,116,0.15)' }}
            />
            <img
              src="/images/hero-img-5.jpg"
              alt="Kashmir travel experience"
              className="hidden sm:block absolute object-cover"
              style={{ width: '130px', height: '130px', bottom: '-18px', left: '-18px', borderRadius: '16px', border: '5px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
            />
            <img
              src="/images/hero-img-1.jpg"
              alt="Kashmir houseboat travel"
              className="hidden sm:block absolute object-cover"
              style={{ width: '130px', height: '130px', top: '-18px', right: '-18px', borderRadius: '16px', border: '5px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
            />
          </div>

          <div>
            <span className="font-bold uppercase" style={{ fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' }}>Who We Are</span>
            <h2 className="font-black text-slate-900 mt-2 mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
              Twin Brothers Holidays
            </h2>
            <p className="text-slate-600 font-medium" style={{ fontSize: '14px', lineHeight: '1.9' }}>
              Discover the world with ease and inspiration through Twin Brothers Holidays, your guide to
              unforgettable journeys and seamless travel experiences across India — with destinations from
              Kashmir to Ladakh, Kerala, Goa and beyond. We specialize in tailored tour planning, cozy
              accommodations, and reliable local transportation — so the only thing you have to plan is
              what to pack.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              {[
                { icon: 'fa-person-walking-luggage', text: 'Great travel experience, every time' },
                { icon: 'fa-wallet', text: 'Competitive, transparent pricing' },
                { icon: 'fa-globe', text: 'Freedom to discover, confidence to explore' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fff3eb' }}
                  >
                    <i className={`fa-solid ${f.icon}`} style={{ color: '#ff8126', fontSize: '13px' }}></i>
                  </span>
                  <span className="font-bold text-slate-800" style={{ fontSize: '13.5px' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission / Vision / Why Choose Us */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '56px', paddingBottom: '16px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Our Mission',
              icon: 'fa-bullseye',
              text: 'To deliver exceptional travel services that guarantee maximum satisfaction, complete safety, and lifetime memories for every traveller, wherever in India (or beyond) they choose to go.',
            },
            {
              title: 'Our Vision',
              icon: 'fa-eye',
              text: 'To be the most reliable, client-centric tour package curator across India, known for genuine, ground-level hospitality in every destination we serve.',
            },
            {
              title: 'Why Choose Us',
              icon: 'fa-star',
              text: 'Deep local expertise, a well-maintained vehicle fleet, handpicked hotel partners, and a responsive team focused on flawless trip execution.',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-white border border-slate-150 hover:border-[#ff8126] transition-colors"
              style={{ borderRadius: '20px', padding: '26px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
            >
              <span
                className="flex items-center justify-center mb-4"
                style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff3eb' }}
              >
                <i className={`fa-solid ${c.icon}`} style={{ color: '#ff8126', fontSize: '17px' }}></i>
              </span>
              <h3 className="font-black text-slate-900 mb-2" style={{ fontSize: '16px' }}>{c.title}</h3>
              <p className="text-slate-500 font-medium" style={{ fontSize: '13px', lineHeight: '1.8' }}>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What we offer */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '56px', paddingBottom: '16px' }}>
        <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '22px' }}>What We Offer</h2>
        <p className="text-slate-500 font-medium mb-6" style={{ fontSize: '13.5px' }}>Everything you need for your next trip, in one place.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white border border-slate-150 hover:border-[#ff8126] hover:shadow-md transition-all text-center"
              style={{ borderRadius: '16px', padding: '22px 14px', textDecoration: 'none' }}
            >
              <span
                className="flex items-center justify-center mx-auto mb-3"
                style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fff3eb' }}
              >
                <i className={`fa-solid ${s.icon}`} style={{ color: '#ff8126', fontSize: '17px' }}></i>
              </span>
              <h3 className="font-black text-slate-900" style={{ fontSize: '13.5px' }}>{s.label}</h3>
              <p className="text-slate-500 font-medium mt-1" style={{ fontSize: '11px', lineHeight: '1.5' }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Where we travel */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '56px', paddingBottom: '16px' }}>
        <h2 className="font-black text-slate-900 mb-2" style={{ fontSize: '22px' }}>Where We Travel</h2>
        <p className="text-slate-500 font-medium mb-6" style={{ fontSize: '13.5px' }}>From Kashmir&apos;s valleys to destinations across India and beyond.</p>
        <div className="flex flex-wrap gap-2.5">
          {destinations.map((d) => (
            <span
              key={d}
              className="font-bold text-slate-700 bg-white border border-slate-200"
              style={{ fontSize: '13px', borderRadius: '999px', padding: '9px 18px' }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '56px', paddingBottom: '20px' }}>
        <h2 className="font-black text-slate-900 mb-6" style={{ fontSize: '22px' }}>Frequently Asked Questions</h2>
        <div style={{ maxWidth: '760px' }}>
          <AboutFaqAccordion />
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '20px', paddingBottom: '56px' }}>
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: 'linear-gradient(135deg, #ff8126, #f25b22)', borderRadius: '24px', padding: '36px' }}
        >
          <div className="text-center sm:text-left">
            <h3 className="font-black text-white" style={{ fontSize: '20px' }}>Ready to plan your trip?</h3>
            <p className="text-white/85 font-semibold mt-1" style={{ fontSize: '13px' }}>Talk to our travel specialists and get a custom itinerary.</p>
          </div>
          <Link
            href="/contact-us"
            className="font-black text-center flex-shrink-0"
            style={{ background: '#fff', color: '#094074', fontSize: '13px', borderRadius: '999px', padding: '14px 32px', letterSpacing: '0.5px', textDecoration: 'none' }}
          >
            Contact Us <i className="fa-solid fa-arrow-right ml-1" style={{ fontSize: '11px' }}></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
