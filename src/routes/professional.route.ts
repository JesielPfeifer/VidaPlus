import express from 'express';
import { ProfessionalController } from '../controllers/professional.controller';

const professionalController = new ProfessionalController();
export const professionalRouter = express.Router();

professionalRouter.post('/', professionalController.registerProfessional);
professionalRouter.get('/', professionalController.getAllProfessionalAtHospital);
professionalRouter.put('/:id', professionalController.updateProfessionalData);
