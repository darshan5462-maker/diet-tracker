const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalCalories: { type: Number, default: 0 },
  
  meals: [{
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    time: { type: String },
    foods: [{
      name: String,
      quantity: Number,
      unit: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }],
    notes: String,
    isCompleted: { type: Boolean, default: false }
  }],
  
  nutritionalAdvice: [{ type: String }],
  restrictions: [{ type: String }],
  goals: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['draft', 'active', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
