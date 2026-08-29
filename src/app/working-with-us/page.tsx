import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Working With Us - Twin Brothers Holidays",
  description: "Join the team at Twin Brothers Holidays or partner with us in Jammu & Kashmir.",
};

export default function WorkingWithUsPage() {
  return (
    <>
      <div className="container-fluid work-hero-section">
        <div className="container">
          <h1 className="work-hero-title">Working <span>With Us</span></h1>
          <p>Join our team or become a partner</p>
        </div>
      </div>

      <div className="container work-content-section py-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="work-card border rounded shadow-sm h-100 bg-white">
              <div className="work-card-body p-4">
                <h3 className="fw-bold mb-3">Careers</h3>
                <p className="text-muted mb-3">
                  Are you passionate about travel and creating unforgettable experiences? We are always looking for talented individuals to join our team in Srinagar.
                </p>
                <p className="text-muted mb-4">
                  We offer a dynamic work environment, opportunities for growth, and the chance to work with a passionate team of travel experts.
                </p>
                <ul className="mb-4">
                  <li>Travel Consultants</li>
                  <li>Tour Guides</li>
                  <li>Marketing Specialists</li>
                  <li>Operations Managers</li>
                </ul>
                <a href="mailto:careers@twinbholidays.com" className="btn btn-primary text-white" style={{ background: '#ff8126', border: 'none' }}>
                  Send Your CV
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="work-card border rounded shadow-sm h-100 bg-white">
              <div className="work-card-body p-4">
                <h3 className="fw-bold mb-3">Partner With Us</h3>
                <p className="text-muted mb-3">
                  We believe in the power of collaboration. If you are a hotelier, transport provider, or a travel agent looking for a reliable partner in Kashmir, we would love to hear from you.
                </p>
                <p className="text-muted mb-4">
                  Partnering with Twin Brothers Holidays means access to a wider audience, reliable bookings, and a long-term mutually beneficial relationship.
                </p>
                <ul className="mb-4">
                  <li>B2B Partnerships</li>
                  <li>Hotel Partnerships</li>
                  <li>Transport Vendor Registration</li>
                </ul>
                <Link href="/contact-us" className="btn btn-outline-primary" style={{ borderColor: '#ff8126', color: '#ff8126' }}>
                  Contact Partnership Team
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <h2 className="fw-bold fs-3">Our Work Culture</h2>
            <p className="lead mt-3 w-75 mx-auto text-muted small" style={{ lineHeight: '1.8' }}>
              We foster a culture of innovation, customer-centricity, and teamwork. Every member of our team plays a crucial role in delivering the exceptional experiences our clients expect.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
