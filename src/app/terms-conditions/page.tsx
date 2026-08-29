import React from 'react';

export const metadata = {
  title: "Terms & Conditions - Twin Brothers Holidays",
  description: "Terms and conditions of booking with Twin Brothers Holidays.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <div className="container-fluid terms-hero-section">
        <div className="container">
          <h1 className="terms-hero-title">Terms & <span>Conditions</span></h1>
          <p>Please read these terms and conditions carefully</p>
        </div>
      </div>

      <div className="container terms-content-section py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto bg-white p-4 border rounded shadow-sm">
            <p className="text-muted">Welcome to <strong>Twin Brothers Holidays</strong>. These terms and conditions outline the rules and regulations for the use of our website and services.</p>

            <p className="text-muted">By accessing this website we assume you accept these terms and conditions. Do not continue to use Twin Brothers Holidays if you do not agree to take all of the terms and conditions stated on this page.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Cookies</h2>
            <p className="text-muted">We employ the use of cookies. By accessing Twin Brothers Holidays, you agreed to use cookies in agreement with the Twin Brothers Holidays's Privacy Policy.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">License</h2>
            <p className="text-muted">Unless otherwise stated, Twin Brothers Holidays and/or its licensors own the intellectual property rights for all material on Twin Brothers Holidays. All intellectual property rights are reserved. You may access this from Twin Brothers Holidays for your own personal use subjected to restrictions set in these terms and conditions.</p>

            <p className="text-muted">You must not:</p>
            <ul className="text-muted pl-4">
              <li>Republish material from Twin Brothers Holidays</li>
              <li>Sell, rent or sub-license material from Twin Brothers Holidays</li>
              <li>Reproduce, duplicate or copy material from Twin Brothers Holidays</li>
              <li>Redistribute content from Twin Brothers Holidays</li>
            </ul>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Booking Policy</h2>
            <p className="text-muted">All bookings made through our website are subject to availability and confirmation. We reserve the right to cancel or modify bookings in unforeseen circumstances. Payment terms will be communicated during the booking process.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Cancellation and Refund</h2>
            <p className="text-muted">Cancellations must be made in writing. Refund policies vary depending on the service and timing of cancellation. Please refer to specific package details for cancellation terms.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">User Comments</h2>
            <p className="text-muted">Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Twin Brothers Holidays does not filter, edit, publish or review Comments prior to their presence on the website.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Disclaimer</h2>
            <p className="text-muted">To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.</p>
          </div>
        </div>
      </div>
    </>
  );
}
