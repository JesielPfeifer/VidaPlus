import { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { unidadeNome, unidadeEndereco, ...dadosPaciente } = req.body;
        const { nome, cpf, email, dataNascimento } = dadosPaciente;

        if (!nome || !cpf || !email) {
            res.status(400).json({
                msg: 'Dados invalidos, preencha os campos obrigatórios',
            });
        }

        let unidade = await prisma.unidade.findFirst({
            where: { nome: unidadeNome },
        });

        if (!unidade) {
            unidade = await prisma.unidade.create({
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
                unidadeId: unidade.id,
            },
        });

        res.status(200).json(paciente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro interno no servidor', error: error });
    }
};
