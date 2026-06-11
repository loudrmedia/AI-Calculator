'use client';

import React from 'react';

const RANGES = [
  { tier: 'Minor soft tissue (whiplash, strains)', range: '$5,000 – $30,000' },
  { tier: 'Moderate injuries with extended treatment', range: '$25,000 – $75,000' },
  { tier: 'Broken bones / surgical injuries', range: '$75,000 – $300,000' },
  { tier: 'Severe or permanent injuries', range: '$300,000 – $1,000,000+' },
  { tier: 'Catastrophic (brain, spinal, amputation)', range: '$1,000,000+' },
];

export function SettlementRanges() {
  return (
    <div className="settlement-ranges">
      <h2>Typical Settlement Ranges by Injury Severity</h2>
      <p className="settlement-ranges-intro">
        Educational ranges based on published settlement data. Your estimate is
        personalized to your accident, injuries, fault, and location.
      </p>
      <div className="settlement-ranges-table">
        {RANGES.map((row) => (
          <div className="settlement-range-row" key={row.tier}>
            <span className="settlement-range-tier">{row.tier}</span>
            <span className="settlement-range-value">{row.range}</span>
          </div>
        ))}
      </div>
      <p className="settlement-ranges-note">
        Insurance Research Council data shows represented claimants recover roughly{' '}
        <strong>3.5x more</strong> than those who settle on their own — even after
        attorney fees.
      </p>
    </div>
  );
}
