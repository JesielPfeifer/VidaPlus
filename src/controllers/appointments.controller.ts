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

            console.log('Creating appointment with data:', {
                pacienteId,
                profissionalId,
                unidadeId,
                ...params,
            });

            const appointment =
                await this.appointmentService.registerAppointment({
                    pacienteId,
                    profissionalId,
                    unidadeId,
                    ...params,
                });

            if (!appointment) {
                return res.status(BAD_REQUEST).json({
                    message: 'Failed to register appointment',
                });
            } else {
                const calendarAppointment =
                    await this.appointmentService.registerCalendarAppointment({
                        dataHora: appointment.data,
                        pacienteId,
                        profissionalId,
                        tipo: appointment.tipo,
                        status: appointment.status,
                    });
                if (!calendarAppointment) {
                    console.log('Failed to create calendar appointment');
                }
            }

            return res.status(CREATED).json({
                ...appointment,
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
            const appointmentId = req.params.id;
            const request = ConsultaSchema.parse(req.body);

            const hasValidData = await this.validateAppointmentData(
                request.pacienteId,
                request.profissionalId,
                request.unidadeId,
            );

            if (!hasValidData) {
                return res.status(NOT_FOUND).json({
                    message: 'Invalid data provided.',
                });
            }

            const updatedAppointment =
                await this.appointmentService.updateAppointmentData(
                    appointmentId,
                    request,
                );

            if (!updatedAppointment) {
                return res.status(NOT_FOUND).json({
                    message: 'Appointment not found.',
                });
            }

            return res.status(OK).json({
                message: 'Appointment updated successfully.',
            });
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
     * Retrieves appointments for a specific professional.
     * @param req - The request object containing the professional's ID.
     * @param res - The response object to send back the appointments.
     * @returns A JSON response with the professional's appointments or an error message.
     */
    public showProfessionalAppointments = catchErrors(
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

            const appointments =
                await this.appointmentService.getAppointmentsByProfessionalId(
                    professionalId,
                );

            if (!appointments) {
                res.status(NOT_FOUND).json({
                    msg: 'No appointments found for this professional',
                });
                return;
            }

            res.status(OK).json(appointments);
            return;
        },
    );

    /**
     * Retrieves all appointments for a patient based on their CPF.
     * @param req - The request object containing the patient's CPF.
     * @param res - The response object to send back the appointments.
     * @returns A JSON response with the patient's appointments or an error message.
     */
    public showPatientAppointments = catchErrors(
        async (req: Request, res: Response) => {
            const patientId = req.params.id;

            const patient =
                await this.patientService.findPatientById(patientId);

            if (!patient) {
                res.status(NOT_FOUND).json({ msg: 'Patient not found' });
                return;
            }

            const appointments =
                await this.appointmentService.findPatientAppointments(
                    patient.id,
                );

            if (appointments?.length === 0) {
                res.status(NOT_FOUND).json({
                    msg: 'Patient has no appointments',
                });
                return;
            }

            res.json(appointments);
        },
    );

    /**
     * Deletes an appointment.
     * @param req - The request object containing the appointment ID.
     * @param res - The response object to send back the result.
     * @returns A JSON response indicating success or failure of the deletion.
     */
    public deleteAppointment = catchErrors(
        async (req: Request, res: Response) => {
            const appointmentId = req.params.id;

            const deleted =
                await this.appointmentService.deleteAppointment(appointmentId);

            if (!deleted) {
                res.status(NOT_FOUND).json({ msg: 'Appointment not found' });
                return;
            }

            res.status(OK).json({ msg: 'Appointment deleted successfully' });
            return;
        },
    );
}
