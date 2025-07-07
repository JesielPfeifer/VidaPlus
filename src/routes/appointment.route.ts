import express from 'express';
import { AppointmentController } from '../controllers/appointments.controller';

const appointmentController = new AppointmentController();
export const hospitalRouter = express.Router();

hospitalRouter.post('/', appointmentController.registerAppointment);
hospitalRouter.put('/', appointmentController.updateAppointmentData);
hospitalRouter.delete('/', appointmentController.deleteAppointment);
hospitalRouter.get('/', appointmentController.showAppointments);
