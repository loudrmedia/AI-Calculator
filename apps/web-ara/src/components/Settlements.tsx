'use client';

import React from 'react';

const SETTLEMENTS: { amount: string; description: string }[] = [
  { amount: '$1,500,000', description: 'Premises liability' },
  { amount: '$1,400,000', description: 'Wrongful death settlement' },
  { amount: '$1,250,000', description: 'Motorcycle accident settlement' },
  { amount: '$600,000', description: 'Truck accident injury settlement' },
  { amount: '$300,000', description: 'Pedestrian accident with disputed liabilty' },
  { amount: '$150,000', description: 'Car accident neck injury settlement' },
  { amount: '$90,000', description: 'Slip and fall injury settlement' },
  { amount: '$70,000', description: 'Rear-end collision settlement' },
  { amount: '$50,000', description: 'Rear-end with minimal property damage' },
];

export function Settlements() {
  return (
    <section className="ara-settlements">
      <div className="container">
        <h2 className="ara-section-title">Our Attorneys fight to get you paid.</h2>
        <p className="ara-section-subtitle">Recent Settlements</p>

        <div className="ara-settlement-grid">
          {SETTLEMENTS.map((item) => (
            <div key={item.amount + item.description} className="ara-settlement-card">
              <span className="ara-settlement-label">Settlement:</span>
              <span className="ara-settlement-amount">{item.amount}</span>
              <span className="ara-settlement-desc">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
