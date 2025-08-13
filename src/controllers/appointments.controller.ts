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
import { ConsultaSchema, ConsultaSchemaUpdate } from '../schemas/schema';
import { ProfessionalService } from '../services/professional.service';
import { AppointmentService } from '../services/appointment.service';
import logger from '../lib/logger';

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

        const isValid = {
            status: patientExists && hospitalUnitExists && professionalExists,
            pacienteId: patientExists,
            profissionalId: professionalExists,
            unidadeId: hospitalUnitExists,
        };

        logger.debug(
            `Appointment data is ${isValid.status ? 'valid' : 'invalid'}: ${JSON.stringify(isValid)}`,
        );

        return isValid.status;
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
            const { pacienteId, profissionalId, unidadeId, online, ...params } =
                request;

            const hasValidData = await this.validateAppointmentData(
                pacienteId,
                profissionalId,
                unidadeId,
            );

            if (!hasValidData) {
                logger.error(
                    'Invalid data provided for appointment registration',
                );
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

            if (!appointment) {
                logger.error('Failed to register appointment');
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
                logger.info(
                    `Calendar appointment registered successfully: ${JSON.stringify(calendarAppointment)}`,
                );
                if (!calendarAppointment) {
                    logger.error('Failed to create calendar appointment');
                }

                if (online) {
                    const telemedicina =
                        await this.appointmentService.registerTelemedicina({
                            consultaId: appointment.id,
                            linkVideo: `https://vidaplus.com.br/videochamada/${appointment.id}`,
                            tokenAcesso: 'abcdef123456',
                        });
                    if (!telemedicina) {
                        logger.error('Failed to create telemedicine record');
                    }
                }
            }

            logger.info(
                `Appointment registered successfully: ${JSON.stringify(appointment)}`,
            );
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
            const request = ConsultaSchema.parse(req.body);
            const appointmentId = req.params.id;
            const {
                pacienteId,
                profissionalId,
                unidadeId,
                online,
                ...appointmentData
            } = request;

            const hasValidData = await this.validateAppointmentData(
                request.pacienteId,
                request.profissionalId,
                request.unidadeId,
            );

            if (!hasValidData) {
                logger.error('Invalid data provided for appointment update');
                return res.status(NOT_FOUND).json({
                    message: 'Invalid data provided.',
                });
            }

            const updatedAppointment =
                await this.appointmentService.updateAppointmentData(
                    appointmentId,
                    appointmentData,
                );

            if (!updatedAppointment) {
                logger.error('Failed to update appointment');
                return res.status(BAD_REQUEST).json({
                    message: 'Failed to update appointment',
                });
            } else {
                const calendarAppointment =
                    await this.appointmentService.updateCalendarAppointment(
                        updatedAppointment.id,
                        {
                            dataHora: updatedAppointment.data,
                            tipo: updatedAppointment.tipo,
                            status: updatedAppointment.status,
                        },
                    );
                logger.info(
                    `Calendar appointment updated successfully: ${JSON.stringify(calendarAppointment)}`,
                );
                if (!calendarAppointment) {
                    logger.error('Failed to update calendar appointment');
                }
            }

            logger.info(
                `Appointment updated successfully: ${JSON.stringify(updatedAppointment)}`,
            );
            return res.status(OK).json({
                message: 'Appointment updated successfully.',
            });
        },
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
                logger.error('Professional not found');
                res.status(NOT_FOUND).json({ msg: 'Professional not found' });
                return;
            }

            const appointments =
                await this.appointmentService.getAppointmentsByProfessionalId(
                    professionalId,
                );

            if (!appointments) {
                logger.error('No appointments found for this professional');
                res.status(NOT_FOUND).json({
                    msg: 'No appointments found for this professional',
                });
                return;
            }

            logger.info(
                `${appointments.length} appointments found for professional ${professionalData.nome}`,
            );
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
                logger.error('Patient not found');
                res.status(NOT_FOUND).json({ msg: 'Patient not found' });
                return;
            }

            const appointments =
                await this.appointmentService.findPatientAppointments(
                    patient.id,
                );

            if (appointments?.length === 0) {
                logger.info('Patient has no appointments');
                res.status(NOT_FOUND).json({
                    msg: 'Patient has no appointments',
                });
                return;
            }

            logger.info(
                `${appointments.length} appointments found for patient ${patient.nome}`,
            );
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
                logger.error('Appointment not found or could not be deleted');
                res.status(NOT_FOUND).json({ msg: 'Appointment not found' });
                return;
            }

            const hasCalendarAppointment =
                await this.appointmentService.hasCalendarAppointment(
                    appointmentId,
                );

            if (hasCalendarAppointment) {
                const calendarDeleted =
                    await this.appointmentService.deleteCalendarAppointment(
                        appointmentId,
                    );
                if (!calendarDeleted) {
                    logger.error('Failed to delete calendar appointment');
                    res.status(BAD_REQUEST).json({
                        msg: 'Failed to delete calendar appointment',
                    });
                    return;
                }
                logger.info('Calendar appointment deleted successfully');
            }

            logger.info('Appointment deleted successfully');
            res.status(OK).json({ msg: 'Appointment deleted successfully' });
            return;
        },
    );
}
