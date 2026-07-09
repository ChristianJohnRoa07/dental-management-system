import db from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import * as jose from 'jose';

import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/constants";
import { sendVerificationEmail } from '@/utils/sendEmail';

const { jwtVerify, decodeJwt } = jose;

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

      const token = crypto.randomBytes(32).toString('hex');

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await db.verificationToken.create({
        data: {
          token,
          userId: newUser.id,
          expiresAt
        }
      });

      const verificationUrl = `http://localhost:3000/api/auth/verifyEmail?token=${token}`;

      await sendVerificationEmail(newUser.email, verificationUrl);

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

  static async verifyUser(data: {
    token: string;
  }) {
    try {

      const { token } = data;

      const tokenRecord = await db.verificationToken.findUnique({
        where: { token },
        include: { user: true }
      });

      if (!tokenRecord) {
        throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);
      }

      if (new Date() > tokenRecord.expiresAt) {
        await db.verificationToken.delete({ where: { id: tokenRecord.id } });
        throw new Error(`${ERROR_CODES.VERIFICATION_TOKEN_EXPIRED}: ${ERROR_MESSAGES.VERIFICATION_TOKEN_EXPIRED}`);
      }

      const updatedUser = await db.user.update({
        where: { id: tokenRecord.userId },
        data: {
          isVerified: true,
          verifiedAt: new Date()
        }
      });

      await db.verificationToken.delete({
        where: { id: tokenRecord.id }
      });

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;

    } catch (error: any) {
      const errorMessage = error.message || String(error);

      // Forward verification errors cleanly without wrapping them into server errors
      if (errorMessage.startsWith(ERROR_CODES.VERIFICATION_TOKEN_EXPIRED) || errorMessage.startsWith(ERROR_CODES.TOKEN_NOT_FOUND)) {
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

  static async logout(data: { token: string }) {
  try {
    if (!data.token) {
      throw new Error(`${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`);
    }

    const payload = decodeJwt(data.token);
    
    if (!payload.exp) {
      throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: Invalid token structure.`);
    }

    const expiresAt = new Date(payload.exp * 1000);

    await db.tokenBlacklist.upsert({
      where: { token: data.token },
      update: {},
      create: {
        token: data.token,
        expiresAt: expiresAt,
      },
    });

    return { status: 'success', message: 'Logged out successfully.' };

  } catch (error: any) {
    if (Object.values(ERROR_CODES).some(code => error.message?.includes(code))) {
      throw error;
    }
    throw new Error(`${ERROR_CODES.SERVER_ERROR}: ${error.message || error}`);
  }
  }

}

type RequestPassword = string;