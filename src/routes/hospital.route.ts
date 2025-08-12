import express from 'express';
import { HospitalController } from '../controllers/hospital.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const hospitalController = new HospitalController();
export const hospitalRouter = express.Router();

hospitalRouter.post(
    '/',
    checkingAuth(['Administrador']),
    hospitalController.createHospitalUnit,
);
hospitalRouter.put(
    '/',
    checkingAuth(['Administrador']),
    hospitalController.updateHospitalUnit,
);
hospitalRouter.delete(
    '/:id',
    checkingAuth(['Administrador']),
    hospitalController.deleteHospitalUnit,
);
hospitalRouter.get(
    '/',
    checkingAuth(['Administrador']),
    hospitalController.getHospitalUnits,
);
hospitalRouter.get(
    '/leitos/:id',
    checkingAuth(['Administrador']),
    hospitalController.getHospitalBeds,
);
