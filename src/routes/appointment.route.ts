import express from 'express';
import { AppointmentController } from '../controllers/appointments.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const appointmentController = new AppointmentController();
export const appointmentRouter = express.Router();

appointmentRouter.post(
    '/',
    checkingAuth(['Administrador', 'Profissional']),
    appointmentController.registerAppointment,
);
appointmentRouter.put(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    appointmentController.updateAppointmentData,
);
appointmentRouter.delete(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    appointmentController.deleteAppointment,
);
appointmentRouter.get(
    '/profissional/:id',
    checkingAuth(['Administrador', 'Profissional']),
    appointmentController.showProfessionalAppointments,
);
appointmentRouter.get(
    '/paciente/:id',
    checkingAuth(['Administrador', 'Usuario', 'Profissional']),
    appointmentController.showPatientAppointments,
);
