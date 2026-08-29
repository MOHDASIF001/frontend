'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';

const denominations = [1000, 2500, 5000, 10000, 15000, 20000];

export default function GiftCardsPage() {
  const router = useRouter();

  const [selectedAmount, setSelectedAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerMobile, setBuyerMobile] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const amount = useCustom ? Number(customAmount) || 0 : selectedAmount;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!amount || amount < 500) newErrors.amount = 'Please choose or enter a valid amount (min ₹500)';

    if (!recipientName.trim()) newErrors.recipientName = "Recipient's name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient's email is required";
    } else if (!emailRegex.test(recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address';
    }

    if (!buyerName.trim()) newErrors.buyerName = 'Your name is required';

    if (!buyerEmail.trim()) {
      newErrors.buyerEmail = 'Your email is required';
    } else if (!emailRegex.test(buyerEmail)) {
      newErrors.buyerEmail = 'Please enter a valid email address';
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!buyerMobile.trim()) {
      newErrors.buyerMobile = 'Your mobile number is required';
    } else if (!mobileRegex.test(buyerMobile.trim())) {
      newErrors.buyerMobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms & Conditions to proceed';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else {
      setErrors({});
      setShowPaymentModal(true);
    }
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.length < 8) {
      setUtrError('Please enter a valid transaction UTR number (min 8 digits)');
      return;
    }
    setUtrError('');
    setSubmitting(true);

    const message =
      `Gift Card Amount: ₹${amount.toLocaleString('en-IN')}\n` +
      `Recipient Name: ${recipientName}\n` +
      `Recipient Email: ${recipientEmail}\n` +
      (personalMessage.trim() ? `Personal Message: ${personalMessage.trim()}\n` : '') +
      `UTR / Transaction ID: ${utrNumber}`;

    try {
      await fetch(`${API_BASE_URL}/submit_inquiry.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: buyerName,
          email: buyerEmail,
          phone: buyerMobile,
          subject: `Gift Card Purchase - ₹${amount.toLocaleString('en-IN')}`,
          message,
          service_type: 'Gift Card',
          source_page: '/gift-cards',
          price: amount,
        }),
      });
    } catch (err) {
      console.error('Error submitting gift card order:', err);
    }

    setSubmitting(false);
    router.push(`/thank-you?giftcard=1&amount=${amount}&recipient=${encodeURIComponent(recipientName)}`);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero */}
      <div
        className="relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        style={{ paddingTop: '110px', paddingBottom: '50px' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left">
              <span
                className="inline-block font-black text-white mb-4"
                style={{ fontSize: '11px', letterSpacing: '1.5px', background: 'linear-gradient(135deg, #ff8126, #fd661e)', padding: '6px 16px', borderRadius: '999px' }}
              >
                TWIN BROTHERS GIFT CARDS
              </span>
              <h1 className="font-black text-white mb-3 text-[26px] sm:text-[40px]" style={{ lineHeight: '1.2' }}>
                Give the Gift of Travel
              </h1>
              <p className="font-semibold mx-auto lg:mx-0" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', maxWidth: '480px' }}>
                A Twin Brothers Holidays Gift Card lets your loved ones choose their own adventure —
                redeemable across our holiday packages, hotels, cabs and activities.
              </p>
            </div>

            {/* Gift card visual */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="relative w-full overflow-hidden"
                style={{ maxWidth: '520px', aspectRatio: '1.6 / 1', borderRadius: '18px', boxShadow: '0 25px 60px rgba(0,0,0,0.45)', containerType: 'inline-size' }}
              >
                {/* Background photo */}
                <img src="/images/gift-card-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                {/* Navy overlay for legibility */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(100deg, rgba(6,14,32,0.85) 0%, rgba(6,14,32,0.55) 38%, rgba(6,14,32,0.08) 62%, rgba(6,14,32,0.3) 100%)' }}
                ></div>
                {/* Bottom fade for readability of bottom row */}
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{ height: '35%', background: 'linear-gradient(to top, rgba(6,14,32,0.75), transparent)' }}
                ></div>
                {/* Gold inner frame */}
                <div className="absolute rounded-[12px] pointer-events-none" style={{ inset: '1.35cqw', border: '1px solid rgba(212,175,90,0.55)' }}></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between" style={{ padding: '2.3cqw 3.5cqw' }}>
                  {/* Top: logo + tagline */}
                  <div>
                    <span className="font-black" style={{ fontSize: '2.6cqw' }}>
                      <span className="text-white">TwinB</span> <span style={{ color: '#ff8126' }}>Holidays</span>
                    </span>
                    <p className="font-semibold" style={{ fontSize: '1.4cqw', color: 'rgba(212,175,90,0.9)', letterSpacing: '0.15cqw', marginTop: '0.15cqw' }}>
                      YOUR JOURNEY, OUR PASSION
                    </p>
                  </div>

                  {/* Middle: cursive heading */}
                  <div>
                    <p className="font-bold text-white" style={{ fontSize: '1.6cqw', letterSpacing: '0.4cqw' }}>— THE GIFT OF —</p>
                    <p style={{ fontFamily: "'Alex Brush', cursive", fontSize: '7cqw', lineHeight: '1', color: '#e8c874', marginTop: '0.3cqw' }}>
                      Memories
                    </p>
                  </div>

                  {/* Icon row */}
                  <div className="flex items-center" style={{ gap: '2.5cqw' }}>
                    {[
                      { icon: 'fa-suitcase-rolling', label: 'Holidays' },
                      { icon: 'fa-hotel', label: 'Hotels' },
                      { icon: 'fa-car', label: 'Cabs' },
                      { icon: 'fa-compass', label: 'Activities' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center">
                        <span
                          className="flex items-center justify-center rounded-full"
                          style={{ width: '4.4cqw', height: '4.4cqw', border: '1px solid rgba(212,175,90,0.6)' }}
                        >
                          <i className={`fa-solid ${item.icon}`} style={{ fontSize: '1.75cqw', color: '#e8c874' }}></i>
                        </span>
                        <span className="font-bold" style={{ fontSize: '1.1cqw', letterSpacing: '0.08cqw', color: 'rgba(255,255,255,0.85)', marginTop: '0.4cqw' }}>
                          {item.label.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom row: value + tagline (kept left so the ribbon+bow has room on the right) */}
                  <div style={{ borderTop: '1px solid rgba(212,175,90,0.3)', paddingTop: '1.15cqw', maxWidth: '58%' }}>
                    <span className="block font-semibold" style={{ fontSize: '1.5cqw', color: 'rgba(255,255,255,0.75)' }}>
                      <i className="fa-solid fa-heart" style={{ color: '#e8c874', marginRight: '0.8cqw', fontSize: '1.3cqw' }}></i>
                      Thank you for being part of our journey
                    </span>
                    <span className="block font-black" style={{ fontSize: '3.2cqw', color: '#fff', marginTop: '0.3cqw' }}>
                      ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Vertical gold ribbon with bow, right side */}
                <div
                  className="absolute inset-y-0 pointer-events-none"
                  style={{
                    right: '15%',
                    width: '5%',
                    background: 'linear-gradient(90deg, #9c6f28 0%, #e3b25a 22%, #fdf0cc 50%, #e3b25a 78%, #9c6f28 100%)',
                    boxShadow: '0 0 10px rgba(0,0,0,0.25)',
                  }}
                ></div>
                <svg
                  viewBox="0 0 160 140"
                  className="absolute pointer-events-none"
                  style={{ width: '21.54cqw', height: '18.85cqw', right: 'calc(15% - 10.77cqw)', top: '56%', transform: 'translateY(-50%)', filter: 'drop-shadow(0 1.54cqw 1.92cqw rgba(0,0,0,0.4))' }}
                >
                  <defs>
                    <linearGradient id="bowGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fdf0cc" />
                      <stop offset="45%" stopColor="#dba847" />
                      <stop offset="100%" stopColor="#9c6f28" />
                    </linearGradient>
                    <linearGradient id="bowShine" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fffbe9" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#fffbe9" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Tails (V-notched ends) */}
                  <path
                    d="M80,66 L58,132 L70,120 L76,132 L80,76 L84,132 L90,120 L102,132 Z"
                    fill="url(#bowGold)"
                    stroke="#7d5a1e"
                    strokeWidth="0.6"
                  />

                  {/* Left loop */}
                  <path
                    d="M78,62 C55,30 20,12 10,32 C2,50 22,68 78,62 Z"
                    fill="url(#bowGold)"
                    stroke="#7d5a1e"
                    strokeWidth="0.6"
                  />
                  <path d="M72,55 C56,36 30,26 20,36 C15,44 32,52 72,55 Z" fill="url(#bowShine)" />

                  {/* Right loop */}
                  <path
                    d="M82,62 C105,30 140,12 150,32 C158,50 138,68 82,62 Z"
                    fill="url(#bowGold)"
                    stroke="#7d5a1e"
                    strokeWidth="0.6"
                  />
                  <path d="M88,55 C104,36 130,26 140,36 C145,44 128,52 88,55 Z" fill="url(#bowShine)" />

                  {/* Knot */}
                  <rect x="64" y="54" width="32" height="20" rx="5" fill="url(#bowGold)" stroke="#7d5a1e" strokeWidth="0.6" />
                  <rect x="64" y="54" width="32" height="7" rx="3.5" fill="url(#bowShine)" />
                </svg>

                {/* Corner ribbon tag */}
                <div className="absolute" style={{ top: 0, right: '4.23cqw', width: '9.62cqw', filter: 'drop-shadow(0 1.15cqw 1.92cqw rgba(0,0,0,0.35))' }}>
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{
                      background: 'linear-gradient(160deg, #f6dd9e, #c99a3f)',
                      padding: '1.73cqw 0.77cqw 3.08cqw',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
                    }}
                  >
                    <i className="fa-solid fa-gift" style={{ fontSize: '2.5cqw', color: '#0f172a' }}></i>
                    <span className="font-black" style={{ fontSize: '1.06cqw', color: '#0f172a', letterSpacing: '0.1cqw', marginTop: '0.58cqw' }}>
                      GIFT<br />CARD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Form */}
          <form onSubmit={handleContinue} className="lg:col-span-8 flex flex-col gap-6">
            {/* Choose Amount */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #eef1f5' }}>
              <div className="bg-amber-50 border-b border-amber-200" style={{ padding: '14px 20px' }}>
                <h3 className="font-black text-slate-900 flex items-center gap-2" style={{ fontSize: '15px' }}>
                  <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#ff8126' }}></i>
                  Choose Gift Card Value
                </h3>
              </div>
              <div style={{ padding: '20px' }}>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-4">
                  {denominations.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => { setUseCustom(false); setSelectedAmount(d); }}
                      className="font-bold cursor-pointer"
                      style={{
                        fontSize: '12.5px',
                        padding: '10px 6px',
                        borderRadius: '8px',
                        border: `1px solid ${!useCustom && selectedAmount === d ? '#094074' : '#e2e8f0'}`,
                        background: !useCustom && selectedAmount === d ? '#eaf1f8' : '#fff',
                        color: !useCustom && selectedAmount === d ? '#094074' : '#334155',
                      }}
                    >
                      ₹{d.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
                  <span className="font-bold text-slate-700" style={{ fontSize: '12.5px' }}>Enter a custom amount</span>
                </label>
                {useCustom && (
                  <input
                    type="number"
                    min={500}
                    placeholder="Enter amount (min ₹500)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="form-control font-semibold"
                    style={{ fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', maxWidth: '240px' }}
                  />
                )}
                {errors.amount && <span className="text-red-500 font-bold block mt-2" style={{ fontSize: '11px' }}>{errors.amount}</span>}
              </div>
            </div>

            {/* Recipient details */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #eef1f5' }}>
              <div className="bg-amber-50 border-b border-amber-200" style={{ padding: '14px 20px' }}>
                <h3 className="font-black text-slate-900 flex items-center gap-2" style={{ fontSize: '15px' }}>
                  <i className="fa-solid fa-user-group" style={{ color: '#ff8126' }}></i>
                  Who's This Gift For?
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ padding: '20px' }}>
                <div>
                  <label className="font-bold text-slate-900 block mb-1" style={{ fontSize: '12px' }}>Recipient's Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="form-control font-semibold"
                    style={{ fontSize: '13px', border: `1px solid ${errors.recipientName ? '#ef4444' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px 12px', width: '100%' }}
                  />
                  {errors.recipientName && <span className="text-red-500 font-bold block mt-1" style={{ fontSize: '10.5px' }}>{errors.recipientName}</span>}
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1" style={{ fontSize: '12px' }}>Recipient's Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="form-control font-semibold"
                    style={{ fontSize: '13px', border: `1px solid ${errors.recipientEmail ? '#ef4444' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px 12px', width: '100%' }}
                  />
                  {errors.recipientEmail && <span className="text-red-500 font-bold block mt-1" style={{ fontSize: '10.5px' }}>{errors.recipientEmail}</span>}
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-900 block mb-1" style={{ fontSize: '12px' }}>Personal Message (Optional)</label>
                  <textarea
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    rows={3}
                    placeholder="Write a short message for the recipient..."
                    className="form-control font-semibold"
                    style={{ fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Buyer details */}
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #eef1f5' }}>
              <div className="bg-amber-50 border-b border-amber-200" style={{ padding: '14px 20px' }}>
                <h3 className="font-black text-slate-900 flex items-center gap-2" style={{ fontSize: '15px' }}>
                  <i className="fa-solid fa-address-card" style={{ color: '#ff8126' }}></i>
                  Your Details
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ padding: '20px' }}>
                <div>
                  <label className="font-bold text-slate-900 block mb-1" style={{ fontSize: '12px' }}>Your Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="form-control font-semibold"
                    style={{ fontSize: '13px', border: `1px solid ${errors.buyerName ? '#ef4444' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px 12px', width: '100%' }}
                  />
                  {errors.buyerName && <span className="text-red-500 font-bold block mt-1" style={{ fontSize: '10.5px' }}>{errors.buyerName}</span>}
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1" style={{ fontSize: '12px' }}>Your Mobile Number</label>
                  <input
                    type="tel"
                    value={buyerMobile}
                    onChange={(e) => setBuyerMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={10}
                    className="form-control font-semibold"
                    style={{ fontSize: '13px', border: `1px solid ${errors.buyerMobile ? '#ef4444' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px 12px', width: '100%' }}
                  />
                  {errors.buyerMobile && <span className="text-red-500 font-bold block mt-1" style={{ fontSize: '10.5px' }}>{errors.buyerMobile}</span>}
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-900 block mb-1" style={{ fontSize: '12px' }}>Your Email</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="form-control font-semibold"
                    style={{ fontSize: '13px', border: `1px solid ${errors.buyerEmail ? '#ef4444' : '#e2e8f0'}`, borderRadius: '8px', padding: '10px 12px', width: '100%' }}
                  />
                  {errors.buyerEmail && <span className="text-red-500 font-bold block mt-1" style={{ fontSize: '10.5px' }}>{errors.buyerEmail}</span>}
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ marginTop: '3px' }} />
                  <span className="font-semibold text-slate-500" style={{ fontSize: '11.5px', lineHeight: '1.5' }}>
                    I agree to the <span style={{ color: '#ff8126', fontWeight: 700 }}>Terms & Conditions</span> and{' '}
                    <span style={{ color: '#ff8126', fontWeight: 700 }}>Privacy Policy</span> of Twin Brothers Holidays.
                  </span>
                </label>
                {errors.agreeTerms && <span className="text-red-500 font-bold block mt-2" style={{ fontSize: '10.5px' }}>{errors.agreeTerms}</span>}
              </div>
            </div>

            <button
              type="submit"
              className="font-black text-white cursor-pointer"
              style={{ fontSize: '15px', letterSpacing: '1px', background: 'linear-gradient(135deg, #ff8126, #fd661e)', padding: '14px', borderRadius: '10px', border: 'none' }}
            >
              Proceed to Pay ₹{amount.toLocaleString('en-IN')}
            </button>
          </form>

          {/* Right: How it works + Why */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl" style={{ border: '1px solid #eef1f5', padding: '20px' }}>
              <h3 className="font-black text-slate-900 mb-4" style={{ fontSize: '15px' }}>How It Works</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: 'fa-gift', title: 'Choose & Personalize', desc: 'Pick a value and add a personal message for the recipient.' },
                  { icon: 'fa-credit-card', title: 'Pay Securely', desc: 'Complete payment via UPI and share your transaction ID.' },
                  { icon: 'fa-envelope-circle-check', title: 'Delivered by Email', desc: 'The recipient receives their gift card details over email.' },
                ].map((step, i) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <span
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #094074, #ff8126)' }}
                    >
                      <i className={`fa-solid ${step.icon} text-white`} style={{ fontSize: '13px' }}></i>
                    </span>
                    <div>
                      <p className="font-black text-slate-900 mb-0.5" style={{ fontSize: '12.5px' }}>{step.title}</p>
                      <p className="font-semibold text-slate-500" style={{ fontSize: '11.5px', lineHeight: '1.5' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl" style={{ background: 'linear-gradient(135deg, #094074, #16213e)', padding: '20px' }}>
              <h3 className="font-black text-white mb-3" style={{ fontSize: '15px' }}>Why Gift a Twin Brothers Card?</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  'Usable across holiday packages, hotels, cabs & activities',
                  'Perfect for birthdays, anniversaries & festive gifting',
                  'Personalized message included with every card',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <i className="fa-solid fa-circle-check" style={{ fontSize: '12px', color: '#ff8126', marginTop: '2px' }}></i>
                    <span className="font-semibold text-white" style={{ fontSize: '11.5px', lineHeight: '1.5' }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div style={{ marginTop: '20px', marginBottom: '56px' }}>
          <h2 className="font-black text-slate-900 text-center mb-2" style={{ fontSize: '22px' }}>
            Why Choose Twin Brothers Holidays
          </h2>
          <p className="text-center font-semibold mx-auto mb-8" style={{ fontSize: '13px', color: '#64748b', maxWidth: '560px' }}>
            Thousands of travellers trust us to plan safe, well-organized and memorable holidays.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'fa-tags', title: 'Best Price Guarantee', desc: 'Transparent pricing with no hidden costs on every booking.' },
              { icon: 'fa-user-tie', title: 'Expert Travel Planners', desc: 'Experienced team that crafts itineraries tailored to you.' },
              { icon: 'fa-shield-heart', title: 'Trusted & Reliable', desc: 'A dependable travel partner for holidays, hotels, cabs & more.' },
              { icon: 'fa-headset', title: '24/7 Support', desc: 'Round-the-clock assistance before, during and after your trip.' },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl text-center"
                style={{ padding: '20px 14px', border: '1px solid #eef1f5' }}
              >
                <span
                  className="rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ width: '46px', height: '46px', background: 'linear-gradient(135deg, #094074, #ff8126)' }}
                >
                  <i className={`fa-solid ${f.icon} text-white`} style={{ fontSize: '17px' }}></i>
                </span>
                <h3 className="font-black text-slate-900 mb-1" style={{ fontSize: '13px' }}>{f.title}</h3>
                <p className="font-semibold" style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Us */}
        <div
          className="rounded-2xl"
          style={{ padding: '28px 24px', background: 'linear-gradient(135deg, #094074, #16213e)' }}
        >
          <h2 className="font-black text-white mb-3" style={{ fontSize: '20px' }}>
            About Twin Brothers Holidays
          </h2>
          <p className="font-semibold mb-4" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', maxWidth: '760px' }}>
            Twin Brothers Holidays is a travel company built around planning smooth, memorable journeys —
            from holiday packages and hotel stays to cabs and activities. A gift card from us isn't just a
            voucher, it's an invitation for someone you care about to plan their own adventure with a team
            that handles the details.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              'Handpicked holiday packages',
              'Verified hotels & cabs',
              'Dedicated support team',
              'Seamless, hassle-free bookings',
            ].map((point) => (
              <div key={point} className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check" style={{ fontSize: '13px', color: '#ff8126' }}></i>
                <span className="font-semibold text-white" style={{ fontSize: '12px' }}>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal (UPI QR + UTR, same pattern as hotel checkout) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-[380px] w-full text-center relative" style={{ border: '1px solid #eef1f5', maxHeight: '92vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-3 right-3 bg-transparent border-none text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="font-black text-[#094074] mb-0.5" style={{ fontSize: '15px' }}>UPI Payment Portal</h3>
            <p className="text-slate-400 font-semibold mb-2.5" style={{ fontSize: '10.5px' }}>Twin Brothers Holidays Secure Checkout</p>

            <div className="rounded-xl bg-slate-50 mb-2.5" style={{ border: '1px solid #eef1f5', padding: '8px' }}>
              <span className="block font-bold text-slate-400 uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>Amount Payable</span>
              <span className="block font-black text-slate-900" style={{ fontSize: '19px' }}>₹{amount.toLocaleString('en-IN')}</span>
            </div>

            <div className="rounded-2xl bg-white flex flex-col items-center justify-center mx-auto mb-2.5" style={{ border: '1px solid #eef1f5', padding: '10px', maxWidth: '180px' }}>
              <div className="relative flex flex-col items-center justify-center border" style={{ width: '120px', height: '120px', background: '#f8fafc', borderRadius: '8px', borderColor: '#eef1f5', padding: '6px' }}>
                <i className="fa-solid fa-qrcode text-slate-700" style={{ fontSize: '72px', lineHeight: '1', marginBottom: '2px' }}></i>
                <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ background: 'rgba(255,129,38,0.05)', border: '1px dashed rgba(255,129,38,0.3)' }}></div>
                <span className="font-black uppercase" style={{ fontSize: '6.5px', color: '#ff8126', letterSpacing: '1px' }}>Scan with any UPI App</span>
              </div>
            </div>

            <div className="text-left mx-auto mb-2.5" style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600, maxWidth: '320px' }}>
              <div className="flex items-start gap-1.5 mb-1">
                <i className="fa-solid fa-circle-info" style={{ color: '#ff8126', marginTop: '2px' }}></i>
                <span>Scan the QR code with GPay, PhonePe, Paytm or Bhim UPI app to pay.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <i className="fa-solid fa-circle-info" style={{ color: '#ff8126', marginTop: '2px' }}></i>
                <span>After completing payment, enter the Transaction ID / UTR Number below to confirm your gift card order.</span>
              </div>
            </div>

            <form onSubmit={handleVerifyPayment} className="text-left pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
              <label className="font-bold text-slate-500 block mb-1" style={{ fontSize: '11px' }}>12-Digit Transaction ID (UTR)</label>
              <input
                type="text"
                placeholder="ENTER UTR / TRANSACTION NUMBER"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={12}
                className="form-control font-semibold"
                style={{ fontSize: '12px', border: `1px solid ${utrError ? '#ef4444' : '#e2e8f0'}`, borderRadius: '8px', padding: '8px 10px', width: '100%', marginBottom: '4px' }}
              />
              {utrError && <span className="text-red-500 font-bold block mb-2" style={{ fontSize: '10px' }}>{utrError}</span>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full font-black text-white uppercase cursor-pointer"
                style={{ fontSize: '11.5px', letterSpacing: '1px', background: 'linear-gradient(135deg, #ff8126, #fd661e)', padding: '9px', borderRadius: '8px', border: 'none', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Confirming...' : 'Verify & Confirm Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
