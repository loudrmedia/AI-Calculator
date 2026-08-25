'use client';

import React from 'react';
import { useFunnel } from '../lib/funnel-context';
import { FunnelStep } from '../lib/types';

// Sits above the bar. Copy follows the goal-gradient pattern used on
// converting multi-step forms: time on step one, remaining work in the
// middle, and the payoff named on the last question. Contact already has
// the "estimate is ready" banner, so that step is left blank here.
const STEP_NUDGE: Partial<Record<FunnelStep, string>> = {
  accident_type: 'Takes about 30 seconds',
  injuries: "You're halfway there",
  fault: 'Just a few more questions',
  timing: 'Almost done',
  zip_code: 'Last step — then your estimate',
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
      {nudge && <p className="progress-nudge">{nudge}</p>}
      <div className="progress-track">
        <div
          className={`progress-fill ${isFirstStep ? 'progress-fill-init' : ''}`}
          style={{ width: `${displayProgress}%` }}
        />
        <span className="progress-label">{displayProgress}%</span>
      </div>
    </div>
  );
}
