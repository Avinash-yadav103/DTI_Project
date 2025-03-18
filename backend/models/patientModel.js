const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
    patientID: String,
    firstName: String,
    lastName: String,
    dob: Date,
    gender: String,
    email: String,
    phone: String,
    address: String,
    emergencyContact: {
        ECName: String,
        ECRelation: String,
        ECPhone: String,
    },
    medicalInfo: {
        bloodType: String,
        allergies: [String],
        medications: [String],
        medicalConditions: [String],
        surgicalHistory: [String],
        familyHistory: [String],
    },
    healthAttributes: {
        height: Number,
        weight: Number,
        bloodpressure: String,
        heartrate: Number,
        temp: Number,
        cholestrol: Number,
        bloodsugar: Number,
        spO2: Number,
    },
    healthRecords: {
        healthHistory: [String],
        vitalStats: [String],
        vaccinationRecords: [String],
        testResults: [String],
        healthIssues: [String],
    },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    login: {
        username: String,
        password: String,
    },
    privacyPreferences: {
        shareMedicalHistoryWithDoctor: Boolean,
        shareVitalsWithDoctor: Boolean,
        shareAllHealthData: Boolean,
    }
});
module.exports = mongoose.model('Patient', patientSchema);
