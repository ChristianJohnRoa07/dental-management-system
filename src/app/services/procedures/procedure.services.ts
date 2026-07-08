import db from "@/lib/db";

import { ERROR_CODES, ERROR_MESSAGES, DYNAMIC_ERRORS } from "@/lib/constants";

export class ProcedureService {
  static async getAll(data: {
    userId: string
  }) {
    const { userId } = data;

    if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

    return await db.procedure.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async create(data: {
    name: string;
    description?: string;
    price?: number;
    userId: string
  }) {
    const { name, userId, description, price } = data;

    if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

    if (!name || name.trim() === '') throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

    return await db.procedure.create({
      data: {
        name: name,
        description: description,
        price: price,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  static async update(data: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    userId: string
  }) {
    try {
      const { id, name, userId, description, price } = data;

      if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

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
          price: price,
          updatedBy: userId,
        },
      });
    }
    catch (error: any) {
      const errorMessage = error.message || String(error);

      if (errorMessage.startsWith(ERROR_CODES.VALIDATION_ERROR)) {
        throw error;
      }

      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${errorMessage}`);
    }
  }

  static async toggleActiveStatus(data: {
    id: string;
    userId: string
  }) {
    try {
      const { id, userId } = data;

      if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

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
    catch (error: any) {
      const errorMessage = error.message || String(error);

      if (errorMessage.startsWith(ERROR_CODES.VALIDATION_ERROR)) {
        throw error;
      }

      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${errorMessage}`);
    }
  }
}