import React from 'react';
import { Citation, SOURCES, MODEL_VERSION, DATA_ACCESS_DATE } from '../lib/sources';

interface CitationRendererProps {
  citations: Citation[];
  showFullDetails?: boolean;
}

export function CitationRenderer({ citations, showFullDetails = false }: CitationRendererProps) {
  if (citations.length === 0) return null;

  return (
    <div className="citations-container">
      <div className="citations-header">
        <h4>Data Sources</h4>
        <span className="model-version">
          Model v{MODEL_VERSION} • Data accessed {DATA_ACCESS_DATE}
        </span>
      </div>
      
      <p className="citations-intro">
        Every figure in this estimate is derived from publicly available sources. 
        Click any link to verify the underlying data.
      </p>

      <ul className="citations-list">
        {citations.map((citation, index) => (
          <li key={`${citation.sourceId}-${index}`} className="citation-item">
            <a 
              href={citation.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="citation-link"
            >
              <span className="citation-number">[{index + 1}]</span>
              <span className="citation-name">{citation.shortName}</span>
              <svg className="external-icon" viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
            </a>
            {showFullDetails && (
              <span className="citation-detail">{citation.figureUsed}</span>
            )}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .citations-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px 20px;
          margin-top: 24px;
          font-size: 14px;
        }

        .citations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .citations-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }

        .model-version {
          font-size: 12px;
          color: #64748b;
        }

        .citations-intro {
          color: #64748b;
          margin: 0 0 12px 0;
          font-size: 13px;
        }

        .citations-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
        }

        @media (max-width: 480px) {
          .citations-list {
            grid-template-columns: 1fr;
          }
        }

        .citation-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .citation-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s;
        }

        .citation-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        .citation-number {
          font-weight: 500;
          color: #64748b;
          font-size: 12px;
        }

        .citation-name {
          font-weight: 500;
        }

        .external-icon {
          opacity: 0.6;
        }

        .citation-detail {
          font-size: 12px;
          color: #64748b;
          padding-left: 24px;
        }
      `}</style>
    </div>
  );
}

interface InlineCitationProps {
  sourceId: keyof typeof SOURCES;
  children?: React.ReactNode;
}

export function InlineCitation({ sourceId, children }: InlineCitationProps) {
  const source = SOURCES[sourceId];
  
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-citation"
      title={source.name}
    >
      {children || source.shortName}
      <sup>[↗]</sup>
      <style jsx>{`
        .inline-citation {
          color: #2563eb;
          text-decoration: none;
          border-bottom: 1px dotted #2563eb;
        }
        .inline-citation:hover {
          color: #1d4ed8;
          border-bottom-style: solid;
        }
        .inline-citation sup {
          font-size: 10px;
          margin-left: 1px;
        }
      `}</style>
    </a>
  );
}

export function AllSourcesTable() {
  const sourcesList = Object.values(SOURCES);

  return (
    <div className="sources-table-container">
      <h3>Complete Data Sources</h3>
      <p className="sources-intro">
        All data accessed and current as of {DATA_ACCESS_DATE}. Click any link to verify.
      </p>
      
      <div className="sources-grid">
        {sourcesList.map((source, index) => (
          <div key={source.id} className="source-card">
            <div className="source-header">
              <span className="source-number">{index + 1}</span>
              <a 
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-title"
              >
                {source.name}
              </a>
            </div>
            
            {Object.keys(source.figures).length > 0 && (
              <div className="source-figures">
                {Object.entries(source.figures).map(([key, fig]) => (
                  <div key={key} className="figure-item">
                    <span className="figure-value">
                      {typeof fig.value === 'number' 
                        ? fig.unit === 'USD' 
                          ? `$${fig.value.toLocaleString()}`
                          : fig.unit === 'percent'
                            ? `${fig.value}%`
                            : `${fig.value}×`
                        : fig.value}
                    </span>
                    <span className="figure-desc">{fig.description}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="source-usage">
              <strong>Usage:</strong> {source.allowedUsage}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .sources-table-container {
          padding: 24px 0;
        }

        .sources-table-container h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          color: #1e293b;
        }

        .sources-intro {
          color: #64748b;
          margin: 0 0 20px 0;
        }

        .sources-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .source-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }

        .source-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .source-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #2563eb;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .source-title {
          color: #1e293b;
          font-weight: 600;
          text-decoration: none;
          line-height: 1.4;
        }

        .source-title:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .source-figures {
          background: #f8fafc;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 12px;
        }

        .figure-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 4px 0;
          gap: 12px;
        }

        .figure-item:not(:last-child) {
          border-bottom: 1px solid #e2e8f0;
        }

        .figure-value {
          font-weight: 600;
          color: #059669;
          white-space: nowrap;
        }

        .figure-desc {
          font-size: 13px;
          color: #64748b;
          text-align: right;
        }

        .source-usage {
          font-size: 13px;
          color: #475569;
        }

        .source-usage strong {
          color: #334155;
        }
      `}</style>
    </div>
  );
}
