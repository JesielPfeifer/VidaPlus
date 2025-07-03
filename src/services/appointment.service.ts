import { prisma } from '../lib/prisma';

export class AppointmentService {
    constructor() {}

    public async findPatientAppointments(pacienteId: string) {
        const patientAppointments = await prisma.consulta.findMany({
            where: { pacienteId },
            orderBy: { data: 'desc' },
        });
        return patientAppointments.length > 0 ? patientAppointments : [];
    }
}
