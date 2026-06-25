'use client';

import React, { useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';

const CONSENT_TEXT = `By clicking "GET RESULTS," you expressly consent to receive calls and text messages for marketing purposes using automated technology. You agree that we may contact you at any time, including before 8am or after 9pm local time. Consent is not a condition of purchase. You agree to our Privacy Policy and Terms of Use.`;

type ContactErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  consent?: string;
};

export function ContactStep() {
  const { state, dispatch } = useFunnel();
  const [firstName, setFirstName] = useState(state.contact.firstName || '');
  const [lastName, setLastName] = useState(state.contact.lastName || '');
  const [email, setEmail] = useState(state.contact.email || '');
  const [phone, setPhone] = useState(state.contact.phone || '');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
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
    const newErrors: ContactErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

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

    dispatch({ type: 'SET_FIRST_NAME', payload: firstName.trim() });
    dispatch({ type: 'SET_LAST_NAME', payload: lastName.trim() });
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
      <h2 className="step-title">Last step: where should we send your results?</h2>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            autoFocus
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors((prev) => ({ ...prev, firstName: undefined }));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="First name"
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors((prev) => ({ ...prev, lastName: undefined }));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Last name"
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>
      </div>

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
        <label htmlFor="phone">Phone (your specialist will call this number)</label>
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

      <p className="privacy-note">
        🔒 Your information is secure, confidential, and never sold.
      </p>

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
            'GET MY RESULTS »'
          )}
        </button>
      </div>
    </div>
  );
}
