import { NextResponse } from 'next/server';
import { PatientService } from '@/app/services/patients/patient.services';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { isTokenBlacklisted } from '@/lib/hooks/api/validateToken';

export const dynamic = 'force-dynamic';

// GET /api/patients - Fetch all patients
export async function GET(request: Request) {

  const userId = request.headers.get('x-user-id');

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
    const procedures = await PatientService.getAll({ userId });
    return NextResponse.json({ status: 'success', data: procedures });
  } catch (error: any) {
    const errorMessage = error.message || '';

    return NextResponse.json(
      { status: 'error', message: `${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create new patients
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

    const newPatient = await PatientService.create({ ...body, userId });

    return NextResponse.json({ status: 'success', data: newPatient }, { status: 201 });
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

// PUT /api/patients - Update patients details
export async function PUT(request: Request) {

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

    const updatedProcedure = await PatientService.update({ ...body, userId });

    return NextResponse.json({ status: 'success', data: updatedProcedure }, { status: 200 });
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