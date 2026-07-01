import db from "@/lib/db";

export class ProcedureService {
  static async getAll() {
    return await db.procedure.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create(data: { 
        name: string; 
        description?: string; 
        price?: number; 
        userId: string 
    }) {
    if (!data.name) throw new Error('VALIDATION_ERROR: Name is required');

    return await db.procedure.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        createdBy: data.userId,
        updatedBy: data.userId,
      },
    });
  }
}