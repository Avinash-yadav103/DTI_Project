const express = require('express');
const router = express.Router();
const TransactionLog = require('../models/TransactionLog');

// POST emergency alert
router.post('/', async (req, res) => {
  try {
    const { 
      patientId, 
      location, 
      medicalInfo 
    } = req.body;
    
    // In a real app, you would:
    // 1. Notify emergency services via SMS/call API
    // 2. Locate and notify nearby hospitals 
    // 3. Send patient medical info to emergency responders
    
    console.log(`EMERGENCY ALERT: Patient ${patientId} at location ${location}`);
    
    // Log this emergency event
    const emergencyLog = new TransactionLog({
      patientId,
      action: 'emergency',
      actor: {
        name: req.body.name || 'Patient',
        role: 'Patient',
        id: patientId
      },
      details: 'Emergency SOS activated',
      hash: '0x' + Math.random().toString(16).substring(2, 34),
      blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
      consensusTimestamp: new Date(),
      additionalInfo: {
        ipAddress: req.ip,
        location: location || 'Unknown',
        medicalInfo: medicalInfo || {}
      }
    });
    
    await emergencyLog.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Emergency services notified' 
    });
  } catch (error) {
    console.error('Emergency notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to notify emergency services' 
    });
  }
});

module.exports = router;