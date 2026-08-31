import React, { useState } from 'react';
import { Search, Sparkles, Zap, Compass, Cpu, Layers, ArrowRight, Shield } from 'lucide-react';

const PRESET_TOPICS = [
  { label: 'Autonomous Agentic AI', icon: '🤖', query: 'Autonomous Multi-Agent Systems in Enterprise Orchestration 2026' },
  { label: 'Solid-State Batteries', icon: '⚡', query: 'Solid State Battery Electrolyte Breakthroughs & Commercial Scaling' },
  { label: 'Post-Quantum Crypto', icon: '🔐', query: 'NIST Post-Quantum Cryptographic Migration Standards & Lattice Algorithms' },
  { label: 'CRISPR Epigenomics', icon: '🧬', query: 'CRISPR Epigenome Editing and In-Vivo Delivery Advances' },
  { label: 'Neuromorphic Chips', icon: '🧠', query: 'Neuromorphic Computing Architecture & Low-Power Edge AI Silicon' },
  { label: 'Fusion Energy Net Gain', icon: '☀️', query: 'Magnetic Confinement Fusion Net Energy Gain & High-Temperature Superconductors' },
];

export default function ResearchForm({ onStartResearch, isLoading = false }) {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('standard'); // 'quick', 'standard', 'deep'
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onStartResearch(topic.trim(), depth);
  };

  const handleSelectPreset = (presetQuery) => {
    setTopic(presetQuery);
    onStartResearch(presetQuery, depth);
  };

  return (
    <section className="research-form-section" style={{ padding: '2.5rem 1rem 3rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* Visual Accent Pill */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span className="badge badge-purple" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
          <Sparkles size={14} color="#C4B5FD" />
          Autonomous Multi-Agent Intelligence Engine
        </span>
      </div>

      {/* Hero Headline */}
      <h1 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
        marginBottom: '1rem'
      }}>
        Accelerate Deep Discovery with <br />
        <span className="gradient-text-rainbow">Executive Precision</span>
      </h1>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '1.15rem',
        maxWidth: '700px',
        margin: '0 auto 2.5rem',
        lineHeight: 1.6
      }}>
        Synthesize multi-source verified intelligence, peer-reviewed evidence, structured takeaways, and executive scorecards in seconds.
      </p>

      {/* Glowing Command Input Card */}
      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-xl)',
          border: isFocused ? '1px solid var(--brand-primary)' : '1px solid var(--border-medium)',
          boxShadow: isFocused ? 'var(--glow-primary), var(--shadow-lg)' : 'var(--shadow-md)',
          background: 'var(--bg-glass-strong)',
          transition: 'all var(--transition-smooth)',
          position: 'relative',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'nowrap'
        }}>
          {/* Glowing Search Icon */}
          <div style={{
            paddingLeft: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            color: isFocused ? 'var(--brand-accent)' : 'var(--text-muted)',
            transition: 'color 0.2s ease'
          }}>
            <Search size={24} />
          </div>

          {/* Primary Text Input */}
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter any research subject, breakthrough technology, market sector..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              fontFamily: 'var(--font-body)',
              padding: '0.75rem 0.25rem',
            }}
          />

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="btn btn-primary"
            style={{
              padding: '0.85rem 1.6rem',
              fontSize: '1rem',
              borderRadius: 'var(--radius-lg)',
              opacity: !topic.trim() || isLoading ? 0.6 : 1,
              cursor: !topic.trim() || isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#FFF',
                  borderRadius: '50%',
                  animation: 'spinSlow 0.8s linear infinite'
                }}></div>
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <span>Synthesize</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Depth Selector Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
          marginTop: '0.65rem',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Layers size={14} color="var(--brand-accent)" />
            <span>Research Depth:</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[
              { id: 'quick', label: '⚡ Quick Brief', desc: 'Fast Executive TL;DR' },
              { id: 'standard', label: '🚀 Standard Synthesis', desc: 'Deep Multi-Source' },
              { id: 'deep', label: '🧠 Comprehensive Dossier', desc: 'Exhaustive Rigor' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDepth(option.id)}
                style={{
                  background: depth === option.id ? 'var(--grad-logo)' : 'var(--bg-surface-elevated)',
                  color: depth === option.id ? '#FFFFFF' : 'var(--text-secondary)',
                  border: depth === option.id ? 'none' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: depth === option.id ? '0 2px 10px rgba(139, 92, 246, 0.4)' : 'none'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Preset Topics Pills */}
      <div style={{ textAlign: 'left', marginTop: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <Zap size={14} color="var(--brand-secondary)" />
          <span>Trending Intelligence Tracks</span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}>
          {PRESET_TOPICS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(item.query)}
              disabled={isLoading}
              className="glass-panel"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                transition: 'all var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
