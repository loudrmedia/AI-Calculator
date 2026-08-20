'use client';

import React, { useEffect, useRef } from 'react';
import { useFunnel } from '../lib/funnel-context';
import { ProgressBar } from './ProgressBar';
import { Navbar } from './Navbar';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { Settlements } from './Settlements';
import { PracticeAreas } from './PracticeAreas';
import { CallNowBand } from './CallNowBand';
import { ExitIntentPopup } from './ExitIntentPopup';
import { CONFIG } from '../lib/config';
import { captureTrackingParams } from '../lib/tracking';
import {
  AccidentTypeStep,
  InjuriesStep,
  FaultStep,
  TimingStep,
  ZipCodeStep,
  ContactStep,
  ResultsStep,
} from './steps';


// Clears the fixed navbar so the question isn't tucked underneath it
const NAVBAR_OFFSET = 96;

export function Calculator() {
  const { state } = useFunnel();
  const funnelRef = useRef<HTMLDivElement>(null);
  const lastScrolledStep = useRef(state.currentStep);

  // Capture marketing attribution (UTMs, gclid, etc.) as soon as the app loads,
  // while the original landing URL params are still present
  useEffect(() => {
    captureTrackingParams();
  }, []);

  // Bring the next question into view when the step changes. We scroll to the
  // funnel card rather than the top of the page, otherwise answering a question
  // throws the user back up past the hero and they have to scroll down again.
  //
  // Comparing the step itself rather than flipping a "first render" flag is what
  // keeps this from firing on load: Strict Mode invokes effects twice, and a
  // flag is already spent by the second pass, which scrolled the single-column
  // layout straight past the headline.
  useEffect(() => {
    if (lastScrolledStep.current === state.currentStep) return;
    lastScrolledStep.current = state.currentStep;

    const card = funnelRef.current;
    if (!card) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const top = card.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }, [state.currentStep]);

  const renderStep = () => {
    switch (state.currentStep) {
      case 'accident_type':
        return <AccidentTypeStep />;
      case 'injuries':
        return <InjuriesStep />;
      case 'fault':
        return <FaultStep />;
      case 'timing':
        return <TimingStep />;
      case 'zip_code':
        return <ZipCodeStep />;
      case 'contact':
        return <ContactStep />;
      case 'results':
        return <ResultsStep />;
      default:
        return <AccidentTypeStep />;
    }
  };

  const isResultsPage = state.currentStep === 'results';

  // The results screen is its own full-page ARA treatment (black canvas), so it
  // renders without the landing page's hero, marketing sections or footer CTA.
  if (isResultsPage) {
    return (
      <div className="page-wrapper ara-results-page">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <ResultsStep />
          </div>
        </main>
        <ExitIntentPopup />
      </div>
    );
  }

  const funnelCard = (
    <div className="card">
      {state.currentStep === 'contact' && (
        <div className="estimate-ready-banner">
          <span className="trust-check">✓</span>
          <span>
            <strong>Good news — your estimate is ready.</strong> See your case value instantly on
            the next screen.
          </span>
        </div>
      )}

      <ProgressBar />

      <div key={state.currentStep} className="step-content">
        {renderStep()}
      </div>

      <div className="trust-badge-row">
        <span className="trust-badge">🔒 256-bit Encrypted</span>
        <span className="trust-badge-divider">•</span>
        <span className="trust-badge">🛡️ Never Shared Without Consent</span>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="container">
          <div className="ara-hero">
            <div className="ara-hero-copy">
              <h1>
                <span className="ara-hero-alert">Don&apos;t Waste Time!</span>
                <span>Average Payout for a California Accident is</span>
                <span className="ara-hero-amount">$20,000 - $250,000.</span>
                <span>Get your case assessed quickly.</span>
              </h1>
            </div>

            <div className="ara-hero-form" ref={funnelRef}>
              {funnelCard}
            </div>

            {/* A direct child of the hero grid rather than nested in either
                column, so the layout can place it per breakpoint: beneath the
                headline on desktop, where it balances the two columns, and
                after the form on mobile, so the questions stay near the top. */}
            <img
              className="ara-awards"
              src="/ara/awards.png"
              alt="10 Best Attorney Client Satisfaction, Best Lawyers Law Firm of the Year 2020, Top 25 Motor Vehicle Trial Lawyers"
            />
          </div>

          <p className="ara-prefer-call">
            Prefer to talk? Call <a href={CONFIG.PHONE_LINK}>{CONFIG.PHONE_NUMBER}</a>
          </p>
        </div>

        <Settlements />
        <PracticeAreas />
        <CallNowBand />
        <FAQ />
      </main>

      <Footer />

      <ExitIntentPopup />
    </div>
  );
}
