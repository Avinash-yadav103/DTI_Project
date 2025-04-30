const express = require('express');
const router = express.Router();
const TransactionLog = require('../models/TransactionLog');

// Get transaction logs for a patient
router.get('/', async (req, res) => {
  try {
    const { patientId, timeFilter, actionFilter, actorFilter, searchQuery } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Build query
    const query = { patientId };
    
    // Time filter
    if (timeFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.timestamp = { $gte: today };
    } else if (timeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query.timestamp = { $gte: weekAgo };
    } else if (timeFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query.timestamp = { $gte: monthAgo };
    }
    
    // Action filter
    if (actionFilter && actionFilter !== 'all') {
      query.action = actionFilter;
    }
    
    // Actor filter
    if (actorFilter && actorFilter !== 'all') {
      query['actor.role'] = new RegExp(actorFilter, 'i');
    }
    
    // Search query
    if (searchQuery) {
      query.$or = [
        { details: new RegExp(searchQuery, 'i') },
        { 'actor.name': new RegExp(searchQuery, 'i') },
        { hash: new RegExp(searchQuery, 'i') }
      ];
    }
    
    // Get logs
    const logs = await TransactionLog.find(query).sort({ timestamp: -1 });
    
    res.json(logs);
  } catch (err) {
    console.error('Error fetching transaction logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new transaction log
router.post('/', async (req, res) => {
  try {
    const { 
      patientId, action, actor, details, hash, 
      blockNumber, consensusTimestamp, additionalInfo 
    } = req.body;
    
    // Create new log
    const newLog = new TransactionLog({
      patientId,
      action,
      actor,
      details,
      hash,
      blockNumber,
      consensusTimestamp,
      additionalInfo
    });
    
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error('Error creating transaction log:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export logs as CSV, JSON, or PDF
router.get('/export', async (req, res) => {
  try {
    const { patientId, format } = req.query;
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }
    
    if (!['csv', 'json', 'pdf'].includes(format)) {
      return res.status(400).json({ message: 'Invalid export format' });
    }
    
    // Get logs
    const logs = await TransactionLog.find({ patientId }).sort({ timestamp: -1 });
    
    // Export based on format
    if (format === 'json') {
      // Return JSON directly
      res.json(logs);
    } else if (format === 'csv') {
      // Create CSV content
      let csvContent = 'Date,Time,Action,Actor,Role,Details,Transaction Hash\n';
      logs.forEach(log => {
        const date = new Date(log.timestamp).toLocaleDateString();
        const time = new Date(log.timestamp).toLocaleTimeString();
        csvContent += `${date},${time},${log.action},${log.actor.name},${log.actor.role},${log.details},${log.hash}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transaction_logs_${patientId}.csv`);
      res.send(csvContent);
    } else {
      // For PDF, we'll implement a simple HTML-to-PDF conversion
      // This would typically use a library like pdfkit or puppeteer
      // For simplicity, let's just return a message
      res.status(501).json({ message: 'PDF export not implemented yet' });
    }
  } catch (err) {
    console.error('Error exporting transaction logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;