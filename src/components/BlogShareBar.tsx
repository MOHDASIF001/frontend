'use client';

import React, { useEffect, useState } from 'react';

export default function BlogShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  // Starts empty on both server and client so the very first client render
  // matches the server-rendered HTML exactly (no hydration mismatch) — the
  // real page URL is only known in the browser, so it's filled in after
  // mount via this effect, once React no longer needs the two to match.
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      label: 'WhatsApp',
      icon: 'fa-brands fa-whatsapp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    },
    {
      label: 'Facebook',
      icon: 'fa-brands fa-facebook-f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'Twitter',
      icon: 'fa-brands fa-x-twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 pt-6" style={{ borderTop: '1px solid #eef1f5' }}>
      <span className="font-black text-slate-400 uppercase" style={{ fontSize: '11px' }}>Share</span>
      {shareLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${s.label}`}
          className="flex items-center justify-center"
          style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eaf1f8', color: '#094074', textDecoration: 'none' }}
        >
          <i className={s.icon} style={{ fontSize: '14px' }}></i>
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 font-bold border-none cursor-pointer"
        style={{ fontSize: '12px', color: '#094074', background: '#eaf1f8', borderRadius: '10px', padding: '0 14px', height: '36px' }}
      >
        {copied ? 'Link Copied!' : 'Copy Link'}
        <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'}`} style={{ fontSize: '11px' }}></i>
      </button>
    </div>
  );
}
