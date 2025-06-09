import express from 'express';
import 'dotenv/config';

import { pacienteRouter } from './routes/paciente.route';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'OK' });
});

app.get('/', (_, res) => {
    res.status(200).json({
        status: 'healthy',
    });
});

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

app.use('/pacientes', pacienteRouter);
// app.use('/consulta');
// app.use('/medicos');
// app.use('/user');

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
