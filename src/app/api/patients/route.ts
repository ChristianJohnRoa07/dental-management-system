import { NextResponse } from 'next/server';
import { PatientService } from '@/app/services/patients/patient.services';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { checkSession } from '@/lib/hooks/api/checkSession';

export const dynamic = 'force-dynamic';

// GET /api/patients - Fetch all patients
export const GET = checkSession(
  async () => {
    const patients = await PatientService.getAll();
    return NextResponse.json({ status: "success", data: patients });
  },
);

// POST /api/patients - Create new patients
export const POST = checkSession(
  async (req, user) => {
    const body = await req.json();
    const newPatient = await PatientService.create({
      ...body,
      userId: user.id,
    });

    return NextResponse.json(
      { status: "success", data: newPatient },
      { status: 201 },
    );
  },
);

// PUT /api/patients - Update patients details
export const PUT = checkSession(
  async (req, user) => {
    const body = await req.json();
    const updatedPatient = await PatientService.update({
      ...body,
      userId: user.id,
    });

    return NextResponse.json(
      { status: "success", data: updatedPatient },
      { status: 201 },
    );
  },
);
