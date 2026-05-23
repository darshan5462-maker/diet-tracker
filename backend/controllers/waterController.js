const Water = require('../models/Water');

exports.getTodayWater = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    let record = await Water.findOne({ user: req.user._id, date: { $gte: start, $lte: end } });
    if (!record) {
      record = { glasses: 0, mlAmount: 0, goal: req.user.dailyWaterGoal || 8, entries: [] };
    }
    res.json({ success: true, water: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addWater = async (req, res) => {
  try {
    const { amount, unit = 'glasses' } = req.body;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    let record = await Water.findOne({ user: req.user._id, date: { $gte: start, $lte: end } });

    const mlAmount = unit === 'glasses' ? amount * 250 : unit === 'oz' ? amount * 29.57 : amount;
    const glasses = unit === 'glasses' ? amount : unit === 'ml' ? amount / 250 : amount * 29.57 / 250;

    if (!record) {
      record = await Water.create({
        user: req.user._id,
        glasses,
        mlAmount,
        goal: req.user.dailyWaterGoal || 8,
        entries: [{ amount, unit }]
      });
    } else {
      record.glasses += glasses;
      record.mlAmount += mlAmount;
      record.entries.push({ amount, unit });
      await record.save();
    }

    res.json({ success: true, water: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWeeklyWater = async (req, res) => {
  try {
    const end = new Date();
    const start = new Date(); start.setDate(start.getDate() - 6); start.setHours(0, 0, 0, 0);

    const records = await Water.find({ user: req.user._id, date: { $gte: start, $lte: end } });
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(); day.setDate(day.getDate() - i);
      const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);
      const record = records.find(r => r.date >= dayStart && r.date <= dayEnd);
      weeklyData.push({
        date: day.toISOString().split('T')[0],
        day: day.toLocaleDateString('en', { weekday: 'short' }),
        glasses: record ? record.glasses : 0,
        goal: req.user.dailyWaterGoal || 8
      });
    }

    res.json({ success: true, weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetWater = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    await Water.findOneAndDelete({ user: req.user._id, date: { $gte: start, $lte: end } });
    res.json({ success: true, message: 'Water intake reset' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
