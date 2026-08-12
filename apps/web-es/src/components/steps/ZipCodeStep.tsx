'use client';

import React, { useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';

export function ZipCodeStep() {
  const { state, dispatch } = useFunnel();
  const [zipCode, setZipCode] = useState(state.inputs.zipCode || '');
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
      setError('Por favor ingrese un código postal válido de 5 dígitos');
      return;
    }

    dispatch({ type: 'SET_ZIP_CODE', payload: zipCode });
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <div>
      <h2 className="step-title">¿Cuál es su código postal?</h2>

      <div className="input-group">
        <label htmlFor="zipCode">Código Postal</label>
        <input
          type="text"
          id="zipCode"
          autoFocus
          value={zipCode}
          onChange={handleZipChange}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          placeholder="Ingrese su código postal de 5 dígitos"
          maxLength={5}
          inputMode="numeric"
        />
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Atrás
        </button>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continuar »
        </button>
      </div>
    </div>
  );
}
