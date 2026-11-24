const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'c++', 'c#', 'go', 'rust',
  'php', 'ruby', 'kotlin', 'swift', 'sql', 'html', 'css', 'bash'
];

const validateGenerate = (req, res, next) => {
  const { prompt, language, mode } = req.body || {};

  if (typeof prompt !== 'string' || prompt.trim().length < 3) {
    return res.status(400).json({ message: 'Please describe what you need (at least 3 characters).' });
  }
  if (prompt.length > 6000) {
    return res.status(400).json({ message: 'That is too long (max 6000 characters).' });
  }
  if (language !== undefined && !LANGUAGES.includes(String(language).toLowerCase())) {
    return res.status(400).json({ message: 'Unsupported language.' });
  }
  if (mode !== undefined && !['generate', 'explain'].includes(mode)) {
    return res.status(400).json({ message: 'Mode must be "generate" or "explain".' });
  }
  if (language) req.body.language = String(language).toLowerCase();
  next();
};

module.exports = { validateGenerate, LANGUAGES };
