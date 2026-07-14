import { promises as fs } from 'fs';
import path from 'path';

export async function generateRelativePath(file: File, patientId: string): Promise<string> {
    
    const relativePath = `/uploads/${patientId}-${Date.now()}-${file.name}`;
    const diskStoragePath = path.join(process.cwd(), 'public', relativePath);

    await fs.mkdir(path.dirname(diskStoragePath), { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(diskStoragePath, buffer);

    return relativePath;
}