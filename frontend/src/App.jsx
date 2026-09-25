import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ResearchForm from './components/ResearchForm';
import StatusTracker from './components/StatusTracker';
import ResearchWorkspace from './components/ResearchWorkspace';
import HistoryDrawer from './components/HistoryDrawer';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentReport, setCurrentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState({ phase: 'STARTING', message: '', progress: 0, topic: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const pollingRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchHistory();
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) setHistory(await res.json());
    } catch (_) {}
  };

  const handleStartResearch = async (topic, depth = 'standard') => {
    setIsLoading(true);
    setErrorMessage('');
    setCurrentReport(null);
    setStatusData({ phase: 'DISCOVERY', message: 'Initializing pipeline…', progress: 10, topic });

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, depth }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      const { task_id } = await res.json();

      if (pollingRef.current) clearInterval(pollingRef.current);

      pollingRef.current = setInterval(async () => {
        try {
          const s = await fetch(`/api/research/status/${task_id}`);
          if (!s.ok) return;
          const data = await s.json();

          setStatusData({ phase: data.phase || 'ANALYSIS', message: data.message || '', progress: data.progress || 30, topic });

          if (data.phase === 'COMPLETED' && data.result) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setCurrentReport(data.result);
            setIsLoading(false);
            fetchHistory();
          } else if (data.phase === 'ERROR') {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setIsLoading(false);
            setErrorMessage(data.message || 'Pipeline failed.');
          }
        } catch (_) {}
      }, 1200);

    } catch (err) {
      setIsLoading(false);
      setErrorMessage(`Connection error: ${err.message}. Make sure the backend is running.`);
    }
  };

  const handleDeleteReport = async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try { await fetch(`/api/history/${id}`, { method: 'DELETE' }); } catch (_) {}
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onNewResearch={() => {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setCurrentReport(null);
          setIsLoading(false);
          setErrorMessage('');
        }}
        isGenerating={isLoading}
      />

      <main style={{ flex: 1 }}>
        {/* Error banner */}
        {errorMessage && (
          <div
            style={{
              maxWidth: '760px',
              margin: '1.5rem auto 0',
              padding: '0 1.5rem',
            }}
          >
            <div
              style={{
                background: 'var(--red-dim)',
                border: '1px solid var(--red-border)',
                borderRadius: 'var(--r-md)',
                padding: '0.875rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <AlertCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {errorMessage}
              </span>
              <button
                onClick={() => setErrorMessage('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <X size={15} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <StatusTracker
            phase={statusData.phase}
            message={statusData.message}
            progress={statusData.progress}
            topic={statusData.topic}
          />
        )}

        {/* Report workspace */}
        {!isLoading && currentReport && (
          <div style={{ paddingTop: '1.5rem' }}>
            <ResearchWorkspace
              report={currentReport}
              onNewResearch={() => { setCurrentReport(null); setErrorMessage(''); }}
            />
          </div>
        )}

        {/* Home / search */}
        {!isLoading && !currentReport && (
          <ResearchForm onStartResearch={handleStartResearch} isLoading={isLoading} />
        )}
      </main>

      {/* Footer */}
      <footer
        className="no-print"
        style={{
          borderTop: '1px solid var(--border-faint)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>ResearchX</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
          Multi-Agent Intelligence Engine · 2026
        </span>
      </footer>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReport={(rep) => { setCurrentReport(rep); setErrorMessage(''); }}
        onDeleteReport={handleDeleteReport}
      />
    </div>
  );
}
