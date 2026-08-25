'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { InjurySelection } from '../../lib/types';

type InjuryTier = 'minor' | 'serious' | 'severe';

// One tap answers the question. The summary spells out what each tier covers so
// the claimant can self-select without a second panel of checkboxes. Each one
// has to hold a single line on the narrowest phone, so keep them to roughly
// this length — the styling clips rather than wraps.
const TIER_OPTIONS: { value: InjuryTier; label: string; summary: string }[] = [
  {
    value: 'minor',
    label: 'Minor Injuries',
    summary: 'Aches, cuts, scrapes or bruises',
  },
  {
    value: 'serious',
    label: 'Serious Injuries',
    summary: 'Broken bones, internal bleeding',
  },
  {
    value: 'severe',
    label: 'Severe / Life-Changing',
    summary: 'Surgery, brain injury, paralysis',
  },
];

function deriveTier(injuries: InjurySelection): InjuryTier | null {
  if (injuries.catastrophic.length > 0) return 'severe';
  if (injuries.substantial.length > 0) return 'serious';
  if (injuries.softTissue.length > 0) return 'minor';
  return null;
}

const EMPTY_INJURIES: InjurySelection = {
  softTissue: [],
  substantial: [],
  catastrophic: [],
  noInjury: false,
};

// The estimate reads severity off whichever list is non-empty, so the chosen
// tier is recorded as an unspecified injury in that list. It stays 'other'
// rather than a named injury because the claimant never named one.
function injuriesForTier(tier: InjuryTier): InjurySelection {
  return {
    ...EMPTY_INJURIES,
    softTissue: tier === 'minor' ? ['other'] : [],
    substantial: tier === 'serious' ? ['other'] : [],
    catastrophic: tier === 'severe' ? ['other'] : [],
  };
}

export function InjuriesStep() {
  const { state, dispatch } = useFunnel();
  const injuries = state.inputs.injuries || EMPTY_INJURIES;
  const [tier, setTier] = useState<InjuryTier | null>(() => deriveTier(injuries));
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTierSelect = (newTier: InjuryTier) => {
    setTier(newTier);
    dispatch({ type: 'SET_INJURIES', payload: injuriesForTier(newTier) });

    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      dispatch({ type: 'NEXT_STEP' });
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const hasSelection = tier !== null;

  const handleContinue = useCallback(() => {
    if (hasSelection) {
      // Cancel any pending auto-advance so we don't dispatch NEXT_STEP twice
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
      }
      dispatch({ type: 'NEXT_STEP' });
    }
  }, [hasSelection, dispatch]);

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && hasSelection) {
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSelection, handleContinue]);

  return (
    <div>
      <h2 className="step-title">How badly were you injured?</h2>

      <div className="options-grid">
        {TIER_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`option-button injury-tier ${tier === option.value ? 'selected' : ''}`}
            onClick={() => handleTierSelect(option.value)}
          >
            <span className="injury-tier-label">{option.label}</span>
            <span className="injury-tier-summary">{option.summary}</span>
          </button>
        ))}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack} aria-label="Back">
          «
        </button>
        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!hasSelection}
          aria-label="Continue"
        >
          »
        </button>
      </div>
    </div>
  );
}
