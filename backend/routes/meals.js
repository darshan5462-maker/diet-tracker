const express = require('express');
const router = express.Router();
const { getMeals, addMeal, updateMeal, deleteMeal, getTodaySummary, getWeeklyData, toggleFavorite } = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMeals);
router.get('/today-summary', getTodaySummary);
router.get('/weekly', getWeeklyData);
router.post('/', addMeal);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
