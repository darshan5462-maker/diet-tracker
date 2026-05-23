const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Meal = require('../models/Meal');
const Water = require('../models/Water');
const BMI = require('../models/BMI');

router.use(protect);

router.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year) || new Date().getFullYear();
    const m = parseInt(month) !== undefined ? parseInt(month) : new Date().getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const meals = await Meal.find({ user: req.user._id, date: { $gte: start, $lte: end } });
    const water = await Water.find({ user: req.user._id, date: { $gte: start, $lte: end } });
    const bmi = await BMI.find({ user: req.user._id, date: { $gte: start, $lte: end } });

    const totalCalories = meals.reduce((s, m) => s + m.totalCalories, 0);
    const daysWithMeals = new Set(meals.map(m => m.date.toDateString())).size;
    const avgCalories = daysWithMeals ? Math.round(totalCalories / daysWithMeals) : 0;
    const totalWater = water.reduce((s, w) => s + w.glasses, 0);
    const avgWater = water.length ? (totalWater / water.length).toFixed(1) : 0;

    const dailyData = {};
    meals.forEach(meal => {
      const d = meal.date.toISOString().split('T')[0];
      if (!dailyData[d]) dailyData[d] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      dailyData[d].calories += meal.totalCalories;
      dailyData[d].protein += meal.totalProtein;
      dailyData[d].carbs += meal.totalCarbs;
      dailyData[d].fat += meal.totalFat;
    });

    const mealTypeBreakdown = {
      breakfast: meals.filter(m => m.mealType === 'breakfast').reduce((s, m) => s + m.totalCalories, 0),
      lunch: meals.filter(m => m.mealType === 'lunch').reduce((s, m) => s + m.totalCalories, 0),
      dinner: meals.filter(m => m.mealType === 'dinner').reduce((s, m) => s + m.totalCalories, 0),
      snack: meals.filter(m => m.mealType === 'snack').reduce((s, m) => s + m.totalCalories, 0)
    };

    res.json({
      success: true,
      report: {
        period: { year: y, month: m },
        totalCalories, avgCalories, totalWater, avgWater,
        totalMeals: meals.length, daysWithMeals,
        mealTypeBreakdown,
        bmiRecords: bmi,
        dailyData: Object.entries(dailyData).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
