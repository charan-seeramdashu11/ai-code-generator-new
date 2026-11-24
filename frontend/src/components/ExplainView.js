import React from 'react';
import CodeBlock from './CodeBlock';

// Renders an explanation: plain paragraphs/headings plus any ``` code fences as code blocks.
export default function ExplainView({ text, language }) {
  const parts = text.split(/```[\w+#.-]*\n?/);
  return (
    <div className="explain">
      {parts.map((part, idx) => {
        const isCode = idx % 2 === 1;
        if (isCode) return part.trim() ? <CodeBlock key={idx} code={part.replace(/\n$/, '')} language={language} /> : null;
        return part
          .split('\n')
          .filter((l) => l.trim())
          .map((line, j) => {
            const isHeading = /^#+\s/.test(line) || /^\*\*[^*]+\*\*:?$/.test(line.trim());
            const clean = line.replace(/^#+\s*/, '').replace(/\*\*(.+?)\*\*/g, '$1');
            return isHeading ? (
              <h4 key={`${idx}-${j}`}>{clean}</h4>
            ) : (
              <p key={`${idx}-${j}`}>{clean}</p>
            );
          });
      })}
    </div>
  );
}
