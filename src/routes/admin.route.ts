import express from 'express';
import { AdminController } from '../controllers/admin.controller';

const adminController = new AdminController();
export const adminRouter = express.Router();

adminRouter.post('/register', adminController.register);
adminRouter.post('/login', adminController.login);
