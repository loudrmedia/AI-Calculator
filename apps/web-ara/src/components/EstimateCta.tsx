'use client';

import React, { RefObject } from 'react';

interface EstimateCtaProps {
  /** The funnel card, so the click lands on the questions rather than the hero copy. */
  targetRef: RefObject<HTMLDivElement>;
  /** Clears the fixed navbar. */
  offset?: number;
}

/**
 * Closes out the landing page after the FAQ. A visitor who has read this far is
 * several screens below the only copy of the funnel, so this is both the return
 * path and the last ask on the page.
 */
export function EstimateCta({ targetRef, offset = 96 }: EstimateCtaProps) {
  const handleClick = () => {
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';

    const card = targetRef.current;
    if (!card) {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const top = card.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(top, 0), behavior });
  };

  return (
    <div className="ara-bottom-cta">
      <button type="button" className="ara-bottom-cta-btn" onClick={handleClick}>
        Get My Free Estimate
        <span className="ara-bottom-cta-arrow" aria-hidden="true">
          »
        </span>
      </button>
      <p className="ara-bottom-cta-note">Only takes 30 seconds · No obligation</p>
    </div>
  );
}
