'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModals } from '../context/ModalContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { openModal } = useModals();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    { href: '/', label: 'Home', match: ['/'] },
    { href: '/holidays', label: 'Holidays', match: ['/holidays', '/tour-details'] },
    { href: '/destinations', label: 'Destinations', match: ['/destinations'] },
    { href: '/hotel', label: 'Hotels', match: ['/hotel', '/hotels-details'] },
    { href: '/cabs', label: 'Cabs', match: ['/cabs'] },
    { href: '/activities', label: 'Activities', match: ['/activities'] },
    { href: '/about-us', label: 'About', match: ['/about-us'] },
    { href: '/contact-us', label: 'Contact', match: ['/contact-us'] },
  ];

  return (
    <div className="container-fluid navbar-contener p-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-light">
        <div className="container-fluid">
          {/* Logo */}
          <Link href="/" className="navbar-brand">
            <img src="/images/twinb-logo-final.png" alt="Twin Brothers Holidays" className="logo-image" />
          </Link>

          {/* Mobile toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarSupportedContent"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            style={{ border: 'none', outline: 'none', padding: '6px 12px' }}
          >
            <i className="fa-solid fa-bars" style={{ fontSize: '22px', color: '#ffffff' }}></i>
          </button>

          {/* Nav links — responsive collapse */}
          <div
            className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-start align-items-lg-center gap-1 gap-lg-0 py-3 py-lg-0">
              {links.map(({ href, label, match }) => {
                const active = match.some(m =>
                  m === '/' ? pathname === '/' : pathname.startsWith(m)
                );
                return (
                  <li key={href} className="nav-item w-100 w-lg-auto">
                    <Link
                      href={href}
                      className={`nav-link py-2 px-3 ${active ? 'active' : ''}`}
                      onClick={() => setIsOpen(false)}
                      style={{ 
                        color: active ? '#ff8126' : '#2c2c2c',
                        fontWeight: active ? 'bold' : 'normal',
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0 px-3 px-lg-0">
                <button
                  className="nav-custom-package-btn"
                  onClick={() => {
                    setIsOpen(false);
                    openModal('customize');
                  }}
                >
                  Customize Package
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
