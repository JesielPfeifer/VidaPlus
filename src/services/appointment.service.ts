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
            include: {
                prontuario: true,
            },
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

    /**
     * Registers a new appointment.
     * @param data - The appointment data to register.
     * @returns The created appointment data.
     */
    public async registerAppointment(data: any) {
        return await prisma.consulta.create({ data });
    }

    /**
     * Updates an existing appointment.
     * @param appointmentId - The ID of the appointment to update.
     * @param data - The updated appointment data.
     * @returns
     */
    public async updateAppointmentData(id: string, data: any) {
        return await prisma.consulta.update({ where: { id }, data });
    }

    /**
     * Deletes an appointment by its ID.
     * @param id - The ID of the appointment to delete.
     * @returns The deleted appointment data.
     */
    public async deleteAppointment(id: string) {
        return await prisma.consulta.delete({ where: { id } });
    }

    /**
     * Find an appointment by ID.
     * @param id - The ID of the appointment.
     * @returns The appointment data or null if not found.
     */
    public async findAppointmentById(id: string) {
        return await prisma.consulta.findUnique({ where: { id } });
    }

    public async existsAppointment(id: string) {
        const appointment = await prisma.consulta.findUnique({
            where: { id },
        });
        return !!appointment;
    }

    public async registerCalendarAppointment(data: any) {
        return await prisma.agenda.create({ data });
    }
}
