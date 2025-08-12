import { prisma } from '../lib/prisma';

export class HospitalService {
    constructor() {}

    /**
     * Finds a hospital unit by its name.
     * @param nome - The name of the hospital unit.
     * @returns The hospital unit data or null if not found.
     */
    public async findByName(nome: string) {
        return await prisma.unidade.findUnique({ where: { nome } });
    }

    /**
     * Finds a hospital unit by its ID.
     * @param id - The ID of the hospital unit.
     * @returns The hospital unit data or null if not found.
     */
    public async findById(id: string) {
        return await prisma.unidade.findUnique({ where: { id } });
    }

    /**
     * Creates a new hospital unit.
     * @param data - The data for the new hospital unit.
     * @returns The created hospital unit data.
     */
    public async createUnit(data: { nome: string; endereco: string }) {
        return await prisma.unidade.create({ data });
    }

    /**
     * Updates an existing hospital unit.
     * @param id - The ID of the hospital unit to update.
     * @param data - The updated data for the hospital unit.
     * @returns The updated hospital unit data.
     */
    public async updateUnit(
        id: string,
        data: { nome: string; endereco: string },
    ) {
        return await prisma.unidade.update({ where: { id }, data });
    }

    /**
     * Checks if a hospital unit name is already in use.
     * @param nome - The name to check.
     * @returns True if the name is in use, false otherwise.
     */
    public async hospitalUnitNameInUse(nome: string) {
        return !!(await prisma.unidade.findUnique({ where: { nome } }));
    }

    /**
     * Deletes a hospital unit by its ID.
     * @param id - The ID of the hospital unit to delete.
     * @returns The deleted hospital unit data.
     */
    public async deleteUnit(id: string) {
        return await prisma.unidade.delete({ where: { id } });
    }

    /**
     * Retrieves all hospital units.
     * @returns An array of all hospital units.
     */
    public async findAllUnits() {
        return await prisma.unidade.findMany();
    }

    /**
     * Checks if a hospital unit exists by its ID.
     * @param id - The ID of the hospital unit to check.
     * @returns True if the hospital unit exists, false otherwise.
     */
    public async existsHospitalUnit(id: string) {
        const hospitalUnit = await prisma.unidade.findUnique({ where: { id } });
        return !!hospitalUnit;
    }

    public async getHospitalBeds(hospitalId: string) {
        return await prisma.internacao.findMany({
            where: { unidadeId: hospitalId },
            include: {
                unidade: true,
                paciente: true,
            },
        });
    }
}
