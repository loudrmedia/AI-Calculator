'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { formatCurrency, formatRange, getInjuryCategoryLabel } from '../../lib/calculator';
import { CitationRenderer } from '../CitationRenderer';
import { Disclaimer } from '../Disclaimer';
import { OfferChecker } from '../OfferChecker';
import { CONFIG } from '../../lib/config';

const PHONE_NUMBER = CONFIG.PHONE_NUMBER;
const PHONE_LINK = CONFIG.PHONE_LINK;

// Animates a number counting up to its target for a rewarding reveal
function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setValue(target);
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

export function ResultsStep() {
  const { state } = useFunnel();
  const result = state.result;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  // Synchronous guard against duplicate submissions (e.g. StrictMode double-effect)
  const submitAttempted = useRef(false);

  const withAttorneyAvg = result
    ? Math.round((result.withAttorney.grossLow + result.withAttorney.grossHigh) / 2)
    : 0;
  const animatedValue = useCountUp(withAttorneyAvg);

  useEffect(() => {
    if (result && !submitted) {
      submitLead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, submitted]);

  const getTrustedFormCertUrl = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    
    // Try multiple methods to get TrustedForm certificate URL
    // Method 1: Our explicit input by ID
    const inputById = document.getElementById('xxTrustedFormCertUrl') as HTMLInputElement;
    if (inputById?.value) return inputById.value;
    
    // Method 2: Hidden input field by name (TrustedForm may create its own)
    const inputByName = document.querySelector<HTMLInputElement>('input[name="xxTrustedFormCertUrl"]');
    if (inputByName?.value) return inputByName.value;
    
    // Method 3: TrustedForm's auto-generated ID pattern
    const inputByPattern = document.getElementById('xxTrustedFormCertUrl_0') as HTMLInputElement;
    if (inputByPattern?.value) return inputByPattern.value;
    
    // Method 4: Window object (some TrustedForm versions)
    const win = window as typeof window & { TrustedForm?: { certUrl?: string } };
    if (win.TrustedForm?.certUrl) return win.TrustedForm.certUrl;
    
    return undefined;
  };

  const submitLead = async () => {
    if (!result || submitted || submitAttempted.current) return;
    submitAttempted.current = true;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        inputs: state.inputs,
        contact: state.contact,
        result: {
          withoutAttorney: result.withoutAttorney,
          withAttorney: result.withAttorney,
          severityCategory: result.severityCategory,
          modelVersion: result.modelVersion,
        },
        utmParams: getUtmParams(),
        trustedFormCertUrl: getTrustedFormCertUrl(),
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Lead submission failed');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Lead submission error:', error);
      setSubmitError('Failed to save your information. Please try again.');
      submitAttempted.current = false; // allow manual retry
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUtmParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_content: params.get('utm_content') || undefined,
      utm_term: params.get('utm_term') || undefined,
    };
  };

  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--gray-200)' }} />
        <p style={{ marginTop: '16px', color: 'var(--gray-500)' }}>Calculating your estimate...</p>
      </div>
    );
  }

  const hasInjuries = result.severityCategory !== 'none';
  const showWarning = result.showStatuteWarning;

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Personalized success moment */}
      <div className="results-success-header">
        <div className="results-success-icon">✓</div>
        <h2 className="step-title" style={{ marginBottom: '4px' }}>
          {state.contact.firstName ? `Congratulations, ${state.contact.firstName}!` : 'Congratulations!'}
        </h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
          Your claim estimate is ready — based on{' '}
          {getInjuryCategoryLabel(result.severityCategory).toLowerCase()}.
        </p>
      </div>

      {showWarning && (
        <div className="disclaimer-box warning" style={{ marginBottom: '24px', textAlign: 'left' }}>
          <h4>⚠️ Time-Sensitive Notice</h4>
          <p>
            Most states impose a 2-3 year statute of limitations for personal injury claims. 
            Based on your accident date, you should consult an attorney promptly.
          </p>
        </div>
      )}

      {!hasInjuries && !state.inputs.hasPropertyDamage ? (
        <div className="result-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-600)' }}>
            Based on your selections (no injuries, no property damage), there may not be 
            a compensable claim. However, if you believe you have damages, we recommend 
            consulting with an attorney.
          </p>
        </div>
      ) : (
        <>
          {/* Hero value — the payoff, front and center */}
          <div className="hero-value-card">
            <div className="hero-value-label">Your Estimated Case Value</div>
            <div className="hero-value-amount">{formatCurrency(animatedValue)}</div>
            <div className="hero-value-range">
              Range with attorney: {formatRange(result.withAttorney.grossLow, result.withAttorney.grossHigh)}
            </div>
          </div>

          <div className="results-section">
            <h3>With Attorney vs Without</h3>
            
            <div className="comparison-grid">
              <div className="result-card highlight">
                <div className="result-label">With Attorney</div>
                <div className="result-sublabel">Average</div>
                <div className="result-value" style={{ fontSize: '26px' }}>
                  ✓ {formatCurrency(withAttorneyAvg)}
                </div>
                <div className="result-detail">
                  Range: {formatRange(result.withAttorney.grossLow, result.withAttorney.grossHigh)}
                </div>
              </div>

              <div className="result-card">
                <div className="result-label">Without Attorney</div>
                <div className="result-sublabel">Average</div>
                <div className="result-value" style={{ fontSize: '26px', color: 'var(--danger)' }}>
                  ✗ {formatCurrency(Math.round((result.withoutAttorney.low + result.withoutAttorney.high) / 2))}
                </div>
                <div className="result-detail">
                  Range: {formatRange(result.withoutAttorney.low, result.withoutAttorney.high)}
                </div>
              </div>
            </div>

            <p style={{ 
              textAlign: 'center', 
              fontSize: '13px', 
              color: 'var(--gray-600)', 
              marginTop: '16px',
              padding: '12px',
              background: '#f0fdf4',
              borderRadius: '8px'
            }}>
              With an attorney, you could recover{' '}
              <strong>
                +{formatCurrency(result.withAttorney.netLow - result.withoutAttorney.high)} to{' '}
                +{formatCurrency(result.withAttorney.netHigh - result.withoutAttorney.low)} more
              </strong>{' '}
              — even after fees.
            </p>
          </div>

          <OfferChecker result={result} />
        </>
      )}

      {/* Primary CTA — directly after the value, before any legal content */}
      <div className="results-cta-section">
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--gray-900)', marginBottom: '8px' }}>
          Lock In Your Free Case Review
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '16px' }}>
          Specialists are reviewing your case now. Calling is the fastest way to protect
          your claim&apos;s value.
        </p>

        <a 
          href={PHONE_LINK} 
          className="btn btn-primary call-pulse"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            textDecoration: 'none',
            padding: '16px 32px',
            fontSize: '18px',
          }}
        >
          📞 Call Now: {PHONE_NUMBER}
        </a>
        
        <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '12px' }}>
          Free consultation • No obligation • No fees unless you win
        </p>
      </div>

      {/* Expectation setting — primes the lead to answer the call */}
      <div className="next-steps">
        <h3>What Happens Next</h3>
        <ol>
          <li>
            <span className="next-step-num">1</span>
            <span>
              <strong>Your case is being reviewed.</strong> We&apos;ve received your details
              and confirmed your estimate.
            </span>
          </li>
          <li>
            <span className="next-step-num">2</span>
            <span>
              <strong>Expect a call shortly</strong> at <strong>{state.contact.phone}</strong>.
              Answering quickly keeps your case moving.
            </span>
          </li>
          <li>
            <span className="next-step-num">3</span>
            <span>
              <strong>Get your action plan.</strong> A specialist will explain exactly how to
              pursue the full value of your claim.
            </span>
          </li>
        </ol>
      </div>

      <div className="disclaimer-box" style={{ textAlign: 'left' }}>
        <h4>📋 Important Notice</h4>
        <ul>
          {result.disclaimers.filter(d => !d.includes('TIME-SENSITIVE')).map((disclaimer, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{disclaimer}</li>
          ))}
        </ul>
      </div>

      {/* Data sources - smaller and less prominent */}
      <div className="data-sources-compact">
        <CitationRenderer citations={result.citations} showFullDetails={false} />
      </div>

      {submitError && (
        <div className="disclaimer-box warning" style={{ marginTop: '16px' }}>
          <p>{submitError}</p>
          <button 
            className="btn btn-secondary" 
            onClick={submitLead}
            disabled={isSubmitting}
            style={{ marginTop: '8px' }}
          >
            {isSubmitting ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <Disclaimer />

      <div className="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Use</a>
        <a href="/sources">Data Sources</a>
      </div>
    </div>
  );
}
