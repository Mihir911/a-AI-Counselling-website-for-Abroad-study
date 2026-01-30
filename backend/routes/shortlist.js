const express = require('express');
const router = express.Router();
const {
    addToShortlist,
    getShortlist,
    removeFromShortlist,
    lockUniversity,
    unlockUniversity,
    getLockedUniversities
} = require('../controllers/shortlistController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', addToShortlist);
router.get('/', getShortlist);
router.get('/locked', getLockedUniversities);
router.delete('/:id', removeFromShortlist);
router.put('/:id/lock', lockUniversity);
router.put('/:id/unlock', unlockUniversity);

module.exports = router;
