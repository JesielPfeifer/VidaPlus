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
        async (req: Request, res: Response) => {
            const request = ProfissionalSchema.parse(req.body);

            const professionalData =
                await this.professionalService.getProfessionalDataById(
                    req.params.id,
                );

            if (!professionalData) {
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }
            const updatedProfessional =
                await this.professionalService.updateProfessionalData(
                    professionalData.id,
                    request,
                );

            if (!updatedProfessional) {
                res.status(BAD_REQUEST).json({
                    msg: 'Error updating professional data',
                });
                return;
            }
            res.status(OK).json({
                msg: 'Professional data updated successfully',
                updatedProfessional,
            });
            return;
        },
    );

    /**
     * Retrieves professional data by COREM, CRM or even ID.
     * @param req - The request object containing the professional's ID, COREM or CRM.
     * @param res - The response object to send back the professional data.
     * @returns A JSON response with the professional's data or an error message.
     */
    public getProfessionalData = catchErrors(
        async (req: Request, res: Response) => {
            const professionalData =
                await this.professionalService.getProfessionalDataById(
                    req.params.id,
                );

            if (!professionalData) {
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }
            res.status(OK).json(professionalData);
            return;
        },
    );

    /**
     * Retrieves all professional registered at hospital unit.
     * @param req - The request object containing the professional's ID, COREM or CRM.
     * @param res - The response object to send back the professional data.
     * @returns A JSON response with the professional's data or an error message.
     */
    public getAllProfessionalAtHospital = catchErrors(
        async (req: Request, res: Response) => {
            const { unidadeId } = req.body;

            const hospitalUnit = await this.hospitalService.findById(unidadeId);

            if (!hospitalUnit) {
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }

            const allProfessionals =
                await this.professionalService.getAllProfessionalsbyHospitalId(
                    unidadeId,
                );

            if (!allProfessionals) {
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }

            res.status(OK).json(allProfessionals);
            return;
        },
    );

    /**
     * Deletes a professional by their ID.
     * @param req - The request object containing the professional's ID.
     * @param res - The response object to send back the result.
     * @returns A JSON response indicating success or failure of the deletion.
     */
    public deleteProfessional = catchErrors(
        async (req: Request, res: Response) => {
            const professionalId = req.params.id;

            const professionalData =
                await this.professionalService.getProfessionalDataById(
                    professionalId,
                );

            if (!professionalData) {
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }

            await this.professionalService.deleteProfessional(
                professionalData.id,
            );

            res.status(OK).json({
                msg: 'Professional deleted successfully',
            });
            return;
        },
    );
}
