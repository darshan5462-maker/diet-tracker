const User = require('../models/User');
const Meal = require('../models/Meal');
const BMI = require('../models/BMI');

// Get all patients (for doctors)
exports.getPatients = async (req, res) => {
  try {
    const query = req.user.role === 'doctor'
      ? { role: 'patient', assignedDoctor: req.user._id }
      : { role: 'patient' };

    const patients = await User.find(query)
      .select('-password')
      .populate('assignedDoctor', 'name email specialization');

    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true }).select('-password');
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient details with stats
exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    // Get recent meals
    const recentMeals = await Meal.find({ user: patient._id }).sort({ date: -1 }).limit(5);
    
    // Get latest BMI
    const latestBMI = await BMI.findOne({ user: patient._id }).sort({ date: -1 });

    // Get weekly calorie data
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0,0,0,0);
    const weekMeals = await Meal.find({ user: patient._id, date: { $gte: weekStart } });
    const weeklyCalories = weekMeals.reduce((s, m) => s + m.totalCalories, 0);

    res.json({ success: true, patient, recentMeals, latestBMI, weeklyCalories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign doctor to patient
exports.assignDoctor = async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    
    const patient = await User.findByIdAndUpdate(
      patientId,
      { assignedDoctor: doctorId },
      { new: true }
    ).select('-password');

    await User.findByIdAndUpdate(doctorId, { $addToSet: { patients: patientId } });

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
