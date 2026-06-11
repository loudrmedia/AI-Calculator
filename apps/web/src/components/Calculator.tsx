'use client';

import React, { useEffect } from 'react';
import { useFunnel } from '../lib/funnel-context';
import { ProgressBar } from './ProgressBar';
import { Navbar } from './Navbar';
import { ValueComparison } from './ValueComparison';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { Disclaimer } from './Disclaimer';
import { SettlementRanges } from './SettlementRanges';
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
          {isFirstStep && (
            <div className="settlement-teaser">
              💰 Average car accident settlements range from <strong>$5,000 to $300,000+</strong>
              {' '}— answer a few questions to see your personalized estimate.
            </div>
          )}

          <div className="card">
            {!isResultsPage && (
              <div className="header">
                <h1>Injured in an Accident? See What Your Case Is Worth in 60 Seconds</h1>
                <p>Insurance adjusters lowball 9 out of 10 claims. Get your real number — free, private, no obligation.</p>
                <div className="trust-row">
                  <span className="trust-item"><span className="trust-check">✓</span> 100% Free</span>
                  <span className="trust-item"><span className="trust-check">✓</span> Takes ~1 Minute</span>
                  <span className="trust-item"><span className="trust-check">✓</span> No Obligation</span>
                </div>
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
              <div className="methodology-strip">
                Our calculator applies the same <strong>multiplier method</strong> insurance
                adjusters and attorneys use to value claims — adjusted for your injuries,
                fault, timing, and state.
              </div>
              <SettlementRanges />
              <ValueComparison />
              <FAQ />
              <Disclaimer />
            </>
          )}
        </div>
      </main>

      <Footer />

      <ExitIntentPopup />

      {/* Sticky call bar — mobile only */}
      <a href={CONFIG.PHONE_LINK} className="mobile-call-bar">
        <span className="mobile-call-icon">📞</span>
        <span className="mobile-call-text">
          <span className="mobile-call-label">Free Case Review — Tap to Call</span>
          <span className="mobile-call-number">{CONFIG.PHONE_NUMBER}</span>
        </span>
      </a>
    </div>
  );
}
