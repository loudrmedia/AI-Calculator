'use client';

import React, { useEffect, useCallback } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { AccidentTiming } from '../../lib/types';

const TIMING_OPTIONS: { value: AccidentTiming; label: string }[] = [
  { value: 'less_than_30_days', label: 'Less Than 30 Days Ago' },
  { value: 'one_to_three_months', label: '1-3 Months Ago' },
  { value: 'three_to_six_months', label: '3-6 Months Ago' },
  { value: 'six_to_twelve_months', label: '6-12 Months Ago' },
  { value: 'one_to_two_years', label: '1-2 Years Ago' },
  { value: 'more_than_two_years', label: 'More Than 2 Years Ago' },
];

export function TimingStep() {
  const { state, dispatch } = useFunnel();
  const selected = state.inputs.accidentTiming;

  const handleSelect = (timing: AccidentTiming) => {
    dispatch({ type: 'SET_TIMING', payload: timing });
  };

  const handleContinue = useCallback(() => {
    if (selected) {
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

  const showWarning = selected === 'one_to_two_years' || selected === 'more_than_two_years';

  return (
    <div>
      <h2 className="step-title">When did this accident occur?</h2>

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
          <h4>⚠️ Time-Sensitive Notice</h4>
          <p>
            Most states impose a 2-3 year statute of limitations for personal injury claims. 
            Based on your selection, you should consult an attorney promptly to understand 
            your specific deadline.
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
