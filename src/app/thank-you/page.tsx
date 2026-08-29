'use client';

import React from 'react';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <>
      <style jsx>{`
        .thank-you-section {
          padding: 100px 0;
          text-align: center;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thank-you-icon {
          font-size: 80px;
          color: #28a745;
          margin-bottom: 20px;
        }

        .thank-you-title {
          font-size: 36px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
        }

        .thank-you-text {
          font-size: 18px;
          color: #666;
          margin-bottom: 30px;
        }

        .btn-home {
          background-color: #ff8126;
          color: #fff;
          padding: 12px 30px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-home:hover {
          background-color: #e67e22;
          color: #fff;
        }
      `}</style>

      <div className="container thank-you-section">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <i className="fa-solid fa-circle-check thank-you-icon"></i>
            <h1 className="thank-you-title">Thank You!</h1>
            <p className="thank-you-text">
              Your inquiry has been successfully submitted. Our travel experts will get back to you shortly.
            </p>
            <Link href="/" className="btn-home">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
