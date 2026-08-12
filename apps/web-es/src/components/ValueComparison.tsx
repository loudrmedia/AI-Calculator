'use client';

import React from 'react';

export function ValueComparison() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="value-comparison">
      <div className="comparison-card good">
        <div className="comparison-icon">✓</div>
        <h3>Lo Que le Ayudamos a Descubrir</h3>
        <ul>
          <li>
            <span className="check">✓</span>
            Todo su potencial de compensación, no solo lo que ofrece el seguro
          </li>
          <li>
            <span className="check">✓</span>
            Orientación clara sobre los mejores pasos a seguir en su situación
          </li>
          <li>
            <span className="check">✓</span>
            Conexión con profesionales legales con experiencia que luchan por usted
          </li>
          <li>
            <span className="check">✓</span>
            El máximo de cada dólar que merece por sus lesiones y daños
          </li>
        </ul>
      </div>

      <div className="comparison-card bad">
        <div className="comparison-icon">✗</div>
        <h3>Lo Que el Seguro No le Dirá</h3>
        <ul>
          <li>
            <span className="x-mark">✗</span>
            Su primera oferta suele ser mucho menor que el valor real de su reclamo
          </li>
          <li>
            <span className="x-mark">✗</span>
            El dolor continuo y las necesidades médicas futuras rara vez se cubren
          </li>
          <li>
            <span className="x-mark">✗</span>
            Los ingresos perdidos y la menor capacidad de trabajo se pasan por alto
          </li>
          <li>
            <span className="x-mark">✗</span>
            La pérdida de valor de su vehículo tras las reparaciones se ignora
          </li>
        </ul>
      </div>

      <div className="value-comparison-cta">
        <button type="button" className="btn btn-primary" onClick={scrollToTop}>
          Descubra Cuánto Vale su Caso ↑
        </button>
      </div>
    </div>
  );
}
