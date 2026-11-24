// Talks to the AI provider. Supports OpenAI and Google Gemini.
// Uses the global fetch built into Node 18+.

class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const GENERATE_PROMPT = (language) =>
  `You are CodeForge, an expert senior software engineer. The user describes what they want ` +
  `in plain, possibly informal or broken English. Work out their real intent and write complete, ` +
  `runnable, well-commented ${language} code. Declare every variable, include every import, and ` +
  `handle errors sensibly. If the request is for a whole app or project, output each file in turn, ` +
  `each preceded by a comment line giving its file name. Reply with ONLY the code - no explanations, ` +
  `no markdown fences.`;

const EXPLAIN_PROMPT =
  `You are CodeForge, a patient senior engineer reviewing code. The user pastes code or asks about code. ` +
  `Reply in plain text with these short sections: "What it does", "How it works", "Problems found" ` +
  `(bugs, undeclared variables, security or performance issues - or "None found") and "Improved version" ` +
  `(corrected code only if you found problems). Keep it clear and concise.`;

// Models sometimes wrap code in ``` fences even when told not to.
const stripFences = (text) => {
  const trimmed = (text || '').trim();
  const match = trimmed.match(/^```[\w+#.-]*\n([\s\S]*?)\n?```$/);
  return match ? match[1].trim() : trimmed;
};

const mapProviderError = (provider, status, detail) => {
  const name = provider === 'gemini' ? 'Gemini' : 'OpenAI';
  if (status === 401 || status === 403) {
    return new AppError(502, `${name} rejected the API key. Check ${provider.toUpperCase()}_API_KEY on the server.`);
  }
  if (status === 429) {
    const hint =
      provider === 'openai'
        ? 'Add billing credits at platform.openai.com/settings/organization/billing, or switch to Gemini (free) with AI_PROVIDER=gemini.'
        : 'Wait a minute and try again.';
    return new AppError(502, `${name} quota or rate limit reached. ${hint}`);
  }
  if (status === 404) {
    return new AppError(502, `${name} model not found. Check the ${provider.toUpperCase()}_MODEL setting.`);
  }
  return new AppError(502, `${name} error (${status}): ${detail}`);
};

const callOpenAI = async (system, user) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new AppError(500, 'OPENAI_API_KEY is not set on the server.');
  const base = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.error?.message || 'Unknown error';
    console.error('OpenAI error:', res.status, detail);
    throw mapProviderError('openai', res.status, detail);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
};

const callGemini = async (system, user) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AppError(500, 'GEMINI_API_KEY is not set on the server.');
  const base = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const res = await fetch(`${base}/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: 0.3 }
    })
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.error?.message || 'Unknown error';
    console.error('Gemini error:', res.status, detail);
    throw mapProviderError('gemini', res.status, detail);
  }
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
};

const getProvider = () => (process.env.AI_PROVIDER || 'openai').toLowerCase();

const runAI = async ({ prompt, language, mode }) => {
  const provider = getProvider();
  const system = mode === 'explain' ? EXPLAIN_PROMPT : GENERATE_PROMPT(language);
  const raw = provider === 'gemini' ? await callGemini(system, prompt) : await callOpenAI(system, prompt);
  const result = mode === 'explain' ? raw.trim() : stripFences(raw);
  if (!result) throw new AppError(502, 'The AI returned an empty answer. Please try again.');
  return { result, provider };
};

const providerStatus = () => {
  const provider = getProvider();
  const keyName = provider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENAI_API_KEY';
  return {
    provider,
    keyConfigured: Boolean(process.env[keyName]),
    model: provider === 'gemini' ? process.env.GEMINI_MODEL || 'gemini-2.0-flash' : process.env.OPENAI_MODEL || 'gpt-4o-mini'
  };
};

module.exports = { runAI, providerStatus, AppError, stripFences };
