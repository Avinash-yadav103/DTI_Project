import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;