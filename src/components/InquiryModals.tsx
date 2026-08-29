'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModals } from '../context/ModalContext';
import { API_BASE_URL } from '../config';

export default function InquiryModals() {
  const { activeModal, modalData, closeModal } = useModals();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form data when active modal changes
  useEffect(() => {
    setFormData({});
    setPhoneError('');
  }, [activeModal]);

  if (!activeModal) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'phone') {
      const val = value.replace(/[^0-9]/g, '');
      setFormData((prev: any) => ({
        ...prev,
        phone: val
      }));
      if (val.length === 10) {
        setPhoneError('');
      }
    }
  };

  const handlePhoneBlur = (phoneVal: string) => {
    if (phoneVal.length !== 10 && phoneVal.length > 0) {
      setPhoneError('Please enter a valid 10-digit number.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phone = formData.phone || '';
    if (phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit number.');
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const payload: any = {
      ...formData,
      source_page: 'nextjs_frontend',
    };

    // Inject service type and details based on active modal
    if (activeModal === 'customize') {
      payload.service_type = 'Customize Package';
      if (modalData?.packageName) {
        payload.package_name = modalData.packageName;
      }
    } else if (activeModal === 'flight') {
      payload.service_type = 'Flight Booking';
      payload.name = payload.name || 'Flight Inquiry';
    } else if (activeModal === 'train') {
      payload.service_type = 'Train Booking';
      payload.name = payload.name || 'Train Inquiry';
    } else if (activeModal === 'gondola') {
      payload.service_type = 'Gondola Booking';
      payload.name = payload.name || 'Gondola Inquiry';
    } else if (activeModal === 'helipad') {
      payload.service_type = 'Helipad Booking';
      payload.name = payload.name || 'Helipad Inquiry';
    } else if (activeModal === 'airport') {
      payload.subject = 'Home Page Service Booking';
      // service_type is selected by dropdown (Pickup, Drop, etc.)
    } else if (activeModal === 'expert') {
      payload.service_type = 'Expert Consultation';
    } else if (activeModal === 'activity') {
      payload.service_type = 'Activity Booking';
      payload.activity_name = modalData?.activityName || '';
      payload.price = modalData?.price || '';
    } else if (activeModal === 'hotel') {
      payload.service_type = 'Hotel Booking';
      payload.hotel_name = modalData?.hotelName || '';
      payload.room_name = modalData?.roomName || '';
      payload.plan_type = modalData?.planType || '';
      payload.price = modalData?.price || '';
    } else if (activeModal === 'tour_booking') {
      payload.service_type = 'Tour Package Booking';
      payload.source_page = `Tour Details - ${modalData?.title || ''}`;
      payload.package_name = modalData?.title || '';
      payload.price = modalData?.price || '';
    }

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
        closeModal();
        router.push('/thank-you');
      } else {
        alert(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      style={{ display: 'flex', zIndex: 1050 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="modal-content-custom modal-content-flight">
        <span className="close-modal-flight" onClick={closeModal}>&times;</span>
        
        {/* --- CUSTOMIZE MODAL --- */}
        {activeModal === 'customize' && (
          <>
            <div className="modal-header-custom">
              <h2>Customize Your Trip</h2>
              <p>Tell us your preferences and get a custom plan!</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              {modalData?.packageName && (
                <div className="mb-3">
                  <div className="p-2 bg-light border rounded">
                    <small className="d-block text-muted">Selected Item:</small>
                    <strong className="text-primary">{modalData.packageName}</strong>
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label offer-form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control offer-form-control" 
                  name="name" 
                  placeholder="Enter your full name" 
                  required 
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control offer-form-control" 
                  name="phone" 
                  placeholder="Enter your phone number" 
                  required 
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  onBlur={() => handlePhoneBlur(formData.phone || '')}
                />
                {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Email (Optional)</label>
                <input 
                  type="email" 
                  className="form-control offer-form-control" 
                  name="email" 
                  placeholder="Enter your email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Your Requirements</label>
                <textarea 
                  className="form-control offer-form-control" 
                  name="message" 
                  rows={3} 
                  placeholder="Tell us your preferences (Destination, Days, Budget)..."
                  value={formData.message || ''}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Get Customize Package'}
              </button>
            </form>
          </>
        )}

        {/* --- FLIGHT MODAL --- */}
        {activeModal === 'flight' && (
          <>
            <div className="modal-header-custom">
              <h2>Search Flights</h2>
              <p>Find the best flight deals!</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>From</label>
                    <input 
                      type="text" 
                      name="pickup_location" 
                      placeholder="City or Airport" 
                      required 
                      value={formData.pickup_location || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>To</label>
                    <input 
                      type="text" 
                      name="drop_location" 
                      placeholder="City or Airport" 
                      required 
                      value={formData.drop_location || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Departure</label>
                    <input 
                      type="date" 
                      name="travel_date" 
                      required 
                      value={formData.travel_date || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Return</label>
                    <input 
                      type="date" 
                      name="travel_date_end" 
                      value={formData.travel_date_end || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Travellers</label>
                    <input 
                      type="number" 
                      name="passengers" 
                      min="1" 
                      required 
                      value={formData.passengers || 1} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Enter mobile number" 
                      required 
                      value={formData.phone || ''} 
                      onChange={handleInputChange}
                      onBlur={() => handlePhoneBlur(formData.phone || '')}
                    />
                    {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Class</label>
                    <select 
                      name="plan_type" 
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                      value={formData.plan_type || 'Economy'}
                      onChange={handleInputChange}
                    >
                      <option>Economy</option>
                      <option>Business</option>
                      <option>First Class</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Searching...' : 'Search Flights'}
              </button>
            </form>
          </>
        )}

        {/* --- TRAIN MODAL --- */}
        {activeModal === 'train' && (
          <>
            <div className="modal-header-custom">
              <h2>Train Ticketing</h2>
              <p>Book your train journey with ease!</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>From</label>
                    <input 
                      type="text" 
                      name="pickup_location" 
                      placeholder="Station" 
                      required 
                      value={formData.pickup_location || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>To</label>
                    <input 
                      type="text" 
                      name="drop_location" 
                      placeholder="Station" 
                      required 
                      value={formData.drop_location || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      name="travel_date" 
                      required 
                      value={formData.travel_date || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Class</label>
                    <select 
                      name="plan_type" 
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                      value={formData.plan_type || 'Sleeper'}
                      onChange={handleInputChange}
                    >
                      <option>Sleeper</option>
                      <option>AC 3 Tier</option>
                      <option>AC 2 Tier</option>
                      <option>AC 1st Class</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Passengers</label>
                    <input 
                      type="number" 
                      name="passengers" 
                      min="1" 
                      required 
                      value={formData.passengers || 1} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Enter mobile number" 
                      required 
                      value={formData.phone || ''} 
                      onChange={handleInputChange}
                      onBlur={() => handlePhoneBlur(formData.phone || '')}
                    />
                    {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Searching...' : 'Search Trains'}
              </button>
            </form>
          </>
        )}

        {/* --- GONDOLA MODAL --- */}
        {activeModal === 'gondola' && (
          <>
            <div className="modal-header-custom">
              <h2>Gondola Booking</h2>
              <p>Experience the Gulmarg Gondola!</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Phase</label>
                    <select 
                      name="plan_type" 
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                      value={formData.plan_type || 'Phase 1 (Gulmarg to Kungdoor)'}
                      onChange={handleInputChange}
                    >
                      <option>Phase 1 (Gulmarg to Kungdoor)</option>
                      <option>Phase 2 (Kungdoor to Apharwat)</option>
                      <option>Both Phases</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      name="travel_date" 
                      required 
                      value={formData.travel_date || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Passengers</label>
                    <input 
                      type="number" 
                      name="passengers" 
                      min="1" 
                      required 
                      value={formData.passengers || 1} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Enter mobile number" 
                      required 
                      value={formData.phone || ''} 
                      onChange={handleInputChange}
                      onBlur={() => handlePhoneBlur(formData.phone || '')}
                    />
                    {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Gondola'}
              </button>
            </form>
          </>
        )}

        {/* --- HELIPAD MODAL --- */}
        {activeModal === 'helipad' && (
          <>
            <div className="modal-header-custom">
              <h2>Amarnath Helipad</h2>
              <p>Book your helicopter ride!</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Route</label>
                    <select 
                      name="plan_type" 
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                      value={formData.plan_type || 'Neelgrath to Panjtarni'}
                      onChange={handleInputChange}
                    >
                      <option>Neelgrath to Panjtarni</option>
                      <option>Pahalgam to Panjtarni</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      name="travel_date" 
                      required 
                      value={formData.travel_date || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Passengers</label>
                    <input 
                      type="number" 
                      name="passengers" 
                      min="1" 
                      required 
                      value={formData.passengers || 1} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Enter mobile number" 
                      required 
                      value={formData.phone || ''} 
                      onChange={handleInputChange}
                      onBlur={() => handlePhoneBlur(formData.phone || '')}
                    />
                    {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Helicopter'}
              </button>
            </form>
          </>
        )}

        {/* --- AIRPORT MODAL --- */}
        {activeModal === 'airport' && (
          <>
            <div className="modal-header-custom">
              <h2>Airport Service</h2>
              <p>Book your pickup or drop-off!</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label>Service Type</label>
                    <select 
                      name="service_type"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                      value={formData.service_type || 'Pickup'}
                      onChange={handleInputChange}
                    >
                      <option value="Pickup">Pickup</option>
                      <option value="Drop">Drop</option>
                      <option value="Round Trip">Round Trip</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Pickup Location</label>
                    <input 
                      type="text" 
                      name="pickup_location" 
                      placeholder="Location" 
                      required 
                      value={formData.pickup_location || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Drop Location</label>
                    <input 
                      type="text" 
                      name="drop_location" 
                      placeholder="Location" 
                      required 
                      value={formData.drop_location || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      name="travel_date" 
                      required 
                      value={formData.travel_date || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Time</label>
                    <input 
                      type="time" 
                      name="message" 
                      required 
                      value={formData.message || ''} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <label>Passengers</label>
                    <input 
                      type="number" 
                      name="passengers" 
                      min="1" 
                      required 
                      value={formData.passengers || 1} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Enter mobile number" 
                      required 
                      value={formData.phone || ''} 
                      onChange={handleInputChange}
                      onBlur={() => handlePhoneBlur(formData.phone || '')}
                    />
                    {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Service'}
              </button>
            </form>
          </>
        )}

        {/* --- EXPERT MODAL --- */}
        {activeModal === 'expert' && (
          <>
            <div className="modal-header-custom">
              <h2>Connect With An Expert</h2>
              <p>Get in touch for expert assistance.</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="mb-3">
                <label className="form-label offer-form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control offer-form-control" 
                  name="name" 
                  placeholder="Enter your full name" 
                  required 
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control offer-form-control" 
                  name="phone" 
                  placeholder="Enter your phone number" 
                  required 
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  onBlur={() => handlePhoneBlur(formData.phone || '')}
                />
                {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Message</label>
                <textarea 
                  className="form-control offer-form-control" 
                  name="message" 
                  rows={3} 
                  placeholder="How can we help you?"
                  value={formData.message || ''}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Request Call Back'}
              </button>
            </form>
          </>
        )}

        {/* --- ACTIVITY MODAL --- */}
        {activeModal === 'activity' && (
          <>
            <div className="modal-header-custom">
              <h2>Book Activity</h2>
              <p>Secure your spot now!</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="mb-3">
                <div className="p-2 bg-light border rounded">
                  <small className="d-block text-muted">Activity:</small>
                  <strong className="text-primary">{modalData?.activityName}</strong>
                  <span className="mx-2 text-secondary">|</span>
                  <span className="text-dark fw-bold">₹{modalData?.price} / Adult</span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control offer-form-control" 
                  name="name" 
                  placeholder="Enter full name" 
                  required 
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control offer-form-control" 
                  name="phone" 
                  placeholder="Enter phone number" 
                  required 
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  onBlur={() => handlePhoneBlur(formData.phone || '')}
                />
                {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">Date</label>
                  <input 
                    type="date" 
                    className="form-control offer-form-control" 
                    name="travel_date" 
                    required 
                    value={formData.travel_date || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">No. of Persons</label>
                  <input 
                    type="number" 
                    className="form-control offer-form-control" 
                    name="passengers" 
                    min="1" 
                    required 
                    value={formData.passengers || 1}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          </>
        )}

        {/* --- HOTEL MODAL --- */}
        {activeModal === 'hotel' && (
          <>
            <div className="modal-header-custom">
              <h2>Book Hotel Room</h2>
              <p>Complete booking details</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="mb-3">
                <div className="p-2 bg-light border rounded">
                  <small className="d-block text-muted">Hotel & Room Details:</small>
                  <strong className="text-primary">{modalData?.hotelName}</strong>
                  <div className="small text-muted">{modalData?.roomName} ({modalData?.planType})</div>
                  <div className="text-dark fw-bold">₹{modalData?.price} / Night</div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control offer-form-control" 
                  name="name" 
                  placeholder="Enter full name" 
                  required 
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control offer-form-control" 
                  name="phone" 
                  placeholder="Enter phone number" 
                  required 
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  onBlur={() => handlePhoneBlur(formData.phone || '')}
                />
                {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Email (Optional)</label>
                <input 
                  type="email" 
                  className="form-control offer-form-control" 
                  name="email" 
                  placeholder="Enter email address"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">Check-in Date</label>
                  <input 
                    type="date" 
                    className="form-control offer-form-control" 
                    name="travel_date" 
                    required 
                    value={formData.travel_date || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">Check-out Date</label>
                  <input 
                    type="date" 
                    className="form-control offer-form-control" 
                    name="travel_date_end" 
                    required 
                    value={formData.travel_date_end || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">No. of Rooms</label>
                  <input 
                    type="number" 
                    className="form-control offer-form-control" 
                    name="rooms" 
                    min="1" 
                    required 
                    value={formData.rooms || 1}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">No. of Guests</label>
                  <input 
                    type="number" 
                    className="form-control offer-form-control" 
                    name="passengers" 
                    min="1" 
                    required 
                    value={formData.passengers || 1}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Request Booking'}
              </button>
            </form>
          </>
        )}

        {/* --- TOUR BOOKING MODAL --- */}
        {activeModal === 'tour_booking' && (
          <>
            <div className="modal-header-custom">
              <h2>Book This Package</h2>
              <p>Complete your booking details</p>
            </div>
            <form onSubmit={handleSubmit} className="custom-package-form">
              <div className="mb-3">
                <div className="p-2 bg-light border rounded">
                  <small className="d-block text-muted">Selected Package:</small>
                  <strong className="text-primary">{modalData?.title}</strong>
                  <div className="mt-1">
                    <span className="text-secondary small">
                      Duration: {modalData?.duration_days}D / {modalData?.duration_nights}N
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control offer-form-control" 
                  name="name" 
                  placeholder="Enter full name" 
                  required 
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control offer-form-control" 
                  name="phone" 
                  placeholder="Enter phone number" 
                  required 
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  onBlur={() => handlePhoneBlur(formData.phone || '')}
                />
                {phoneError && <small style={{ color: 'red', display: 'block', marginTop: 4 }}>{phoneError}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label offer-form-label">Email (Optional)</label>
                <input 
                  type="email" 
                  className="form-control offer-form-control" 
                  name="email" 
                  placeholder="Enter email address"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">Travel Date</label>
                  <input 
                    type="date" 
                    className="form-control offer-form-control" 
                    name="travel_date" 
                    required 
                    value={formData.travel_date || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label offer-form-label">No. of Persons</label>
                  <input 
                    type="number" 
                    className="form-control offer-form-control" 
                    name="passengers" 
                    min="1" 
                    required 
                    value={formData.passengers || 2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button type="submit" className="btn-custom-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Send Booking Inquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
