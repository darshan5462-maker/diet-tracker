const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'g' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 }
});

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  foods: [foodItemSchema],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  totalSugar: { type: Number, default: 0 },
  image: { type: String, default: '' },
  notes: { type: String, default: '' },
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

mealSchema.pre('save', function(next) {
  this.totalCalories = this.foods.reduce((sum, f) => sum + f.calories, 0);
  this.totalProtein = this.foods.reduce((sum, f) => sum + f.protein, 0);
  this.totalCarbs = this.foods.reduce((sum, f) => sum + f.carbs, 0);
  this.totalFat = this.foods.reduce((sum, f) => sum + f.fat, 0);
  this.totalSugar = this.foods.reduce((sum, f) => sum + f.sugar, 0);
  next();
});

module.exports = mongoose.model('Meal', mealSchema);
