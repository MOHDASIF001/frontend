'use client';

import React, { useState } from 'react';

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full flex items-center justify-between flex-wrap gap-2 border-none cursor-pointer"
      style={{
        background: 'repeating-linear-gradient(135deg, #fff3eb, #fff3eb 6px, #ffe4cf 6px, #ffe4cf 12px)',
        border: '1.5px dashed #ff8126',
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      <span className="font-black break-all" style={{ fontSize: '16px', color: '#094074', letterSpacing: '1px' }}>{code}</span>
      <span className="font-bold flex items-center gap-1.5 flex-shrink-0" style={{ fontSize: '11px', color: '#ff8126' }}>
        {copied ? 'Copied!' : 'Copy'}
        <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} style={{ fontSize: '11px' }}></i>
      </span>
    </button>
  );
}
