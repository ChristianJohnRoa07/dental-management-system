import db from "@/lib/db";

import { ERROR_CODES, ERROR_MESSAGES, DYNAMIC_ERRORS } from "@/lib/constants";

export class ProcedureService {
  static async getAll() {
    return await db.procedure.findMany({
      orderBy: { name: 'asc' },
      include: {
        updatedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  static async create(data: {
    name: string;
    description?: string;
    price?: number;
    category?:string;
    userId: string
  }) {
    const { name, userId, description, price, category } = data;

    if (!name || name.trim() === '') throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

    return await db.procedure.create({
      data: {
        name: name,
        description: description,
        price: price,
        category: category,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  static async update(data: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    price?: number;
    userId: string
  }) {
    const { id, name, userId, description, category, price } = data;

    if (!name || name.trim() === '') throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

    const currentProcedure = await db.procedure.findUnique({
      where: { id: id }
    });

    if (!currentProcedure) {
      const err = DYNAMIC_ERRORS.NOT_FOUND('Procedure');
      throw new Error(`${err.code}: ${err.message}`);
    }

    return await db.procedure.update({
      where: {
        id: id
      },
      data: {
        name: name,
        description: description,
        category: category,
        price: price,
        updatedBy: userId,
      },
    });
  }

  static async toggleActiveStatus(data: {
    id: string;
    userId: string
  }) {
    const { id, userId } = data;

    if (!id) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

    const currentProcedure = await db.procedure.findUnique({
      where: { id: id }
    });

    if (!currentProcedure) {
      const err = DYNAMIC_ERRORS.NOT_FOUND('Procedure');
      throw new Error(`${err.code}: ${err.message}`);
    }

    return await db.procedure.update({
      where: { id: id },
      data: {
        isActive: !currentProcedure.isActive,
        updatedBy: userId
      },
    });
  }
}