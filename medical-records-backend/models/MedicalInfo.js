const mongoose = require('mongoose');

// Allergy schema
const allergySchema = new mongoose.Schema({
  type: { type: String },
  severity: { 
    type: String, 
    enum: ['mild', 'moderate', 'severe', 'life-threatening'],
    default: 'mild' 
  },
  reaction: { type: String }
});

// Emergency contact schema
const emergencyContactSchema = new mongoose.Schema({
  name: { type: String },
  relation: { type: String },
  phone: { type: String }
});

// Medical info schema
const medicalInfoSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
    default: 'unknown'
  },
  allergies: [allergySchema],
  height: { type: String },
  weight: { type: String },
  emergencyContact: emergencyContactSchema,
  chronicConditions: [String],
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalInfo', medicalInfoSchema);