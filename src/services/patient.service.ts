import { prisma } from '../lib/prisma';
import { PacienteSchema } from '../schemas/schema';

export class PatientService {
    constructor() {}

    public async getPatientData(cpf: string) {
        const patientData = await prisma.paciente.findUnique({
            where: { cpf },
        });
        return patientData ? patientData : null;
    }

    public async findByCpf(cpf: string) {
        return await prisma.paciente.findUnique({ where: { cpf } });
    }

    public async registerPatient(data: any) {
        return await prisma.paciente.create({ data });
    }

    public async updatePatientData(cpf: string, data: any) {
        return await prisma.paciente.update({ where: { cpf }, data });
    }

    public async patientCpfInUse(cpf: string) {
        return !!(await prisma.paciente.findUnique({
            where: { cpf },
        }));
    }

    public async deleteUnit(id: string) {
        return await prisma.paciente.delete({ where: { id } });
    }

    public async findAllUnits() {
        return await prisma.paciente.findMany();
    }
}
