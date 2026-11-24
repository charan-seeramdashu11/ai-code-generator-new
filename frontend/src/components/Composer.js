import React, { useEffect, useRef, useState } from 'react';
import { LANGUAGES } from '../utils/languages';

export default function Composer({ onSend, loading }) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState('generate');
  const ref = useRef(null);

  // Auto-grow the textarea.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [text]);

  const submit = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim(), language, mode);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="composer-wrap">
      <div className="composer">
        <textarea
          ref={ref}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            mode === 'generate'
              ? 'Describe the code you want… e.g. "a calculator app with history"'
              : 'Paste code here and I will explain it and look for bugs…'
          }
        />
        <div className="composer-row">
          <div className="seg">
            <button className={mode === 'generate' ? 'on' : ''} onClick={() => setMode('generate')}>
              ✨ Generate
            </button>
            <button className={mode === 'explain' ? 'on' : ''} onClick={() => setMode('explain')}>
              🔍 Explain
            </button>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language">
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <button className="send" onClick={submit} disabled={loading || !text.trim()} aria-label="Send">
            {loading ? '…' : '↑'}
          </button>
        </div>
      </div>
      <p className="foot">Enter to send · Shift+Enter for a new line · AI can make mistakes, always review code.</p>
    </div>
  );
}
