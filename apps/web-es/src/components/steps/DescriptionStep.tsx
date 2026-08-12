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
      <h2 className="step-title">¿Desea una revisión más completa de su caso? Cuéntenos qué pasó. (Opcional)</h2>

      <div className="input-group">
        <label htmlFor="description">¿Qué sucedió?</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ejemplo: Me chocaron por detrás en un semáforo en rojo. He tenido dolor de cuello y falté dos semanas al trabajo..."
          rows={5}
          maxLength={2000}
        />
        <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px' }}>
          {description.length}/2000 caracteres
        </p>
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Atrás
        </button>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continuar »
        </button>
      </div>

      <button className="skip-link" onClick={handleContinue}>
        Omitir Este Paso →
      </button>
    </div>
  );
}
