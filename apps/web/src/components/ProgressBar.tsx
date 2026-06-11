'use client';

import React from 'react';
import { useFunnel } from '../lib/funnel-context';

export function ProgressBar() {
  const { currentStepIndex, totalSteps } = useFunnel();

  // Exclude the results step from the user-facing count, and start the bar
  // partially filled (endowed progress) so the form feels nearly underway
  const userSteps = totalSteps - 1;
  const displayProgress = Math.min(
    100,
    Math.round(20 + (currentStepIndex / (userSteps - 1)) * 80)
  );
  // Animate 0% -> 20% on first load only; on later steps the animation's
  // "forwards" fill would override the inline width, so the class is dropped
  const isFirstStep = currentStepIndex === 0;

  return (
    <div>
      <div className="progress-bar">
        <div className="progress-track">
          <div
            className={`progress-fill ${isFirstStep ? 'progress-fill-init' : ''}`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
      <p className="progress-text">
        Step {Math.min(currentStepIndex + 1, userSteps)} of {userSteps} &middot; {displayProgress}% complete
      </p>
    </div>
  );
}
