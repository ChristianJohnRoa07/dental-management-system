import db from "@/lib/db";
import { ERROR_CODES, ERROR_MESSAGES, DYNAMIC_ERRORS } from "@/lib/constants";
import { Decimal } from "@prisma/client/runtime/client";
import { hasAppointmentsScheduledForDay } from "@/utils/checkAppointmentSchedule";

export class AppointmentService {
    static async getAll(data: {
        userId: string
    }) {

        const { userId } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        return await db.appointment.findMany({

            orderBy: { appointmentDateTime: 'desc' },
        });

    }

    static async getTodaysAppointments(data: {
        userId: string
    }) {

        const { userId } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        return await db.appointment.findMany(
            {
                where: {
                    appointmentDateTime: {
                        gte: startOfToday,
                        lte: endOfToday
                    },
                },
                orderBy: { appointmentDateTime: 'desc' },
                include: {
                    patient: true,
                    procedure: true
                }
            });

    }

    static async getAppointmentsForConfirmation(data: {
        userId: string
    }) {

        const { userId } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);

        const endOfTomorrow = new Date();
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);

        return await db.appointment.findMany(
            {
                where: {
                    appointmentDateTime: {
                        gte: startOfTomorrow,
                        lte: endOfTomorrow
                    },
                    appointmentStatus: "SCHEDULED"
                },
                orderBy: { appointmentDateTime: 'desc' },
                include: {
                    patient: true,
                    procedure: true
                }
            });

    }

    static async getAppointmentDetails(data: {
        userId: string,
        appointmentId: string;
    }) {

        const { userId, appointmentId } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        if (!appointmentId) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

        const currentAppointment = await db.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: true,
                procedure: true
            }
        });

        if (!currentAppointment) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Appointment');
            throw new Error(`${err.code}: ${err.message}`);
        }

        return currentAppointment;

    }

    static async create(data: {
        patientId: string;
        procedureId: string;
        appointmentDateTime: string;
        userId: string
    }) {

        const { patientId, procedureId, appointmentDateTime, userId, } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        if (!patientId || !procedureId || !appointmentDateTime) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

        const [currentPatient, currentProcedure] = await Promise.all([
            db.patient.findUnique({ where: { id: patientId } }),
            db.procedure.findUnique({ where: { id: procedureId } })
        ]);

        if (!currentPatient) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Patient');
            throw new Error(`${err.code}: ${err.message}`);
        }

        if (!currentProcedure) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Procedure');
            throw new Error(`${err.code}: ${err.message}`);
        }

        const isDayBooked = await hasAppointmentsScheduledForDay({
            patientId,
            appointmentDateTime
        });

        if (isDayBooked) {
            throw new Error(`${ERROR_CODES.APPOINTMENT_EXISTS_ERROR}: ${ERROR_MESSAGES.APPOINTMENT_EXISTS_ERROR}`);
        }

        return await db.appointment.create({
            data: {
                patientId: patientId,
                procedureId: procedureId,
                appointmentDateTime: new Date(appointmentDateTime),
                appointmentStatus: "SCHEDULED",
                createdBy: userId,
                updatedBy: userId
            },
        });
    }

    static async update(data: {
        appointmentId: string;
        patientId: string;
        procedureId: string;
        appointmentDateTime: string;
        userId: string
    }) {

        const { appointmentId, patientId, procedureId, appointmentDateTime, userId, } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        if (!appointmentId || !patientId || !procedureId || !appointmentDateTime) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

        const currentAppointment = await db.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!currentAppointment) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Appointment');
            throw new Error(`${err.code}: ${err.message}`);
        }

        const isDayBooked = await hasAppointmentsScheduledForDay({
            patientId,
            appointmentId,
            appointmentDateTime
        });

        if (isDayBooked) {
            throw new Error(`${ERROR_CODES.APPOINTMENT_EXISTS_ERROR}: ${ERROR_MESSAGES.APPOINTMENT_EXISTS_ERROR}`);
        }

        return await db.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                patientId: patientId,
                procedureId: procedureId,
                appointmentDateTime: new Date(appointmentDateTime),
                updatedBy: userId,
            },
        });

    }

    static async confirmAppointment(data: {
        appointmentId: string;
        userId: string
    }) {

        const { appointmentId, userId, } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        if (!appointmentId) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

        const currentAppointment = await db.appointment.findUnique({
            where: {
                id: appointmentId,
                appointmentStatus: "SCHEDULED",
            }
        });

        if (!currentAppointment) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Appointment');
            throw new Error(`${err.code}: ${err.message}`);
        }

        return await db.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                appointmentStatus: "CONFIRMED",
                updatedBy: userId,
            },
        });

    }

    static async cancelAppointment(data: {
        appointmentId: string;
        userId: string
    }) {

        const { appointmentId, userId, } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        if (!appointmentId) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

        const currentAppointment = await db.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!currentAppointment) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Appointment');
            throw new Error(`${err.code}: ${err.message}`);
        }

        return await db.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                appointmentStatus: "CANCELLED",
                updatedBy: userId,
            },
        });

    }

    static async assignProcedurePrice(data: {
        appointmentId: string;
        procedurePrice: Decimal;
        userId: string
    }) {

        const { appointmentId, procedurePrice, userId, } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        if (!appointmentId || !procedurePrice) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

        const requestingUser = await db.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!requestingUser || requestingUser.role !== 'ADMIN') {
            throw new Error(`${ERROR_CODES.FORBIDDEN_ERROR}: ${ERROR_MESSAGES.FORBIDDEN_ERROR}`);
        }

        const currentAppointment = await db.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!currentAppointment) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Appointment');
            throw new Error(`${err.code}: ${err.message}`);
        }

        if (currentAppointment.appointmentStatus === "SCHEDULED") {
            throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: Cannot assign a procedure price to a scheduled appointment. Please confirm the appointment first.`);
        }

        return await db.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                procedurePrice: procedurePrice,
                procedurePriceAssignBy: userId,
                procedurePriceAssignDateTime: new Date(),
                updatedBy: userId,
            },
        });
    }

    static async completeAppointment(data: {
        appointmentId: string;
        amountReceived: Decimal;
        userId: string
    }) {

        const { appointmentId, amountReceived, userId, } = data;

        if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

        if (!appointmentId || !amountReceived) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

        const currentAppointment = await db.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!currentAppointment) {
            const err = DYNAMIC_ERRORS.NOT_FOUND('Appointment');
            throw new Error(`${err.code}: ${err.message}`);
        }

        if (currentAppointment.appointmentStatus === "SCHEDULED") {
            throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: Cannot complete a scheduled appointment. Please confirm the appointment first.`);
        }

        return await db.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                appointmentStatus: "COMPLETED",
                amountReceived: amountReceived,
                amountReceivedById: userId,
                amountReceivedDateTime: new Date(),
                updatedBy: userId,
            },
        });

    }
}