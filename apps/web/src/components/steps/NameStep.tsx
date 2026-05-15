'use client';

import React, { useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';

export function NameStep() {
  const { state, dispatch } = useFunnel();
  const [firstName, setFirstName] = useState(state.contact.firstName || '');
  const [lastName, setLastName] = useState(state.contact.lastName || '');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  const validate = () => {
    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    dispatch({ type: 'SET_FIRST_NAME', payload: firstName.trim() });
    dispatch({ type: 'SET_LAST_NAME', payload: lastName.trim() });
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <div>
      <h2 className="step-title">What&apos;s your name?</h2>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors((prev) => ({ ...prev, firstName: undefined }));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            placeholder="First name"
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors((prev) => ({ ...prev, lastName: undefined }));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            placeholder="Last name"
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>
      </div>

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
