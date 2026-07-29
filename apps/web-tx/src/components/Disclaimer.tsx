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
        {/* TODO(TX): Replace with the actual TX-licensed attorney sponsor disclosure
            (attorney name, bar/license state, principal office city/state, and a link
            to sponsor information) before this version goes live. Copied from the CA
            version as a placeholder only - do not launch with CA attorney info shown
            to TX visitors. */}
        <strong>TX RESIDENTS:</strong> Paid attorney advertising on behalf of jointly advertising independent 
        attorneys licensed in Texas is responsible for this advertisement. Attorney sponsor information is 
        available at{' '}
        <a href="https://cawa.autoreliefassistance.com/sponsors" target="_blank" rel="noopener noreferrer">
          [TODO: TX sponsor info URL]
        </a>. Auto Relief Assistance is not a law firm and does not provide legal services.
      </p>
    </div>
  );
}
