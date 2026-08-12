'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { AccidentTiming } from '../../lib/types';

const TIMING_OPTIONS: { value: AccidentTiming; label: string }[] = [
  { value: 'within_7_days', label: 'En los últimos 7 días' },
  { value: 'eight_to_30_days', label: 'Hace 8–30 días' },
  { value: 'one_to_six_months', label: 'Hace 1–6 meses' },
  { value: 'seven_to_twelve_months', label: 'Hace 7–12 meses' },
  { value: 'thirteen_to_eighteen_months', label: 'Hace 13–18 meses' },
  { value: 'more_than_eighteen_months', label: 'Hace más de 18 meses' },
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
      <h2 className="step-title">¿Cuándo ocurrió el accidente?</h2>

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
          <h4>⚠️ Su Plazo Podría Estar Por Vencer</h4>
          <p>
            La mayoría de los estados solo permiten de 2 a 3 años para presentar un reclamo por 
            lesiones personales. Es posible que aún califique, pero termine su estimado ahora y 
            hable con un especialista antes de que venza su plazo.
          </p>
        </div>
      )}

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Atrás
        </button>
        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!selected}
        >
          Continuar »
        </button>
      </div>
    </div>
  );
}
