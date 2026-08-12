'use client';

import React from 'react';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/logo-wide.png" alt="Auto Relief Assistance" className="navbar-logo-img navbar-logo-desktop" />
          <img src="/logo-mobile.png" alt="Auto Relief Assistance" className="navbar-logo-img navbar-logo-mobile" />
        </a>
      </div>
    </nav>
  );
}
