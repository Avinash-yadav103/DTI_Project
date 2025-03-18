import { Request, Response } from 'express';
import AppointmentService from '../services/appointmentService';

class AppointmentController {
  private appointmentService: AppointmentService;

  constructor() {
    this.appointmentService = new AppointmentService();
  }

  public createAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
      const appointmentData = req.body;
      const newAppointment = await this.appointmentService.createAppointment(appointmentData);
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating appointment', error });
    }
  };

  public getAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
      const appointments = await this.appointmentService.getAppointments();
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving appointments', error });
    }
  };

  public deleteAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
      const appointmentId = req.params.id;
      await this.appointmentService.deleteAppointment(appointmentId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting appointment', error });
    }
  };
}

export default AppointmentController;