'use client';

import React, { createContext, useContext, useState } from 'react';

export type ModalType = 
  | 'customize' 
  | 'flight' 
  | 'train' 
  | 'gondola' 
  | 'helipad' 
  | 'airport' 
  | 'expert' 
  | 'activity' 
  | 'hotel'
  | 'tour_booking';

interface ModalContextType {
  activeModal: ModalType | null;
  modalData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, data?: any) => {
    setActiveModal(type);
    setModalData(data || null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <ModalContext.Provider value={{ activeModal, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
}
