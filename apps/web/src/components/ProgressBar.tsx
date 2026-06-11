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
    Math.round(12 + (currentStepIndex / (userSteps - 1)) * 88)
  );

  return (
    <div>
      <div className="progress-bar">
        <div className="progress-track">
          <div
            className="progress-fill"
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
