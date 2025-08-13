import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import { PrescriptionService } from '../services/prescription.service';
import { ReportsService } from '../services/reports.service';
import { ProfessionalService } from '../services/professional.service';
import { PatientService } from '../services/patient.service';
import { HospitalService } from '../services/hospital.service';
import { AppointmentService } from '../services/appointment.service';
import { ProntuarioSchema } from '../schemas/schema';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import logger from '../lib/logger';

export class ReportController {
    private reportService: ReportsService;
    private patientService: PatientService;
    private professionalService: ProfessionalService;
    private appointmentService: AppointmentService;

    constructor() {
        this.reportService = new ReportsService();
        this.patientService = new PatientService();
        this.professionalService = new ProfessionalService();
        this.appointmentService = new AppointmentService();
    }

    private async validateReportData(
        pacienteId: string,
        profissionalId: string,
        appointmentId: string,
    ): Promise<boolean> {
        const patientExists =
            await this.patientService.existsPatient(pacienteId);
        const appointmentExists =
            await this.appointmentService.existsAppointment(appointmentId);
        const professionalExists =
            await this.professionalService.existsProfessional(profissionalId);

        const isValidReportData = {
            status: patientExists && appointmentExists && professionalExists,
            pacienteId: patientExists,
            profissionalId: professionalExists,
            consultaId: appointmentExists,
        };

        logger.debug(
            `Appointment data is ${isValidReportData.status ? 'valid' : 'invalid'}: ${JSON.stringify(isValidReportData)}`,
        );

        return isValidReportData.status;
    }

    /**
     * Registers a new report for a patient.
     * @param req - The request object containing report data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the created report information or an error message.
     */
    public registerReport = catchErrors(async (req: Request, res: Response) => {
        const { prescricoes, ...reportData } = req.body;
        const reportDataParsed = ProntuarioSchema.parse(reportData);

        const isValid = await this.validateReportData(
            reportDataParsed.pacienteId,
            reportDataParsed.profissionalId,
            reportDataParsed.consultaId,
        );

        if (!isValid) {
            logger.error(`Invalid report data: ${JSON.stringify(isValid)}`);
            return res.status(BAD_REQUEST).json({
                message: 'Invalid data, cannot register report',
            });
        }

        const report = await this.reportService.registerReport(
            reportDataParsed,
            prescricoes,
        );

        if (!report) {
            logger.error(
                `Failed to register report: ${JSON.stringify(reportDataParsed)}`,
            );
            return res.status(BAD_REQUEST).json({
                message: 'Failed to register report',
            });
        }

        logger.info(
            `Report registered successfully: ${JSON.stringify(report)}`,
        );
        return res.status(CREATED).json(report);
    });

    public updateReport = catchErrors(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { prescricoes, ...reportData } = req.body;
        const reportDataParsed = ProntuarioSchema.parse(req.body);

        const isValid = await this.validateReportData(
            reportDataParsed.pacienteId,
            reportDataParsed.profissionalId,
            reportDataParsed.consultaId,
        );

        if (!isValid) {
            logger.error(`Invalid report data: ${JSON.stringify(isValid)}`);
            return res.status(BAD_REQUEST).json({
                message: 'Invalid data, cannot update report',
            });
        }
        const existingReport = await this.reportService.existsReport(id);

        if (!existingReport) {
            logger.error(`Report not found for update: ${id}`);
            return res.status(NOT_FOUND).json({
                message: 'Report does not exist, cannot update report',
            });
        }
        const updatedReport = await this.reportService.updateReport(
            id,
            reportData,
            prescricoes,
        );

        if (!updatedReport) {
            logger.error(`Failed to update report: ${id}`);
            return res.status(BAD_REQUEST).json({
                message: 'Failed to update report',
            });
        }

        logger.info(
            `Report updated successfully: ${JSON.stringify(updatedReport)}`,
        );
        res.status(OK).json(updatedReport);
        return;
    });

    public deleteReport = catchErrors(async (req: Request, res: Response) => {
        const { id } = req.params;

        const existingReport = await this.reportService.existsReport(id);

        if (!existingReport) {
            logger.error(`Report not found for deletion: ${id}`);
            return res.status(NOT_FOUND).json({
                message: 'Report does not exist',
            });
        }
        const deletedReport = await this.reportService.deleteReport(id);

        if (!deletedReport) {
            logger.error(`Failed to delete report: ${id}`);
            return res.status(BAD_REQUEST).json({
                message: 'Failed to delete report',
            });
        }

        logger.info(`Report deleted successfully: ${id}`);
        res.status(OK).json(deletedReport);
    });

    public showPatientsReports = catchErrors(
        async (req: Request, res: Response) => {
            const patientId = req.params.id;

            const existingPatient =
                await this.patientService.existsPatient(patientId);

            if (!existingPatient) {
                logger.error(`Patient not found: ${patientId}`);
                return res.status(NOT_FOUND).json({
                    message: 'Patient not found',
                });
            }

            const reports =
                await this.reportService.getPatientReportHistory(patientId);

            logger.info(
                `Total reports found for patient ${patientId}: ${reports.length}`,
            );
            res.status(OK).json(reports);
        },
    );
}
