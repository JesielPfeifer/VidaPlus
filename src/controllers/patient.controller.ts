import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    CREATED,
    NOT_FOUND,
} from '../constants/httpCodes.constant';

export const register = catchErrors(async (req: Request, res: Response) => {
    const { unidadeNome, unidadeEndereco, ...dadosPaciente } = req.body;
    const { nome, cpf, email, dataNascimento } = dadosPaciente;

    if (!nome || !cpf || !email) {
        res.status(BAD_REQUEST).json({
            msg: 'Dados invalidos, preencha os campos obrigatórios',
        });
    }

    let hospitalUnit = await prisma.unidade.findFirst({
        where: { nome: unidadeNome },
    });

    if (!hospitalUnit) {
        hospitalUnit = await prisma.unidade.create({
            data: {
                nome: unidadeNome,
                endereco: unidadeEndereco,
            },
        });
    }
    const paciente = await prisma.paciente.create({
        data: {
            nome,
            cpf,
            email,
            ...dadosPaciente,
            dataNascimento: new Date(dataNascimento),
            unidadeId: hospitalUnit.id,
        },
    });

    res.status(CREATED).json(paciente);
});

export const updateInfos = async (req: Request, res: Response) => {
    try {
        console.log(req);
    } catch (error) {
        console.log(error);
        res.status(INTERNAL_SERVER_ERROR).json({
            msg: 'Erro interno no servidor',
            error: error,
        });
    }
};

export const showAppointments = catchErrors(
    async (req: Request, res: Response) => {
        const { cpf } = req.body;

        const patient = await prisma.paciente.findFirst({
            where: { cpf },
        });

        if (!patient) {
            res.status(NOT_FOUND).json({ msg: 'Patient not found' });
            return;
        }
        const appointments = await prisma.consulta.findMany({
            where: { pacienteId: patient?.id },
            orderBy: { data: 'desc' },
        });
        if (appointments.length === 0) {
            res.status(NOT_FOUND).json({ msg: 'Patient has no appointments' });
            return;
        }

        res.json(appointments);
    },
);
