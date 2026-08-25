'use client';

import React from 'react';

/**
 * First-party trust seals. The old collage used 2019–2020 third-party award
 * marks that ARA is not a law firm and cannot refresh without inventing
 * credentials. These three are claims the page already makes elsewhere.
 */
export function TrustBadges() {
  return (
    <div className="ara-awards ara-trust-badges" aria-label="Trust signals">
      <Seal
        ring="Free estimate"
        title="30"
        unit="sec"
        caption="No obligation"
      />
      <Seal
        ring="Attorney fees"
        title="No"
        unit="fee"
        caption="Unless you win"
      />
      <Seal
        ring="Your privacy"
        title="256"
        unit="bit"
        caption="Encrypted"
      />
    </div>
  );
}

function Seal({
  ring,
  title,
  unit,
  caption,
}: {
  ring: string;
  title: string;
  unit: string;
  caption: string;
}) {
  const id = ring.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="ara-trust-seal">
      <svg viewBox="0 0 120 120" role="img" aria-label={`${ring}: ${caption}`}>
        <defs>
          <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0bd3f" />
            <stop offset="55%" stopColor="#e0af34" />
            <stop offset="100%" stopColor="#c9991f" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill={`url(#${id}-gold)`} />
        <circle cx="60" cy="60" r="50" fill="#1b263f" />
        <circle cx="60" cy="60" r="46" fill="none" stroke="#e0af34" strokeWidth="1.25" />
        <text
          x="60"
          y="28"
          textAnchor="middle"
          fill="#e0af34"
          fontFamily="Open Sans, Arial, sans-serif"
          fontSize="8"
          fontWeight="800"
          letterSpacing="1.4"
        >
          {ring.toUpperCase()}
        </text>
        <text
          x="60"
          y="62"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Open Sans, Arial, sans-serif"
          fontSize="26"
          fontWeight="800"
        >
          {title}
        </text>
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fill="#e0af34"
          fontFamily="Open Sans, Arial, sans-serif"
          fontSize="11"
          fontWeight="800"
          letterSpacing="2"
        >
          {unit.toUpperCase()}
        </text>
        <text
          x="60"
          y="100"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Open Sans, Arial, sans-serif"
          fontSize="8"
          fontWeight="700"
          letterSpacing="0.6"
        >
          {caption.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
