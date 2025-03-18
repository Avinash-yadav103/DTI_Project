import { Appointment } from '../models/appointmentModel';

export class AppointmentService {
    async createAppointment(data: any): Promise<Appointment> {
        const appointment = new Appointment(data);
        return await appointment.save();
    }

    async getAppointments(): Promise<Appointment[]> {
        return await Appointment.find();
    }

    async deleteAppointment(id: string): Promise<void> {
        await Appointment.findByIdAndDelete(id);
    }
}