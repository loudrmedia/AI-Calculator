'use client';

import { AllSourcesTable } from '../../components/CitationRenderer';
import { MODEL_VERSION } from '../../lib/sources';

export default function SourcesPage() {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Data Sources & Methodology</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '8px' }}>
          Calculator Model Version: {MODEL_VERSION}
        </p>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
          Every figure in our estimates is derived from publicly available sources. 
          This page provides complete transparency about our methodology and data.
        </p>

        <div style={{ 
          background: '#eff6ff', 
          border: '1px solid #3b82f6', 
          borderRadius: '8px', 
          padding: '16px',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '16px', color: '#1e40af', marginBottom: '8px' }}>
            Our Commitment to Transparency
          </h3>
          <p style={{ color: '#1e40af', fontSize: '14px', margin: 0 }}>
            We believe you deserve to know exactly how your estimate was calculated. 
            Click any source link below to verify the underlying data yourself.
          </p>
        </div>

        <AllSourcesTable />

        <section style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>How We Calculate Estimates</h2>
          
          <div style={{ lineHeight: '1.8', color: 'var(--gray-700)' }}>
            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '8px' }}>
              Model A: Without Attorney (Early Settlement Range)
            </h3>
            <p>
              This model estimates what you might receive in an early, direct settlement with 
              insurance. It uses:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                <strong>Base Amount:</strong> Insurance Information Institute average paid claims 
                for bodily injury ($28,278) and property damage ($6,770)
              </li>
              <li>
                <strong>Severity Adjustment:</strong> Applied based on injury category 
                (soft tissue: 15%, substantial: 50%, catastrophic: 100%)
              </li>
              <li>
                <strong>Modifiers:</strong> Fault status and accident timing adjustments
              </li>
            </ul>

            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '8px' }}>
              Model B: With Attorney (Negotiated Range)
            </h3>
            <p>
              This model estimates potential outcomes with legal representation, including 
              non-economic damages:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                <strong>Economic Base:</strong> Same calculation as Model A
              </li>
              <li>
                <strong>Non-Economic (Pain & Suffering):</strong> Multiplier method 
                (1.5× to 5× economic damages) per industry-standard frameworks documented 
                by Lawyers.com
              </li>
              <li>
                <strong>Net After Fees:</strong> Gross amount minus illustrative 33% contingent 
                fee (actual fees vary by attorney)
              </li>
            </ul>

            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '8px' }}>
              Rounding Policy
            </h3>
            <p>
              All monetary estimates are <strong>rounded UP</strong> to the nearest dollar 
              for presentation.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Important Limitations</h2>
          
          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #f59e0b', 
            borderRadius: '8px', 
            padding: '20px'
          }}>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Illustrative Only:</strong> These estimates are educational and do not 
                predict actual case outcomes
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Not Legal Advice:</strong> Consult a qualified attorney for advice 
                specific to your situation
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Industry Averages:</strong> Source figures represent averages, not 
                individual case predictions
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Jurisdiction Varies:</strong> Laws, insurance practices, and outcomes 
                vary significantly by state
              </li>
              <li>
                <strong>Many Factors:</strong> Actual case values depend on specific facts, 
                evidence, coverage limits, and many other factors not captured in this simplified model
              </li>
            </ul>
          </div>
        </section>

        <section style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Source Update Policy</h2>
          <p style={{ color: 'var(--gray-700)' }}>
            We regularly review and update our source data to ensure accuracy. Each estimate 
            includes a model version number that corresponds to the source data used. 
            If you received an estimate with an older version, the underlying data may have 
            since been updated.
          </p>
        </section>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' }}>
          <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            ← Back to Calculator
          </a>
        </div>
      </div>
    </div>
  );
}
