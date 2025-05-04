const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    ref: 'User'
  },
  doctorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  hospitalId: {
    type: String,
    required: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['in-person', 'virtual'],
    default: 'in-person'
  },
  notes: String,
  meetingLink: String,
  reasonForVisit: String,
  cancelReason: String,
  canceledBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);