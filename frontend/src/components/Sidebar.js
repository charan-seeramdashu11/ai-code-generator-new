import React from 'react';

const timeLabel = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function Sidebar({ items, health, open, onClose, onNew, onSelect, onDelete, onClear }) {
  const ai = health?.ai;
  const ready = health && ai?.keyConfigured;

  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="logo">⚡</span>
          <div>
            <strong>CodeForge</strong>
            <small>AI code generator</small>
          </div>
        </div>

        <button className="new-chat" onClick={onNew}>
          + New chat
        </button>

        <div className="hist-head">
          <span>History</span>
          {items.length > 0 && (
            <button className="link" onClick={onClear}>
              Clear all
            </button>
          )}
        </div>

        <div className="hist">
          {items.length === 0 && <p className="empty">Nothing here yet. Your generations will appear here.</p>}
          {items.map((it) => (
            <div className="hist-item" key={it._id}>
              <button onClick={() => onSelect(it)} title={it.prompt}>
                <span className="h-mode">{it.mode === 'explain' ? '🔍' : '✨'}</span>
                <span className="h-text">{it.prompt}</span>
                <span className="h-date">{timeLabel(it.createdAt)}</span>
              </button>
              <button className="h-del" onClick={() => onDelete(it._id)} aria-label="Delete">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="status">
          <div>
            <i className={`dot ${ready ? 'ok' : 'bad'}`} />
            {health ? (ready ? `${ai.provider} · ${ai.model}` : `${ai?.provider || 'AI'} key missing`) : 'Server offline'}
          </div>
          <div>
            <i className={`dot ${health?.database === 'connected' ? 'ok' : 'warn'}`} />
            Database {health?.database === 'connected' ? 'connected' : 'offline'}
          </div>
        </div>
      </aside>
    </>
  );
}
