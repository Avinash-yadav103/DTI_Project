const doctorSchema = new mongoose.Schema({
    doctorID: String,
    firstName: String,
    lastName: String,
    dob: Date,
    gender: String,
    email: String,
    phone: String,
    address: String,
    professionalInfo: {
        specialization: String,
        qualification: String,
        hospitalAffiliation: String,
        yearsOfExperience: Number,
        languagesSpoken: [String],
        licensingDetails: String,
        medicalLicenseExpiry: Date,
    },
    workSchedule: {
        workingHours: String,
        availability: Boolean,
        hospitalLocation: String,
    },
    experienceReputation: {
        ratings: Number,
        patientReviews: [String],
        successRate: Number,
        consultationFee: Number,
    },
    appointmentsWithPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    login: {
        username: String,
        password: String,
    },
});
module.exports = mongoose.model('Doctor', doctorSchema);
