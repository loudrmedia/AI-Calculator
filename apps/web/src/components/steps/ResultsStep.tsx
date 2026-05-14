'use client';

import React, { useEffect, useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';
import { formatCurrency, formatRange, getInjuryCategoryLabel } from '../../lib/calculator';
import { CitationRenderer } from '../CitationRenderer';
import { Disclaimer } from '../Disclaimer';
import { CONFIG } from '../../lib/config';

const PHONE_NUMBER = CONFIG.PHONE_NUMBER;
const PHONE_LINK = CONFIG.PHONE_LINK;

export function ResultsStep() {
  const { state } = useFunnel();
  const result = state.result;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (result && !submitted) {
      submitLead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, submitted]);

  const getTrustedFormCertUrl = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    const input = document.querySelector<HTMLInputElement>('input[name="xxTrustedFormCertUrl"]');
    return input?.value || undefined;
  };

  const submitLead = async () => {
    if (!result || submitted) return;

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
      {/* Callback emphasis banner */}
      <div className="callback-banner" style={{ textAlign: 'left' }}>
        <div className="callback-icon">📞</div>
        <div className="callback-text">
          <strong>An Accident Claim Specialist Will Call You Shortly</strong>
          <p>We&apos;re reviewing your case and will reach out as soon as possible.</p>
        </div>
      </div>

      {/* Main title */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 className="step-title" style={{ marginBottom: '8px' }}>
          Your Evidence-Based Claim Value Estimate
        </h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>
          Based on {getInjuryCategoryLabel(result.severityCategory).toLowerCase()}
        </p>
      </div>

      {showWarning && (
        <div className="disclaimer-box warning" style={{ marginBottom: '24px' }}>
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
          <div className="results-section">
            <h3>Comparison: With Attorney vs Without</h3>
            
            <div className="comparison-grid">
              <div className="result-card highlight">
                <div className="result-label">With Attorney</div>
                <div className="result-sublabel">Average</div>
                <div className="result-value" style={{ fontSize: '26px' }}>
                  ✓ {formatCurrency(Math.round((result.withAttorney.grossLow + result.withAttorney.grossHigh) / 2))}
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
              *Based on your claim details, you&apos;d <strong>significantly benefit</strong> from speaking with an attorney.
            </p>
          </div>

          <div className="results-section">
            <h3>Potential Additional Value with Attorney</h3>
            <div className="result-card">
              <div className="result-value" style={{ color: 'var(--success)', fontSize: '24px' }}>
                +{formatCurrency(result.withAttorney.netLow - result.withoutAttorney.high)} to +{formatCurrency(result.withAttorney.netHigh - result.withoutAttorney.low)}
              </div>
              <div className="result-detail">
                Potential additional recovery even after fees
              </div>
            </div>
          </div>
        </>
      )}

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

      {/* Call to action with specialist emphasis */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--gray-900)', marginBottom: '12px' }}>
          Don&apos;t Wait - Speak With a Specialist Now
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '8px' }}>
          One of our accident claim specialists will contact you at{' '}
          <strong>{state.contact.email}</strong> or <strong>{state.contact.phone}</strong> very soon.
        </p>
        <p style={{ fontWeight: '600', color: 'var(--gray-800)', marginBottom: '16px' }}>
          For immediate assistance, call us directly:
        </p>
        
        <a 
          href={PHONE_LINK} 
          className="btn btn-primary"
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
          Free consultation • No obligation
        </p>
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
