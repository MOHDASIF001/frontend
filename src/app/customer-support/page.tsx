import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Customer Support - Twin Brothers Holidays",
  description: "24/7 client assistance and customer support at Twin Brothers Holidays.",
};

export default function CustomerSupportPage() {
  return (
    <>
      <div className="container-fluid support-hero-section">
        <div className="container">
          <h1 className="support-hero-title">Customer <span>Support</span></h1>
          <p>We are here to help you</p>
        </div>
      </div>

      <div className="container support-content-section py-5">
        <div className="row g-4">
          <div className="col-lg-4 text-center">
            <div className="support-card p-4 border rounded shadow-sm bg-white h-100 d-flex flex-column align-items-center">
              <i className="fa-solid fa-phone fs-1 text-primary mb-3"></i>
              <h3 className="fw-bold fs-5 mb-3">Call Us</h3>
              <p className="text-muted small mb-4">Our support team is available 24/7 to assist you with your queries and bookings.</p>
              <a href="tel:+916005242675" className="btn btn-outline-primary mt-auto text-decoration-none" style={{ color: '#ff8126', borderColor: '#ff8126' }}>
                Call +91 6005242675
              </a>
            </div>
          </div>
          <div className="col-lg-4 text-center">
            <div className="support-card p-4 border rounded shadow-sm bg-white h-100 d-flex flex-column align-items-center">
              <i className="fa-solid fa-envelope fs-1 text-primary mb-3"></i>
              <h3 className="fw-bold fs-5 mb-3">Email Us</h3>
              <p className="text-muted small mb-4">Send us an email and we will get back to you within 24 hours.</p>
              <a href="mailto:info@twinbholidays.com" className="btn btn-outline-primary mt-auto text-decoration-none" style={{ color: '#ff8126', borderColor: '#ff8126' }}>
                info@twinbholidays.com
              </a>
            </div>
          </div>
          <div className="col-lg-4 text-center">
            <div className="support-card p-4 border rounded shadow-sm bg-white h-100 d-flex flex-column align-items-center">
              <i className="fa-solid fa-location-dot fs-1 text-primary mb-3"></i>
              <h3 className="fw-bold fs-5 mb-3">Visit Us</h3>
              <p className="text-muted small mb-4">Come visit our office for a face-to-face consultation.</p>
              <Link href="/contact-us" className="btn btn-outline-primary mt-auto text-decoration-none" style={{ color: '#ff8126', borderColor: '#ff8126' }}>
                Get Directions
              </Link>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-10 mx-auto">
            <h2 className="fw-bold fs-3 text-center mb-4">Frequently Asked Questions</h2>
            <div className="accordion" id="supportAccordion">
              <div className="accordion-item mb-2 border rounded shadow-sm overflow-hidden">
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    How can I book a tour?
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#supportAccordion">
                  <div className="accordion-body small text-muted bg-white">
                    You can book a tour directly through our website by selecting a package and clicking 'Book Now', or by contacting our support team via phone or email for a customized itinerary.
                  </div>
                </div>
              </div>
              <div className="accordion-item mb-2 border rounded shadow-sm overflow-hidden">
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    What is your cancellation policy?
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#supportAccordion">
                  <div className="accordion-body small text-muted bg-white">
                    Our cancellation policy varies depending on the specific package and timing. Please refer to the Terms & Conditions page or specific package details for more information.
                  </div>
                </div>
              </div>
              <div className="accordion-item mb-2 border rounded shadow-sm overflow-hidden">
                <h2 className="accordion-header" id="headingThree">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Do you provide airport transfers?
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#supportAccordion">
                  <div className="accordion-body small text-muted bg-white">
                    Yes, most of our tour packages include airport transfers. We also offer standalone cab services for airport pickup and drop-off.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
