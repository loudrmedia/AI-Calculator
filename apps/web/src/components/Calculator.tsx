'use client';

import React from 'react';
import { useFunnel } from '../lib/funnel-context';
import { ProgressBar } from './ProgressBar';
import { Navbar } from './Navbar';
import { ValueComparison } from './ValueComparison';
import { FAQ } from './FAQ';
import { Footer } from './Footer';
import { Disclaimer } from './Disclaimer';
import { CONFIG } from '../lib/config';
import {
  AccidentTypeStep,
  InjuriesStep,
  FaultStep,
  TimingStep,
  ZipCodeStep,
  DescriptionStep,
  NameStep,
  ContactStep,
  ResultsStep,
} from './steps';


export function Calculator() {
  const { state } = useFunnel();

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
      case 'name':
        return <NameStep />;
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
            {!isResultsPage && (
              <div className="header">
                <h1>Free AI Case Calculator</h1>
                <p>Instantly Determine the Value of Your Claim.</p>
              </div>
            )}

            {!isResultsPage && <ProgressBar />}

            {renderStep()}
          </div>

          {!isResultsPage && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                Risk-Free Claim Assessment • Call Now:{' '}
                <a href={CONFIG.PHONE_LINK} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  {CONFIG.PHONE_NUMBER}
                </a>
              </p>
              <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px' }}>
                🔒 Privacy Protected
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
    </div>
  );
}
