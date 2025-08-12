import express from 'express';
import { ReportController } from '../controllers/report.controller';
import { checkingAuth } from '../middlewares/auth.middleware';

const reportController = new ReportController();
export const reportRouter = express.Router();

reportRouter.post(
    '/',
    checkingAuth(['Administrador', 'Profissional']),
    reportController.registerReport,
);
reportRouter.put(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    reportController.updateReport,
);
reportRouter.delete(
    '/:id',
    checkingAuth(['Administrador', 'Profissional']),
    reportController.deleteReport,
);
reportRouter.get(
    '/paciente/:id',
    checkingAuth(['Administrador', 'Profissional']),
    reportController.showPatientsReports,
);
