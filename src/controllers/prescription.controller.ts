import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import { PrescriptionService } from '../services/prescription.service';
import { ReportsService } from '../services/reports.service';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { PrescricaoSchema } from '../schemas/schema';

export class PrescriptionController {
    private prescriptionService: PrescriptionService;
    private reportService: ReportsService;

    constructor() {
        this.prescriptionService = new PrescriptionService();
        this.reportService = new ReportsService();
    }

    public registerPrescription = catchErrors(
        async (req: Request, res: Response) => {
            const request = PrescricaoSchema.parse(req.body);

            const existingReport = await this.reportService.existsReport(
                request.prontuarioId,
            );

            if (!existingReport) {
                return res.status(NOT_FOUND).json({
                    message:
                        'Report does not exist, cannot register prescription',
                });
            }

            const prescription =
                await this.prescriptionService.registerPrescription(request);

            if (!prescription) {
                return res.status(BAD_REQUEST).json({
                    message: 'Failed to register prescription',
                });
            }

            res.status(CREATED).json(prescription);
        },
    );

    public updatePrescription = catchErrors(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const request = PrescricaoSchema.parse(req.body);

            const existingPrescription =
                await this.prescriptionService.existsPrescription(id);

            if (!existingPrescription) {
                return res.status(NOT_FOUND).json({
                    message:
                        'Prescription does not exist, cannot update prescription',
                });
            }

            const prescription =
                await this.prescriptionService.updatePrescription(id, request);

            if (!prescription) {
                return res.status(BAD_REQUEST).json({
                    message: 'Failed to update prescription',
                });
            }

            res.status(OK).json(prescription);
        },
    );

    public deletePrescription = catchErrors(
        async (req: Request, res: Response) => {
            const { id } = req.params;

            const existingPrescription =
                await this.prescriptionService.existsPrescription(id);

            if (!existingPrescription) {
                return res.status(NOT_FOUND).json({
                    message:
                        'Prescription does not exist, cannot delete prescription',
                });
            }

            await this.prescriptionService.deletePrescription(id);

            if (!existingPrescription) {
                return res.status(BAD_REQUEST).json({
                    message: 'Failed to delete prescription',
                });
            }

            res.status(OK).json({
                message: 'Prescription deleted successfully',
            });
        },
    );
}
