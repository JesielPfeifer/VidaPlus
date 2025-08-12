import { prisma } from '../lib/prisma';

export class ReportsService {
    constructor() {}

    /**
     * Check if a report exists by prontuarioId
     * @param prontuarioId - The ID of the prontuario to check
     * @return boolean - Returns true if the report exists, false otherwise
     */
    public existsReport = async (prontuarioId: string) => {
        const report = await prisma.prontuario.findUnique({
            where: { id: prontuarioId },
        });
        return report ? true : false;
    };

    /**
     * Register a new report
     * @param data - The report data to register
     * @return The created report
     */
    public registerReport = async (reportData: any, prescriptions: any) => {
        return await prisma.prontuario.create({
            data: {
                ...reportData,
                prescricoes: {
                    create: prescriptions,
                },
            },
            include: {
                prescricoes: true,
            },
        });
    };

    /**
     * Update an existing report
     * @param id - The ID of the report to update
     * @param data - The updated report data
     * @return The updated report
     */
    public updateReport = async (
        id: string,
        reportData: any,
        prescriptions: any,
    ) => {
        return await prisma.prontuario.update({
            where: { id },
            data: {
                ...reportData,
                prescricoes: {
                    // to keep tracking of prescriptions, it's created anotther prescription inside the same report
                    create: prescriptions,
                },
            },
            include: {
                prescricoes: true,
            },
        });
    };

    /**
     * Delete an existing report
     * @param id - The ID of the report to delete
     * @return The deleted report
     */
    public deleteReport = async (id: string) => {
        return await prisma.prontuario.delete({
            where: { id },
        });
    };

    /**
     * Get report data by ID
     * @param id - The ID of the report to retrieve
     * @return The report data
     */
    public getReportData = async (id: string) => {
        return await prisma.prontuario.findUnique({
            where: { id },
        });
    };

    /**
     * Get all reports for a specific patient
     * @param patientId - The ID of the patient
     * @return An array of reports for the patient
     */
    public getPatientReportHistory = async (patientId: string) => {
        return await prisma.prontuario.findMany({
            where: { pacienteId: patientId },
            include: {
                prescricoes: true,
            },
        });
    };
}
