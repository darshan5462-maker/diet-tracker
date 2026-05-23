const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  glasses: { type: Number, default: 0 },
  mlAmount: { type: Number, default: 0 },
  goal: { type: Number, default: 8 },
  entries: [{
    amount: Number,
    unit: { type: String, enum: ['glasses', 'ml', 'oz'], default: 'glasses' },
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Water', waterSchema);
