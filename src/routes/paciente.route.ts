import express from 'express';
import { register } from '../controllers/paciente.controller';

export const pacienteRouter = express.Router();

pacienteRouter.post('/', register);
