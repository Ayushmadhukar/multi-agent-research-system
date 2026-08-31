import React from 'react';
import { Sparkles, History, Sun, Moon, ShieldCheck, Plus } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({
  theme,
  setTheme,
  onOpenHistory,
  historyCount = 0,
  onNewResearch,
  isGenerating = false,
}) {
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header
      className="navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'var(--bg-glass)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.85rem 1.5rem',
        transition: 'all var(--transition-smooth)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Brand Logo Clickable to Reset */}
        <div
          onClick={onNewResearch}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Return to ResearchX Command Center"
        >
          <Logo size="md" showTagline={true} />
        </div>

        {/* Center Live Operational Badge */}
        <div
          className="nav-status-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isGenerating ? 'var(--brand-secondary)' : 'var(--brand-success)',
              boxShadow: isGenerating
                ? '0 0 10px #EC4899, 0 0 20px #EC4899'
                : '0 0 10px #10B981, 0 0 15px #10B981',
              animation: isGenerating ? 'pulseGlow 1.5s infinite' : 'none',
            }}
          ></span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isGenerating ? 'Synthesizing Dossier...' : 'Neural Engine Active'}
          </span>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <span style={{ color: 'var(--brand-accent)', fontSize: '0.75rem' }}>v2.4 Pro</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* New Research Action */}
          <button
            onClick={onNewResearch}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem 0.95rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
            }}
            title="Start new research query"
          >
            <Plus size={16} color="var(--brand-primary)" />
            <span style={{ fontWeight: 600 }}>New Query</span>
          </button>

          {/* Research Library / History Toggle */}
          <button
            onClick={onOpenHistory}
            className="btn btn-secondary"
            style={{
              position: 'relative',
              padding: '0.5rem 0.95rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
            }}
            title="Open Research Library"
          >
            <History size={16} color="var(--brand-accent)" />
            <span>Library</span>
            {historyCount > 0 && (
              <span
                style={{
                  background: 'var(--grad-logo)',
                  color: '#FFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  marginLeft: '4px',
                }}
              >
                {historyCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: 'var(--radius-md)' }}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? (
              <Sun size={18} color="#F59E0B" />
            ) : (
              <Moon size={18} color="#8B5CF6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
