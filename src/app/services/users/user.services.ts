import db from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as jose from "jose";
import React from "react";
import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { Role } from "@/app/generated/prisma/enums";

import { ERROR_CODES, ERROR_MESSAGES } from "@/lib/constants";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "@/app/services/emails/email.service";

const { decodeJwt } = jose;

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

const DEV_DOMAIN = process.env.DEV_DOMAIN;

export class UserService {
  static async getAll() {
    return await db.user.findMany({
      orderBy: { createdAt: "desc" },
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
  }

  static async register(data: {
    username: string;
    email: string;
    password: RequestPassword;
    firstName: string;
    lastName: string;
    role: Role | string;
  }) {
    const { username, email, password, firstName, lastName, role } = data;

    if (!username || !email || !password || !firstName || !lastName || !role) {
      throw new Error(
        `${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`,
      );
    }

    const isValidRole = Object.values(Role).includes(role as Role);

    if (!isValidRole) {
      throw new Error(
        `${ERROR_CODES.VALIDATION_ERROR}: Invalid role provided.`,
      );
    }

    const assignedRole = role as Role;

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      throw new Error(
        `${ERROR_CODES.CONFLICT_ERROR}: ${ERROR_MESSAGES.CONFLICT_ERROR}`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        role: assignedRole,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await db.verificationToken.create({
      data: {
        token,
        userId: newUser.id,
        expiresAt,
      },
    });

    const verificationUrl = `http://${DEV_DOMAIN}/api/auth/verifyEmail?token=${token}`; // Change this if prod deployment

    await sendVerificationEmail({
      to: newUser.email,
      firstName: newUser.firstName,
      verificationUrl,
    });

    const { password: _hashedPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async verifyUser(data: { token: string }) {
    const { token } = data;

    const existingToken = await db.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!existingToken) {
      throw new Error(
        `${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`,
      );
    }

    if (new Date() > existingToken.expiresAt) {
      await db.verificationToken.delete({ where: { id: existingToken.id } });
      throw new Error(
        `${ERROR_CODES.VERIFICATION_TOKEN_EXPIRED}: ${ERROR_MESSAGES.VERIFICATION_TOKEN_EXPIRED}`,
      );
    }

    const [updatedUser] = await db.$transaction([
      db.user.update({
        where: { id: existingToken.userId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
        },
      }),
      db.verificationToken.delete({
        where: { id: existingToken.id },
      }),
    ]);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async login(data: { username: string; password: string }) {
    const { username, password } = data;

    if (!username || !password) {
      throw new Error(
        `${ERROR_CODES.VALIDATION_ERROR}: ${ERROR_MESSAGES.VALIDATION_ERROR}`,
      );
    }

    const user = await db.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      throw new Error(
        `${ERROR_CODES.AUTH_ERROR}: ${ERROR_MESSAGES.AUTH_ERROR}`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error(
        `${ERROR_CODES.AUTH_ERROR}: ${ERROR_MESSAGES.AUTH_ERROR}`,
      );
    }

    const accessToken = await new jose.SignJWT({
      id: user.id,
      role: user.role,
      username: user.username,
      isVerified: user.isVerified,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(JWT_SECRET);

    const { password: _hashedPassword, ...authSessionUser } = user;

    return {
      ...authSessionUser,
      accessToken,
    };
  }

  static async logout(data: { accessToken: string }) {
    const { accessToken } = data;

    if (!accessToken) {
      throw new Error(
        `${ERROR_CODES.TOKEN_NOT_FOUND}: ${ERROR_MESSAGES.TOKEN_NOT_FOUND}`
      );
    }

    try {
      const payload = decodeJwt(accessToken);

      if (!payload.exp) {
        throw new Error(
          `${ERROR_CODES.VALIDATION_ERROR}: Invalid token structure.`
        );
      }

      const expiresAt = new Date(payload.exp * 1000);

      await db.tokenBlacklist.upsert({
        where: { token: accessToken },
        update: {},
        create: {
          token: accessToken,
          expiresAt: expiresAt,
        },
      });

      return { status: "success", message: "Logged out successfully." };
    } catch (error: any) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  static async forgotPasswordEmailSend(data: {
    email: string;
    origin?: string;
  }) {
    const { email, origin } = data;

    if (!email) {
      throw new Error("Email is required.");
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Anti-Enumeration Security: Exit early without error if user doesn't exist
    if (!user) {
      return { success: true };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    await db.passwordResetToken.create({
      data: {
        tokenHash,
        expiresAt,
        userId: user.id,
      },
    });

    const baseUrl =
      origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${rawToken}`;

    await sendResetPasswordEmail({
      to: user.email,
      firstName: user.firstName,
      resetLink,
    });

    return { success: true };
  }

  static async resetPassword(data: { token: string; newPassword: string }) {
    const { token, newPassword } = data;

    // 1. Validation
    if (!token || !newPassword) {
      throw new Error("Token and new password are required.");
    }

    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    // 2. Hash the incoming raw token to match what is stored in DB
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // 3. Find active matching token
    const resetToken = await db.passwordResetToken.findFirst({
      where: {
        tokenHash,
        used: false,
        expiresAt: {
          gt: new Date(), // Check token is not expired
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetToken || !resetToken.user) {
      throw new Error("Invalid or expired password reset token.");
    }

    // 4. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update user password and invalidate reset token in a transaction
    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { success: true, message: "Password updated successfully." };
  }
}

type RequestPassword = string;
