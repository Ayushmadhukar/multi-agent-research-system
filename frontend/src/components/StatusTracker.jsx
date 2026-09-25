import React from 'react';
import { Globe, FileSearch, PenLine, ShieldCheck, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 'DISCOVERY', label: 'Search',    icon: Globe,        desc: 'Querying sources & repositories' },
  { id: 'ANALYSIS',  label: 'Read',      icon: FileSearch,   desc: 'Extracting key content from pages' },
  { id: 'SYNTHESIS', label: 'Write',     icon: PenLine,      desc: 'Drafting structured report' },
  { id: 'CRITIQUE',  label: 'Review',    icon: ShieldCheck,  desc: 'Scoring quality & accuracy' },
];

const PHASE_TO_IDX = {
  STARTING: 0, DISCOVERY: 0,
  ANALYSIS: 1,
  SYNTHESIS: 2,
  CRITIQUE: 3,
  COMPLETED: 4,
};

export default function StatusTracker({ phase = 'DISCOVERY', message = '', progress = 15, topic = '' }) {
  const idx = PHASE_TO_IDX[phase] ?? 0;

  return (
    <div style={{ maxWidth: '680px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div
        className="card"
        style={{ padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>
              Analyzing
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, margin: 0, maxWidth: '460px' }}>
              {topic || 'Processing…'}
            </h3>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {progress}%
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track" style={{ marginBottom: '1.5rem' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Stages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {STAGES.map((stage, i) => {
            const done    = idx > i;
            const active  = idx === i;
            const Icon    = stage.icon;

            return (
              <div
                key={stage.id}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--r-md)',
                  border: `1px solid ${active ? 'var(--accent-border)' : done ? 'var(--green-border)' : 'var(--border-faint)'}`,
                  background: active ? 'var(--accent-dim)' : done ? 'var(--green-dim)' : 'var(--bg-elevated)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  {done ? (
                    <CheckCircle2 size={14} color="var(--green)" strokeWidth={2} />
                  ) : (
                    <Icon
                      size={14}
                      color={active ? 'var(--accent)' : 'var(--text-tertiary)'}
                      strokeWidth={2}
                      style={active ? { animation: 'pulse-dot 2s infinite' } : {}}
                    />
                  )}
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--text-tertiary)',
                    }}
                  >
                    {done ? 'Done' : active ? 'Active' : `0${i + 1}`}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: done || active ? 'var(--text-primary)' : 'var(--text-tertiary)', marginBottom: '0.1rem' }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', lineHeight: 1.3 }}>
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live message */}
        {message && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.625rem 0.875rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-faint)',
              borderRadius: 'var(--r-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <span className="live-dot accent" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
