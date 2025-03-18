import { Appointment } from '../models/appointmentModel';

export class AppointmentService {
    async createAppointment(data) {
        const appointment = new Appointment(data);
        return await appointment.save();
    }

    async getAppointments() {
        return await Appointment.find();
    }

    async deleteAppointment(id) {
        await Appointment.findByIdAndDelete(id);
    }
}