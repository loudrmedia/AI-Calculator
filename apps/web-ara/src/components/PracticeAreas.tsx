'use client';

import React from 'react';

const PRACTICE_AREAS: { label: string; icon: string }[] = [
  { label: 'Bicycle Accident', icon: '/ara/practice-bicycle-accident.webp' },
  { label: 'Dog Bites', icon: '/ara/practice-dog-bites.webp' },
  { label: 'Brain Injury', icon: '/ara/practice-brain-injury.webp' },
  { label: 'Medical Malpractice', icon: '/ara/practice-medical-malpractice.png' },
  { label: 'Motorcycle Accident', icon: '/ara/practice-motorcycle-accident.webp' },
  { label: 'Premises Liability', icon: '/ara/practice-premises-liability.png' },
  { label: 'Scooter Accident', icon: '/ara/practice-scooter-accident.webp' },
  { label: 'Product Defect', icon: '/ara/practice-product-defect.webp' },
  { label: 'Slip and Fall', icon: '/ara/practice-slip-and-fall.webp' },
  { label: 'Workplace Accident', icon: '/ara/practice-workplace-accident.webp' },
  { label: 'Wrongful Death', icon: '/ara/practice-wrongful-death.png' },
  { label: 'Pedestrian Accidents', icon: '/ara/practice-pedestrian-accidents.webp' },
];

export function PracticeAreas() {
  return (
    <>
      <section className="ara-practice-heading">
        <div className="container">
          <h2>California Car Accident Attorneys</h2>
        </div>
      </section>

      <section className="ara-practice-band">
        <div className="container">
          <div className="ara-practice-grid">
            {PRACTICE_AREAS.map((area) => (
              <div key={area.label} className="ara-practice-item">
                <img src={area.icon} alt="" aria-hidden="true" />
                <span>{area.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
