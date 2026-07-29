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
          <p>Talk with a real person</p>
          <a href={PHONE_LINK} className="footer-phone">{PHONE_NUMBER}</a>
        </div>

        <div className="footer-links-row">
          <a href="https://wagoogle.autoreliefassistance.com/privacypolicy-ara" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <span className="divider">•</span>
          <a href="https://wagoogle.autoreliefassistance.com/termsandconditons-ara" target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
        </div>

        <div className="footer-address">
          <p>Auto Relief Assistance</p>
        </div>
      </div>
    </footer>
  );
}
