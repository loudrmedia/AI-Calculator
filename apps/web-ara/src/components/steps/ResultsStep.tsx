'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { formatRange } from '../../lib/calculator';
import { CitationRenderer } from '../CitationRenderer';
import { Disclaimer } from '../Disclaimer';
import { CONFIG } from '../../lib/config';
import { getTrackingParams, trackLeadConversion } from '../../lib/tracking';

const PHONE_NUMBER = CONFIG.PHONE_NUMBER;
const PHONE_LINK = CONFIG.PHONE_LINK;

export function ResultsStep() {
  const { state } = useFunnel();
  const result = state.result;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  // Synchronous guard against duplicate submissions (e.g. StrictMode double-effect)
  const submitAttempted = useRef(false);

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
      const tracking = getTrackingParams();
      const payload = {
        inputs: state.inputs,
        contact: state.contact,
        result: {
          withoutAttorney: result.withoutAttorney,
          withAttorney: result.withAttorney,
          severityCategory: result.severityCategory,
          modelVersion: result.modelVersion,
        },
        utmParams: {
          utm_source: tracking.utm_source,
          utm_medium: tracking.utm_medium,
          utm_campaign: tracking.utm_campaign,
          utm_content: tracking.utm_content,
          utm_term: tracking.utm_term,
        },
        tracking: {
          gclid: tracking.gclid,
          wbraid: tracking.wbraid,
          gbraid: tracking.gbraid,
          fbclid: tracking.fbclid,
          landingPageUrl: tracking.landingPageUrl,
          referrer: tracking.referrer,
        },
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
      } else {
        // Count the conversion only once the lead has actually been recorded,
        // so a failed submission can't inflate ad platform reporting.
        // Phone is normalized to E.164 (+1XXXXXXXXXX) for Google Enhanced Conversions.
        const digits = (state.contact.phone || '').replace(/\D/g, '');
        trackLeadConversion({
          firstName: state.contact.firstName,
          lastName: state.contact.lastName,
          email: state.contact.email,
          phone: digits ? `+1${digits.slice(-10)}` : undefined,
          zipCode: state.inputs.zipCode,
        });
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

  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner" style={{ borderTopColor: 'var(--gold)', borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <p style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>Calculating your estimate...</p>
      </div>
    );
  }

  const hasInjuries = result.severityCategory !== 'none';
  const showWarning = result.showStatuteWarning;

  return (
    <div style={{ textAlign: 'center' }}>
      {/* The estimate opens the page. It is what the visitor came for and what
          they were promised, so it lands before the call expectation below. */}
      <div className="ara-estimate-first">
        {!hasInjuries && !state.inputs.hasPropertyDamage ? (
          <div className="result-card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Based on your selections (no injuries, no property damage), there may not be 
              a compensable claim. However, if you believe you have damages, we recommend 
              consulting with an attorney.
            </p>
          </div>
        ) : (
          <>
            <h2 className="ara-estimate-heading">
              {state.contact.firstName
                ? `${state.contact.firstName}, here is your case estimate`
                : 'Here is your case estimate'}
            </h2>

            {/* Both figures are ranges rather than single numbers: the estimate
                is a band, and quoting one number reads as a promise of that
                amount. The representation figure leads on size and colour so
                the comparison is legible at a glance. */}
            <div className="ara-value-grid">
              <div className="ara-value-card ara-value-card--primary">
                <div className="ara-value-tag">Your Estimated Case Value</div>
                <div className="ara-value-amount">
                  {formatRange(result.withAttorney.grossLow, result.withAttorney.grossHigh)}
                </div>
                <div className="ara-value-note">Estimated range for claims like yours</div>
              </div>

              <div className="ara-value-card ara-value-card--secondary">
                <div className="ara-value-tag">Typical Insurance Offer</div>
                <div className="ara-value-amount">
                  {formatRange(result.withoutAttorney.low, result.withoutAttorney.high)}
                </div>
                <div className="ara-value-note">
                  What insurers commonly pay when a claim is settled directly
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <hr className="ara-divider" />

      {/* ARA "check your phone" moment — the lead is already submitted at this point */}
      <div className="ara-results-hero">
        <h1>Check your phone!</h1>
        <p>
          In the next <span className="ara-highlight">5 minutes</span> you will receive a call to
          find out the value of your case.
        </p>
      </div>

      <div className="ara-callout">
        <p>
          ⚠️ Don&apos;t miss this call! It might come from an Unknown Number, so please pick up.
        </p>
        <p>
          🔔 If we can&apos;t connect, we won&apos;t be able to help you move your case forward or
          get your payout started.
        </p>
      </div>

      {showWarning && (
        <div className="disclaimer-box warning" style={{ margin: '28px 0 24px', textAlign: 'left' }}>
          <h4>⚠️ Time-Sensitive Notice</h4>
          <p>
            Most states impose a 2-3 year statute of limitations for personal injury claims. 
            Based on your accident date, you should consult an attorney promptly.
          </p>
        </div>
      )}

      <hr className="ara-divider" />

      <div className="ara-results-cta">
        <h2>Or...call us now to find out faster</h2>
        <p className="ara-get-started">
          <span className="ara-chevron">≫</span> Get Started <span className="ara-chevron">≪</span>
        </p>

        <a href={PHONE_LINK} className="ara-call-btn call-pulse">
          {PHONE_NUMBER}
        </a>

        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '14px' }}>
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

      <img className="ara-footer-logo" src="/logo-wide.png" alt="Auto Relief Assistance" />

      <div className="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Use</a>
        <a href="/sources">Data Sources</a>
      </div>
    </div>
  );
}
