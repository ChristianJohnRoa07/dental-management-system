import { NextResponse } from 'next/server';
import path from 'path';
import { PatientService } from '@/app/services/patients/patient.services';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { checkSession } from '@/lib/hooks/api/checkSession';
import { generateRelativePath } from '@/lib/hooks/api/generateRelativePath';
import { PatientRouteContext } from '@/interface/patient/PatientRouteContext';

export const dynamic = 'force-dynamic';

// GET /api/patients/images/[id] - Fetch patient details
export const GET = checkSession<PatientRouteContext>(
  async (req, context) => {
    const resolvedParams = await context.params;
    const patientId = resolvedParams.id;

    const patientDetails = await PatientService.getPatientDetails({
      patientId,
    });

    return NextResponse.json({ status: 'success', data: patientDetails });
  }
);

// POST /api/patients/images/[id] - Upload patient images (Restricted to ADMIN or DOCTOR)
export const POST = checkSession<PatientRouteContext>(
  async (req, context, user) => {
    const resolvedParams = await context.params;
    const patientId = resolvedParams.id;

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { status: ERROR_CODES.VALIDATION_ERROR, message: ERROR_MESSAGES.VALIDATION_ERROR },
        { status: 400 }
      );
    }

    const absoluteTmpPath = await generateRelativePath(file, patientId);
    const fileName = path.basename(absoluteTmpPath);
    const uploadedUrl = `/api/patients/images/${fileName}`;

    const record = await PatientService.uploadImage({
      patientId,
      url: uploadedUrl,
      userId: user.id,
    });

    return NextResponse.json({ status: 'success', data: record }, { status: 201 });
  },
);