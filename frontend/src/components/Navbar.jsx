import React from 'react';
import { History, Sun, Moon, Plus, FlaskConical } from 'lucide-react';

export default function Navbar({
  theme,
  setTheme,
  onOpenHistory,
  historyCount = 0,
  onNewResearch,
  isGenerating = false,
}) {
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-default)',
        padding: '0 1.5rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Logo */}
        <button
          onClick={onNewResearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FlaskConical size={15} color="#fff" strokeWidth={2} />
          </div>
          <span
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            ResearchX
          </span>
        </button>

        {/* Center: live status */}
        <div className="status-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            className={`live-dot ${isGenerating ? 'accent' : 'green'}`}
          />
          <span style={{ fontSize: '0.78rem' }}>
            {isGenerating ? 'Running pipeline…' : 'Ready'}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button onClick={onNewResearch} className="btn btn-secondary" style={{ height: '34px', padding: '0 0.75rem', fontSize: '0.83rem' }}>
            <Plus size={14} strokeWidth={2.5} />
            New
          </button>

          <button
            onClick={onOpenHistory}
            className="btn btn-secondary"
            style={{ height: '34px', padding: '0 0.75rem', fontSize: '0.83rem', position: 'relative' }}
          >
            <History size={14} />
            Library
            {historyCount > 0 && (
              <span
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0 5px',
                  height: '16px',
                  lineHeight: '16px',
                  borderRadius: '99px',
                  minWidth: '16px',
                  textAlign: 'center',
                }}
              >
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            style={{ height: '34px', width: '34px' }}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={15} color="var(--text-secondary)" />
            ) : (
              <Moon size={15} color="var(--text-secondary)" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
