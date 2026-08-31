import React from 'react';

function cleanHeadingText(text) {
  if (!text) return '';
  let cleaned = text.replace(/^#+\s*/, '');
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^\*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
  cleaned = cleaned.replace(/[#\*_]/g, '').trim();
  return cleaned;
}

function isTableDividerLine(line) {
  if (!line) return false;
  const trimmed = line.trim();
  return /^\|?[\s\-\:\.\+\|]+\|?$/.test(trimmed) && trimmed.includes('-') && (trimmed.includes('|') || trimmed.startsWith('-'));
}

function isEmptyTableRow(line) {
  if (!line) return true;
  const trimmed = line.trim();
  return /^\|[\s\|]*\|?$/.test(trimmed) || trimmed === '|' || trimmed === '||';
}

function parseTableCells(line) {
  if (!line) return [];
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

export default function MarkdownRenderer({ content = '' }) {
  if (!content) return null;

  const renderFormattedLine = (line) => {
    if (!line) return null;

    // Clean stray ### from inside inline lines
    let sanitizedLine = line.replace(/^#{1,6}\s+/, '').replace(/\s+#{1,6}\s+/g, ' ');

    const segments = [];
    let lastIdx = 0;
    
    // Match double star **bold**, single star *bold*, inline `code`, markdown links [text](url), and raw URLs
    const tokenRegex = /(\*\*(.*?)\*\*|\*([^\*\n]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|https?:\/\/[^\s<]+)/g;
    let match;
    
    while ((match = tokenRegex.exec(sanitizedLine)) !== null) {
      if (match.index > lastIdx) {
        segments.push(sanitizedLine.substring(lastIdx, match.index));
      }
      
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
        const innerText = token.slice(2, -2);
        segments.push(
          <strong key={match.index} style={{ color: 'var(--text-heading)', fontWeight: 700 }}>
            {innerText}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*') && token.length >= 3 && !token.startsWith('**')) {
        // Single asterisks e.g. *A Comprehensive Research Report* -> remove stars and make bold
        const innerText = token.slice(1, -1);
        segments.push(
          <strong key={match.index} style={{ color: 'var(--text-heading)', fontWeight: 700 }}>
            {innerText}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
        segments.push(
          <code key={match.index} style={{
            fontFamily: 'var(--font-mono)',
            background: 'rgba(236, 72, 153, 0.12)',
            color: '#EC4899',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.9em'
          }}>
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('[') && token.includes('](')) {
        const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          segments.push(
            <a
              key={match.index}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--brand-accent)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(6, 182, 212, 0.4)',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#38BDF8'}
              onMouseLeave={(e) => e.target.style.color = 'var(--brand-accent)'}
            >
              {linkMatch[1]} ↗
            </a>
          );
        }
      } else if (token.startsWith('http')) {
        segments.push(
          <a
            key={match.index}
            href={token}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--brand-accent)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(6, 182, 212, 0.4)',
              fontWeight: 600
            }}
          >
            {token} ↗
          </a>
        );
      }
      lastIdx = tokenRegex.lastIndex;
    }
    
    if (lastIdx < sanitizedLine.length) {
      segments.push(sanitizedLine.substring(lastIdx));
    }

    return segments.length > 0 ? segments : sanitizedLine;
  };

  const rawLines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let prevWasEmpty = false;

  let i = 0;
  while (i < rawLines.length) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // Check code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} style={{
            background: '#0B0F19',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.25rem',
            overflowX: 'auto',
            margin: '1rem 0',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.4)'
          }}>
            <code style={{
              fontFamily: 'var(--font-mono)',
              color: '#67E8F9',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}>
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        inCodeBlock = true;
      }
      prevWasEmpty = false;
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      i++;
      continue;
    }

    // Skip empty or broken table row artifacts like | | or |  |  |
    if (isEmptyTableRow(trimmed)) {
      i++;
      continue;
    }

    // Check if current block is a Markdown Table
    if (trimmed.includes('|') && (trimmed.startsWith('|') || trimmed.endsWith('|') || isTableDividerLine(trimmed))) {
      const tableLines = [];
      while (i < rawLines.length) {
        const cur = rawLines[i].trim();
        if (!cur) break;
        if (isEmptyTableRow(cur)) {
          i++;
          continue;
        }
        if (cur.includes('|') || isTableDividerLine(cur)) {
          tableLines.push(cur);
          i++;
        } else {
          break;
        }
      }

      const headerIndex = tableLines.findIndex((l) => !isTableDividerLine(l) && !isEmptyTableRow(l));
      const dividerIndex = tableLines.findIndex((l) => isTableDividerLine(l));

      if (headerIndex !== -1 && dividerIndex !== -1 && dividerIndex === headerIndex + 1) {
        const headerCells = parseTableCells(tableLines[headerIndex]);
        const bodyRows = tableLines.slice(dividerIndex + 1)
          .filter((l) => !isTableDividerLine(l) && !isEmptyTableRow(l))
          .map(parseTableCells);

        if (headerCells.length > 0 && (bodyRows.length > 0 || headerCells.some(c => c.length > 0))) {
          elements.push(
            <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '1.25rem 0', width: '100%' }}>
              <table
                className="glass-panel"
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.92rem',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface)'
                }}
              >
                <thead>
                  <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '2px solid var(--border-medium)' }}>
                    {headerCells.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          fontWeight: 700,
                          color: 'var(--text-heading)',
                          borderRight: cIdx < headerCells.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                        }}
                      >
                        {renderFormattedLine(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{
                        borderBottom: rIdx < bodyRows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                      }}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          style={{
                            padding: '0.65rem 1rem',
                            color: 'var(--text-primary)',
                            borderRight: cIdx < row.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                          }}
                        >
                          {renderFormattedLine(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          prevWasEmpty = false;
          continue;
        }
      }

      if (tableLines.every(isTableDividerLine) || tableLines.length === 0) {
        continue;
      }
    }

    // Skip horizontal divider repeats
    if (trimmed === '---' || trimmed === '***') {
      elements.push(
        <hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.5rem 0' }} />
      );
      prevWasEmpty = false;
      i++;
      continue;
    }

    // Empty line handling
    if (!trimmed) {
      if (!prevWasEmpty) {
        elements.push(<div key={`gap-${i}`} style={{ height: '0.5rem' }} />);
        prevWasEmpty = true;
      }
      i++;
      continue;
    }
    prevWasEmpty = false;

    // Headings (match #, ##, ###, ####, #####, ###### - and cleanly strip all hashes)
    if (/^#{1,6}\s+/.test(trimmed)) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)/);
      const level = match[1].length;
      const headingClean = cleanHeadingText(match[2]);

      if (level === 1) {
        elements.push(
          <h1 key={`h1-${i}`} style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            margin: '1.5rem 0 0.85rem',
            color: 'var(--text-heading)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.4rem',
            letterSpacing: '-0.02em'
          }}>
            {headingClean}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2 key={`h2-${i}`} style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            margin: '1.35rem 0 0.65rem',
            color: 'var(--text-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '4px',
              height: '1.1em',
              background: 'var(--grad-logo)',
              borderRadius: '2px',
              boxShadow: '0 0 10px rgba(236,72,153,0.4)'
            }}></span>
            {headingClean}
          </h2>
        );
      } else {
        // Level 3 (###) or deeper: render as clean h3 with zero hashes
        elements.push(
          <h3 key={`h3-${i}`} style={{
            fontSize: '1.12rem',
            fontWeight: 700,
            margin: '1.1rem 0 0.45rem',
            color: 'var(--brand-primary)',
            letterSpacing: '-0.01em'
          }}>
            {headingClean}
          </h3>
        );
      }
      i++;
      continue;
    }

    // Bullet points (e.g. - item, * item with space)
    if (trimmed.startsWith('- ') || (trimmed.startsWith('* ') && !trimmed.startsWith('* *'))) {
      elements.push(
        <div key={`li-${i}`} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem',
          margin: '0.3rem 0 0.3rem 0.5rem',
          lineHeight: 1.65
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--brand-accent)',
            boxShadow: '0 0 6px var(--brand-accent)',
            marginTop: '0.65rem',
            flexShrink: 0
          }}></span>
          <div style={{ color: 'var(--text-primary)', flex: 1 }}>
            {renderFormattedLine(trimmed.substring(2))}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list items (e.g. 1. item)
    if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      elements.push(
        <div key={`ol-${i}`} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem',
          margin: '0.3rem 0 0.3rem 0.5rem',
          lineHeight: 1.65
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            color: 'var(--brand-primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginTop: '0.2rem',
            flexShrink: 0
          }}>
            {match ? match[1] : '•'}
          </span>
          <div style={{ color: 'var(--text-primary)', flex: 1 }}>
            {renderFormattedLine(match ? match[2] : trimmed)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={`quote-${i}`} style={{
          borderLeft: '4px solid var(--brand-primary)',
          background: 'rgba(139, 92, 246, 0.08)',
          padding: '0.85rem 1.15rem',
          borderRadius: '0 10px 10px 0',
          margin: '1rem 0',
          color: 'var(--text-primary)',
          fontStyle: 'italic'
        }}>
          {renderFormattedLine(trimmed.substring(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Regular paragraphs (clean any stray hashes)
    const cleanParagraph = trimmed.replace(/^#{1,6}\s*/, '');
    elements.push(
      <p key={`p-${i}`} style={{
        margin: '0.65rem 0',
        lineHeight: 1.75,
        color: 'var(--text-primary)',
        fontSize: '1rem'
      }}>
        {renderFormattedLine(cleanParagraph)}
      </p>
    );

    i++;
  }

  return (
    <div className="markdown-body" style={{ width: '100%' }}>
      {elements}
    </div>
  );
}
