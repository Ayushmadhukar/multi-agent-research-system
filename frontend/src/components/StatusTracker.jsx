import React from 'react';
import { Globe, FileSearch, Edit3, Award, CheckCircle2, Sparkles } from 'lucide-react';

const STAGES = [
  { id: 'DISCOVERY', title: 'Global Discovery', icon: Globe, desc: 'Scanning verified repositories & authoritative publications' },
  { id: 'ANALYSIS', title: 'Evidence Ingestion', icon: FileSearch, desc: 'Extracting empirical data & key findings' },
  { id: 'SYNTHESIS', title: 'Intelligence Synthesis', icon: Edit3, desc: 'Drafting multi-dimensional executive briefing' },
  { id: 'CRITIQUE', title: 'Peer Review & Verification', icon: Award, desc: 'Assessing factual rigor & scoring methodology' },
];

export default function StatusTracker({ phase = 'DISCOVERY', message = '', progress = 25, topic = '' }) {
  const getStageIndex = (currentPhase) => {
    switch (currentPhase) {
      case 'STARTING':
      case 'DISCOVERY':
        return 0;
      case 'ANALYSIS':
        return 1;
      case 'SYNTHESIS':
        return 2;
      case 'CRITIQUE':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(phase);

  return (
    <div
      className="glass-panel-glow"
      style={{
        maxWidth: '900px',
        margin: '0 auto 3rem',
        padding: '2rem',
        textAlign: 'left',
        position: 'relative'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Sparkles size={18} color="var(--brand-secondary)" className="animate-spin-slow" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-secondary)' }}>
              Live Intelligence Synthesis
            </span>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
            {topic ? `Analyzing: "${topic}"` : 'Synthesizing Dossier...'}
          </h3>
        </div>

        {/* Numerical Progress Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.2rem',
          padding: '0.4rem 0.9rem',
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: 'var(--radius-md)'
        }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-accent)', fontFamily: 'var(--font-display)' }}>
            {progress}%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete</span>
        </div>
      </div>

      {/* Glowing Dynamic Progress Bar */}
      <div style={{
        height: '8px',
        background: 'rgba(0, 0, 0, 0.08)',
        borderRadius: '999px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'var(--grad-logo)',
          borderRadius: '999px',
          boxShadow: '0 0 15px rgba(236, 72, 153, 0.6), 0 0 25px rgba(6, 182, 212, 0.4)',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}></div>
      </div>

      {/* Milestone Stages Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
      }}>
        {STAGES.map((stage, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: isCurrent
                  ? 'rgba(139, 92, 246, 0.12)'
                  : isDone
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'var(--bg-surface)',
                border: isCurrent
                  ? '1px solid var(--brand-primary)'
                  : isDone
                  ? '1px solid rgba(16, 185, 129, 0.35)'
                  : '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? '0 0 20px rgba(139, 92, 246, 0.18)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCurrent ? 'var(--grad-logo)' : isDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                  color: isDone ? 'var(--brand-success)' : isCurrent ? '#FFF' : 'var(--text-muted)'
                }}>
                  {isDone ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                </div>

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isDone ? 'var(--brand-success)' : isCurrent ? 'var(--brand-primary)' : 'var(--text-muted)'
                }}>
                  {isDone ? 'Verified' : isCurrent ? 'Active' : `Step 0${idx + 1}`}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isCurrent || isDone ? 'var(--text-heading)' : 'var(--text-muted)', marginBottom: '0.2rem' }}>
                {stage.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {stage.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Operational Message */}
      {message && (
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--brand-accent)',
            boxShadow: '0 0 10px var(--brand-accent)',
            animation: 'pulseGlow 1.5s infinite'
          }}></div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {message}
          </span>
        </div>
      )}
    </div>
  );
}
