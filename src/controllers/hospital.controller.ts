import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import catchErrors from '../utils/catchError';
import { HospitalService } from '../services/hospital.service';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
} from '../constants/httpCodes.constant';
import { UnidadeSchema } from '../schemas/schema';

export class HospitalController {
    private hospitalService: HospitalService;

    constructor() {
        this.hospitalService = new HospitalService();
    }

    public createHospitalUnit = catchErrors(
        async (req: Request, res: Response) => {
            const request = UnidadeSchema.parse(req.body);

            const existingHospitalUnit = await this.hospitalService.findByNome(
                request.nome,
            );

            if (existingHospitalUnit) {
                res.status(BAD_REQUEST).json({
                    msg: 'Hospital unit already exists',
                });
                return;
            }

            const hospital = await this.hospitalService.createUnidade(request);

            res.status(CREATED).json(hospital);
            return;
        },
    );

    public updateHospitalUnit = catchErrors(
        async (req: Request, res: Response) => {
            const { unidadeNome, unidadeEndereco } = req.body;

            const hospitalUnit = await prisma.unidade.findUnique({
                where: { nome: unidadeNome },
            });

            if (!hospitalUnit) {
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }

            if (hospitalUnit.nome === unidadeNome) {
                res.status(BAD_REQUEST).json({
                    msg: 'Hospital unit already exists with the same name',
                });
                return;
            }

            if (
                hospitalUnit.endereco === unidadeEndereco ||
                hospitalUnit.nome === unidadeNome
            ) {
                res.status(200).json({
                    msg: 'No changes detected for the hospital unit',
                });
                return;
            }

            const updatedHospitalUnit = await prisma.unidade.update({
                where: { id: hospitalUnit.id },
                data: {
                    nome: unidadeNome,
                    endereco: unidadeEndereco,
                },
            });

            res.json(updatedHospitalUnit);
            return;
        },
    );

    public deleteHospitalUnit = catchErrors(
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
                res.status(NOT_FOUND).json({
                    msg: 'Patient has no appointments',
                });
                return;
            }

            res.json(appointments);
        },
    );
}
