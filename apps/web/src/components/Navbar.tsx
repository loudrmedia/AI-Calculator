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
          <span className="logo-text">
            <span className="logo-main">Auto Relief</span>
            <span className="logo-sub">Assistance</span>
          </span>
        </a>
        <a href={PHONE_LINK} className="navbar-cta">
          <span className="cta-label">CALL US RIGHT NOW</span>
          <span className="cta-phone">{PHONE_NUMBER}</span>
        </a>
      </div>
    </nav>
  );
}
