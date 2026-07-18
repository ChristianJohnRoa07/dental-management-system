import db from "@/lib/db";

export async function hasAppointmentsScheduledForDay(data: {
    patientId: string;
    appointmentDateTime: string;
    appointmentId?: string;
}): Promise<boolean> {
    const { patientId, appointmentId, appointmentDateTime } = data;

    const targetDateTime = new Date(appointmentDateTime);

    const startOfTargetDay = new Date(targetDateTime);
    startOfTargetDay.setHours(0, 0, 0, 0);

    const endOfTargetDay = new Date(targetDateTime);
    endOfTargetDay.setHours(23, 59, 59, 999);

    const existingAppointment = await db.appointment.findFirst({
        where: {
            ...(appointmentId && { id: { not: appointmentId } }),
            appointmentStatus: {
                in: ["SCHEDULED", "CONFIRMED"]
            },
            OR: [
                {
                    appointmentDateTime: targetDateTime
                },
                {
                    patientId: patientId,
                    appointmentDateTime: {
                        gte: startOfTargetDay,
                        lte: endOfTargetDay
                    }
                }
            ]
        }
    });

    return !!existingAppointment;
}