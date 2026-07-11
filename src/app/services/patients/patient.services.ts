import db from "@/lib/db";

import { ERROR_CODES, ERROR_MESSAGES, DYNAMIC_ERRORS } from "@/lib/constants";

export class PatientService {
  static async getAll(data: {
    userId: string
  }) {
    const { userId } = data;

    if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

    return await db.patient.findMany({
      orderBy: { firstName: 'asc' },
    });
  }

  static async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    userId: string
  }) {
    const { firstName, lastName, email, mobileNumber, userId } = data;

    if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

    if (
      !firstName || firstName.trim() === '' ||
      !lastName || lastName.trim() === '' ||
      !email || email.trim() === '' ||
      !mobileNumber || mobileNumber.trim() === ''
    ) {
      throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);
    }

    return await db.patient.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNumber: mobileNumber,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  static async update(data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    userId: string
  }) {
    try {
      
      const { id, firstName, lastName, email, mobileNumber, userId } = data;

      if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

      if (
        !firstName || firstName.trim() === '' ||
        !lastName || lastName.trim() === '' ||
        !email || email.trim() === '' ||
        !mobileNumber || mobileNumber.trim() === ''
      ) {
        throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);
      }

      const currentPatient = await db.patient.findUnique({
        where: { id: id }
      });

      if (!currentPatient) {
        const err = DYNAMIC_ERRORS.NOT_FOUND('Patient');
        throw new Error(`${err.code}: ${err.message}`);
      }

      return await db.patient.update({
        where: {
          id: id
        },
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNumber: mobileNumber,
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

  // static async toggleActiveStatus(data: {
  //   id: string;
  //   userId: string
  // }) {
  //   try {
  //     const { id, userId } = data;

  //     if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

  //     if (!id) throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);

  //     const currentProcedure = await db.procedure.findUnique({
  //       where: { id: id }
  //     });

  //     if (!currentProcedure) {
  //       const err = DYNAMIC_ERRORS.NOT_FOUND('Procedure');
  //       throw new Error(`${err.code}: ${err.message}`);
  //     }

  //     return await db.procedure.update({
  //       where: { id: id },
  //       data: {
  //         isActive: !currentProcedure.isActive,
  //         updatedBy: userId
  //       },
  //     });
  //   }
  //   catch (error: any) {
  //     const errorMessage = error.message || String(error);

  //     if (errorMessage.startsWith(ERROR_CODES.VALIDATION_ERROR)) {
  //       throw error;
  //     }

  //     throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${errorMessage}`);
  //   }
  // }
}