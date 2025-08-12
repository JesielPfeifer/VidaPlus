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

export class ReportController {
    private prescriptionService: PrescriptionService;
    private reportService: ReportsService;
    private patientService: PatientService;
    private professionalService: ProfessionalService;
    private appointmentService: AppointmentService;

    constructor() {
        this.prescriptionService = new PrescriptionService();
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

        return patientExists && appointmentExists && professionalExists;
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
            return res.status(BAD_REQUEST).json({
                message: 'Invalid data, cannot register report',
            });
        }

        const report = await this.reportService.registerReport(
            reportDataParsed,
            prescricoes,
        );

        if (!report) {
            return res.status(BAD_REQUEST).json({
                message: 'Failed to register report',
            });
        }

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
            return res.status(BAD_REQUEST).json({
                message: 'Invalid data, cannot update report',
            });
        }
        const existingReport = await this.reportService.existsReport(id);

        if (!existingReport) {
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
            return res.status(BAD_REQUEST).json({
                message: 'Failed to update report',
            });
        }

        res.status(OK).json(updatedReport);
        return;
    });

    public deleteReport = catchErrors(async (req: Request, res: Response) => {
        const { id } = req.params;

        const existingPrescription =
            await this.prescriptionService.existsPrescription(id);

        if (!existingPrescription) {
            return res.status(NOT_FOUND).json({
                message: 'Prescription does not exist',
            });
        }

        const deletedPrescription =
            await this.prescriptionService.deletePrescription(id);

        if (!deletedPrescription) {
            return res.status(BAD_REQUEST).json({
                message: 'Failed to delete prescription',
            });
        }

        res.status(OK).json(deletedPrescription);
    });

    public showPatientsReports = catchErrors(
        async (req: Request, res: Response) => {
            const patientId = req.params.id;

            const existingPatient =
                await this.patientService.existsPatient(patientId);

            if (!existingPatient) {
                return res.status(NOT_FOUND).json({
                    message: 'Patient not found',
                });
            }

            const reports =
                await this.reportService.getPatientReportHistory(patientId);

            res.status(OK).json(reports);
        },
    );
}
