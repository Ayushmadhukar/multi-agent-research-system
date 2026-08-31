/**
 * ResearchX Export Utilities
 */

export function downloadMarkdown(report) {
  if (!report) return;
  const filename = `${report.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_researchx.md`;
  const content = `---
title: "${report.topic}"
date: "${report.timestamp}"
generated_by: "ResearchX Autonomous Intelligence Suite"
overall_score: "${report.scorecard?.overall_score || 'N/A'}/10"
read_time: "${report.read_time_minutes || 5} min"
---

${report.full_report}

---
Generated with ResearchX — The Autonomous Research & Intelligence Platform.
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function copyToClipboard(text, onCopied) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    if (onCopied) onCopied();
  }).catch((err) => {
    console.error('Failed to copy: ', err);
  });
}

export function triggerPrint() {
  window.print();
}
