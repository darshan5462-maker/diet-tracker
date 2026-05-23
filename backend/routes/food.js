const express = require('express');
const router = express.Router();
const { searchFood, getFoodById, getCategories } = require('../controllers/foodController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/search', searchFood);
router.get('/categories', getCategories);
router.get('/:id', getFoodById);

module.exports = router;
