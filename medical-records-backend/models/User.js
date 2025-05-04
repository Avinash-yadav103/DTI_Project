const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  aadhaarId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: String,
  dateOfBirth: String,
  fullAddress: String,
  photo: String,
  role: {
    type: String,
    enum: ['patient', 'doctor', 'student', 'government'],
    default: 'patient'
  },
  doctorId: {
    type: String,
    sparse: true,
    index: true
  },
  specialization: String,
  hospital: String,
  licenseNumber: String,
  yearsOfExperience: Number,
  education: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);