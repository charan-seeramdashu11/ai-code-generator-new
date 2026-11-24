require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB, isDbReady } = require('./config/db');
const { providerStatus } = require('./services/aiService');
const generateRoutes = require('./routes/generate');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Required behind Render/Railway proxies so rate limiting sees real client IPs.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ name: 'CodeForge AI API', status: 'running' }));

// Open this URL after deploying to see whether everything is configured.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: isDbReady() ? 'connected' : 'disconnected', ai: providerStatus() });
});

app.use('/api/generate', generateRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB();
  app.listen(PORT, () => console.log(`CodeForge API listening on port ${PORT}`));
}

module.exports = app;
