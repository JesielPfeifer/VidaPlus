import { prisma } from '../lib/prisma';

export class ProfessionalService {
    constructor() {}

    public async getProfessionalDataByCRM(crm: string) {
        const professionalData = await prisma.profissional.findUnique({
            where: { crm },
        });
        return professionalData ? professionalData : null;
    }

    public async getProfessionalDataByCoren(coren: string) {
        const professionalData = await prisma.profissional.findUnique({
            where: { coren },
        });
        return professionalData ? professionalData : null;
    }

    public async getProfessionalDataById(id: string) {
        const professionalData = await prisma.profissional.findUnique({
            where: { id },
        });
        return professionalData ? professionalData : null;
    }

    public async registerProfessional(data: any) {
        return await prisma.profissional.create({ data });
    }

    public async updateProfessionalData(id: string, data: any) {
        return await prisma.profissional.update({ where: { id }, data });
    }

    public async getAllProfessionalsbyHospitalId(hospitalId: string) {
        return await prisma.profissional.findMany({
            where: { unidadeId: hospitalId },
        });
    }
    public async deleteProfessional(professionalId: string) {
        return await prisma.profissional.delete({
            where: { id: professionalId },
        });
    }

    public async existsProfessional(id: string) {
        const professional = await prisma.profissional.findUnique({
            where: { id },
        });
        return !!professional;
    }
}
