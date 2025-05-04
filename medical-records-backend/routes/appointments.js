const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const TransactionLog = require('../models/TransactionLog');

// Get all appointments for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const appointments = await Appointment.find({ patientId })
      .sort({ date: -1, time: -1 });
    
    // Get doctor information for each appointment
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await User.findOne({ doctorId: appointment.doctorId });
        
        return {
          ...appointment.toObject(),
          doctor: doctor ? {
            name: doctor.name,
            specialty: doctor.specialization,
            photo: doctor.photo
          } : null
        };
      })
    );
    
    res.status(200).json({
      success: true,
      appointments: populatedAppointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
});

// Get all appointments for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const appointments = await Appointment.find({ doctorId })
      .sort({ date: 1, time: 1 });
    
    // Get patient information for each appointment
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = await User.findOne({ aadhaarId: appointment.patientId });
        
        return {
          ...appointment.toObject(),
          patient: patient ? {
            name: patient.name,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth
          } : null
        };
      })
    );
    
    res.status(200).json({
      success: true,
      appointments: populatedAppointments
    });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
});

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      hospitalId,
      hospitalName,
      date,
      time,
      type,
      notes,
      reasonForVisit,
      meetingLink
    } = req.body;
    
    // Validate inputs
    if (!patientId || !doctorId || !hospitalId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: 'scheduled'
    });
    
    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }
    
    // Create new appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      hospitalId,
      hospitalName,
      date: new Date(date),
      time,
      type: type || 'in-person',
      notes,
      reasonForVisit,
      meetingLink: type === 'virtual' ? meetingLink : null
    });
    
    await appointment.save();
    
    // Log transaction
    const patient = await User.findOne({ aadhaarId: patientId });
    const doctor = await User.findOne({ doctorId });
    
    const transactionLog = new TransactionLog({
      patientId,
      action: 'create',
      actor: {
        name: patient ? patient.name : 'Unknown Patient',
        role: 'Patient',
        id: patientId
      },
      target: {
        type: 'Appointment',
        id: appointment._id,
        name: doctor ? `Appointment with Dr. ${doctor.name}` : 'Medical Appointment'
      },
      details: `Appointment scheduled for ${new Date(date).toLocaleDateString()} at ${time}`,
      hash: '0x' + Math.random().toString(16).substring(2, 34),
      blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
      consensusTimestamp: new Date(),
      additionalInfo: {
        ipAddress: req.ip || '127.0.0.1',
        device: req.headers['user-agent'] || 'Unknown'
      }
    });
    
    await transactionLog.save();
    
    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      appointment: {
        ...appointment.toObject(),
        doctor: doctor ? {
          name: doctor.name,
          specialty: doctor.specialization
        } : null
      }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while scheduling appointment'
    });
  }
});

// Get nearby hospitals
router.get('/hospitals/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query; // maxDistance in meters (default 10km)
    
    if (!lat || !lng) {
      // If no coordinates, return all hospitals
      const hospitals = await Hospital.find({ isActive: true });
      return res.status(200).json({
        success: true,
        hospitals
      });
    }
    
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      hospitals
    });
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hospitals'
    });
  }
});

// Get doctors by hospital
router.get('/doctors/hospital/:hospitalId', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const doctors = await User.find({
      role: 'doctor',
      hospital: hospitalId
    }).select('-password');
    
    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error('Error fetching hospital doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors'
    });
  }
});

// Additional routes for canceling, rescheduling, etc.
// ...

module.exports = router;