const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String }
});

const medicalRecordSchema = new mongoose.Schema({
  patientId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['diagnosis', 'examination', 'imaging', 'labTest', 'vaccination'] 
  },
  doctor: { 
    type: String, 
    required: true 
  },
  hospital: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  diagnosis: { 
    type: String 
  },
  clinicalNotes: { 
    type: String 
  },
  prescription: [{ 
    type: String 
  }],
  documents: [documentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);