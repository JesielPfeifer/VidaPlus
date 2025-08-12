import express from 'express';
import { PatientController } from '../controllers/patient.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const patientController = new PatientController();
export const patientRouter = express.Router();

patientRouter.post(
    '/',
    checkingAuth(['Administrador', 'Usuario']),
    patientController.registerPatient,
);
patientRouter.post(
    '/internacao',
    checkingAuth(['Administrador', 'Profissional']),
    patientController.registerPatientHospitalization,
);
patientRouter.put(
    '/',
    checkingAuth(['Administrador', 'Usuario']),
    patientController.updateInfos,
);
patientRouter.delete(
    '/:id',
    checkingAuth(['Administrador']),
    patientController.deletePatient,
);
patientRouter.get(
    '/',
    checkingAuth(['Administrador', 'Usuario', 'Profissional']),
    patientController.getPatientData,
);
