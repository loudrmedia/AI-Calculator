'use client';

import React, { useState } from 'react';
import { useFunnel } from '../../lib/funnel-context';

// TODO(legal): this is a working translation of the English TCPA consent and has
// NOT been approved by counsel. It is the exact text stored on the lead record as
// proof of consent, so it must be reviewed and signed off before this site takes
// live traffic. If legal supplies different wording, update both this constant
// and the checkbox label below so the stored text matches what the user saw.
const CONSENT_TEXT = `Al marcar esta casilla, usted da su consentimiento expreso para recibir llamadas y mensajes de texto con fines de mercadeo de parte de 1800theLaw2 mediante tecnología automatizada, incluyendo voz artificial o pregrabada y voz generada por inteligencia artificial. Usted acepta que podemos comunicarnos con usted en cualquier momento, incluso antes de las 8:00 a.m. o después de las 9:00 p.m., hora local. El consentimiento no es una condición de compra. Usted acepta el uso de firmas electrónicas.`;

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
      newErrors.firstName = 'El nombre es obligatorio';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Por favor ingrese un correo electrónico válido';
    }

    if (!phone.trim()) {
      newErrors.phone = 'El número de teléfono es obligatorio';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Por favor ingrese un número de teléfono válido de 10 dígitos';
    }

    if (!consent) {
      newErrors.consent = 'Por favor acepte los términos para continuar';
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
      <h2 className="step-title">Último paso: ¿a dónde enviamos sus resultados?</h2>

      <div className="contact-form">
        <div className="input-group">
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
            placeholder="Nombre*"
          />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
        </div>

        <div className="input-group">
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors((prev) => ({ ...prev, lastName: undefined }));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Apellido*"
          />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
        </div>

        <div className="input-group">
          <div className="input-with-icon">
            <span className="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
            </span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Correo Electrónico*"
            />
          </div>
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="input-group">
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Teléfono*"
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>
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
            Al marcar esta casilla, usted da su consentimiento expreso para recibir llamadas y 
            mensajes de texto con fines de mercadeo de parte de 1800theLaw2 mediante tecnología 
            automatizada, incluyendo voz artificial o pregrabada y voz generada por inteligencia 
            artificial. Usted acepta que podemos comunicarnos con usted en cualquier momento, 
            incluso antes de las 8:00 a.m. o después de las 9:00 p.m., hora local. El 
            consentimiento no es una condición de compra. Usted acepta el uso de firmas 
            electrónicas.
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
          ← Atrás
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
              Procesando...
            </>
          ) : (
            'VER MIS RESULTADOS »'
          )}
        </button>
      </div>
    </div>
  );
}
