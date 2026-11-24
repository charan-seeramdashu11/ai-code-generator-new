const express = require('express');
const router = express.Router();
const { generate, history, remove, clearAll } = require('../controllers/generateController');
const { validateGenerate } = require('../middleware/validateRequest');
const { generateLimiter } = require('../middleware/rateLimiter');

router.post('/', generateLimiter, validateGenerate, generate);
router.get('/history', history);
router.delete('/:id', remove);
router.delete('/', clearAll);

module.exports = router;
