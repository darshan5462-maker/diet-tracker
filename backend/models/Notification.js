const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['meal_reminder', 'water_reminder', 'diet_update', 'goal_achieved', 'system', 'doctor_message'],
    default: 'system'
  },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
