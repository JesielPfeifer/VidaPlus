import { Request, Response } from 'express';
import catchErrors from '../utils/catchError';
import {
    BAD_REQUEST,
    CREATED,
    NOT_FOUND,
    OK,
} from '../constants/httpCodes.constant';
import { InternacaoSchema, PacienteSchema } from '../schemas/schema';
import { PatientService } from '../services/patient.service';
import { HospitalService } from '../services/hospital.service';
import { AppointmentService } from '../services/appointment.service';

export class PatientController {
    private patientService: PatientService;
    private hospitalService: HospitalService;

    constructor() {
        this.patientService = new PatientService();
        this.hospitalService = new HospitalService();
    }

    /**
     * Registers a new patient in the system.
     * @param req - The request object containing patient data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the created patient information or an error message.
     */
    public registerPatient = catchErrors(
        async (req: Request, res: Response) => {
            const request = PacienteSchema.parse(req.body);
            const { nome, cpf, email, dataNascimento } = request;

            const hospitalUnit = await this.hospitalService.findById(
                request.unidadeId,
            );

            if (!hospitalUnit) {
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }
            const paciente = await this.patientService.registerPatient({
                ...request,
                nome,
                cpf,
                email,
                dataNascimento: new Date(dataNascimento),
                unidadeId: hospitalUnit.id,
            });
            if (!paciente) {
                res.status(BAD_REQUEST).json({
                    msg: 'Error registering patient',
                });
                return;
            }
            res.status(CREATED).json(paciente);
            return;
        },
    );

    /**
     * Updates patient information.
     * @param req - The request object containing updated patient data.
     * @param res - The response object to send back the result.
     * @returns A JSON response with the updated patient information or an error message.
     */
    public updateInfos = catchErrors(async (req: Request, res: Response) => {
        const request = PacienteSchema.parse(req.body);
        const { cpf, nome, email } = request;

        const patient = await this.patientService.findByCpf(cpf);

        if (!patient) {
            res.status(NOT_FOUND).json({ msg: 'Patient not found' });
            return;
        }

        const updatedPatient = await this.patientService.updatePatientData(
            cpf,
            {
                ...request,
                nome,
                email,
                telefone: request.telefone,
                dataNascimento: new Date(request.dataNascimento),
                genero: request.genero,
            },
        );
        if (!updatedPatient) {
            res.status(BAD_REQUEST).json({
                msg: 'Error updating patient information',
            });
            return;
        }
        res.status(OK).json(updatedPatient);
    });

    /**
     * Deletes a patient by their ID.
     * @param req - The request object containing the patient's ID.
     * @returns A JSON response indicating the success or failure of the deletion.
     */
    public deletePatient = catchErrors(async (req: Request, res: Response) => {
        const patientId = req.params.id;

        const patient = await this.patientService.findPatientById(patientId);

        if (!patient) {
            res.status(NOT_FOUND).json({ msg: 'Patient not found' });
            return;
        }

        const deletedPatient =
            await this.patientService.deletePatienById(patientId);

        if (!deletedPatient) {
            res.status(BAD_REQUEST).json({
                msg: 'Error deleting patient',
            });
            return;
        }

        res.status(OK).json({ msg: 'Patient deleted successfully' });
        return;
    });
    /**
     * Get a patient's data by their CPF.
     * @param req - The request object containing the patient's CPF.
     * @returns A JSON response with the patient's data or an error message.
     */
    public getPatientData = catchErrors(async (req: Request, res: Response) => {
        const patientCpf = req.body.cpf;

        const patient = await this.patientService.findByCpf(patientCpf);

        if (!patient) {
            res.status(NOT_FOUND).json({ msg: 'Patient not found' });
            return;
        }

        res.status(OK).json({ ...patient });
        return;
    });

    public registerPatientHospitalization = catchErrors(
        async (req: Request, res: Response) => {
            const request = InternacaoSchema.parse(req.body);
            const { dataEntrada, dataSaida } = request;

            const patient = await this.patientService.findPatientById(
                request.pacienteId,
            );
            if (!patient) {
                res.status(NOT_FOUND).json({ msg: 'Patient not found' });
                return;
            }

            const hospitalUnit = await this.hospitalService.findById(
                request.unidadeId,
            );
            if (!hospitalUnit) {
                res.status(NOT_FOUND).json({ msg: 'Hospital unit not found' });
                return;
            }

            const hospitalization =
                await this.patientService.registerHospitalization({
                    ...request,
                    dataEntrada: new Date(dataEntrada),
                    dataSaida: dataSaida ? new Date(dataSaida) : null,
                });

            res.status(CREATED).json(hospitalization);
        },
    );
}
