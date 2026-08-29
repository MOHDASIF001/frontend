'use client';

import React from 'react';
import { useModals, ModalType } from '../context/ModalContext';

interface OpenModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  modalType: ModalType;
  modalData?: any;
  children: React.ReactNode;
}

export default function OpenModalButton({ modalType, modalData, children, ...props }: OpenModalButtonProps) {
  const { openModal } = useModals();
  return (
    <button onClick={() => openModal(modalType, modalData)} {...props}>
      {children}
    </button>
  );
}
