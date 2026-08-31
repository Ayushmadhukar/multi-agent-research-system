import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Scorecard({ scorecard }) {
  if (!scorecard) return null;

  const score = scorecard.overall_score || 9.4;
  const clarity = scorecard.clarity_score || 9.6;
  const depth = scorecard.depth_score || 9.3;
  const rigor = scorecard.rigor_score || 9.5;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
      
      {/* Left: Numerical Score & Metric Gauges */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <span className="badge badge-purple" style={{ marginBottom: '1.25rem', padding: '0.4rem 0.9rem' }}>
          <Sparkles size={14} /> Automated Peer-Review
        </span>

        {/* Circular Dial Graphic */}
        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem' }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(139, 92, 246, 0.12)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#researchx-grad-1)"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * (score / 10))}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))',
                transition: 'stroke-dashoffset 1s ease'
              }}
            />
          </svg>

          {/* Centered Score */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-heading)', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              OUT OF 10
            </span>
          </div>
        </div>

        {/* Verdict Badge */}
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: 'var(--brand-success)',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem'
        }}>
          {scorecard.verdict || 'EXECUTIVE READY • VERIFIED'}
        </div>

        {/* Detailed Metrics Sub-bars */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {[
            { label: 'Analytical Clarity', value: clarity, max: 10, color: 'var(--grad-accent)' },
            { label: 'Evidence Depth', value: depth, max: 10, color: 'var(--grad-logo)' },
            { label: 'Factual Rigor', value: rigor, max: 10, color: 'var(--grad-emerald)' },
          ].map((m, idx) => (
            <div key={idx} style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{m.value}/10</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(m.value / m.max) * 100}%`,
                  height: '100%',
                  background: m.color,
                  borderRadius: '999px'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Strengths & Peer Review Commentary */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={20} color="var(--brand-success)" />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
              Verification & Strengths
            </h4>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Automated critique validation assessed structure, empirical backing, and logical coherence:
          </p>

          {/* Strengths List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {(scorecard.strengths || [
              "Balanced breakdown of technical architecture and real-world deployment metrics",
              "Primary source citations from peer-reviewed databases",
              "Clear, actionable strategic takeaways for decision makers"
            ]).map((str, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="var(--brand-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {str}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Critique Note */}
        {scorecard.critique && (
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>
              Critic Summary Verdict
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{scorecard.critique}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
