import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { PatientService } from '../services/patient.service';
import { HospitalService } from '../services/hospital.service';
import { ConsultaSchema } from '../schemas/schema';
import { ProfessionalService } from '../services/professional.service';
import { AppointmentService } from '../services/appointment.service';

export class AppointmentController {
    private patientService: PatientService;
    private hospitalService: HospitalService;
    private professionalService: ProfessionalService;
    private appointmentService: AppointmentService;

    constructor() {
        this.patientService = new PatientService();
        this.hospitalService = new HospitalService();
        this.professionalService = new ProfessionalService();
        this.appointmentService = new AppointmentService();
    }

    private async validateAppointmentData(
        pacienteId: string,
        profissionalId: string,
        unidadeId: string,
    ): Promise<boolean> {
        const patientExists =
            await this.patientService.existsPatient(pacienteId);
        const hospitalUnitExists =
            await this.hospitalService.existsHospitalUnit(unidadeId);
        const professionalExists =
            await this.professionalService.existsProfessional(profissionalId);

        return patientExists && hospitalUnitExists && professionalExists;
    }
    /**
     * Registers a new appointment for a patient.
     * @param req - The request object containing patient data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the created patient information or an error message.
     */
    public registerAppointment = catchErrors(
        async (req: Request, res: Response) => {
            const request = ConsultaSchema.parse(req.body);
            const { pacienteId, profissionalId, unidadeId, ...params } =
                request;

            const hasValidData = await this.validateAppointmentData(
                pacienteId,
                profissionalId,
                unidadeId,
            );

            if (!hasValidData) {
                return res.status(NOT_FOUND).json({
                    message: 'Invalid data provided.',
                });
            }
            const appointment =
                await this.appointmentService.registerAppointment({
                    pacienteId,
                    profissionalId,
                    unidadeId,
                    ...params,
                });

            return res.status(CREATED).json({
                message: 'Appointment registered successfully.',
                appointment,
            });
        },
    );

    /**
     * Updates an existing appointment.
     * @param req - The request object containing the updated appointment data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the updated appointment or an error message.
     */
    public updateAppointmentData = catchErrors(
        async (req: Request, res: Response) => {
            const request = ConsultaSchema.parse(req.body);
            
        },
    );

    /**
     * Retrieves appointments for a specific patient.
     * @param req - The request object containing the patient's CPF.
     * @param res - The response object to send back the appointments.
     * @returns A JSON response with the patient's appointments or an error message.
     */
    public showAppointments = catchErrors(
        async (req: Request, res: Response) => {},
    );

    /**
     * Deletes an appointment.
     * @param req - The request object containing the appointment ID.
     * @param res - The response object to send back the result.
     * @returns A JSON response indicating success or failure of the deletion.
     */
    public deleteAppointment = catchErrors(
        async (req: Request, res: Response) => {},
    );
}
