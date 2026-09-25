import React, { useState, useRef } from 'react';
import { Search, ArrowRight, Zap, ChevronDown } from 'lucide-react';

const PRESETS = [
  { label: 'Agentic AI Systems',       query: 'Autonomous Multi-Agent Systems in Enterprise 2026' },
  { label: 'Solid-State Batteries',    query: 'Solid State Battery Electrolyte Breakthroughs & Commercial Scaling' },
  { label: 'Post-Quantum Crypto',      query: 'NIST Post-Quantum Cryptographic Migration & Lattice Algorithms' },
  { label: 'CRISPR Epigenomics',       query: 'CRISPR Epigenome Editing and In-Vivo Delivery Advances' },
  { label: 'Neuromorphic Chips',       query: 'Neuromorphic Computing Architecture & Low-Power Edge AI Silicon' },
  { label: 'Fusion Energy',            query: 'Magnetic Confinement Fusion Net Energy Gain & Superconductors' },
];

const DEPTH_OPTIONS = [
  { id: 'quick',    label: 'Quick',         desc: 'Fast summary' },
  { id: 'standard', label: 'Standard',      desc: 'Balanced depth' },
  { id: 'deep',     label: 'Comprehensive', desc: 'Full dossier' },
];

export default function ResearchForm({ onStartResearch, isLoading = false }) {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('standard');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onStartResearch(topic.trim(), depth);
  };

  const handlePreset = (query) => {
    setTopic(query);
    setTimeout(() => onStartResearch(query, depth), 50);
  };

  return (
    <div style={{ padding: '4rem 1.5rem 3rem', maxWidth: '720px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div
          className="badge badge-accent"
          style={{ marginBottom: '1rem', display: 'inline-flex', padding: '0.25rem 0.75rem' }}
        >
          <Zap size={11} strokeWidth={2.5} />
          Multi-Agent Research Engine
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
          }}
        >
          Research anything,
          <br />
          <span style={{ color: 'var(--accent)' }}>synthesized instantly.</span>
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Four specialized AI agents search, read, write, and peer-review — delivering a structured intelligence report in seconds.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: `1px solid ${isFocused ? 'var(--border-focus)' : 'var(--border-default)'}`,
            borderRadius: 'var(--r-lg)',
            boxShadow: isFocused
              ? '0 0 0 3px var(--accent-dim), var(--shadow-sm)'
              : 'var(--shadow-sm)',
            transition: 'all var(--t-fast)',
            overflow: 'hidden',
          }}
        >
          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '4px 4px 4px 1rem' }}>
            <Search
              size={17}
              color={isFocused ? 'var(--accent)' : 'var(--text-tertiary)'}
              style={{ flexShrink: 0, transition: 'color var(--t-fast)' }}
            />
            <input
              ref={inputRef}
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter a topic, technology, or question to research…"
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontFamily: 'var(--font)',
                padding: '0.75rem 0.75rem',
              }}
            />
            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="btn btn-primary"
              style={{ height: '40px', padding: '0 1.1rem', fontSize: '0.875rem', flexShrink: 0 }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                    }}
                    className="animate-spin"
                  />
                  Running…
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight size={14} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>

          {/* Depth row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem 0.625rem',
              borderTop: '1px solid var(--border-faint)',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
              Depth:
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {DEPTH_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDepth(opt.id)}
                  style={{
                    background: depth === opt.id ? 'var(--accent-dim)' : 'transparent',
                    color: depth === opt.id ? 'var(--accent-hover)' : 'var(--text-tertiary)',
                    border: `1px solid ${depth === opt.id ? 'var(--accent-border)' : 'transparent'}`,
                    borderRadius: 'var(--r-sm)',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: depth === opt.id ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all var(--t-fast)',
                    fontFamily: 'var(--font)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* Preset suggestions */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.6rem',
          }}
        >
          Suggested topics
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {PRESETS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePreset(item.query)}
              disabled={isLoading}
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--r-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.82rem',
                fontFamily: 'var(--font)',
                cursor: 'pointer',
                transition: 'all var(--t-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.background = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.background = 'var(--bg-surface)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
