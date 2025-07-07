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
import { AppointmentService } from '../services/appointment.service';
import { ProfissionalSchema } from '../schemas/schema';
import { ProfessionalService } from '../services/professional.service';

export class ProfessionalController {
    private patientService: PatientService;
    private hospitalService: HospitalService;
    private appointmentsService: AppointmentService;
    private professionalService: ProfessionalService;

    constructor() {
        this.patientService = new PatientService();
        this.hospitalService = new HospitalService();
        this.appointmentsService = new AppointmentService();
        this.professionalService = new ProfessionalService();
    }

    /**
     * Registers a new patient in the system.
     * @param req - The request object containing patient data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the created patient information or an error message.
     */
    public registerProfessional = catchErrors(
        async (req: Request, res: Response) => {
            const request = ProfissionalSchema.parse(req.body);

            const hospitalUnit = this.hospitalService.findById(
                request.unidadeId,
            );

            if (!hospitalUnit) {
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }
            const profissional =
                await this.professionalService.registerProfessional(request);

            if (!profissional) {
                res.status(BAD_REQUEST).json({
                    msg: 'Error registering professional',
                });
                return;
            }

            res.status(CREATED).json({
                msg: 'Professional registered successfully',
                profissional,
            });
            return;
        },
    );

    /**
     * Updates the professional's information.
     * @param req - The request object containing updated professional data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the updated professional information or an error message.
     */
    public updateProfessionalData = catchErrors(
        async (req: Request, res: Response) => {},
    );

    /**
     * Retrieves appointments for a specific professional.
     * @param req - The request object containing the professional's ID.
     * @param res - The response object to send back the appointments.
     * @returns A JSON response with the professional's appointments or an error message.
     */
    public showAppointments = catchErrors(
        async (req: Request, res: Response) => {},
    );
}
