'use client';

import React from 'react';

export function ValueComparison() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="value-comparison">
      <div className="comparison-card good">
        <div className="comparison-icon">✓</div>
        <h3>What We Help You Discover</h3>
        <ul>
          <li>
            <span className="check">✓</span>
            Your full compensation potential — not just what insurance offers
          </li>
          <li>
            <span className="check">✓</span>
            Clear guidance on the strongest next steps for your situation
          </li>
          <li>
            <span className="check">✓</span>
            Connect with experienced legal professionals who fight for you
          </li>
          <li>
            <span className="check">✓</span>
            Maximize every dollar you deserve for your injuries and damages
          </li>
        </ul>
      </div>

      <div className="comparison-card bad">
        <div className="comparison-icon">✗</div>
        <h3>What Insurance Won&apos;t Tell You</h3>
        <ul>
          <li>
            <span className="x-mark">✗</span>
            Their first offer is often far below what your claim is worth
          </li>
          <li>
            <span className="x-mark">✗</span>
            Ongoing pain and future medical needs are rarely covered
          </li>
          <li>
            <span className="x-mark">✗</span>
            Lost income and reduced earning capacity get overlooked
          </li>
          <li>
            <span className="x-mark">✗</span>
            Your vehicle&apos;s diminished value after repairs is ignored
          </li>
        </ul>
      </div>

      <div className="value-comparison-cta">
        <button type="button" className="btn btn-primary" onClick={scrollToTop}>
          See What Your Case Is Worth ↑
        </button>
      </div>
    </div>
  );
}
