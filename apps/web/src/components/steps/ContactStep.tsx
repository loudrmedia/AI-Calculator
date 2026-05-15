'use client';

import React, { useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';

const CONSENT_TEXT = `By clicking "GET RESULTS," you expressly consent to receive calls and text messages for marketing purposes using automated technology. You agree that we may contact you at any time, including before 8am or after 9pm local time. Consent is not a condition of purchase. You agree to our Privacy Policy and Terms of Use.`;

export function ContactStep() {
  const { state, dispatch } = useFunnel();
  const [email, setEmail] = useState(state.contact.email || '');
  const [phone, setPhone] = useState(state.contact.phone || '');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string; consent?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const validate = () => {
    const newErrors: { email?: string; phone?: string; consent?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!consent) {
      newErrors.consent = 'Please agree to the terms to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    dispatch({ type: 'SET_EMAIL', payload: email.trim() });
    dispatch({ type: 'SET_PHONE', payload: phone });
    dispatch({
      type: 'SET_CONSENT',
      payload: {
        timestamp: new Date().toISOString(),
        text: CONSENT_TEXT,
      },
    });

    dispatch({ type: 'CALCULATE_RESULT' });
    dispatch({ type: 'NEXT_STEP' });
    
    setIsSubmitting(false);
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <div>
      <h2 className="step-title">Final step. What are your contact details?</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '24px', fontSize: '14px' }}>
        Your case estimate is ready. Enter your contact details to see its full value.
      </p>

      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="(555) 555-5555"
        />
        {errors.phone && <p className="error-message">{errors.phone}</p>}
      </div>

      <div className="consent-box">
        <label>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors((prev) => ({ ...prev, consent: undefined }));
            }}
          />
          <span>
            By clicking &quot;GET RESULTS,&quot; you expressly consent to receive calls and text 
            messages for marketing purposes using automated technology. You agree that we may 
            contact you at any time, including before 8am or after 9pm local time. Consent is 
            not a condition of purchase. You agree to our{' '}
            <a href="/privacy" target="_blank">Privacy Policy</a> and{' '}
            <a href="/terms" target="_blank">Terms of Use</a>.
          </span>
        </label>
        {errors.consent && (
          <p className="error-message" style={{ marginTop: '8px', marginLeft: '30px' }}>
            {errors.consent}
          </p>
        )}
      </div>

      <div className="button-row">
        <button className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner" />
              Processing...
            </>
          ) : (
            'GET RESULTS »'
          )}
        </button>
      </div>
    </div>
  );
}
