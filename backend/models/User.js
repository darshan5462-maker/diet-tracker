const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // Patient specific
  height: { type: Number }, // cm
  weight: { type: Number }, // kg
  targetWeight: { type: Number },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
    default: 'moderately_active'
  },
  goal: { type: String, enum: ['lose_weight', 'gain_weight', 'maintain'], default: 'maintain' },
  dailyCalorieGoal: { type: Number, default: 2000 },
  dailyWaterGoal: { type: Number, default: 8 }, // glasses
  
  // Doctor specific
  specialization: { type: String, default: '' },
  licenseNumber: { type: String, default: '' },
  
  // Auth
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: { type: Boolean, default: true },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
