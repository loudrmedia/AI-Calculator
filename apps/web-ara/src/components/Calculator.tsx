'use client';

import React, { useEffect, useRef } from 'react';
import { useFunnel } from '../lib/funnel-context';
import { ProgressBar } from './ProgressBar';
import { Navbar } from './Navbar';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { Settlements } from './Settlements';
import { PracticeAreas } from './PracticeAreas';
import { EstimateCta } from './EstimateCta';
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
              <p className="ara-hero-badge">
                <span className="ara-hero-badge-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <path d="M8 7h8M8 11h8M8 15h4" />
                  </svg>
                </span>
                Free Case Value Calculator
              </p>
              <h1>
                See What Your <span className="ara-hero-accent">California Accident</span> Case Could Be Worth
              </h1>
              <p className="ara-hero-sub">
                Get a personalized estimate based on{' '}
                <span className="ara-hero-underline">real case data</span>
              </p>
              <ul className="ara-hero-points">
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12.5l2.5 2.5L16 9" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Free
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Private
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  No obligation
                </li>
              </ul>
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
        <EstimateCta targetRef={funnelRef} offset={NAVBAR_OFFSET} />
        <FAQ />
      </main>

      <Footer />

      <ExitIntentPopup />
    </div>
  );
}
