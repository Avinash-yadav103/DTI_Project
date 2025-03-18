import { Router } from 'express';
import AppointmentController from '../controllers/appointmentController';

const router = Router();
const appointmentController = new AppointmentController();

router.post('/appointments', appointmentController.createAppointment);
router.get('/appointments', appointmentController.getAppointments);
router.delete('/appointments/:id', appointmentController.deleteAppointment);

export default router;