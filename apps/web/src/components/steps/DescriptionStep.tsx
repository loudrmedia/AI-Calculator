'use client';

import React, { useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';

export function DescriptionStep() {
  const { state, dispatch } = useFunnel();
  const [description, setDescription] = useState(state.inputs.accidentDescription || '');

  const handleContinue = () => {
    dispatch({ type: 'SET_DESCRIPTION', payload: description });
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <div>
      <h2 className="step-title">Want a stronger case review? Tell us what happened.</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '24px', fontSize: '14px' }}>
        Optional — but details like injuries, treatment, and how the accident happened help
        specialists fight for your full payout.
      </p>

      <div className="input-group">
        <label htmlFor="description">What happened?</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: I was rear-ended at a red light. I've had neck pain and missed two weeks of work..."
          rows={5}
          maxLength={2000}
        />
        <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px' }}>
          {description.length}/2000 characters
        </p>
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continue »
        </button>
      </div>

      <button className="skip-link" onClick={handleContinue}>
        Skip this step →
      </button>
    </div>
  );
}
