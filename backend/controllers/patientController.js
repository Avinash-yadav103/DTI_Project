const Patient = require('../models/patientModel');
exports.getPatients = async (req, res) => {
    const patients = await Patient.find();
    res.json(patients);
};
exports.addPatient = async (req, res) => {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.json(newPatient);
};