import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { HospitalService } from '../services/hospital.service';
import { ProfissionalSchema } from '../schemas/schema';
import { ProfessionalService } from '../services/professional.service';
import logger from '../lib/logger';

export class ProfessionalController {
    private hospitalService: HospitalService;
    private professionalService: ProfessionalService;

    constructor() {
        this.hospitalService = new HospitalService();
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
                logger.error(`Hospital unit not found: ${request.unidadeId}`);
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }
            const profissional =
                await this.professionalService.registerProfessional(request);

            if (!profissional) {
                logger.error(
                    `Error registering professional: ${JSON.stringify(
                        request,
                    )}`,
                );
                res.status(BAD_REQUEST).json({
                    msg: 'Error registering professional',
                });
                return;
            }

            logger.info(
                `Professional registered successfully: ${profissional}`,
            );
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
                logger.error(`Professional not found: ${req.params.id}`);
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }

            const updatedProfessional =
                await this.professionalService.updateProfessionalData(
                    professionalData.id,
                    request,
                );

            if (!updatedProfessional) {
                logger.error(
                    `Error updating professional data: ${JSON.stringify(
                        request,
                    )}`,
                );
                res.status(BAD_REQUEST).json({
                    msg: 'Error updating professional data',
                });
                return;
            }

            logger.info(
                `Professional data updated successfully: ${updatedProfessional}`,
            );
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
                logger.error(`Professional not found: ${req.params.id}`);
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }

            logger.info(`Professional data retrieved successfully`);
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
                logger.error(`Hospital unit not found: ${unidadeId}`);
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }

            const allProfessionals =
                await this.professionalService.getAllProfessionalsbyHospitalId(
                    unidadeId,
                );

            if (!allProfessionals) {
                logger.error(
                    `No professionals found for hospital unit: ${unidadeId}`,
                );
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }

            logger.info(
                `Total professionals found for hospital unit ${hospitalUnit.nome}: ${allProfessionals.length}`,
            );
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
                logger.error(`Professional not found: ${professionalId}`);
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }

            await this.professionalService.deleteProfessional(
                professionalData.id,
            );

            logger.info(`Professional deleted successfully: ${professionalId}`);
            res.status(OK).json({
                msg: 'Professional deleted successfully',
            });
            return;
        },
    );
}
