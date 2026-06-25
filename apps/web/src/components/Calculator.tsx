'use client';

import React, { useEffect } from 'react';
import { useFunnel } from '../lib/funnel-context';
import { ProgressBar } from './ProgressBar';
import { Navbar } from './Navbar';
import { ValueComparison } from './ValueComparison';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { Disclaimer } from './Disclaimer';
import { ExitIntentPopup } from './ExitIntentPopup';
import { CONFIG } from '../lib/config';
import {
  AccidentTypeStep,
  InjuriesStep,
  FaultStep,
  TimingStep,
  ZipCodeStep,
  DescriptionStep,
  ContactStep,
  ResultsStep,
} from './steps';


export function Calculator() {
  const { state } = useFunnel();

  // Always bring the user back to the top of the form when the step changes,
  // so the next question is immediately visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      case 'description':
        return <DescriptionStep />;
      case 'contact':
        return <ContactStep />;
      case 'results':
        return <ResultsStep />;
      default:
        return <AccidentTypeStep />;
    }
  };

  const isResultsPage = state.currentStep === 'results';
  const isFirstStep = state.currentStep === 'accident_type';

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="container">
          <div className="card">
            {isFirstStep && (
              <div className="header">
                <h1>See What Your Case Is Worth in 30 Seconds</h1>
                <div className="trust-row">
                  <span className="trust-item"><span className="trust-check">✓</span> 100% Free</span>
                  <span className="trust-item"><span className="trust-check">✓</span> Takes 30 Seconds</span>
                  <span className="trust-item"><span className="trust-check">✓</span> No Obligation</span>
                </div>
              </div>
            )}

            {state.currentStep === 'contact' && (
              <div className="estimate-ready-banner">
                <span className="trust-check">✓</span>
                <span>
                  <strong>Good news — your estimate is ready.</strong> See your case value instantly on
                  the next screen.
                </span>
              </div>
            )}

            {!isResultsPage && <ProgressBar />}

            <div key={state.currentStep} className="step-content">
              {renderStep()}
            </div>
          </div>

          {!isResultsPage && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                Prefer to talk it through? Get your free case review by phone:{' '}
                <a href={CONFIG.PHONE_LINK} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  {CONFIG.PHONE_NUMBER}
                </a>
              </p>
              <div className="trust-badge-row">
                <span className="trust-badge">🔒 256-bit Encrypted</span>
                <span className="trust-badge-divider">•</span>
                <span className="trust-badge">✅ TrustedForm Certified</span>
                <span className="trust-badge-divider">•</span>
                <span className="trust-badge">🚫 Never Shared Without Consent</span>
              </div>
            </div>
          )}

          {isFirstStep && (
            <>
              <ValueComparison />
              <FAQ />
              <Disclaimer />
            </>
          )}
        </div>
      </main>

      <Footer />

      <ExitIntentPopup />
    </div>
  );
}
