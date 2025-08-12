import { prisma } from '../lib/prisma';

export class PrescriptionService {
    constructor() {}

    public registerPrescription = async (data: any) => {
        return await prisma.prescricao.create({ data });
    };

    public updatePrescription = async (id: string, data: any) => {
        return await prisma.prescricao.update({
            where: { id },
            data,
        });
    };

    public deletePrescription = async (id: string) => {
        return await prisma.prescricao.delete({
            where: { id },
        });
    };

    public getPrescriptionData = async (id: string) => {
        return await prisma.prescricao.findUnique({
            where: { id },
        });
    };

    public existsPrescription = async (id: string) => {
        const prescription = await prisma.prescricao.findUnique({
            where: { id },
        });
        return prescription ? true : false;
    };
}
