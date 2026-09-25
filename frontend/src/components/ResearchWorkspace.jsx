import React, { useState } from 'react';
import {
  FileText, BookOpen, Lightbulb, Globe, BarChart3,
  Download, Copy, Printer, Check, Clock, Calendar,
  Tag, ArrowLeft, ExternalLink,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import KeyFindings from './KeyFindings';
import SourceCard from './SourceCard';
import Scorecard from './Scorecard';
import { downloadMarkdown, copyToClipboard, triggerPrint } from '../utils/exportUtils';

const TABS = [
  { id: 'brief',     label: 'Overview',       icon: FileText  },
  { id: 'report',    label: 'Full Report',     icon: BookOpen  },
  { id: 'findings',  label: 'Key Findings',    icon: Lightbulb },
  { id: 'sources',   label: 'Sources',         icon: Globe     },
  { id: 'scorecard', label: 'Scorecard',       icon: BarChart3 },
];

export default function ResearchWorkspace({ report, onNewResearch }) {
  const [activeTab, setActiveTab] = useState('brief');
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopy = () => {
    copyToClipboard(report.full_report, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto 5rem', padding: '0 1.5rem' }} className="animate-fade-in">

      {/* Breadcrumb / nav bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0',
          borderBottom: '1px solid var(--border-faint)',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <button
          onClick={onNewResearch}
          className="btn btn-ghost"
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.83rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          New research
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Meta info */}
          {report.timestamp && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              <Calendar size={12} strokeWidth={2} />
              {report.timestamp}
            </span>
          )}
          {report.read_time_minutes && (
            <>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                <Clock size={12} strokeWidth={2} />
                {report.read_time_minutes} min read
              </span>
            </>
          )}
          {report.scorecard?.overall_score && (
            <>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span className="badge badge-green">Score {report.scorecard.overall_score}/10</span>
            </>
          )}
          {/* Tags */}
          {report.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="badge badge-default">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Report title */}
      <h1
        style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.25,
          letterSpacing: '-0.025em',
          marginBottom: '1.75rem',
          maxWidth: '860px',
        }}
      >
        {report.topic}
      </h1>

      {/* Tabs + Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '1.75rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
        className="no-print"
      >
        {/* Tab list */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            let count = null;
            if (tab.id === 'findings') count = report.key_findings?.length;
            if (tab.id === 'sources')  count = report.sources?.length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} strokeWidth={2} />
                {tab.label}
                {count != null && count > 0 && (
                  <span
                    style={{
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '0 5px',
                      height: '16px',
                      lineHeight: '16px',
                      borderRadius: '99px',
                      border: '1px solid var(--border-faint)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Export actions */}
        <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0, paddingBottom: '1px' }}>
          <button onClick={handleCopy} className="btn btn-ghost btn-icon" style={{ height: '32px', width: '32px' }} title="Copy report">
            {copied ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
          </button>
          <button onClick={() => downloadMarkdown(report)} className="btn btn-ghost btn-icon" style={{ height: '32px', width: '32px' }} title="Download Markdown">
            <Download size={14} />
          </button>
          <button onClick={triggerPrint} className="btn btn-ghost btn-icon" style={{ height: '32px', width: '32px' }} title="Print / PDF">
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="animate-fade-in" key={activeTab}>

        {/* ── OVERVIEW ── */}
        {activeTab === 'brief' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Executive summary */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                Executive Summary
              </div>
              <div style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <MarkdownRenderer content={report.executive_summary} />
              </div>
            </div>

            {/* Key findings */}
            {report.key_findings?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  Key Findings
                </div>
                <KeyFindings findings={report.key_findings} />
              </div>
            )}

            {/* Quick sources */}
            {report.sources?.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Sources
                  </div>
                  <button
                    onClick={() => setActiveTab('sources')}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    View all ({report.sources.length}) <ExternalLink size={11} strokeWidth={2} />
                  </button>
                </div>
                <SourceCard sources={report.sources.slice(0, 3)} />
              </div>
            )}
          </div>
        )}

        {/* ── FULL REPORT ── */}
        {activeTab === 'report' && (
          <div
            className="card"
            style={{ padding: '2.5rem' }}
          >
            <MarkdownRenderer content={report.full_report} />
          </div>
        )}

        {/* ── KEY FINDINGS ── */}
        {activeTab === 'findings' && (
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>
              Evidence signals extracted and categorized from multi-source synthesis.
            </p>
            <KeyFindings findings={report.key_findings} />
          </div>
        )}

        {/* ── SOURCES ── */}
        {activeTab === 'sources' && (
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>
              {report.sources?.length || 0} references consulted across publications, pre-prints, and web sources.
            </p>
            <SourceCard sources={report.sources} />
          </div>
        )}

        {/* ── SCORECARD ── */}
        {activeTab === 'scorecard' && (
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>
              Automated quality evaluation covering rigor, clarity, and structural validity.
            </p>
            <Scorecard scorecard={report.scorecard} />
          </div>
        )}

      </div>
    </div>
  );
}
