import { NextResponse } from 'next/server';
import { AppointmentService } from '@/app/services/appointments/appointment.services';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { isTokenBlacklisted } from '@/lib/hooks/api/validateToken';

export const dynamic = 'force-dynamic';

// GET /api/appointments - Fetch all appointments
export async function GET(request: Request) {

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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let result;

    if (type === 'TODAY') {
      result = await AppointmentService.getTodaysAppointments({ userId });
    } else if (type === 'SCHEDULED') {
      result = await AppointmentService.getAppointmentsForConfirmation({ userId });
    } else {
      // If you have a general getAll method, call it here. Otherwise, return a bad request.
      result = await AppointmentService.getAll({ userId });
    }

    return NextResponse.json({ status: 'success', data: result });
  } catch (error: any) {
    const errorMessage = error.message || '';

    return NextResponse.json(
      { status: 'error', message: `${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: Request) {

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

    const body = await request.json();

    const newAppointment = await AppointmentService.create({ ...body, userId });

    return NextResponse.json({ status: 'success', data: newAppointment }, { status: 201 });
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