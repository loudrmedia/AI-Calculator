'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { AccidentTiming } from '../../lib/types';

const TIMING_OPTIONS: { value: AccidentTiming; label: string }[] = [
  { value: 'within_7_days', label: 'Within the last 7 days' },
  { value: 'eight_to_30_days', label: '8–30 days ago' },
  { value: 'one_to_six_months', label: '1–6 months ago' },
  { value: 'seven_to_twelve_months', label: '7–12 months ago' },
  { value: 'thirteen_to_eighteen_months', label: '13-18 months ago' },
  { value: 'more_than_eighteen_months', label: 'More than 18 months ago' },
];

export function TimingStep() {
  const { state, dispatch } = useFunnel();
  const selected = state.inputs.accidentTiming;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance after selection, except when the statute-of-limitations
  // warning needs to be read first
  const handleSelect = (timing: AccidentTiming) => {
    dispatch({ type: 'SET_TIMING', payload: timing });
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    const needsWarning = timing === 'thirteen_to_eighteen_months' || timing === 'more_than_eighteen_months';
    if (!needsWarning) {
      advanceTimer.current = setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
      }, 300);
    }
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

  const showWarning = selected === 'thirteen_to_eighteen_months' || selected === 'more_than_eighteen_months';

  return (
    <div>
      <h2 className="step-title">When did the accident happen?</h2>

      <div className="options-grid">
        {TIMING_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`option-button ${selected === option.value ? 'selected' : ''}`}
            onClick={() => handleSelect(option.value)}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {showWarning && (
        <div className="disclaimer-box warning" style={{ marginTop: '16px' }}>
          <h4>⚠️ Your Window May Be Closing</h4>
          <p>
            Most states only allow 2-3 years to file a personal injury claim. You may still
            qualify — but finish your estimate now and speak with a specialist before your
            deadline passes.
          </p>
        </div>
      )}

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
