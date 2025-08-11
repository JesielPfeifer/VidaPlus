import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const adminController = new AdminController();
export const adminRouter = express.Router();

adminRouter.post('/register', adminController.register);
adminRouter.post('/login', checkingAuth, adminController.login);
adminRouter.delete('/:id', adminController.deleteAdmin);
adminRouter.get('/', adminController.getAdminData);
