import express from 'express';
import 'dotenv/config';

import { patientRouter } from './routes/patient.route';
import prisma from './lib/prisma';
import errorHandler from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 3333;

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
// app.use('/consulta');
// app.use('/medicos');
// app.use('/user');

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
