import React from 'react';
import CodeBlock from './CodeBlock';
import ExplainView from './ExplainView';

export default function ResultCard({ item }) {
  const isExplain = item.mode === 'explain';
  return (
    <div className="exchange">
      <div className="bubble user">
        <span className="badge">{isExplain ? 'Explain' : item.language}</span>
        <p>{item.prompt}</p>
      </div>

      <div className="bubble ai">
        <div className="avatar">⚡</div>
        <div className="ai-body">
          {item.loading && (
            <div className="typing">
              <span /> <span /> <span />
              <em>{isExplain ? 'Analyzing your code…' : 'Writing your code…'}</em>
            </div>
          )}
          {item.error && <div className="error-box">⚠️ {item.error}</div>}
          {item.result &&
            (isExplain ? (
              <ExplainView text={item.result} language={item.language} />
            ) : (
              <CodeBlock code={item.result} language={item.language} />
            ))}
          {item.result && item.saved === false && (
            <p className="hint">Not saved to history (database offline).</p>
          )}
        </div>
      </div>
    </div>
  );
}
