const express = require('express');
const router = express.Router();
const { createProfile, getProfile, updateProfile, getProfileStrength } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createProfile);
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/strength', getProfileStrength);

module.exports = router;
