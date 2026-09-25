import React, { useState } from 'react';
import { X, Search, Trash2, ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function HistoryDrawer({ isOpen, onClose, history = [], onSelectReport, onDeleteReport }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter((item) =>
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 101,
          animation: 'slide-in-right 0.25s ease',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Research Library
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {history.length} saved reports
            </span>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-faint)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--r-md)',
              padding: '0.4rem 0.75rem',
            }}
          >
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports…"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                width: '100%',
                fontFamily: 'var(--font)',
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)' }}>
              <BookOpen size={28} strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.875rem', margin: 0, color: 'inherit' }}>
                {searchTerm ? 'No matching reports.' : 'No reports yet.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { onSelectReport(item); onClose(); }}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border-faint)',
                    background: 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all var(--t-fast)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.borderColor = 'var(--border-faint)';
                  }}
                >
                  {/* Score badge */}
                  {item.scorecard?.overall_score && (
                    <span
                      className="badge badge-green"
                      style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.65rem' }}
                    >
                      {item.scorecard.overall_score}/10
                    </span>
                  )}

                  {/* Timestamp */}
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={10} strokeWidth={2} />
                    {item.timestamp}
                  </div>

                  {/* Title */}
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                      marginBottom: '0.35rem',
                      paddingRight: '3rem',
                    }}
                  >
                    {item.topic}
                  </h4>

                  {/* Snippet */}
                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-tertiary)',
                      lineHeight: 1.5,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.executive_summary}
                  </p>

                  {/* Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.6rem',
                      paddingTop: '0.6rem',
                      borderTop: '1px solid var(--border-faint)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Open <ArrowRight size={11} strokeWidth={2} />
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteReport(item.id); }}
                      className="btn-danger"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-tertiary)',
                        borderRadius: '4px',
                        transition: 'color var(--t-fast)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                      title="Delete"
                    >
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
