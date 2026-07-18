import { NextResponse } from 'next/server';
import path from 'path';
import { AppointmentService } from '@/app/services/appointments/appointment.services';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { isTokenBlacklisted } from '@/utils/validateToken';
import { generateRelativePath } from '@/utils/generateRelativePath';

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: Promise<{ id: string }> | { id: string };
}

// GET /api/appointments/[id] - Fetch all appointments
export async function GET(request: Request,
    { params }: RouteParams
) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (token && await isTokenBlacklisted(token)) {

        return NextResponse.json(
            {
                status: ERROR_CODES.INVALID_TOKEN,
                message: ERROR_MESSAGES.INVALID_TOKEN
            },
            { status: 401 }
        );
    }

    try {
        const userId = request.headers.get('x-user-id');

        const resolvedParams = await params;
        const appointmentId = resolvedParams.id;

        const appointment = await AppointmentService.getAppointmentDetails({ userId, appointmentId });

        return NextResponse.json({ status: 'success', data: appointment });
    } catch (error: any) {
        const errorMessage = error.message || '';

        return NextResponse.json(
            { status: 'error', message: `${errorMessage}` },
            { status: 500 }
        );
    }
}

// PUT /api/appointments/[id] - Update appointment details
export async function PUT(
    request: Request,
    { params }: RouteParams
) {

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (token && await isTokenBlacklisted(token)) {
        return NextResponse.json(
            {
                status: ERROR_CODES.INVALID_TOKEN,
                message: ERROR_MESSAGES.INVALID_TOKEN
            },
            { status: 401 }
        );
    }

    try {
        const userId = request.headers.get('x-user-id')!;

        const resolvedParams = await params;
        const appointmentId = resolvedParams.id;
        const body = await request.json();

        const updatedAppointment = await AppointmentService.update({ ...body, appointmentId, userId });

        return NextResponse.json({ status: 'success', data: updatedAppointment }, { status: 200 });
    } catch (error: any) {
        const errorMessage = error.message || '';

        if (errorMessage.includes(ERROR_CODES.VALIDATION_ERROR)) {
            return NextResponse.json({ status: 'error', message: errorMessage }, { status: 400 });
        }

        if (errorMessage.includes(ERROR_CODES.CONFLICT_ERROR)) {
            return NextResponse.json({ status: 'error', message: errorMessage }, { status: 409 });
        }

        return NextResponse.json(
            { status: 'error', message: `${errorMessage}` },
            { status: 500 }
        );
    }
}

// PATCH /api/appointments/[id] - Perform status transition updates
export async function PATCH(
    request: Request,
    { params }: RouteParams
) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (token && await isTokenBlacklisted(token)) {
        return NextResponse.json(
            {
                status: ERROR_CODES.INVALID_TOKEN,
                message: ERROR_MESSAGES.INVALID_TOKEN
            },
            { status: 401 }
        );
    }

    try {
        const userId = request.headers.get('x-user-id')!;
        const resolvedParams = await params;
        const appointmentId = resolvedParams.id;
        
        const body = await request.json();
        const { action, procedurePrice, amountReceived, } = body;

        if (!action) {
            return NextResponse.json(
                { status: 'error', message: `${ERROR_CODES.VALIDATION_ERROR}: Missing 'action' field in request body.` },
                { status: 400 }
            );
        }

        let result;

        switch (action) {
            case 'confirm':
                result = await AppointmentService.confirmAppointment({ appointmentId, userId });
                break;
            case 'cancel':
                result = await AppointmentService.cancelAppointment({ appointmentId, userId });
                break;
            case 'assignProcedurePrice':
                result = await AppointmentService.assignProcedurePrice({ appointmentId, procedurePrice, userId });
                break;
            case 'complete':
                result = await AppointmentService.completeAppointment({ appointmentId, amountReceived, userId });
                break;
            default:
                return NextResponse.json(
                    { status: 'error', message: `${ERROR_CODES.VALIDATION_ERROR}: Invalid action type.` },
                    { status: 400 }
                );
        }

        return NextResponse.json({ status: 'success', data: result }, { status: 200 });
    } catch (error: any) {
        const errorMessage = error.message || '';

        if (errorMessage.includes(ERROR_CODES.VALIDATION_ERROR)) {
            return NextResponse.json({ status: 'error', message: errorMessage }, { status: 400 });
        }

        if (errorMessage.includes('NOT_FOUND')) {
            return NextResponse.json({ status: 'error', message: errorMessage }, { status: 404 });
        }

        return NextResponse.json(
            { status: 'error', message: `${errorMessage}` },
            { status: 500 }
        );
    }
}