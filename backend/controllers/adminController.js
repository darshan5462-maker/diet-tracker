const User = require('../models/User');
const Meal = require('../models/Meal');
const DietPlan = require('../models/DietPlan');
const BMI = require('../models/BMI');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalMeals = await Meal.countDocuments();
    const totalDietPlans = await DietPlan.countDocuments();

    // New users this month
    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Calories tracked today
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayMeals = await Meal.find({ date: { $gte: todayStart } });
    const caloriesToday = todayMeals.reduce((s, m) => s + m.totalCalories, 0);

    res.json({
      success: true,
      stats: {
        totalUsers, totalPatients, totalDoctors, totalMeals,
        totalDietPlans, newUsersThisMonth, caloriesToday
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserGrowth = async (req, res) => {
  try {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
      data.push({
        month: d.toLocaleDateString('en', { month: 'short', year: '2-digit' }),
        users: count
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
