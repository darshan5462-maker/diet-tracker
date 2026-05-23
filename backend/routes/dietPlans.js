const express = require('express');
const router = express.Router();
const { getDietPlans, getDietPlan, createDietPlan, updateDietPlan, deleteDietPlan, markMealComplete } = require('../controllers/dietPlanController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getDietPlans);
router.get('/:id', getDietPlan);
router.post('/', authorize('doctor', 'admin'), createDietPlan);
router.put('/:id', authorize('doctor', 'admin'), updateDietPlan);
router.delete('/:id', authorize('doctor', 'admin'), deleteDietPlan);
router.patch('/:id/meals/:mealId/complete', markMealComplete);

module.exports = router;
