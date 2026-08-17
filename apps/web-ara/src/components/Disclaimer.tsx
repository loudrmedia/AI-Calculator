'use client';

import React from 'react';

export function Disclaimer() {
  return (
    <div className="page-disclaimer">
      <p>
        This website is intended to provide general information only, and nothing herein constitutes 
        legal advice nor the creation of an attorney/client relationship. Testimonials or endorsements 
        do not constitute a guarantee, warranty, or prediction regarding the outcome of your potential case. 
        Prior outcomes do not guarantee future results. Each case is unique and results will vary based on 
        individual circumstances.
      </p>
      <p>
        <strong>CA RESIDENTS:</strong> Paid attorney advertising on behalf of jointly advertising independent 
        attorneys, including Kevin Danesh, licensed only in California, with a principal office in Santa Monica, 
        California, is responsible for this advertisement. Attorney sponsor information is available at{' '}
        <a href="https://cawa.autoreliefassistance.com/sponsors" target="_blank" rel="noopener noreferrer">
          cawa.autoreliefassistance.com/sponsors
        </a>. Auto Relief Assistance is not a law firm and does not provide legal services.
      </p>
    </div>
  );
}
