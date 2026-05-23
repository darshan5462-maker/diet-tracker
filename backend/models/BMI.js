const mongoose = require('mongoose');

const bmiSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bmi: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Underweight', 'Normal weight', 'Overweight', 'Obese'],
  },
  bodyFat: { type: Number },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('BMI', bmiSchema);
