import { NextResponse } from 'next/server';
import path from 'path';
import { PatientService } from '@/app/services/patients/patient.services';
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { isTokenBlacklisted } from '@/utils/validateToken';
import { generateRelativePath } from '@/utils/generateRelativePath';

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: Promise<{ id: string }> | { id: string };
}

// GET /api/patients/images/[id] - Fetch patient details
export async function GET(
    request: Request,
    { params }: RouteParams
) {

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

        const resolvedParams = await params;
        const patientId = resolvedParams.id;

        const patientDetails = await PatientService.getPatientDetails({ userId, patientId });
        return NextResponse.json({ status: 'success', data: patientDetails });
    } catch (error: any) {
        const errorMessage = error.message || '';

        return NextResponse.json(
            { status: 'error', message: `${errorMessage}` },
            { status: 500 }
        );
    }
}

// POST /api/patients/images/[id] - Upload patient images
export async function POST(
    request: Request,
    { params }: RouteParams
) {
    const userId = request.headers.get('x-user-id')!;
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

    const resolvedParams = await params;
    const patientId = resolvedParams.id;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ status: ERROR_CODES.VALIDATION_ERROR, message: ERROR_MESSAGES.VALIDATION_ERROR }, { status: 400 });
        }

        // Use this for production
        // const uploadedUrl = `https://your-storage-bucket.com/patients/${patientId}/images/${file.name}`; 

        // For development purposes
        const absoluteTmpPath = await generateRelativePath(file, patientId);

        const fileName = path.basename(absoluteTmpPath);

        const uploadedUrl = `/api/patients/images/${fileName}`;

        const record = await PatientService.uploadImage({
            patientId,
            url: uploadedUrl,
            userId,
        });

        return NextResponse.json({ status: 'success', data: record }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json(
            { status: 'error', message: error.message },
            { status: 500 }
        );
    }
}