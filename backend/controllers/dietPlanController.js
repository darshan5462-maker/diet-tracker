const DietPlan = require('../models/DietPlan');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getDietPlans = async (req, res) => {
  try {
    const query = req.user.role === 'patient'
      ? { assignedTo: req.user._id }
      : { createdBy: req.user._id };

    const plans = await DietPlan.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email specialization');

    if (!plan) return res.status(404).json({ success: false, message: 'Diet plan not found' });
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.create({ ...req.body, createdBy: req.user._id });

    if (plan.assignedTo) {
      await Notification.create({
        user: plan.assignedTo,
        title: 'New Diet Plan Assigned',
        message: `Dr. ${req.user.name} has assigned you a new diet plan: ${plan.title}`,
        type: 'diet_update',
        link: `/patient/diet-plan/${plan._id}`
      });
    }

    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!plan) return res.status(404).json({ success: false, message: 'Diet plan not found' });
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDietPlan = async (req, res) => {
  try {
    await DietPlan.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    res.json({ success: true, message: 'Diet plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markMealComplete = async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    const meal = plan.meals.id(req.params.mealId);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    meal.isCompleted = !meal.isCompleted;
    await plan.save();

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
