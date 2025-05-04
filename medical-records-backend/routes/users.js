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

// Add this route after your existing login route

// Doctor login route
router.post('/doctor-login', async (req, res) => {
  try {
    const { doctorId, password } = req.body;
    
    if (!doctorId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and password are required'
      });
    }
    
    // Find doctor by doctorId
    const doctor = await User.findOne({ doctorId, role: 'doctor' });
    
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid doctor ID or password'
      });
    }
    
    // Verify password
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid doctor ID or password'
      });
    }
    
    // Log successful login
    console.log(`Doctor logged in successfully: ${doctor.name} (${doctor.doctorId})`);
    
    // Return doctor data (excluding password)
    const doctorData = {
      _id: doctor._id,
      doctorId: doctor.doctorId,
      aadhaarId: doctor.aadhaarId,
      name: doctor.name,
      gender: doctor.gender,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      email: doctor.email,
      phone: doctor.phone,
      role: doctor.role
    };
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: doctorData
    });
  } catch (err) {
    console.error('Doctor login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Add this to your users.js routes file
router.put('/update-profile', async (req, res) => {
  try {
    const { aadhaarId, profileData } = req.body;
    
    if (!aadhaarId) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar ID is required'
      });
    }
    
    // Find the user
    const user = await User.findOne({ aadhaarId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update basic user info
    user.name = profileData.name || user.name;
    user.gender = profileData.gender || user.gender;
    user.dateOfBirth = profileData.dateOfBirth || user.dateOfBirth;
    user.fullAddress = profileData.fullAddress || user.fullAddress;
    // If your User schema has these fields:
    if (profileData.phone) user.phone = profileData.phone;
    if (profileData.email) user.email = profileData.email;
    if (profileData.bio) user.bio = profileData.bio;
    
    await user.save();
    
    // Update or create medical info
    let medicalInfo = await MedicalInfo.findOne({ patientId: aadhaarId });
    
    if (medicalInfo) {
      // Update existing medical info
      if (profileData.medicalInfo) {
        medicalInfo.bloodType = profileData.medicalInfo.bloodType || medicalInfo.bloodType;
        medicalInfo.height = profileData.medicalInfo.height || medicalInfo.height;
        medicalInfo.weight = profileData.medicalInfo.weight || medicalInfo.weight;
        
        // Update allergies if provided
        if (profileData.medicalInfo.allergies && profileData.medicalInfo.allergies.length > 0) {
          medicalInfo.allergies = profileData.medicalInfo.allergies;
        }
        
        // Update conditions if your schema supports it
        if (profileData.medicalInfo.chronicConditions) {
          // If your schema has chronicConditions field
          medicalInfo.chronicConditions = profileData.medicalInfo.chronicConditions;
        }
      }
      
      // Update emergency contact
      if (profileData.emergencyContact) {
        medicalInfo.emergencyContact = {
          name: profileData.emergencyContact.name || medicalInfo.emergencyContact?.name,
          relation: profileData.emergencyContact.relation || medicalInfo.emergencyContact?.relation,
          phone: profileData.emergencyContact.phone || medicalInfo.emergencyContact?.phone
        };
      }
      
      medicalInfo.updatedAt = Date.now();
    } else {
      // Create new medical info record
      medicalInfo = new MedicalInfo({
        patientId: aadhaarId,
        bloodType: profileData.medicalInfo?.bloodType || 'unknown',
        height: profileData.medicalInfo?.height,
        weight: profileData.medicalInfo?.weight,
        allergies: profileData.medicalInfo?.allergies || [],
        emergencyContact: profileData.emergencyContact || {}
      });
      
      // Add chronicConditions if your schema supports it
      if (profileData.medicalInfo?.chronicConditions) {
        medicalInfo.chronicConditions = profileData.medicalInfo.chronicConditions;
      }
    }
    
    await medicalInfo.save();
    
    // Create a transaction log for this update
    const transactionLog = new TransactionLog({
      patientId: aadhaarId,
      action: 'update',
      actor: {
        name: user.name,
        role: 'Patient',
        id: aadhaarId
      },
      details: 'Profile information updated',
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
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// Add this route to your users.js file
router.get('/profile/:aadhaarId', async (req, res) => {
  try {
    const { aadhaarId } = req.params;
    
    // Find the user in MongoDB
    const user = await User.findOne({ aadhaarId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get medical info if available
    let medical = await MedicalInfo.findOne({ patientId: aadhaarId });
    
    // Create a user object without the password
    const userData = {
      _id: user._id,
      aadhaarId: user.aadhaarId,
      name: user.name,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      fullAddress: user.fullAddress,
      email: user.email,
      phone: user.phone,
      role: user.role,
      photo: user.photo
    };
    
    res.status(200).json({
      success: true,
      user: userData,
      medical: medical || null
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

module.exports = router;