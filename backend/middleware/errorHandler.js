const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Bad JSON body, invalid ObjectId, etc.
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON in request.' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id.' });

  const status = err.status || 500;
  if (status >= 500) console.error('Server error:', err);
  res.status(status).json({ message: err.message || 'Internal server error' });
};

module.exports = { notFound, errorHandler };
