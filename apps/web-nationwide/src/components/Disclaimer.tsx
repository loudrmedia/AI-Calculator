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
        {/* TODO(Nationwide): Replace with the actual multi-state attorney sponsor
            disclosure. Because this version is shown in every state, compliance
            requirements (and possibly the sponsoring attorney/firm) may differ by
            the visitor's state - confirm with legal before launch. Copied from the
            CA version as a placeholder only - do not launch with CA-only attorney
            info shown to non-CA visitors. */}
        <strong>NOTICE:</strong> Paid attorney advertising on behalf of jointly advertising independent 
        attorneys is responsible for this advertisement. Attorney sponsor information, including licensing 
        and jurisdiction details, is available at{' '}
        <a href="https://cawa.autoreliefassistance.com/sponsors" target="_blank" rel="noopener noreferrer">
          [TODO: nationwide sponsor info URL]
        </a>. Auto Relief Assistance is not a law firm and does not provide legal services.
      </p>
    </div>
  );
}
