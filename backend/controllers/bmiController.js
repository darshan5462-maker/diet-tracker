const BMI = require('../models/BMI');

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

exports.calculateBMI = async (req, res) => {
  try {
    const { weight, height, notes } = req.body;
    const bmi = weight / Math.pow(height / 100, 2);
    const category = getBMICategory(bmi);

    const record = await BMI.create({
      user: req.user._id,
      weight, height,
      bmi: Math.round(bmi * 10) / 10,
      category,
      notes: notes || ''
    });

    res.status(201).json({ success: true, bmi: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBMIHistory = async (req, res) => {
  try {
    const records = await BMI.find({ user: req.user._id }).sort({ date: -1 }).limit(20);
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLatestBMI = async (req, res) => {
  try {
    const record = await BMI.findOne({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, bmi: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
