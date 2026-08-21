'use client';

import React from 'react';

/**
 * Sits between the FAQ and the footer. By the time a visitor has read the
 * answers they are several screens below the questionnaire, and the funnel
 * only exists at the top of the page, so this is the return path.
 */
export function BackToTop() {
  const handleClick = () => {
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="ara-back-to-top">
      <button type="button" className="ara-back-to-top-btn" onClick={handleClick}>
        <span className="ara-back-to-top-arrow" aria-hidden="true">
          ↑
        </span>
        Back to Top
      </button>
    </div>
  );
}
