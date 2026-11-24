import React from 'react';
import { TEMPLATES } from '../utils/templates';

export default function Welcome({ onUseTemplate }) {
  return (
    <div className="welcome">
      <div className="logo-big">⚡</div>
      <h1>
        What do you want to <span className="grad">build</span> today?
      </h1>
      <p className="sub">
        Describe it in your own words — even rough English works. CodeForge figures out what you mean and writes
        the code.
      </p>
      <div className="templates">
        {TEMPLATES.map((t) => (
          <button key={t.title} className="template" onClick={() => onUseTemplate(t)}>
            <span className="t-icon">{t.icon}</span>
            <strong>{t.title}</strong>
            <small>{t.desc}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
