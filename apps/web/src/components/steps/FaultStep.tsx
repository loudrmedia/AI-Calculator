'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { FaultStatus } from '../../lib/types';

const FAULT_OPTIONS: { value: FaultStatus; label: string; description: string }[] = [
  { 
    value: 'not_at_fault', 
    label: 'No, it was not my fault', 
    description: 'Someone else caused the accident' 
  },
  { 
    value: 'partial_fault', 
    label: 'I may have been partially at fault', 
    description: 'You can often still recover compensation' 
  },
  { 
    value: 'at_fault', 
    label: 'Yes, it was my fault', 
    description: 'Some options may still be available' 
  },
];

export function FaultStep() {
  const { state, dispatch } = useFunnel();
  const selected = state.inputs.faultStatus;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance after selection so users don't need an extra click
  const handleSelect = (status: FaultStatus) => {
    dispatch({ type: 'SET_FAULT_STATUS', payload: status });
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

  const handleContinue = useCallback(() => {
    if (selected) {
      // Cancel any pending auto-advance so we don't dispatch NEXT_STEP twice
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
      }
      dispatch({ type: 'NEXT_STEP' });
    }
  }, [selected, dispatch]);

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selected) {
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, handleContinue]);

  return (
    <div>
      <h2 className="step-title">Were you at fault for the accident?</h2>
      <p className="step-subtitle">
        Be honest — even partial fault doesn&apos;t disqualify you in most states.
      </p>

      <div className="options-grid">
        {FAULT_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`option-button ${selected === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}
          >
            <span style={{ fontWeight: 600 }}>{option.label}</span>
            <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
              {option.description}
            </span>
          </button>
        ))}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue »
        </button>
      </div>
    </div>
  );
}
