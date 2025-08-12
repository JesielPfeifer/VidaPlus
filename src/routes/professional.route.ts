import express from 'express';
import { ProfessionalController } from '../controllers/professional.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const professionalController = new ProfessionalController();
export const professionalRouter = express.Router();

professionalRouter.post(
    '/',
    checkingAuth(['Administrador', 'Profissional']),
    professionalController.registerProfessional,
);
professionalRouter.get(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    professionalController.getProfessionalData,
);
professionalRouter.put(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    professionalController.updateProfessionalData,
);
professionalRouter.delete(
    '/:id',
    checkingAuth(['Administrador']),
    professionalController.deleteProfessional,
);
professionalRouter.get(
    '/',
    checkingAuth(['Administrador']),
    professionalController.getAllProfessionalAtHospital,
);
