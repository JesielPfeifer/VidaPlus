import { prisma } from '../lib/prisma';

export class HospitalService {
    async findByNome(nome: string) {
        return await prisma.unidade.findUnique({ where: { nome } });
    }

    async createUnidade(data: { nome: string; endereco: string }) {
        return await prisma.unidade.create({ data });
    }

    async updateUnidade(id: string, data: { nome: string; endereco: string }) {
        return await prisma.unidade.update({ where: { id }, data });
    }

    async isNomeEmUso(nome: string) {
        return !!(await prisma.unidade.findUnique({ where: { nome } }));
    }
}
