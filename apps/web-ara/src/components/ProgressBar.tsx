'use client';

import React from 'react';
import { useFunnel } from '../lib/funnel-context';
import { FunnelStep } from '../lib/types';

// One line under the bar, keyed to remaining work. Contact already has the
// "estimate is ready" banner above the bar, so that step is left blank here.
const STEP_NUDGE: Partial<Record<FunnelStep, string>> = {
  accident_type: 'Takes about 30 seconds.',
  injuries: 'Biggest factor in your estimate — almost halfway.',
  fault: 'A couple more questions.',
  timing: 'Your estimate is next.',
  zip_code: 'Last question before we show your range.',
};

export function ProgressBar() {
  const { currentStepIndex, totalSteps, state } = useFunnel();

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
  const nudge = STEP_NUDGE[state.currentStep];

  return (
    <div className="progress-bar">
      <div className="progress-track">
        <div
          className={`progress-fill ${isFirstStep ? 'progress-fill-init' : ''}`}
          style={{ width: `${displayProgress}%` }}
        />
        <span className="progress-label">{displayProgress}%</span>
      </div>
      {nudge && <p className="progress-nudge">{nudge}</p>}
    </div>
  );
}
