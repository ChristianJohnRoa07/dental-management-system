import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export async function generateRelativePath(file: File, patientId: string): Promise<string> {
    
    const tempDir = os.tmpdir();

    const uniqueFileName = `${patientId}-${Date.now()}-${file.name}`;

    const diskStoragePath = path.join(tempDir, 'nextjs-uploads', uniqueFileName);

    await fs.mkdir(path.dirname(diskStoragePath), { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(diskStoragePath, buffer);

    return diskStoragePath;
}