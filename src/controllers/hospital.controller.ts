import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import { HospitalService } from '../services/hospital.service';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { UnidadeSchema } from '../schemas/schema';
import logger from '../lib/logger';

export class HospitalController {
    private hospitalService: HospitalService;

    constructor() {
        this.hospitalService = new HospitalService();
    }

    public createHospitalUnit = catchErrors(
        async (req: Request, res: Response) => {
            const request = UnidadeSchema.parse(req.body);

            const existingHospitalUnit =
                await this.hospitalService.hospitalUnitNameInUse(request.nome);

            if (existingHospitalUnit) {
                logger.error(`Hospital unit already exists: ${request.nome}`);
                res.status(BAD_REQUEST).json({
                    msg: 'Hospital unit already exists',
                });
                return;
            }

            const hospital = await this.hospitalService.createUnit(request);

            logger.info(`Hospital unit created successfully: ${hospital}`);
            res.status(CREATED).json(hospital);
            return;
        },
    );

    /**
     * Updates an existing hospital unit.
     * @param req - The request object containing the updated hospital unit data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the updated hospital unit or an error message.
     * @throws {Error} If the hospital unit does not exist or if there are no changes detected.
     */
    public updateHospitalUnit = catchErrors(
        async (req: Request, res: Response) => {
            const hospitalId = req.params.id;
            const request = UnidadeSchema.parse(req.body);

            const hospitalUnit = await this.hospitalService.findById(
                hospitalId,
            );

            if (!hospitalUnit) {
                logger.error(
                    `Hospital unit not found for update: ${request.nome}`,
                );
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }

            if (
                hospitalUnit.endereco === request.endereco &&
                hospitalUnit.nome === request.nome
            ) {
                logger.info(
                    `No changes detected for hospital unit: ${request.nome}`,
                );
                res.status(200).json({
                    msg: 'No changes detected for the hospital unit',
                });
                return;
            }

            const updatedHospitalUnit = await this.hospitalService.updateUnit(
                hospitalUnit.id,
                {
                    nome: request.nome,
                    endereco: request.endereco,
                },
            );

            logger.info(`Hospital unit updated successfully: ${request.nome}`);
            res.json(updatedHospitalUnit);
            return;
        },
    );

    public deleteHospitalUnit = catchErrors(
        async (req: Request, res: Response) => {
            const hospitalId = req.params.id;

            const deleteStatus =
                await this.hospitalService.deleteUnit(hospitalId);

            if (!deleteStatus) {
                logger.error(`Failed to delete hospital unit: ${hospitalId}`);
                res.status(BAD_REQUEST).json({
                    msg: 'Failed to delete hospital unit',
                });
                return;
            }

            logger.info(`Hospital unit deleted successfully: ${hospitalId}`);
            res.status(200).json({
                msg: 'Hospital unit deleted successfully',
            });
            return;
        },
    );
    public getHospitalUnits = catchErrors(
        async (req: Request, res: Response) => {
            const hospitalUnits = await this.hospitalService.findAllUnits();

            if (!hospitalUnits || hospitalUnits.length === 0) {
                logger.info('No hospital units found');
                res.status(NOT_FOUND).json({
                    msg: 'There are no hospital units registered',
                });
                return;
            }
            logger.info(
                `Total hospital units found: ${hospitalUnits.length}. Hospital data: ${JSON.stringify(hospitalUnits)}`,
            );
            res.status(OK).json({ hospitalUnits });
        },
    );

    public getHospitalBeds = catchErrors(
        async (req: Request, res: Response) => {
            const hospitalId = req.params.id;

            const hospitalBeds =
                await this.hospitalService.getHospitalBeds(hospitalId);

            if (!hospitalBeds || hospitalBeds.length === 0) {
                logger.info(
                    `No hospital beds found for hospital: ${hospitalId}`,
                );
                res.status(NOT_FOUND).json({
                    msg: 'There are no hospital beds registered',
                });
                return;
            }

            const totalBedsUsed = hospitalBeds.length;
            logger.info(
                `${totalBedsUsed} beds used in hospital ${hospitalBeds[0].unidade.nome}: `,
            );
            res.status(OK).json({ totalBedsUsed: totalBedsUsed, hospitalBeds });
        },
    );
}
