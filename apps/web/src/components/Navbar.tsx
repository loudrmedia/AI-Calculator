'use client';

import React from 'react';
import { CONFIG } from '../lib/config';

const PHONE_NUMBER = CONFIG.PHONE_NUMBER;
const PHONE_LINK = CONFIG.PHONE_LINK;

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/logo-wide.png" alt="Auto Relief Assistance" className="navbar-logo-img navbar-logo-desktop" />
          <img src="/logo-mobile.png" alt="Auto Relief Assistance" className="navbar-logo-img navbar-logo-mobile" />
        </a>
        <a href={PHONE_LINK} className="navbar-cta">
          <span className="cta-label">FREE CASE REVIEW</span>
          <span className="cta-phone">{PHONE_NUMBER}</span>
        </a>
      </div>
    </nav>
  );
}
