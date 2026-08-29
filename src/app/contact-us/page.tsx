import React from 'react';
import ContactNowButton from '../../components/ContactNowButton';
import { API_BASE_URL } from '../../config';

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=contact-us.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "Contact Us - Twin Brothers Holidays",
      description: "Contact Twin Brothers Holidays for holidays, hotels, cabs and activities across India and beyond.",
    };
  }
}

const infoCards = [
  {
    icon: 'fa-square-phone',
    title: 'Phone',
    desc: 'Feel free to call us anytime. Our phone lines are open 24/7.',
    action: '+91 6005242675',
    href: 'tel:+916005242675',
  },
  {
    icon: 'fa-envelope',
    title: 'Email',
    desc: 'Send us an email and we will respond within 12 hours.',
    action: 'info@twinbholidays.com',
    href: 'mailto:info@twinbholidays.com',
  },
  {
    icon: 'fa-location-dot',
    title: 'Location',
    desc: 'Srinagar, Jammu & Kashmir, India.',
    action: 'View on Google Maps',
    href: 'https://maps.app.goo.gl/d25L2',
    external: true,
  },
];

export default function ContactUsPage() {
  return (
    <div className="bg-[#f8fafc]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#094074] to-[#05213d] text-white relative overflow-hidden">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
          <span
            className="inline-block font-bold rounded-full mb-4"
            style={{ fontSize: '11px', color: '#fff', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 16px', letterSpacing: '1px' }}
          >
            GET IN TOUCH
          </span>
          <h1 className="font-black" style={{ fontSize: '30px', lineHeight: '1.25' }}>Contact Us</h1>
          <p className="text-white/75 font-semibold mt-3 mx-auto" style={{ fontSize: '14px', maxWidth: '480px' }}>
            Have a question about a trip, a booking, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '-36px', paddingBottom: '16px', position: 'relative', zIndex: 10 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {infoCards.map((c) => (
            <div
              key={c.title}
              className="bg-white border border-slate-150 hover:border-[#ff8126] transition-colors flex flex-col items-center text-center"
              style={{ borderRadius: '20px', padding: '30px 24px', boxShadow: '0 10px 30px rgba(9,64,116,0.1)' }}
            >
              <span
                className="flex items-center justify-center mb-4"
                style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff3eb' }}
              >
                <i className={`fa-solid ${c.icon}`} style={{ color: '#ff8126', fontSize: '20px' }}></i>
              </span>
              <h3 className="font-black text-slate-900 mb-2" style={{ fontSize: '16px' }}>{c.title}</h3>
              <p className="text-slate-500 font-medium" style={{ fontSize: '12.5px', lineHeight: '1.6', marginBottom: '18px' }}>{c.desc}</p>
              <a
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className="font-black mt-auto"
                style={{ color: '#ff8126', fontSize: '13.5px', textDecoration: 'none' }}
              >
                {c.action} <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry CTA */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div
          className="flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #094074, #05213d)', borderRadius: '24px', padding: '36px' }}
        >
          <div className="text-center lg:text-left">
            <span className="font-bold uppercase" style={{ fontSize: '11px', color: '#ff8126', letterSpacing: '1.5px' }}>Get in Touch</span>
            <h2 className="font-black text-white mt-2 mb-2" style={{ fontSize: '22px' }}>Feel Free to Contact With Us</h2>
            <p className="text-white/70 font-medium" style={{ fontSize: '13.5px', lineHeight: '1.8', maxWidth: '520px' }}>
              Planning your dream holiday shouldn&apos;t be stressful. Reach out to our travel specialists and let us co-create an itinerary that suits your pace, preference, and price.
            </p>
          </div>
          <div className="flex-shrink-0">
            <ContactNowButton />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '56px' }}>
        <h2 className="font-black text-slate-900 mb-4 text-center" style={{ fontSize: '20px' }}>Our Office Location</h2>
        <div className="overflow-hidden border border-slate-150" style={{ borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5609.206992678857!2d74.44962342401263!3d34.07020208169301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1a540caecc86f%3A0x4fe49a27416f2ca7!2sTwin%20brothers%20holidays!5e1!3m2!1sen!2sin!4v1739807933760!5m2!1sen!2sin"
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
