const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
  } catch (err) {
    throw new Error(
      `Cannot reach the server at ${API_BASE}. Make sure the backend is running and REACT_APP_API_URL is correct.`
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const generate = (prompt, language, mode) =>
  request('/generate', { method: 'POST', body: JSON.stringify({ prompt, language, mode }) });

export const fetchHistory = () => request('/generate/history');
export const deleteItem = (id) => request(`/generate/${id}`, { method: 'DELETE' });
export const clearHistory = () => request('/generate', { method: 'DELETE' });
export const fetchHealth = () => request('/health');
