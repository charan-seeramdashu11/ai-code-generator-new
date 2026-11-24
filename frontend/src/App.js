import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Welcome from './components/Welcome';
import Composer from './components/Composer';
import ResultCard from './components/ResultCard';
import { generate, fetchHistory, deleteItem, clearHistory, fetchHealth } from './services/api';

const readTheme = () => {
  try {
    return localStorage.getItem('cf-theme') || 'dark';
  } catch (e) {
    return 'dark';
  }
};

export default function App() {
  const [thread, setThread] = useState([]);
  const [history, setHistory] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(readTheme);
  const endRef = useRef(null);

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await fetchHistory());
    } catch (e) {
      setHistory([]);
    }
  }, []);

  const loadHealth = useCallback(async () => {
    try {
      setHealth(await fetchHealth());
    } catch (e) {
      setHealth(null);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    loadHealth();
  }, [loadHistory, loadHealth]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('cf-theme', theme);
    } catch (e) {
      /* storage unavailable */
    }
  }, [theme]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [thread]);

  const handleSend = async (prompt, language, mode) => {
    const id = `pending-${Date.now()}`;
    setThread((t) => [...t, { _id: id, prompt, language, mode, loading: true }]);
    setLoading(true);
    try {
      const data = await generate(prompt, language, mode);
      setThread((t) => t.map((x) => (x._id === id ? data : x)));
      loadHistory();
    } catch (err) {
      setThread((t) => t.map((x) => (x._id === id ? { _id: id, prompt, language, mode, error: err.message } : x)));
      loadHealth();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setHistory((h) => h.filter((x) => x._id !== id));
    } catch (e) {
      /* ignore */
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Delete all history?')) return;
    try {
      await clearHistory();
      setHistory([]);
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <div className="app">
      <Sidebar
        items={history}
        health={health}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNew={() => {
          setThread([]);
          setSidebarOpen(false);
        }}
        onSelect={(it) => {
          setThread([it]);
          setSidebarOpen(false);
        }}
        onDelete={handleDelete}
        onClear={handleClear}
      />

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            ☰
          </button>
          <span className="title">CodeForge AI</span>
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>

        <div className="scroll">
          <div className="column">
            {thread.length === 0 ? (
              <Welcome onUseTemplate={(t) => handleSend(t.prompt, t.language, 'generate')} />
            ) : (
              thread.map((item) => <ResultCard key={item._id} item={item} />)
            )}
            <div ref={endRef} />
          </div>
        </div>

        <Composer onSend={handleSend} loading={loading} />
      </main>
    </div>
  );
}
