'use client';

import React, { useEffect, useCallback } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { FaultStatus } from '../../lib/types';

const FAULT_OPTIONS: { value: FaultStatus; label: string; description: string }[] = [
  { 
    value: 'not_at_fault', 
    label: 'No', 
    description: 'The accident was not my fault' 
  },
  { 
    value: 'partial_fault', 
    label: 'Partially', 
    description: 'I may have been partially at fault' 
  },
  { 
    value: 'at_fault', 
    label: 'Yes', 
    description: 'The accident was my fault' 
  },
];

export function FaultStep() {
  const { state, dispatch } = useFunnel();
  const selected = state.inputs.faultStatus;

  const handleSelect = (status: FaultStatus) => {
    dispatch({ type: 'SET_FAULT_STATUS', payload: status });
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

  return (
    <div>
      <h2 className="step-title">Was the accident your fault?</h2>

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
