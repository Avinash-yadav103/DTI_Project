const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MedicalInfo = require('../models/MedicalInfo');
const TransactionLog = require('../models/TransactionLog');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { aadhaarId, password, name, gender, dateOfBirth, fullAddress, photo, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ aadhaarId });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this Aadhaar ID already exists' 
      });
    }
    
    // Create new user
    const newUser = new User({
      aadhaarId,
      password,
      name: name || 'User',
      gender,
      dateOfBirth,
      fullAddress,
      photo,
      role: role || 'patient'
    });
    
    await newUser.save();
    
    console.log('User created successfully:', {
      id: newUser._id,
      aadhaarId: newUser.aadhaarId,
      name: newUser.name,
      role: newUser.role
    });
    
    // Create transaction log for user registration
    const transactionLog = new TransactionLog({
      patientId: aadhaarId,
      action: 'update',
      actor: {
        name: name || 'User',
        role: 'Patient',
        id: aadhaarId
      },
      details: 'User registration completed',
      hash: '0x' + Math.random().toString(16).substring(2, 34),
      blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
      consensusTimestamp: new Date(),
      additionalInfo: {
        ipAddress: req.ip || '127.0.0.1',
        device: req.headers['user-agent'] || 'Unknown'
      }
    });
    
    await transactionLog.save();
    
    // Return success response without password
    const userResponse = {
      _id: newUser._id,
      aadhaarId: newUser.aadhaarId,
      name: newUser.name,
      role: newUser.role
    };
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: userResponse 
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Register medical information
router.post('/medical-info', async (req, res) => {
  try {
    const { 
      patientId, 
      bloodType, 
      allergies, 
      height, 
      weight, 
      emergencyContact 
    } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ aadhaarId: patientId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check if medical info already exists for this user
    let medicalInfo = await MedicalInfo.findOne({ patientId });
    
    if (medicalInfo) {
      // Update existing info
      medicalInfo.bloodType = bloodType || medicalInfo.bloodType;
      medicalInfo.allergies = allergies || medicalInfo.allergies;
      medicalInfo.height = height || medicalInfo.height;
      medicalInfo.weight = weight || medicalInfo.weight;
      medicalInfo.emergencyContact = emergencyContact || medicalInfo.emergencyContact;
      medicalInfo.updatedAt = Date.now();
    } else {
      // Create new medical info
      medicalInfo = new MedicalInfo({
        patientId,
        bloodType,
        allergies,
        height,
        weight,
        emergencyContact
      });
    }
    
    await medicalInfo.save();
    
    console.log('Medical info saved successfully:', {
      patientId: medicalInfo.patientId,
      bloodType: medicalInfo.bloodType,
      allergiesCount: medicalInfo.allergies?.length || 0
    });
    
    // Create transaction log
    const transactionLog = new TransactionLog({
      patientId,
      action: 'update',
      actor: {
        name: user.name,
        role: 'Patient',
        id: patientId
      },
      details: 'Medical information updated',
      hash: '0x' + Math.random().toString(16).substring(2, 34),
      blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
      consensusTimestamp: new Date(),
      additionalInfo: {
        ipAddress: req.ip || '127.0.0.1',
        device: req.headers['user-agent'] || 'Unknown'
      }
    });
    
    await transactionLog.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Medical information saved successfully', 
      medicalInfo
    });
  } catch (err) {
    console.error('Error saving medical info:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while saving medical information' 
    });
  }
});

// Add this route to your users.js file
router.post('/login', async (req, res) => {
  try {
    const { aadhaarId, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ aadhaarId });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found. Please check your Aadhaar number.' 
      });
    }
    
    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password.' 
      });
    }
    
    // Log successful login
    console.log(`User logged in successfully: ${user.name} (${user.aadhaarId})`);
    
    // Return user data (excluding password)
    const userData = {
      _id: user._id,
      aadhaarId: user.aadhaarId,
      name: user.name,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      role: user.role
    };
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login'
    });
  }
});

module.exports = router;