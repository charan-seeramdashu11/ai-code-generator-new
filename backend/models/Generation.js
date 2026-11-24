const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    language: { type: String, default: 'javascript' },
    mode: { type: String, enum: ['generate', 'explain'], default: 'generate' },
    result: { type: String, required: true },
    provider: { type: String, default: 'openai' }
  },
  { timestamps: true }
);

generationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Generation', generationSchema);
