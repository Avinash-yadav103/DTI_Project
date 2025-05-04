const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-records')
  .then(() => console.log('MongoDB connected for seeding doctors'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import User model
const User = require('../models/User');

// Sample doctors data
const doctors = [
  {
    doctorId: 'DOC12345',
    aadhaarId: '987654321012',
    password: 'password123',
    name: 'Dr. Sarah Johnson',
    gender: 'female',
    dateOfBirth: '1980-05-15',
    fullAddress: '123 Medical Plaza, City Center, Mumbai',
    role: 'doctor',
    specialization: 'Cardiology',
    hospital: 'City General Hospital',
    licenseNumber: 'MCI-12345-A',
    yearsOfExperience: 15,
    education: 'MBBS, MD (Cardiology)',
    phone: '9876543210',
    email: 'dr.sarah@citygeneral.com'
  },
  {
    doctorId: 'DOC67890',
    aadhaarId: '876543210987',
    password: 'password123',
    name: 'Dr. Rajesh Kumar',
    gender: 'male',
    dateOfBirth: '1975-08-22',
    fullAddress: '456 Healthcare Avenue, Bangalore',
    role: 'doctor',
    specialization: 'Neurology',
    hospital: 'Bangalore Medical Institute',
    licenseNumber: 'MCI-67890-B',
    yearsOfExperience: 20,
    education: 'MBBS, MD (Neurology), DM',
    phone: '8765432109',
    email: 'dr.rajesh@bmi.com'
  },
  {
    doctorId: 'DOC54321',
    aadhaarId: '765432109876',
    password: 'password123',
    name: 'Dr. Priya Sharma',
    gender: 'female',
    dateOfBirth: '1985-12-10',
    fullAddress: '789 Medical Center Road, Delhi',
    role: 'doctor',
    specialization: 'Pediatrics',
    hospital: 'Children\'s Hospital Delhi',
    licenseNumber: 'MCI-54321-C',
    yearsOfExperience: 10,
    education: 'MBBS, DCH, MD (Pediatrics)',
    phone: '7654321098',
    email: 'dr.priya@childhosp.com'
  }
];

// Function to seed doctors
async function seedDoctors() {
  try {
    // Clear existing doctors
    await User.deleteMany({ role: 'doctor' });
    console.log('Existing doctors cleared');
    
    // Hash passwords and create new doctor records
    const doctorPromises = doctors.map(async (doctor) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(doctor.password, salt);
      
      return new User({
        ...doctor,
        password: hashedPassword
      }).save();
    });
    
    const savedDoctors = await Promise.all(doctorPromises);
    console.log(`${savedDoctors.length} doctors successfully seeded`);
    
    // Log created doctors (without passwords)
    savedDoctors.forEach(doc => {
      console.log(`Created doctor: ${doc.name} (ID: ${doc.doctorId})`);
    });
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding doctors:', error);
    mongoose.connection.close();
  }
}

// Run the seed function
seedDoctors();