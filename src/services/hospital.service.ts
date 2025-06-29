import { prisma } from '../lib/prisma';

export class HospitalService {
    async findByName(nome: string) {
        return await prisma.unidade.findUnique({ where: { nome } });
    }

    async createUnit(data: { nome: string; endereco: string }) {
        return await prisma.unidade.create({ data });
    }

    async updateUnit(id: string, data: { nome: string; endereco: string }) {
        return await prisma.unidade.update({ where: { id }, data });
    }

    async hospitalUnitNameInUse(nome: string) {
        return !!(await prisma.unidade.findUnique({ where: { nome } }));
    }

    async deleteUnit(id: string) {
        return await prisma.unidade.delete({ where: { id } });
    }

    async findAllUnits() {
        return await prisma.unidade.findMany();
    }
}
