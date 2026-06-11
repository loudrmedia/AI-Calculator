'use client';

import React, { useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';

export function ZipCodeStep() {
  const { state, dispatch } = useFunnel();
  const [zipCode, setZipCode] = useState(state.inputs.zipCode || '');
  const [hasPropertyDamage, setHasPropertyDamage] = useState(
    state.inputs.hasPropertyDamage !== false
  );
  const [error, setError] = useState('');

  const validateZip = (zip: string) => {
    return /^\d{5}$/.test(zip);
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    setError('');
  };

  const handleContinue = () => {
    if (!validateZip(zipCode)) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    dispatch({ type: 'SET_ZIP_CODE', payload: zipCode });
    dispatch({ type: 'SET_HAS_PROPERTY_DAMAGE', payload: hasPropertyDamage });
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <div>
      <h2 className="step-title">Where did the accident happen?</h2>
      <p className="step-subtitle">
        Settlements vary a lot by state — your zip code personalizes your estimate.
      </p>

      <div className="input-group">
        <label htmlFor="zipCode">Zip Code</label>
        <input
          type="text"
          id="zipCode"
          autoFocus
          value={zipCode}
          onChange={handleZipChange}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          placeholder="Enter 5-digit zip code"
          maxLength={5}
          inputMode="numeric"
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <label className="property-damage-checkbox">
        <input
          type="checkbox"
          checked={hasPropertyDamage}
          onChange={(e) => setHasPropertyDamage(e.target.checked)}
        />
        <span>My vehicle was damaged (this can add to your payout)</span>
      </label>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continue »
        </button>
      </div>
    </div>
  );
}
