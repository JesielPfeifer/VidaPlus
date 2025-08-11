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
import { checkingAuth } from './middlewares/auth.middleware';

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
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

app.use('/pacientes', patientRouter);
app.use('/hospital', hospitalRouter);
app.use('/profissional', professionalRouter);
app.use('/consulta', appointmentRouter);
app.use('/admin', adminRouter);
// app.use('/medicos');

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
