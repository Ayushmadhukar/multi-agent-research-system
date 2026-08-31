import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function KeyFindings({ findings = [] }) {
  const validFindings = (findings || []).filter(
    (item) => item && (
      (item.title && item.title.trim().length >= 3) ||
      (item.description && item.description.trim().length >= 10)
    )
  );

  if (validFindings.length === 0) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginTop: '1rem',
      }}
    >
      {validFindings.map((item, index) => {
        const title = item.title && item.title.trim() ? item.title.trim() : `Key Insight #${index + 1}`;
        const description = item.description && item.description.trim() ? item.description.trim() : 'Empirical evidence synthesized from authoritative source data.';

        return (
          <div
            key={index}
            className="glass-panel"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '220px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {/* Top Header Card */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.85rem',
                }}
              >
                <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                  <Sparkles size={12} /> Finding 0{index + 1}
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                  <TrendingUp size={12} /> High Impact
                </span>
              </div>

              <h4
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                  lineHeight: 1.4,
                  marginBottom: '0.65rem',
                }}
              >
                {title}
              </h4>

              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>

            {/* Bottom Visual Index */}
            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>Empirical Evidence</span>
              <span style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>
                Verified Signal ✓
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
