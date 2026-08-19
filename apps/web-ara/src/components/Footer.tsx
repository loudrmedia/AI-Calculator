'use client';

import React from 'react';
import { CONFIG } from '../lib/config';

const PHONE_NUMBER = CONFIG.PHONE_NUMBER;
const PHONE_LINK = CONFIG.PHONE_LINK;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-cta">
          <p>Call Now and Speak Directly with a Case Analyst Today.</p>
          <a href={PHONE_LINK} className="ara-call-btn">
            {PHONE_NUMBER}
          </a>
        </div>

        <div className="ara-footer-disclaimer">
          <p>
            Dramatized scenes, symbols, figures, or testimonials are illustrative, not based on
            actual events and may feature paid actors or spokespersons. Recoveries vary; past
            results do not predict future outcomes. &ldquo;No fee&rdquo; describes attorney fees;
            costs may apply. Phrases such as &ldquo;best&rdquo; are slogans, not rankings or
            awards. Consultation does not create an attorney-client relationship. Auto Relief
            Assistance is not a law firm and does not provide legal services.{' '}
            <strong>CA RESIDENTS:</strong> Paid independent joint attorney advertising including
            Kevin Danesh in Santa Monica, CA. Full listing at{' '}
            <a
              href="https://cawa.autoreliefassistance.com/sponsors"
              target="_blank"
              rel="noopener noreferrer"
            >
              cawa.autoreliefassistance.com/sponsors
            </a>
            .
          </p>
        </div>

        <img className="ara-footer-logo" src="/logo-wide.png" alt="Auto Relief Assistance" />

        <div className="footer-links-row">
          <a
            href="https://wagoogle.autoreliefassistance.com/privacypolicy-ara"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <span className="divider">|</span>
          <a
            href="https://wagoogle.autoreliefassistance.com/termsandconditons-ara"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}
