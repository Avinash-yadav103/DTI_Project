const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MedicalRecord = require('../models/MedicalRecord');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all medical records for a patient
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }
    
    const records = await MedicalRecord.find({ patientId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific medical record
router.get('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    // Update last accessed time
    record.lastAccessed = Date.now();
    await record.save();
    
    res.json(record);
  } catch (err) {
    console.error('Error fetching record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new medical record
router.post('/', upload.array('documents'), async (req, res) => {
  try {
    const { 
      patientId, title, type, doctor, hospital, 
      date, diagnosis, clinicalNotes, prescription 
    } = req.body;
    
    // Handle prescription array from form data
    const parsedPrescription = prescription ? 
      (Array.isArray(prescription) ? prescription : JSON.parse(prescription)) : [];
    
    // Process uploaded files
    const documents = req.files.map(file => ({
      name: file.originalname,
      type: path.extname(file.originalname).toUpperCase().substring(1),
      fileUrl: `/uploads/${file.filename}`
    }));
    
    const newRecord = new MedicalRecord({
      patientId,
      title,
      type,
      doctor,
      hospital,
      date,
      diagnosis: diagnosis || '',
      clinicalNotes: clinicalNotes || '',
      prescription: parsedPrescription,
      documents
    });
    
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Error creating record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a medical record
router.put('/:id', upload.array('newDocuments'), async (req, res) => {
  try {
    const { 
      title, type, doctor, hospital, 
      date, diagnosis, clinicalNotes, prescription 
    } = req.body;
    
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    // Process any new uploaded files
    const newDocuments = req.files.map(file => ({
      name: file.originalname,
      type: path.extname(file.originalname).toUpperCase().substring(1),
      fileUrl: `/uploads/${file.filename}`
    }));
    
    // Handle prescription array from form data
    const parsedPrescription = prescription ? 
      (Array.isArray(prescription) ? prescription : JSON.parse(prescription)) : [];
    
    // Update record fields
    record.title = title;
    record.type = type;
    record.doctor = doctor;
    record.hospital = hospital;
    record.date = date;
    record.diagnosis = diagnosis || '';
    record.clinicalNotes = clinicalNotes || '';
    record.prescription = parsedPrescription;
    
    // Add any new documents
    if (newDocuments.length > 0) {
      record.documents = [...record.documents, ...newDocuments];
    }
    
    await record.save();
    res.json(record);
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a medical record
router.delete('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    // Delete associated files
    record.documents.forEach(doc => {
      if (doc.fileUrl) {
        const filePath = path.join(__dirname, '..', doc.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
    
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;