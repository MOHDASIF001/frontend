'use client';

import React from 'react';
import { useModals } from '../context/ModalContext';

export default function ContactNowButton() {
  const { openModal } = useModals();

  return (
    <button 
      className="nav-custom-package-btn px-5 py-3 fs-5"
      onClick={() => openModal('customize')}
    >
      Contact Now
    </button>
  );
}
