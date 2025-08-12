import express from 'express';
import { PrescriptionController } from '../controllers/prescription.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const prescriptionController = new PrescriptionController();
export const prescriptionRouter = express.Router();

prescriptionRouter.post(
    '/',
    checkingAuth(['Administrador', 'Profissional']),
    prescriptionController.registerPrescription,
);
prescriptionRouter.put(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    prescriptionController.updatePrescription,
);
prescriptionRouter.delete(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    prescriptionController.deletePrescription,
);
