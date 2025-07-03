import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { PacienteSchema } from '../schemas/schema';
import { PatientService } from '../services/patient.service';
import { HospitalService } from '../services/hospital.service';

export class AppointmentController {
    private patientService: PatientService;
    private hospitalService: HospitalService;
    private professionalService: any;

    constructor() {
        this.patientService = new PatientService();
        this.hospitalService = new HospitalService();
        this.professionalService = null;
    }

    /**
     * Registers a new appointment for a patient.
     * @param req - The request object containing patient data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the created patient information or an error message.
     */
    public registerAppointment = catchErrors(
        async (req: Request, res: Response) => {},
    );

    /**
     * Updates an existing appointment.
     * @param req - The request object containing the updated appointment data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the updated appointment or an error message.
     */
    public updateAppointmentData = catchErrors(
        async (req: Request, res: Response) => {},
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
}
