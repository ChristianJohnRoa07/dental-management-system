import db from "@/lib/db";

import { ERROR_CODES, ERROR_MESSAGES, DYNAMIC_ERRORS } from "@/lib/constants";

export class PatientService {
  static async getAll(data: {
    userId: string
  }) {
    try {
      const { userId } = data;

      if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

      return await db.patient.findMany({
        orderBy: { firstName: 'asc' },
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

  static async getPatientDetails(data: {
    userId: string,
    patientId: string,
  }) {
    try {

      const { patientId, userId } = data;

      if (!userId) throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);

      if (!patientId || patientId.trim() === '') {
        throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);
      }

      const patientWithImage = await db.patient.findUnique({
        where: { id: patientId },
        include: {
          images: true,
        },
      });

      if (!patientWithImage) {
        const err = DYNAMIC_ERRORS.NOT_FOUND('Patient');
        throw new Error(`${err.code}: ${err.message}`);
      }

      const { images, ...patientData } = patientWithImage;

      return {
        patient: patientData,
        images: images || [],
      };

    } catch (error: any) {
      const errorMessage = error.message || String(error);

      if (
        errorMessage.startsWith(ERROR_CODES.VALIDATION_ERROR) ||
        errorMessage.includes('NOT_FOUND')
      ) {
        throw error;
      }

      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${errorMessage}`);
    }

  }

  static async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    userId: string
  }) {
    try {
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
    catch (error: any) {
      const errorMessage = error.message || String(error);

      if (errorMessage.startsWith(ERROR_CODES.VALIDATION_ERROR)) {
        throw error;
      }

      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${errorMessage}`);
    }
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

  static async uploadImage(data: {
    patientId: string;
    url: string;
    userId: string;
  }) {
    try {
      const { patientId, url, userId } = data;

      if (!userId) {
        throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);
      }

      if (!patientId || patientId.trim() === '' || !url || url.trim() === '') {
        throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);
      }

      const targetPatient = await db.patient.findUnique({
        where: { id: patientId }
      });

      if (!targetPatient) {
        const err = DYNAMIC_ERRORS.NOT_FOUND('Patient');
        throw new Error(`${err.code}: ${err.message}`);
      }

      return await db.patientImage.create({
        data: {
          url: url,
          patientId: patientId,
          createdBy: userId,
          createdAt: new Date()
        },
      });

    } catch (error: any) {
      const errorMessage = error.message || String(error);

      if (
        errorMessage.startsWith(ERROR_CODES.VALIDATION_ERROR) ||
        errorMessage.includes('NOT_FOUND')
      ) {
        throw error;
      }

      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${errorMessage}`);
    }
  }

}