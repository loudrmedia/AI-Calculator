'use client';

import React, { useEffect, useState } from 'react';
import { useFunnel } from '../lib/funnel-context';

const SESSION_KEY = 'exitPopupShown';

export function ExitIntentPopup() {
  const { isComplete } = useFunnel();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const handleMouseOut = (e: MouseEvent) => {
      // Desktop only: triggers when the cursor leaves through the top of the
      // viewport (toward the close button / address bar)
      if (window.innerWidth < 769) return;
      if (e.clientY > 0 || e.relatedTarget) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;

      sessionStorage.setItem(SESSION_KEY, '1');
      setOpen(true);
    };

    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, [isComplete]);

  if (!open || isComplete) return null;

  const handleClose = () => setOpen(false);

  const handleCta = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="exit-popup-overlay" onClick={handleClose}>
      <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
        <button className="exit-popup-close" onClick={handleClose} aria-label="Close">
          ✕
        </button>
        <h3>Wait — You&apos;re 30 Seconds Away From Your Free Estimate</h3>
        <p>
          Don&apos;t leave money on the table. Most people are surprised by how much their
          case is worth.
        </p>
        <button className="btn btn-primary exit-popup-cta" onClick={handleCta}>
          Get My Free Estimate →
        </button>
        <p className="exit-popup-note">100% free · No obligation · Takes about 30 seconds</p>
      </div>
    </div>
  );
}
