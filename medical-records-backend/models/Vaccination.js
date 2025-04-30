const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String }
});

const vaccinationSchema = new mongoose.Schema({
  patientId: { 
    type: String, 
    required: true,
    index: true
  },
  name: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  manufacturer: { 
    type: String,
    default: ''
  },
  batchNumber: { 
    type: String,
    default: ''
  },
  location: { 
    type: String,
    default: ''
  },
  givenBy: { 
    type: String,
    default: ''
  },
  category: { 
    type: String,
    required: true
  },
  notes: { 
    type: String,
    default: ''
  },
  documents: [documentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);