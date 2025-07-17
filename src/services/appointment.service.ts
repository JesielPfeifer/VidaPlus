import { prisma } from '../lib/prisma';

export class AppointmentService {
    constructor() {}

    /**
     * Retrieves all appointments for a specific patient.
     * @param pacienteId - The ID of the patient.
     * @returns An array of appointments for the patient or an empty array if none found.
     */
    public async findPatientAppointments(pacienteId: string) {
        const patientAppointments = await prisma.consulta.findMany({
            where: { pacienteId },
            orderBy: { data: 'desc' },
        });
        return patientAppointments.length > 0 ? patientAppointments : [];
    }

    /**
     * Retrieves all appointments for a specific professional.
     * @param professionalId - The ID of the professional.
     * @returns An array of appointments for the professional or an empty array if none found.
     */
    public async getAppointmentsByProfessionalId(professionalId: string) {
        const patientAppointments = await prisma.consulta.findMany({
            where: { profissionalId: professionalId },
            orderBy: { data: 'desc' },
        });
        return patientAppointments.length > 0 ? patientAppointments : [];
    }
}
