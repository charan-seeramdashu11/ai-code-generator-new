const Generation = require('../models/Generation');
const { isDbReady } = require('../config/db');
const { runAI, AppError } = require('../services/aiService');

// POST /api/generate
const generate = async (req, res, next) => {
  try {
    const { prompt, language = 'javascript', mode = 'generate' } = req.body;
    const { result, provider } = await runAI({ prompt: prompt.trim(), language, mode });

    const payload = { prompt: prompt.trim(), language, mode, result, provider };
    let saved = null;

    if (isDbReady()) {
      try {
        saved = await Generation.create(payload);
      } catch (err) {
        console.error('Could not save generation:', err.message);
      }
    }

    // Always return the answer, even if saving to MongoDB was not possible.
    res.status(201).json(
      saved
        ? { ...saved.toObject(), saved: true }
        : { ...payload, _id: `temp-${Date.now()}`, createdAt: new Date().toISOString(), saved: false }
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/generate/history
const history = async (req, res, next) => {
  try {
    if (!isDbReady()) return res.json([]);
    const items = await Generation.find().sort({ createdAt: -1 }).limit(60);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/generate/:id
const remove = async (req, res, next) => {
  try {
    if (!isDbReady()) throw new AppError(503, 'Database is not connected.');
    await Generation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/generate
const clearAll = async (req, res, next) => {
  try {
    if (!isDbReady()) throw new AppError(503, 'Database is not connected.');
    await Generation.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (err) {
    next(err);
  }
};

module.exports = { generate, history, remove, clearAll };
