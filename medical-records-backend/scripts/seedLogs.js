const mongoose = require('mongoose');
const TransactionLog = require('../models/TransactionLog');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-records')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const sampleLogs = [
  {
    patientId: '123456', // Replace with actual patient ID
    action: 'view',
    timestamp: new Date('2023-06-15T09:30:00Z'),
    actor: {
      name: 'Dr. Rajesh Kumar',
      role: 'Doctor',
      hospital: 'City General Hospital',
      id: 'DOC-5678-1234',
    },
    details: 'Viewed patient medical history',
    hash: '0x7f9a3d5a8b1c6e7f4d2c1b5a8e7f9a3d5a8b1c6e',
    blockNumber: 14567823,
    consensusTimestamp: new Date('2023-06-15T09:30:05Z'),
    additionalInfo: {
      ipAddress: '192.168.1.45',
      device: 'Desktop - Chrome',
      location: 'New Delhi, India',
      accessReason: 'Regular checkup',
      recordsAccessed: ['Medical History', 'Allergies', 'Current Medications'],
    },
  },
  // Add more sample logs here
];

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await TransactionLog.deleteMany({});
    
    // Insert sample logs
    await TransactionLog.insertMany(sampleLogs);
    
    console.log('Sample logs added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();