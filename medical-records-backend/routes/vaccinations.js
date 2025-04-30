const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vaccination = require('../models/Vaccination');
const TransactionLog = require('../models/TransactionLog');

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

// Get all vaccinations for a patient
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }
    
    const vaccinations = await Vaccination.find({ patientId }).sort({ date: -1 });
    res.json(vaccinations);
  } catch (err) {
    console.error('Error fetching vaccinations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new vaccination record
router.post('/', upload.array('documents'), async (req, res) => {
  try {
    const { 
      patientId, name, date, manufacturer, batchNumber, 
      location, givenBy, category, notes 
    } = req.body;
    
    // Process uploaded files
    const documents = req.files.map(file => ({
      name: file.originalname,
      type: path.extname(file.originalname).toUpperCase().substring(1),
      fileUrl: `/uploads/${file.filename}`
    }));
    
    // Determine category if not provided
    const determinedCategory = category || determineCategoryFromName(name);
    
    const newVaccination = new Vaccination({
      patientId,
      name,
      date,
      manufacturer: manufacturer || '',
      batchNumber: batchNumber || '',
      location: location || '',
      givenBy: givenBy || '',
      category: determinedCategory,
      notes: notes || '',
      documents
    });
    
    await newVaccination.save();
    
    // Create transaction log for this action
    if (req.headers['user-id']) {
      const transactionLog = new TransactionLog({
        patientId,
        action: 'upload',
        actor: {
          name: req.headers['user-name'] || 'Unknown User',
          role: req.headers['user-role'] || 'Patient',
          id: req.headers['user-id']
        },
        details: `Added vaccination record: ${name}`,
        hash: '0x' + Math.random().toString(16).substring(2, 34),
        blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
        consensusTimestamp: new Date(),
        additionalInfo: {
          ipAddress: req.ip,
          device: req.headers['user-agent'],
          location: 'Local'
        }
      });
      
      await transactionLog.save();
    }
    
    res.status(201).json(newVaccination);
  } catch (err) {
    console.error('Error creating vaccination record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a vaccination record
router.delete('/:id', async (req, res) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id);
    if (!vaccination) {
      return res.status(404).json({ message: 'Vaccination record not found' });
    }
    
    // Delete associated files
    vaccination.documents.forEach(doc => {
      if (doc.fileUrl) {
        const filePath = path.join(__dirname, '..', doc.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
    
    await Vaccination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vaccination record deleted successfully' });
  } catch (err) {
    console.error('Error deleting vaccination record:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to determine category from name
function determineCategoryFromName(name) {
  name = name.toLowerCase();
  if (name.includes('covid')) return 'COVID-19';
  if (name.includes('flu') || name.includes('influenza')) return 'Influenza';
  if (name.includes('hepatitis')) return 'Hepatitis';
  if (name.includes('tetanus') || name.includes('mmr') || name.includes('polio')) return 'Routine';
  return 'Other';
}

module.exports = router;