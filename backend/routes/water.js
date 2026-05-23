const express = require('express');
const router = express.Router();
const { getTodayWater, addWater, getWeeklyWater, resetWater } = require('../controllers/waterController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/today', getTodayWater);
router.get('/weekly', getWeeklyWater);
router.post('/', addWater);
router.delete('/reset', resetWater);

module.exports = router;
