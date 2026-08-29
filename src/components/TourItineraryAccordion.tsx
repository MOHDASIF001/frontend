'use client';

import React, { useState } from 'react';

interface ItineraryDay {
  day_number: number;
  title: string;
  description: string;
}

interface TourItineraryAccordionProps {
  itinerary: ItineraryDay[];
}

export default function TourItineraryAccordion({ itinerary }: TourItineraryAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Open first day by default

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="tour-dtls-pg-itinerary-main-div">
          <h4 className="mb-4">Itinerary</h4>
          {itinerary.map((day, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`itinerary-item itinerary-box-color ${isActive ? 'active' : ''}`}
                style={{
                  border: '1px solid #ff8126',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  overflow: 'hidden',
                  background: '#fff',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="itinerary-question"
                  onClick={() => toggleAccordion(index)}
                  style={{
                    padding: '15px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#fff'
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333', fontWeight: 600 }}>
                    Day {day.day_number} - {day.title}
                  </h3>
                  <span 
                    className="itinerary-icon" 
                    style={{
                      color: '#ff8126',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      display: 'inline-block',
                      transition: 'transform 0.3s ease',
                      transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}
                  >
                    +
                  </span>
                </div>
                <div 
                  className="itinerary-answer"
                  style={{
                    maxHeight: isActive ? '1000px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-out, padding 0.3s ease',
                    background: '#fffcf9',
                    padding: isActive ? '20px 20px 30px 20px' : '0 20px',
                    borderTop: isActive ? '1px solid #feece0' : 'none'
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: 'pre-line', color: '#555', lineHeight: '1.6' }}>
                    {day.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
