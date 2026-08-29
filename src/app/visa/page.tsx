import React from 'react';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Visa Services - Coming Soon | Twin Brothers Holidays',
    description: 'Visa assistance services are coming soon to Twin Brothers Holidays.',
  };
}

export default function VisaPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '110px', paddingBottom: '90px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span
            className="inline-flex items-center justify-center rounded-full mx-auto mb-5"
            style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #094074, #ff8126)' }}
          >
            <i className="fa-solid fa-passport text-white" style={{ fontSize: '24px' }}></i>
          </span>
          <h1 className="font-black text-white mb-3 text-[24px] sm:text-[36px]" style={{ lineHeight: '1.2' }}>
            Visa Services
          </h1>
          <span
            className="inline-block font-black text-white mb-4"
            style={{ fontSize: '12px', letterSpacing: '1.5px', background: 'linear-gradient(135deg, #ff8126, #fd661e)', padding: '6px 18px', borderRadius: '999px' }}
          >
            COMING SOON
          </span>
          <p className="font-semibold" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>
            We're working on bringing you hassle-free visa assistance for your international trips.
            This service isn't live yet — but our travel experts can still guide you on visa requirements
            for your next destination.
          </p>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="bg-white rounded-2xl" style={{ padding: '28px 24px', border: '1px solid #eef1f5' }}>
          <p className="font-bold text-slate-900 mb-4" style={{ fontSize: '14px' }}>
            Need visa guidance right now?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+916005242675"
              className="inline-flex items-center gap-2 font-bold"
              style={{ fontSize: '13px', color: '#fff', background: 'linear-gradient(135deg, #ff8126, #fd661e)', padding: '11px 22px', borderRadius: '8px', textDecoration: 'none' }}
            >
              <i className="fa-solid fa-phone" style={{ fontSize: '13px' }}></i>
              Talk to a Travel Expert
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold"
              style={{ fontSize: '13px', color: '#094074', background: '#eaf1f8', padding: '11px 22px', borderRadius: '8px', textDecoration: 'none' }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
