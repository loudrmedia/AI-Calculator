'use client';

import React, { useState } from 'react';
import { CalculatorResult } from '../lib/types';
import { formatCurrency } from '../lib/calculator';
import { CONFIG } from '../lib/config';

interface OfferCheckerProps {
  result: CalculatorResult;
}

type Verdict = 'low' | 'fair' | 'strong';

export function OfferChecker({ result }: OfferCheckerProps) {
  const [offerInput, setOfferInput] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [checkedOffer, setCheckedOffer] = useState(0);

  const low = result.withAttorney.grossLow;
  const high = result.withAttorney.grossHigh;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    setOfferInput(digits ? Number(digits).toLocaleString('en-US') : '');
    setVerdict(null);
  };

  const handleCheck = () => {
    const offer = Number(offerInput.replace(/,/g, ''));
    if (!offer || offer <= 0) return;
    setCheckedOffer(offer);
    if (offer < low) {
      setVerdict('low');
    } else if (offer <= high) {
      setVerdict('fair');
    } else {
      setVerdict('strong');
    }
  };

  return (
    <div className="offer-checker">
      <h3>📩 Already Received an Insurance Offer?</h3>
      <p>
        Enter the insurer&apos;s offer to see how it compares to your estimated case value.
      </p>

      <div className="offer-checker-input-row">
        <div className="offer-checker-input">
          <span className="offer-dollar">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={offerInput}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="e.g. 15,000"
            aria-label="Insurance offer amount"
          />
        </div>
        <button className="btn btn-primary offer-check-btn" onClick={handleCheck} disabled={!offerInput}>
          Check Offer
        </button>
      </div>

      {verdict === 'low' && (
        <div className="offer-verdict low">
          <strong>⚠️ This offer appears LOW.</strong>{' '}
          {formatCurrency(checkedOffer)} is below your estimated range of{' '}
          {formatCurrency(low)} – {formatCurrency(high)}. Insurers&apos; first offers are
          often a fraction of a claim&apos;s value — don&apos;t accept before speaking with a
          specialist.{' '}
          <a href={CONFIG.PHONE_LINK}>Call {CONFIG.PHONE_NUMBER} now</a>.
        </div>
      )}
      {verdict === 'fair' && (
        <div className="offer-verdict fair">
          <strong>This offer is within your estimated range</strong> of{' '}
          {formatCurrency(low)} – {formatCurrency(high)} — but it may still leave money on
          the table for future medical costs and diminished value. A free case review can
          confirm before you sign anything.
        </div>
      )}
      {verdict === 'strong' && (
        <div className="offer-verdict strong">
          <strong>This offer is above your estimated range.</strong> Before accepting,
          verify it covers all future medical needs and lost income — a free consultation
          costs nothing and signing a release is permanent.
        </div>
      )}
    </div>
  );
}
