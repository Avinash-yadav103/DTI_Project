const mongoose = require('mongoose');

const transactionLogSchema = new mongoose.Schema({
  // Basic transaction info
  patientId: { 
    type: String, 
    required: true,
    index: true 
  },
  action: {
    type: String,
    required: true,
    enum: ['view', 'update', 'access', 'revoke', 'upload', 'share', 'download'],
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  
  // Actor information
  actor: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    hospital: { type: String },
    id: { type: String, required: true }
  },
  
  // Transaction details
  details: { type: String, required: true },
  hash: { type: String, required: true },
  blockNumber: { type: Number },
  consensusTimestamp: { type: Date },
  
  // Access info
  additionalInfo: {
    ipAddress: { type: String },
    device: { type: String },
    location: { type: String },
    accessReason: { type: String },
    recordsAccessed: [{ type: String }],
    changesMade: [{ type: String }],
    previousValue: { type: String },
    newValue: { type: String },
    accessDuration: { type: String },
    accessLevel: { type: String },
    revokedFrom: {
      name: { type: String },
      role: { type: String },
      id: { type: String }
    },
    revokeReason: { type: String },
    fileDetails: {
      name: { type: String },
      type: { type: String },
      size: { type: String },
      hash: { type: String }
    }
  }
});

module.exports = mongoose.model('TransactionLog', transactionLogSchema);