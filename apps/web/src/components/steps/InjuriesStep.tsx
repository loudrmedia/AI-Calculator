'use client';

import React, { useEffect, useCallback } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { 
  SoftTissueInjury, 
  SubstantialInjury, 
  CatastrophicInjury,
  InjurySelection 
} from '../../lib/types';

const SOFT_TISSUE_OPTIONS: { value: SoftTissueInjury; label: string }[] = [
  { value: 'body_aches', label: 'Body Aches & Pain' },
  { value: 'cuts_scrapes_bruises', label: 'Cuts, Scrapes & Bruises' },
];

const SUBSTANTIAL_OPTIONS: { value: SubstantialInjury; label: string }[] = [
  { value: 'broken_bones', label: 'Broken or Fractured Bones' },
  { value: 'internal_bleeding', label: 'Internal Bleeding / Hemorrhaging' },
  { value: 'scarring', label: 'Scarring' },
  { value: 'memory_loss', label: 'Memory Loss' },
];

const CATASTROPHIC_OPTIONS: { value: CatastrophicInjury; label: string }[] = [
  { value: 'surgery_required', label: 'Surgery Required' },
  { value: 'brain_injury', label: 'Brain Injury' },
  { value: 'organ_loss', label: 'Loss of Internal Organs' },
  { value: 'coma', label: 'Coma' },
  { value: 'paralysis', label: 'Paralysis' },
  { value: 'amputation', label: 'Amputation' },
];

export function InjuriesStep() {
  const { state, dispatch } = useFunnel();
  const injuries = state.inputs.injuries || {
    softTissue: [],
    substantial: [],
    catastrophic: [],
    noInjury: false,
  };

  const updateInjuries = (newInjuries: InjurySelection) => {
    dispatch({ type: 'SET_INJURIES', payload: newInjuries });
  };

  const toggleSoftTissue = (injury: SoftTissueInjury) => {
    const current = injuries.softTissue;
    const updated = current.includes(injury)
      ? current.filter((i) => i !== injury)
      : [...current, injury];
    updateInjuries({ ...injuries, softTissue: updated, noInjury: false });
  };

  const toggleSubstantial = (injury: SubstantialInjury) => {
    const current = injuries.substantial;
    const updated = current.includes(injury)
      ? current.filter((i) => i !== injury)
      : [...current, injury];
    updateInjuries({ ...injuries, substantial: updated, noInjury: false });
  };

  const toggleCatastrophic = (injury: CatastrophicInjury) => {
    const current = injuries.catastrophic;
    const updated = current.includes(injury)
      ? current.filter((i) => i !== injury)
      : [...current, injury];
    updateInjuries({ ...injuries, catastrophic: updated, noInjury: false });
  };

  const toggleNoInjury = () => {
    updateInjuries({
      softTissue: [],
      substantial: [],
      catastrophic: [],
      noInjury: !injuries.noInjury,
    });
  };

  const hasSelection = 
    injuries.noInjury ||
    injuries.softTissue.length > 0 ||
    injuries.substantial.length > 0 ||
    injuries.catastrophic.length > 0;

  const handleContinue = useCallback(() => {
    if (hasSelection) {
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
      <h2 className="step-title">How were you injured in the accident?</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '24px', fontSize: '14px' }}>
        Please check all that apply.
      </p>

      <div className="injuries-grid">
        <div className="injuries-column">
          <div className="checkbox-group">
            <h4>Soft Tissue Injuries</h4>
            {SOFT_TISSUE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`checkbox-label ${injuries.softTissue.includes(option.value) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={injuries.softTissue.includes(option.value)}
                  onChange={() => toggleSoftTissue(option.value)}
                  disabled={injuries.noInjury}
                />
                <span>{option.label}</span>
              </label>
            ))}

            <h4>Substantial Injuries</h4>
            {SUBSTANTIAL_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`checkbox-label ${injuries.substantial.includes(option.value) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={injuries.substantial.includes(option.value)}
                  onChange={() => toggleSubstantial(option.value)}
                  disabled={injuries.noInjury}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="injuries-column">
          <div className="checkbox-group">
            <h4>Catastrophic Injuries</h4>
            {CATASTROPHIC_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`checkbox-label ${injuries.catastrophic.includes(option.value) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={injuries.catastrophic.includes(option.value)}
                  onChange={() => toggleCatastrophic(option.value)}
                  disabled={injuries.noInjury}
                />
                <span>{option.label}</span>
              </label>
            ))}

            <h4>No Injuries</h4>
            <label className={`checkbox-label ${injuries.noInjury ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={injuries.noInjury}
                onChange={toggleNoInjury}
              />
              <span>I was not injured</span>
            </label>
          </div>
        </div>
      </div>

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
