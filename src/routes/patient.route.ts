import express from 'express';
import {
    register,
    updateInfos,
    showAppointments,
} from '../controllers/patient.controller';

export const patientRouter = express.Router();

patientRouter.post('/', register);
patientRouter.put('/', updateInfos);
patientRouter.get('/', showAppointments);
