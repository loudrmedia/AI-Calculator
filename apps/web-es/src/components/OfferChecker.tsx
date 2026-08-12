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
      <h3>📩 ¿Ya Recibió una Oferta del Seguro?</h3>
      <p>
        Ingrese la oferta de la aseguradora para ver cómo se compara con el valor estimado de su caso.
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
            placeholder="ej. 15,000"
            aria-label="Monto de la oferta del seguro"
          />
        </div>
        <button className="btn btn-primary offer-check-btn" onClick={handleCheck} disabled={!offerInput}>
          Revisar Oferta
        </button>
      </div>

      {verdict === 'low' && (
        <div className="offer-verdict low">
          <strong>⚠️ Esta oferta parece BAJA.</strong>{' '}
          {formatCurrency(checkedOffer)} está por debajo de su rango estimado de{' '}
          {formatCurrency(low)} – {formatCurrency(high)}. Las primeras ofertas de las
          aseguradoras suelen ser una fracción del valor del reclamo. No acepte sin antes
          hablar con un especialista.{' '}
          <a href={CONFIG.PHONE_LINK}>Llame ahora al {CONFIG.PHONE_NUMBER}</a>.
        </div>
      )}
      {verdict === 'fair' && (
        <div className="offer-verdict fair">
          <strong>Esta oferta está dentro de su rango estimado</strong> de{' '}
          {formatCurrency(low)} – {formatCurrency(high)}, pero aún podría dejar dinero sin
          cobrar por gastos médicos futuros y pérdida de valor. Una revisión gratuita de su
          caso puede confirmarlo antes de que firme cualquier cosa.
        </div>
      )}
      {verdict === 'strong' && (
        <div className="offer-verdict strong">
          <strong>Esta oferta supera su rango estimado.</strong> Antes de aceptar, verifique
          que cubra todas sus necesidades médicas futuras y sus ingresos perdidos. Una consulta
          gratuita no cuesta nada y firmar una liberación es definitivo.
        </div>
      )}
    </div>
  );
}
