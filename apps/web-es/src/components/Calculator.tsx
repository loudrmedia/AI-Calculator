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
import { captureTrackingParams } from '../lib/tracking';
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

  // Capture marketing attribution (UTMs, gclid, etc.) as soon as the app loads,
  // while the original landing URL params are still present
  useEffect(() => {
    captureTrackingParams();
  }, []);

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
                <h1><span className="title-highlight">Víctimas de Accidentes:</span> Descubra Cuánto Vale su Caso en 30 Segundos</h1>
                <div className="trust-row">
                  <span className="trust-item"><span className="trust-check">✓</span> Gratis</span>
                  <span className="trust-item"><span className="trust-check">✓</span> Rápido</span>
                  <span className="trust-item"><span className="trust-check">✓</span> Sin Compromiso</span>
                </div>
              </div>
            )}

            {state.currentStep === 'contact' && (
              <div className="estimate-ready-banner">
                <span className="trust-check">✓</span>
                <span>
                  <strong>Buenas noticias: su estimado está listo.</strong> Vea el valor de su caso
                  al instante en la siguiente pantalla.
                </span>
              </div>
            )}

            {!isResultsPage && <ProgressBar />}

            <div key={state.currentStep} className="step-content">
              {renderStep()}
            </div>

            {!isResultsPage && (
              <div className="trust-badge-row">
                <span className="trust-badge">🔒 Cifrado de 256 bits</span>
                <span className="trust-badge-divider">•</span>
                <span className="trust-badge">🚫 Nunca Compartido Sin su Consentimiento</span>
              </div>
            )}
          </div>

          {!isResultsPage && (
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                ¿Prefiere hablar? Llame al{' '}
                <a href={CONFIG.PHONE_LINK} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  {CONFIG.PHONE_NUMBER}
                </a>
              </p>
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
