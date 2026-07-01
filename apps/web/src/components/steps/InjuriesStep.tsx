'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { 
  SoftTissueInjury, 
  SubstantialInjury, 
  CatastrophicInjury,
  InjurySelection 
} from '../../lib/types';

type InjuryTier = 'minor' | 'serious' | 'severe' | 'none';

const TIER_OPTIONS: { value: InjuryTier; icon: string; label: string }[] = [
  { value: 'minor', icon: '🩹', label: 'Minor Injuries' },
  { value: 'serious', icon: '🦴', label: 'Serious Injuries' },
  { value: 'severe', icon: '🏥', label: 'Severe / Life-Changing' },
];

const SOFT_TISSUE_OPTIONS: { value: SoftTissueInjury; label: string }[] = [
  { value: 'body_aches', label: 'Body Aches & Pain' },
  { value: 'cuts_scrapes_bruises', label: 'Cuts, Scrapes & Bruises' },
  { value: 'other', label: 'Other' },
];

const SUBSTANTIAL_OPTIONS: { value: SubstantialInjury; label: string }[] = [
  { value: 'broken_bones', label: 'Broken / Fractured Bones' },
  { value: 'internal_bleeding', label: 'Internal Bleeding' },
  { value: 'scarring', label: 'Scarring' },
  { value: 'memory_loss', label: 'Memory Loss' },
  { value: 'other', label: 'Other' },
];

const CATASTROPHIC_OPTIONS: { value: CatastrophicInjury; label: string }[] = [
  { value: 'surgery_required', label: 'Surgery Required' },
  { value: 'brain_injury', label: 'Brain Injury' },
  { value: 'organ_loss', label: 'Loss of Internal Organs' },
  { value: 'coma', label: 'Coma' },
  { value: 'paralysis', label: 'Paralysis' },
  { value: 'amputation', label: 'Amputation' },
  { value: 'other', label: 'Other' },
];

function deriveTier(injuries: InjurySelection): InjuryTier | null {
  if (injuries.noInjury) return 'none';
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

export function InjuriesStep() {
  const { state, dispatch } = useFunnel();
  const injuries = state.inputs.injuries || EMPTY_INJURIES;
  const [tier, setTier] = useState<InjuryTier | null>(() => deriveTier(injuries));
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chipSectionRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateInjuries = (newInjuries: InjurySelection) => {
    dispatch({ type: 'SET_INJURIES', payload: newInjuries });
  };

  // Picking a tier clears other tiers; "not injured" auto-advances
  const handleTierSelect = (newTier: InjuryTier) => {
    setTier(newTier);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    if (newTier === 'none') {
      updateInjuries({ ...EMPTY_INJURIES, noInjury: true });
      advanceTimer.current = setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
      }, 300);
      return;
    }

    updateInjuries({
      softTissue: newTier === 'minor' ? injuries.softTissue : [],
      substantial: newTier === 'serious' ? injuries.substantial : [],
      catastrophic: newTier === 'severe' ? injuries.catastrophic : [],
      noInjury: false,
    });

    // Scroll the newly revealed injury options into view (chips render below
    // the fold on mobile); small delay lets React commit the chip section first
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      chipSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  const toggleSoftTissue = (injury: SoftTissueInjury) => {
    const updated = injuries.softTissue.includes(injury)
      ? injuries.softTissue.filter((i) => i !== injury)
      : [...injuries.softTissue, injury];
    updateInjuries({ ...injuries, softTissue: updated, noInjury: false });
  };

  const toggleSubstantial = (injury: SubstantialInjury) => {
    const updated = injuries.substantial.includes(injury)
      ? injuries.substantial.filter((i) => i !== injury)
      : [...injuries.substantial, injury];
    updateInjuries({ ...injuries, substantial: updated, noInjury: false });
  };

  const toggleCatastrophic = (injury: CatastrophicInjury) => {
    const updated = injuries.catastrophic.includes(injury)
      ? injuries.catastrophic.filter((i) => i !== injury)
      : [...injuries.catastrophic, injury];
    updateInjuries({ ...injuries, catastrophic: updated, noInjury: false });
  };

  const hasSelection =
    injuries.noInjury ||
    injuries.softTissue.length > 0 ||
    injuries.substantial.length > 0 ||
    injuries.catastrophic.length > 0;

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

  const renderChips = () => {
    if (tier === 'minor') {
      return SOFT_TISSUE_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`chip ${injuries.softTissue.includes(option.value) ? 'selected' : ''}`}
          onClick={() => toggleSoftTissue(option.value)}
        >
          {option.label}
        </button>
      ));
    }
    if (tier === 'serious') {
      return SUBSTANTIAL_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`chip ${injuries.substantial.includes(option.value) ? 'selected' : ''}`}
          onClick={() => toggleSubstantial(option.value)}
        >
          {option.label}
        </button>
      ));
    }
    if (tier === 'severe') {
      return CATASTROPHIC_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`chip ${injuries.catastrophic.includes(option.value) ? 'selected' : ''}`}
          onClick={() => toggleCatastrophic(option.value)}
        >
          {option.label}
        </button>
      ));
    }
    return null;
  };

  const showChips = tier !== null && tier !== 'none';

  return (
    <div>
      <h2 className="step-title">How badly were you injured?</h2>
      <p className="step-subtitle">
        Your injuries are the single biggest factor in your case value.
      </p>

      <div className="options-grid">
        {TIER_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`option-button ${tier === option.value ? 'selected' : ''}`}
            onClick={() => handleTierSelect(option.value)}
          >
            <span className="icon">{option.icon}</span>
            <span style={{ fontWeight: 600 }}>{option.label}</span>
          </button>
        ))}
      </div>

      {showChips && (
        <div className="chip-section" ref={chipSectionRef}>
          <p className="chip-section-label">
            Select everything that applies — each one can increase your estimate.
          </p>
          <div className="chip-grid">{renderChips()}</div>
        </div>
      )}

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!hasSelection}
        >
          Continue »
        </button>
      </div>
    </div>
  );
}
