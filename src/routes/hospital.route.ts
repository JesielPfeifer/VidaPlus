import express from 'express';
import { HospitalController } from '../controllers/hospital.controller';

const hospitalController = new HospitalController();
export const hospitalRouter = express.Router();

hospitalRouter.post('/', hospitalController.createHospitalUnit);
hospitalRouter.put('/', hospitalController.updateHospitalUnit);
hospitalRouter.delete('/:id', hospitalController.deleteHospitalUnit);
hospitalRouter.get('/', hospitalController.getHospitalUnits);
