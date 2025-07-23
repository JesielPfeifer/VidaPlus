import express from 'express';
import { AppointmentController } from '../controllers/appointments.controller';

const appointmentController = new AppointmentController();
export const appointmentRouter = express.Router();

appointmentRouter.post('/', appointmentController.registerAppointment);
appointmentRouter.put('/:id', appointmentController.updateAppointmentData);
appointmentRouter.delete('/:id', appointmentController.deleteAppointment);
appointmentRouter.get(
    '/profissional/:id',
    appointmentController.showProfessionalAppointments,
);
appointmentRouter.get(
    '/paciente/:id',
    appointmentController.showPatientAppointments,
);
