import React from 'react';

export default function KeyFindings({ findings = [] }) {
  const valid = (findings || []).filter(
    (f) => f && f.title?.trim().length >= 3 && f.description?.trim().length >= 10
  );

  if (valid.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {valid.map((item, i) => (
        <div
          key={i}
          className="card"
          style={{
            padding: '1.1rem 1.25rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            transition: 'border-color var(--t-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          {/* Index marker */}
          <div
            style={{
              flexShrink: 0,
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--accent)',
              marginTop: '1px',
            }}
          >
            {i + 1}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                marginBottom: '0.3rem',
              }}
            >
              {item.title.trim()}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
              {item.description.trim()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
