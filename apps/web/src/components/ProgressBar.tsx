'use client';

import React from 'react';
import { useFunnel, STEPS } from '../lib/funnel-context';

export function ProgressBar() {
  const { currentStepIndex, totalSteps, progress } = useFunnel();

  return (
    <div>
      <div className="progress-bar">
        {STEPS.map((step, index) => (
          <div
            key={step}
            className={`progress-segment ${
              index < currentStepIndex
                ? 'completed'
                : index === currentStepIndex
                ? 'active'
                : ''
            }`}
          />
        ))}
      </div>
      <p className="progress-text">
        PROGRESS {Math.round(progress)}%
      </p>
    </div>
  );
}
