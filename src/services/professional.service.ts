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

    public async registerProfessional(data: any) {
        return await prisma.profissional.create({ data });
    }

    public async updateProfessionalData(crm: string, data: any) {
        return await prisma.profissional.update({ where: { crm }, data });
    }
}
