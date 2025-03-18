const express = require('express');
const router = express.Router();
const { getPatients, addPatient } = require('../controllers/patientController');
router.get('/', getPatients);
router.post('/', addPatient);
module.exports = router;