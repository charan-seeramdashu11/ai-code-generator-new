import React, { useState } from 'react';
import { extFor } from '../utils/languages';

const KEYWORDS =
  'abstract|as|async|await|break|case|catch|class|const|continue|def|default|defer|do|elif|else|enum|except|export|extends|false|final|finally|fn|for|from|func|function|go|if|implements|import|in|interface|is|lambda|let|map|new|nil|none|null|package|pass|private|protected|public|pub|return|self|static|struct|super|switch|this|throw|true|try|type|use|var|void|while|with|yield|select|insert|update|delete|create|table|where|join|primary|key|not|and|or|values|into|set|order|by|group|limit|index|references|foreign|unique|default|integer|varchar|text|timestamp|boolean|serial';

const commentFor = (lang) => {
  if (['python', 'bash', 'ruby'].includes(lang)) return '#.*';
  if (lang === 'sql') return '--.*';
  if (lang === 'html') return '<!--.*?-->';
  return '\\/\\/.*|\\/\\*.*?\\*\\/';
};

// Tiny, dependency-free highlighter. Builds React nodes (no innerHTML), so it is safe.
function highlightLine(line, lang) {
  const re = new RegExp(
    `(${commentFor(lang)})|("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|\`(?:\\\\.|[^\`\\\\])*\`)|\\b(\\d+(?:\\.\\d+)?)\\b|\\b(${KEYWORDS})\\b`,
    'gi'
  );
  const out = [];
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(line)) !== null) {
    if (m[0] === '') {
      re.lastIndex += 1;
      continue;
    }
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? 'tk-com' : m[2] ? 'tk-str' : m[3] ? 'tk-num' : 'tk-kw';
    out.push(
      <span key={i++} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      /* clipboard may be blocked; ignore */
    }
  };

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeforge.${extFor(language)}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <div className="dots">
          <i /> <i /> <i />
        </div>
        <span className="lang-tag">{language}</span>
        <div className="bar-actions">
          <button onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
          <button onClick={download}>Download</button>
        </div>
      </div>
      <pre>
        <code>
          {lines.map((line, i) => (
            <div className="line" key={i}>
              <span className="ln">{i + 1}</span>
              <span className="lc">{line.length ? highlightLine(line, language) : ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
