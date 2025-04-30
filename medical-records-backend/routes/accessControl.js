const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TransactionLog = require('../models/TransactionLog');

// You might want to create a separate model for access control
const AccessControl = mongoose.model('AccessControl', new mongoose.Schema({
  patientId: { type: String, required: true },
  doctor: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    hospital: { type: String, required: true }
  },
  accessLevel: { type: String, required: true, enum: ['read', 'readWrite', 'full'] },
  accessDuration: { type: String, required: true },
  grantedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  accessReason: { type: String, required: true },
  recordTypes: [{ type: String }],
  active: { type: Boolean, default: true }
}));

// Grant access to a doctor
router.post('/', async (req, res) => {
  try {
    const { 
      patientId, doctor, accessLevel, accessDuration, 
      accessReason, recordTypes 
    } = req.body;
    
    // Calculate expiration date based on duration
    let expiresAt = new Date();
    if (accessDuration === '24h') {
      expiresAt.setHours(expiresAt.getHours() + 24);
    } else if (accessDuration === '48h') {
      expiresAt.setHours(expiresAt.getHours() + 48);
    } else if (accessDuration === '1w') {
      expiresAt.setDate(expiresAt.getDate() + 7);
    } else if (accessDuration === '1m') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (accessDuration === 'permanent') {
      // Set to a date far in the future
      expiresAt = new Date(2099, 11, 31);
    }
    
    // Create new access control entry
    const newAccess = new AccessControl({
      patientId,
      doctor,
      accessLevel,
      accessDuration,
      expiresAt,
      accessReason,
      recordTypes
    });
    
    await newAccess.save();
    
    res.status(201).json({ 
      success: true, 
      message: `Access granted to Dr. ${doctor.name}`,
      data: newAccess 
    });
  } catch (err) {
    console.error('Error granting access:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all access grants for a patient
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }
    
    // Get all access grants, sorted by most recent first
    const accessGrants = await AccessControl.find({ 
      patientId,
      // Only return active grants or those that haven't expired
      $or: [
        { active: true },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ grantedAt: -1 });
    
    res.json(accessGrants);
  } catch (err) {
    console.error('Error fetching access grants:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Revoke access
router.post('/revoke/:id', async (req, res) => {
  try {
    const access = await AccessControl.findById(req.params.id);
    if (!access) {
      return res.status(404).json({ message: 'Access grant not found' });
    }
    
    // Revoke access
    access.active = false;
    await access.save();
    
    res.json({ 
      success: true, 
      message: `Access for Dr. ${access.doctor.name} has been revoked` 
    });
  } catch (err) {
    console.error('Error revoking access:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;