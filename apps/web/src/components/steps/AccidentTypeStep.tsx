'use client';

import React from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { AccidentType } from '../../lib/types';

const ACCIDENT_TYPES: { value: AccidentType; label: string; icon: string }[] = [
  { value: 'car_accident', label: 'Car Accident', icon: '🚗' },
  { value: 'motorcycle_accident', label: 'Motorcycle Accident', icon: '🏍️' },
  { value: 'truck_accident', label: 'Truck Accident', icon: '🚛' },
  { value: 'bicycle_accident', label: 'Bicycle Accident', icon: '🚲' },
  { value: 'other', label: 'Other Claim Type', icon: '📋' },
];

export function AccidentTypeStep() {
  const { state, dispatch } = useFunnel();
  const selected = state.inputs.accidentType;

  const handleSelect = (type: AccidentType) => {
    dispatch({ type: 'SET_ACCIDENT_TYPE', payload: type });
  };

  const handleContinue = () => {
    if (selected) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  return (
    <div>
      <h2 className="step-title">What type of accident were you involved in?</h2>
      
      <div className="options-grid">
        {ACCIDENT_TYPES.map((type) => (
          <button
            key={type.value}
            className={`option-button ${selected === type.value ? 'selected' : ''}`}
            onClick={() => handleSelect(type.value)}
          >
            <span className="icon">{type.icon}</span>
            <span>{type.label}</span>
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
