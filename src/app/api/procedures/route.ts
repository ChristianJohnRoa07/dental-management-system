import { NextResponse } from 'next/server';
import { ProcedureService } from '@/app/services/procedures/procedure.services';
import { ERROR_CODES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

// GET /api/procedures - Fetch all procedures
export async function GET(request: Request) {

  const userId = request.headers.get('x-user-id');

  try {
    const procedures = await ProcedureService.getAll({ userId });
    return NextResponse.json({ status: 'success', data: procedures });
  } catch (error: any) {
    const errorMessage = error.message || '';

    return NextResponse.json(
      { status: 'error', message: `${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST /api/procedures - Create new procedure
export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')!;

    const body = await request.json();

    const newProcedure = await ProcedureService.create({...body, userId});

    return NextResponse.json({ status: 'success', data: newProcedure }, { status: 201 });
  } catch (error: any) {
    const errorMessage = error.message || '';

    if (errorMessage.includes(ERROR_CODES.VALIDATION_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 400 });
    }

    if (errorMessage.includes(ERROR_CODES.CONFLICT_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 409 });
    }

    return NextResponse.json(
      { status: 'error', message: 'Failed to complete registration.' },
      { status: 500 }
    );
  }
}

// PUT /api/procedures - Update procedure details
export async function PUT(request: Request) {

  try {
    const userId = request.headers.get('x-user-id')!;

    const body = await request.json();

    const updatedProcedure = await ProcedureService.update({...body, userId});

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
      { status: 'error', message: 'Failed to complete registration.' },
      { status: 500 }
    );
  }
}

// PATCH /api/procedures - Toggle inactive status of a procedure
export async function PATCH(request: Request) {

  try {
    const userId = request.headers.get('x-user-id')!;

    const body = await request.json();

    const updatedProcedure = await ProcedureService.toggleActiveStatus({ 
      id: body.id, 
      userId: userId 
    });

    return NextResponse.json(
      { status: 'success', data: updatedProcedure },
      { status: 200 }
    );

  } catch (error: any) {
    const errorMessage = error.message || '';

    if (errorMessage.includes(ERROR_CODES.VALIDATION_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 400 });
    }

    if (errorMessage.includes(ERROR_CODES.CONFLICT_ERROR)) {
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 409 });
    }

    return NextResponse.json(
      { status: 'error', message: `Failed to complete registration due to: ${errorMessage}` },
      { status: 500 }
    );
  }
}
