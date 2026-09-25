import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function MetricBar({ label, value, max = 10 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {value.toFixed(1)}
        </span>
      </div>
      <div className="progress-track">
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--accent)',
            borderRadius: 'var(--r-full)',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function Scorecard({ scorecard }) {
  if (!scorecard) return null;

  const score   = scorecard.overall_score || 0;
  const clarity = scorecard.clarity_score || 0;
  const depth   = scorecard.depth_score   || 0;
  const rigor   = scorecard.rigor_score   || 0;

  const getGrade = (s) => {
    if (s >= 9) return { label: 'Excellent', color: 'var(--green)' };
    if (s >= 7) return { label: 'Good',      color: 'var(--accent)' };
    if (s >= 5) return { label: 'Fair',      color: 'var(--amber)' };
    return          { label: 'Needs work',  color: 'var(--red)' };
  };
  const grade = getGrade(score);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

      {/* Score panel */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {/* Overall score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
              Overall Score
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {score.toFixed(1)}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/10</span>
            </div>
          </div>
          <span
            className="badge"
            style={{
              background: `${grade.color}18`,
              color: grade.color,
              border: `1px solid ${grade.color}30`,
              fontSize: '0.75rem',
              padding: '0.3rem 0.75rem',
            }}
          >
            {grade.label}
          </span>
        </div>

        {/* Metric bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <MetricBar label="Analytical Clarity" value={clarity} />
          <MetricBar label="Evidence Depth"     value={depth}   />
          <MetricBar label="Factual Rigor"      value={rigor}   />
        </div>

        {/* Verdict */}
        {scorecard.verdict && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-faint)',
              borderRadius: 'var(--r-md)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            "{scorecard.verdict}"
          </div>
        )}
      </div>

      {/* Strengths panel */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
          Strengths
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1.5rem' }}>
          {(scorecard.strengths?.length > 0
            ? scorecard.strengths
            : ['Multi-source evidence synthesis', 'Structured and coherent report', 'Clear actionable takeaways']
          ).map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={14} color="var(--green)" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Critique note */}
        {scorecard.critique && scorecard.critique.length < 600 && (
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
              Reviewer Notes
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', lineHeight: 1.65, margin: 0 }}>
              {scorecard.critique.slice(0, 400)}{scorecard.critique.length > 400 ? '…' : ''}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
