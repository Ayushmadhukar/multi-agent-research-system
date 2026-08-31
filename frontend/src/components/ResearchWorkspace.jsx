import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Lightbulb,
  Globe,
  Award,
  Download,
  Copy,
  Printer,
  Check,
  Clock,
  Calendar,
  Sparkles,
  Tag,
  ArrowLeft
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import KeyFindings from './KeyFindings';
import SourceCard from './SourceCard';
import Scorecard from './Scorecard';
import { downloadMarkdown, copyToClipboard, triggerPrint } from '../utils/exportUtils';

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
    <div style={{ maxWidth: '1200px', margin: '0 auto 4rem', padding: '0 1rem' }}>
      
      {/* Back / Reset Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={onNewResearch}
          className="btn btn-ghost"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>New Research Topic</span>
        </button>

        {/* Tag Pills */}
        {report.tags && report.tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <Tag size={14} color="var(--brand-accent)" />
            {report.tags.map((t, idx) => (
              <span key={idx} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Intelligence Dossier Container */}
      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', background: 'var(--bg-glass-strong)' }}>
        
        {/* Header Metadata Section */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.75rem', marginBottom: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-cyan">
              <Sparkles size={12} /> Verified Dossier
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Calendar size={14} /> {report.timestamp}
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Clock size={14} /> {report.read_time_minutes || 5} min read
            </span>
            {report.scorecard?.overall_score && (
              <>
                <span style={{ color: 'var(--border-subtle)' }}>•</span>
                <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                  Score {report.scorecard.overall_score}/10
                </span>
              </>
            )}
          </div>

          {/* Research Title */}
          <h1 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.25,
            color: 'var(--text-heading)',
            marginBottom: '1.25rem'
          }}>
            {report.topic}
          </h1>

          {/* Action Toolbar */}
          <div className="action-bar-no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            
            {/* Tab Buttons */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem',
              gap: '0.2rem',
              overflowX: 'auto',
              maxWidth: '100%'
            }}>
              {[
                { id: 'brief', label: 'Executive Brief', icon: FileText },
                { id: 'report', label: 'Deep Analysis', icon: BookOpen },
                { id: 'findings', label: `Key Findings (${report.key_findings?.length || 0})`, icon: Lightbulb },
                { id: 'sources', label: `Sources (${report.sources?.length || 0})`, icon: Globe },
                { id: 'scorecard', label: 'Quality Scorecard', icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: isActive ? 'var(--grad-logo)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      boxShadow: isActive ? '0 2px 10px rgba(139, 92, 246, 0.4)' : 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Export & Actions Group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
                title="Copy Full Report to Clipboard"
              >
                {copied ? <Check size={16} color="var(--brand-success)" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={() => downloadMarkdown(report)}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
                title="Download as Markdown file"
              >
                <Download size={16} color="var(--brand-primary)" />
                <span>Markdown</span>
              </button>

              <button
                onClick={triggerPrint}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-md)' }}
                title="Print or Save as PDF"
              >
                <Printer size={16} color="var(--brand-accent)" />
                <span>PDF Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div style={{ minHeight: '400px' }}>
          
          {/* TAB 1: EXECUTIVE BRIEF */}
          {activeTab === 'brief' && (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)',
                border: '1px solid var(--border-vibrant)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Sparkles size={18} color="var(--brand-accent)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                    Strategic Executive Summary
                  </h3>
                </div>
                
                <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.75 }}>
                  <MarkdownRenderer content={report.executive_summary} />
                </div>
              </div>

              {/* Highlight Findings Grid */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.75rem' }}>
                  Critical Findings Summary
                </h3>
                <KeyFindings findings={report.key_findings} />
              </div>

              {/* Fast View Primary Sources */}
              {report.sources && report.sources.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                      Consulted Reference Sources
                    </h3>
                    <button
                      onClick={() => setActiveTab('sources')}
                      style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      View All ({report.sources.length}) →
                    </button>
                  </div>
                  <SourceCard sources={report.sources.slice(0, 3)} />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DEEP ANALYSIS (FULL REPORT) */}
          {activeTab === 'report' && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
            }}>
              <MarkdownRenderer content={report.full_report} />
            </div>
          )}

          {/* TAB 3: KEY FINDINGS */}
          {activeTab === 'findings' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                  Empirical Findings & Insights Matrix
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Categorized evidence signals derived from multi-source synthesis.
                </p>
              </div>
              <KeyFindings findings={report.key_findings} />
            </div>
          )}

          {/* TAB 4: SOURCE INTELLIGENCE */}
          {activeTab === 'sources' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                  Authoritative Source Citations
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Peer-reviewed journals, governmental publications, pre-prints, and industry documentation.
                </p>
              </div>
              <SourceCard sources={report.sources} />
            </div>
          )}

          {/* TAB 5: QUALITY SCORECARD */}
          {activeTab === 'scorecard' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                  Quality Evaluation & Peer Review
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Automated validation metrics scoring rigor, clarity, and structural validity.
                </p>
              </div>
              <Scorecard scorecard={report.scorecard} />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
