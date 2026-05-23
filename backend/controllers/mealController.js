const Meal = require('../models/Meal');

// @desc    Get meals for user
exports.getMeals = async (req, res) => {
  try {
    const { date, mealType, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (mealType) query.mealType = mealType;

    const meals = await Meal.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Meal.countDocuments(query);

    res.json({ success: true, meals, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's nutrition summary
exports.getTodaySummary = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.user._id,
      date: { $gte: start, $lte: end }
    });

    const summary = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat,
      sugar: acc.sugar + meal.totalSugar
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 });

    const byType = {
      breakfast: meals.filter(m => m.mealType === 'breakfast').reduce((s, m) => s + m.totalCalories, 0),
      lunch: meals.filter(m => m.mealType === 'lunch').reduce((s, m) => s + m.totalCalories, 0),
      dinner: meals.filter(m => m.mealType === 'dinner').reduce((s, m) => s + m.totalCalories, 0),
      snack: meals.filter(m => m.mealType === 'snack').reduce((s, m) => s + m.totalCalories, 0)
    };

    res.json({ success: true, summary, byType, meals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get weekly data
exports.getWeeklyData = async (req, res) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const meals = await Meal.find({
      user: req.user._id,
      date: { $gte: start, $lte: end }
    });

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);

      const dayMeals = meals.filter(m => m.date >= dayStart && m.date <= dayEnd);
      const calories = dayMeals.reduce((s, m) => s + m.totalCalories, 0);
      const protein = dayMeals.reduce((s, m) => s + m.totalProtein, 0);
      const carbs = dayMeals.reduce((s, m) => s + m.totalCarbs, 0);
      const fat = dayMeals.reduce((s, m) => s + m.totalFat, 0);

      weeklyData.push({
        date: day.toISOString().split('T')[0],
        day: day.toLocaleDateString('en', { weekday: 'short' }),
        calories, protein, carbs, fat
      });
    }

    res.json({ success: true, weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add meal
exports.addMeal = async (req, res) => {
  try {
    const meal = await Meal.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update meal
exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
    res.json({ success: true, meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
    res.json({ success: true, message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
    meal.isFavorite = !meal.isFavorite;
    await meal.save();
    res.json({ success: true, meal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
