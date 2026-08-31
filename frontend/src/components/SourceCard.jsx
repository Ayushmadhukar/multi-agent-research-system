import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';

export default function SourceCard({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
      {sources.map((src, index) => {
        const relevancePercent = Math.round((src.relevance_score || 0.95) * 100);

        return (
          <div
            key={index}
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              transition: 'all var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-accent)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(6, 182, 212, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div>
              {/* Domain & Match Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-accent)'
                  }}>
                    <Globe size={14} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-accent)' }}>
                    {src.domain}
                  </span>
                </div>

                <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                  {relevancePercent}% Match
                </span>
              </div>

              {/* Title */}
              <h4 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-heading)',
                lineHeight: 1.4,
                marginBottom: '0.5rem'
              }}>
                {src.title || `Source Citation [${index + 1}]`}
              </h4>

              {/* Snippet Preview */}
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                marginBottom: '1rem'
              }}>
                {src.snippet || 'Authoritative data source consulted in this synthesis.'}
              </p>
            </div>

            {/* Linkout Action */}
            <div style={{
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Index #{index + 1}
              </span>

              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>Visit Source</span>
                <ExternalLink size={12} color="var(--brand-accent)" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
