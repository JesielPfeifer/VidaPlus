import { prisma } from '../lib/prisma';

export class PatientService {
    constructor() {}

    /**
     * Retrieves patient data by CPF.
     * @param cpf - The CPF of the patient.
     * @returns The patient data or null if not found.
     */
    public async findByCpf(cpf: string) {
        const patientData = await prisma.paciente.findUnique({
            where: { cpf },
        });
        return patientData ? patientData : null;
    }

    /**
     * Registers a new patient in the system.
     * @param data - The patient data to register.
     * @returns The created patient data.
     */
    public async registerPatient(data: any) {
        return await prisma.paciente.create({ data });
    }

    /**
     * Updates patient information.
     * @param cpf - The CPF of the patient to update.
     * @param data - The updated patient data.
     * @returns The updated patient data.
     */
    public async updatePatientData(cpf: string, data: any) {
        return await prisma.paciente.update({ where: { cpf }, data });
    }

    /**
     * Checks if a patient's CPF is already in use.
     * @param cpf - The CPF to check.
     * @returns True if the CPF is in use, false otherwise.
     */
    public async patientCpfInUse(cpf: string) {
        return !!(await prisma.paciente.findUnique({
            where: { cpf },
        }));
    }

    /**
     * Finds a patient by their ID.
     * @param id - The ID of the patient.
     * @returns Patient data or null if not found.
     */
    public async findPatientById(id: string) {
        return await prisma.paciente.findUnique({
            where: { id },
        });
    }

    /**
     * Finds a patient by their ID.
     * @param id - The ID of the patient.
     * @returns Patient data or null if not found.
     */
    public async deletePatienById(id: string) {
        return await prisma.paciente.delete({
            where: { id },
        });
    }
}
