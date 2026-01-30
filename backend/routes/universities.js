const express = require('express');
const router = express.Router();
const { getUniversities, getUniversity, getRecommendations } = require('../controllers/universityController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getUniversities);
router.get('/recommend', getRecommendations);
router.get('/:id', getUniversity);

module.exports = router;
