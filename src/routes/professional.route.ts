import express from 'express';
import { ProfessionalController } from '../controllers/professional.controller';

const professionalController = new ProfessionalController();
export const professionalRouter = express.Router();

professionalRouter.post('/', professionalController.registerProfessional);
professionalRouter.get('/:id', professionalController.showAppointments);
professionalRouter.get('/:id', professionalController.getProfessionalData);
professionalRouter.put('/:id', professionalController.updateProfessionalData);
professionalRouter.delete('/:id', professionalController.deleteProfessional);
professionalRouter.get('/', professionalController.getAllProfessionalAtHospital,);
