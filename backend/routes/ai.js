const express = require('express');
const router = express.Router();
const { chat, analyzeProfile, getChatHistory, clearHistory } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/chat', chat);
router.get('/analyze', analyzeProfile);
router.get('/history', getChatHistory);
router.delete('/history', clearHistory);

module.exports = router;
