import express from 'express';
import 'dotenv/config';
import prisma from './lib/prisma';
import errorHandler from './middlewares/error.middleware';
import { PORT } from './constants/envs.constant';

import { patientRouter } from './routes/patient.route';
import { hospitalRouter } from './routes/hospital.route';
import { professionalRouter } from './routes/professional.route';
import { appointmentRouter } from './routes/appointment.route';
import { adminRouter } from './routes/admin.route';
import { prescriptionRouter } from './routes/prescription.route';
import { reportRouter } from './routes/report.route';
import logger from './lib/logger';

const app = express();

app.use(express.json());

app.get('/', async (_, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            apiStatus: 'OK',
            prisma: 'Connected',
        });
    } catch (error) {
        res.status(500).json({
            apiStatus: 'Error',
            prisma: 'Disconnected',
        });
    }
});

// #TODO: Criar um arquivo de chamada de todas as rotas com as criações dos dados no banco

app.use('/pacientes', patientRouter);
app.use('/hospital', hospitalRouter);
app.use('/profissional', professionalRouter);
app.use('/consulta', appointmentRouter);
app.use('/admin', adminRouter);
app.use('/prescricao', prescriptionRouter);
app.use('/prontuario', reportRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Aplication Started. Server is running on port ${PORT}`);
    console.log(`Server running on ${PORT}`);
});
