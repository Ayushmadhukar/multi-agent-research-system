import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function SourceCard({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {sources.map((src, i) => (
        <a
          key={i}
          href={src.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card"
          style={{
            padding: '1rem 1.1rem',
            display: 'flex',
            gap: '0.875rem',
            alignItems: 'flex-start',
            textDecoration: 'none',
            transition: 'border-color var(--t-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          {/* Favicon placeholder */}
          <div
            style={{
              flexShrink: 0,
              width: '28px',
              height: '28px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {(src.domain || 'S')[0].toUpperCase()}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {src.title || `Source ${i + 1}`}
              </h4>
              <ExternalLink size={12} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.3rem', fontWeight: 500 }}>
              {src.domain}
            </div>
            {src.snippet && (
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-tertiary)',
                  lineHeight: 1.5,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {src.snippet}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
