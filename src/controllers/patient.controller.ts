import { Request, Response } from 'express';
import prisma from '../lib/prisma';
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
import { AppointmentService } from '../services/appointment.service';

export class PatientController {
    private patientService: PatientService;
    private hospitalService: HospitalService;
    private appointmentsService: AppointmentService;

    constructor() {
        this.patientService = new PatientService();
        this.hospitalService = new HospitalService();
        this.appointmentsService = new AppointmentService();
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
     * Retrieves all appointments for a patient based on their CPF.
     * @param req - The request object containing the patient's CPF.
     * @param res - The response object to send back the appointments.
     * @returns A JSON response with the patient's appointments or an error message.
     */
    public showAppointments = catchErrors(
        async (req: Request, res: Response) => {
            const request = PacienteSchema.parse(req.body);
            const { cpf } = request;

            const patient = await this.patientService.findByCpf(cpf);

            if (!patient) {
                res.status(NOT_FOUND).json({ msg: 'Patient not found' });
                return;
            }

            const appointments =
                await this.appointmentsService.findPatientAppointments(
                    patient?.id,
                );

            if (appointments.length === 0) {
                res.status(NOT_FOUND).json({
                    msg: 'Patient has no appointments',
                });
                return;
            }

            res.json(appointments);
        },
    );
}
