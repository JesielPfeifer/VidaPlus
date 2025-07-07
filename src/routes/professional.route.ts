import express from 'express';
import { ProfessionalController } from '../controllers/professional.controller';

const professionalController = new ProfessionalController();
export const patientRouter = express.Router();

patientRouter.post('/', professionalController.registerProfessional);
patientRouter.put('/', professionalController.updateProfessionalData);
patientRouter.get('/', professionalController.showAppointments);
