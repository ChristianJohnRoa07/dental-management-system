import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { MIME_TYPES } from '@/lib/constants'

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePathArray = resolvedParams.path; 
    
    // Get the filename from the end of the URL array
    const fileName = filePathArray[filePathArray.length - 1];

    // Build the absolute path to the file inside the Docker container's /tmp directory
    const absolutePath = path.join(os.tmpdir(), 'nextjs-uploads', fileName);

    // Read the file buffer
    const fileBuffer = await fs.readFile(absolutePath);

    // Set matching MIME type header
    const ext = path.extname(fileName).toLowerCase() as keyof typeof MIME_TYPES;
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}