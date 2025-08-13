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
        const professionalAppointments = await prisma.consulta.findMany({
            where: { profissionalId: professionalId },
            orderBy: { data: 'desc' },
        });
        return professionalAppointments.length > 0
            ? professionalAppointments
            : [];
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

    public async registerTelemedicina(data: any) {
        return await prisma.telemedicina.create({ data });
    }

    public async updateCalendarAppointment(id: string, data: any) {
        return await prisma.agenda.update({ where: { id }, data });
    }

    public async updateTelemedicina(id: string, data: any) {
        return await prisma.telemedicina.update({ where: { id }, data });
    }

    public async deleteCalendarAppointment(id: string) {
        return await prisma.agenda.delete({ where: { id } });
    }

    public async deleteTelemedicina(id: string) {
        return await prisma.telemedicina.delete({ where: { id } });
    }

    public async hasCalendarAppointment(appointmentId: string) {
        const calendarAppointment = await prisma.agenda.findFirst({
            where: { id: appointmentId },
        });
        return !!calendarAppointment;
    }

    public async hasTelemedicina(appointmentId: string) {
        const telemedicina = await prisma.telemedicina.findFirst({
            where: { id: appointmentId },
        });
        return !!telemedicina;
    }
}
