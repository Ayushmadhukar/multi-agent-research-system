import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ResearchForm from './components/ResearchForm';
import StatusTracker from './components/StatusTracker';
import ResearchWorkspace from './components/ResearchWorkspace';
import HistoryDrawer from './components/HistoryDrawer';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentReport, setCurrentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusData, setStatusData] = useState({
    phase: 'STARTING',
    message: '',
    progress: 0,
    topic: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const pollingRef = useRef(null);

  // Fetch initial history
  useEffect(() => {
    fetchHistory();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.warn('Backend history unreachable:', err);
    }
  };

  const handleStartResearch = async (topic, depth = 'standard') => {
    setIsLoading(true);
    setErrorMessage('');
    setCurrentReport(null);
    setStatusData({
      phase: 'DISCOVERY',
      message: 'Initializing Search Agent & querying Tavily for global intelligence...',
      progress: 15,
      topic,
    });

    try {
      // 1. Dispatch research job to FastAPI backend
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, depth }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server error: ${response.status}`);
      }

      const { task_id } = await response.json();

      // 2. Poll status endpoint every 1.2s to track real agent progress
      if (pollingRef.current) clearInterval(pollingRef.current);

      pollingRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/research/status/${task_id}`);
          if (!statusRes.ok) return;

          const data = await statusRes.json();
          
          setStatusData({
            phase: data.phase || 'ANALYSIS',
            message: data.message || 'Processing pipeline agents...',
            progress: data.progress || 30,
            topic,
          });

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
            setErrorMessage(data.message || 'Pipeline execution failed.');
          }
        } catch (pollErr) {
          console.warn('Status poll retry...', pollErr);
        }
      }, 1200);

    } catch (err) {
      console.error('Failed to initiate research on backend:', err);
      setIsLoading(false);
      setErrorMessage(`Backend connection error: ${err.message}. Please ensure the FastAPI server is running with 'python backend/main.py'.`);
    }
  };

  const handleDeleteReport = async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Could not delete from backend:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Top Navigation Bar */}
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

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, paddingBottom: '3rem' }}>
        
        {/* Error Alert Box */}
        {errorMessage && (
          <div style={{ maxWidth: '900px', margin: '2rem auto 0', padding: '0 1rem' }}>
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              color: '#FECDD3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <strong>Pipeline Error:</strong> {errorMessage}
              </div>
              <button
                onClick={() => setErrorMessage('')}
                className="btn btn-ghost"
                style={{ padding: '0.25rem 0.5rem', color: '#FECDD3' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* State 1: Active Loading / Live Pipeline Execution */}
        {isLoading && (
          <div style={{ paddingTop: '2.5rem' }}>
            <StatusTracker
              phase={statusData.phase}
              message={statusData.message}
              progress={statusData.progress}
              topic={statusData.topic}
            />
          </div>
        )}

        {/* State 2: Report Generated & Active */}
        {!isLoading && currentReport && (
          <div style={{ paddingTop: '1.5rem' }}>
            <ResearchWorkspace
              report={currentReport}
              onNewResearch={() => {
                setCurrentReport(null);
                setErrorMessage('');
              }}
            />
          </div>
        )}

        {/* State 3: Home / Prompt Command Center */}
        {!isLoading && !currentReport && (
          <ResearchForm
            onStartResearch={handleStartResearch}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* History Slide-out Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReport={(rep) => {
          setCurrentReport(rep);
          setErrorMessage('');
        }}
        onDeleteReport={handleDeleteReport}
      />

      {/* Footer */}
      <footer
        className="action-bar-no-print"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>ResearchX</span>
            <span>• Autonomous Multi-Agent Intelligence Engine</span>
          </div>
          <div>
            <span>Direct Pipeline Integration Active • 2026 Enterprise Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
