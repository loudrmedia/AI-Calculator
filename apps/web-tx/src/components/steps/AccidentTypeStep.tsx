'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { AccidentType } from '../../lib/types';

const ACCIDENT_TYPES: { value: AccidentType; label: string; icon: string; badge?: string }[] = [
  { value: 'car_accident', label: 'Car Accident', icon: '🚗', badge: 'Most common' },
  { value: 'motorcycle_accident', label: 'Motorcycle Accident', icon: '🏍️' },
  { value: 'truck_accident', label: 'Truck Accident', icon: '🚛' },
  { value: 'bicycle_accident', label: 'Bicycle Accident', icon: '🚲' },
  { value: 'other', label: 'Other', icon: '📋' },
];

export function AccidentTypeStep() {
  const { state, dispatch } = useFunnel();
  const selected = state.inputs.accidentType;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance after selection so users don't need an extra click
  const handleSelect = (type: AccidentType) => {
    dispatch({ type: 'SET_ACCIDENT_TYPE', payload: type });
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
      <h2 className="step-title">What type of accident were you involved in?</h2>

      <div className="options-grid">
        {ACCIDENT_TYPES.map((type) => (
          <button
            key={type.value}
            className={`option-button ${type.badge ? 'option-highlighted' : ''} ${selected === type.value ? 'selected' : ''}`}
            onClick={() => handleSelect(type.value)}
          >
            <span className="icon">{type.icon}</span>
            <span>{type.label}</span>
            {type.badge && <span className="option-badge">{type.badge}</span>}
          </button>
        ))}
      </div>

      <div className="button-row">
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
