import express from 'express';
import { PatientController } from '../controllers/patient.controller';

const patientController = new PatientController();
export const patientRouter = express.Router();

patientRouter.post('/', patientController.registerPatient);
patientRouter.put('/', patientController.updateInfos);
patientRouter.get('/', patientController.showAppointments);
