import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/constants";
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export class UserService {

  static async getAll() {
    try {
      return await db.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error("Error in getAll users:", error);
      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${ERROR_MESSAGES.SERVER_ERROR}`);
    }
  }

  static async register(data: {
    username: string;
    email: string;
    password: RequestPassword;
    firstName: string;
    lastName: string;
    role?: any;
  }) {
    try {

      if (!data.username || !data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);
      }

      const existingUser = await db.user.findFirst({
        where: {
          OR: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        throw new Error(`${ERROR_CODES.CONFLICT_ERROR}: ${ERROR_MESSAGES.CONFLICT_ERROR}`);
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await db.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        },
      });

      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;

    } catch (error: any) {
      const errorMessage = error.message || String(error);

      if (
        errorMessage.startsWith(ERROR_CODES.VALIDATION_ERROR) ||
        errorMessage.startsWith(ERROR_CODES.CONFLICT_ERROR)
      ) {
        throw error;
      }

      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${errorMessage}`);
    }
  }

  static async login(data: { username: string; password: string }) {
    try {
      if (!data.username || !data.password) {
        throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`);
      }

      const user = await db.user.findUnique({
        where: { username: data.username },
      });

      if (!user) {
        throw new Error(`${ERROR_CODES.AUTH_ERROR}: ${ERROR_MESSAGES.AUTH_ERROR}`);
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        throw new Error(`${ERROR_CODES.AUTH_ERROR}: ${ERROR_MESSAGES.AUTH_ERROR}`);
      }

      const token = await new jose.SignJWT({
        id: user.id,
        role: user.role,
        username: user.username
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(JWT_SECRET);

      const { password, ...authSessionUser } = user;

      return {
        ...authSessionUser,
        token
      };

    } catch (error: any) {
      if (Object.values(ERROR_CODES).some(code => error.message?.includes(code))) {
        throw error;
      }
      throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${error.message || error}`);
    }
  }
}

type RequestPassword = string;