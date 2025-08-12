import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const adminController = new AdminController();
export const adminRouter = express.Router();

adminRouter.post('/register', adminController.register);
adminRouter.post('/login', adminController.login);
adminRouter.delete(
    '/:id',
    checkingAuth(['Administrador']),
    adminController.deleteAdmin,
);
adminRouter.get(
    '/',
    checkingAuth(['Administrador']),
    adminController.getAdminData,
);
