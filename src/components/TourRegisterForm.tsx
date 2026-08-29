'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';

export default function TourRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    passengers: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'phone') {
      const val = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        phone: val
      }));
      if (val.length === 10) {
        setPhoneError('');
      }
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone.length !== 10 && formData.phone.length > 0) {
      setPhoneError('Please enter a valid 10-digit number.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit number.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      service_type: 'Tour Page Offer',
      source_page: 'tour-packages.php',
    };

    try {
      const response = await fetch(`${API_BASE_URL}/submit_inquiry.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        router.push('/thank-you');
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tour-page-hero-contact-div">
      <div className="tour-page-cotact-form-titile">
        <div className="tour-page-box-title"></div>
        <p>
          Avail The <span>Best Offers!</span>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          required 
          value={formData.name}
          onChange={handleInputChange}
        />
        <br />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          required 
          value={formData.email}
          onChange={handleInputChange}
        />
        <br />
        <input 
          type="tel" 
          name="phone" 
          placeholder="Contact" 
          required 
          value={formData.phone}
          onChange={handleInputChange}
          onBlur={handlePhoneBlur}
        />
        {phoneError && <small style={{ color: 'yellow', display: 'block', margin: '-5px 0 5px 0', fontSize: 11 }}>{phoneError}</small>}
        <br />
        <select 
          name="passengers" 
          required 
          value={formData.passengers}
          onChange={handleInputChange}
        >
          <option value="">Select Guests</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="More">More than 6</option>
        </select>
        <br />
        <button 
          className="submit-btn border-0 w-100 py-2 mt-2" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register Here'}
        </button>
      </form>
    </div>
  );
}
