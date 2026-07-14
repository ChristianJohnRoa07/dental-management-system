import { NextResponse } from 'next/server';
import { PatientService } from '@/app/services/patients/patient.services'; // Adjust path
import { ERROR_CODES, ERROR_MESSAGES } from '@/lib/constants';
import { generateRelativePath } from '@/utils/generateRelativePath';
import { isTokenBlacklisted } from '@/utils/validateToken';


interface RouteParams {
    params: Promise<{ id: string }> | { id: string };
}

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
        const relativePath = await generateRelativePath(file, patientId);

        const uploadedUrl = relativePath;

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