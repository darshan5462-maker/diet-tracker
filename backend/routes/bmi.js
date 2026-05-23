const express = require('express');
const router = express.Router();
const { calculateBMI, getBMIHistory, getLatestBMI } = require('../controllers/bmiController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/history', getBMIHistory);
router.get('/latest', getLatestBMI);
router.post('/', calculateBMI);

module.exports = router;
