import { Resend } from "resend";
import { VerificationEmail } from "@/components/emailTemplates/VerificationEmail";
import { ResetPasswordEmail } from "@/components/emailTemplates/ResetPasswordEmail";
import React from "react";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_SENDER =
  process.env.EMAIL_FROM || "Dr. Jones Portal <onboarding@resend.dev>";

export async function sendVerificationEmail({
  to,
  firstName,
  verificationUrl,
}: {
  to: string;
  firstName?: string;
  verificationUrl: string;
}) {

    const emailHtml = await render(
    React.createElement(VerificationEmail, {
      firstName: firstName,
      verificationLink: verificationUrl,
    }),
  );

  const { data, error } = await resend.emails.send({
    from: FROM_SENDER,
    to: [to],
    subject: "Verify your account - Dr. Jones Portal",
    html: emailHtml
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  return data;
}

export async function sendResetPasswordEmail({
  to,
  firstName,
  resetLink,
}: {
  to: string;
  firstName: string;
  resetLink: string;
}) {
  const emailHtml = await render(
    React.createElement(ResetPasswordEmail, {
      firstName: firstName,
      resetLink,
    }),
  );

  const { data, error } = await resend.emails.send({
    from: FROM_SENDER,
    to: [to],
    subject: "Reset Your Password - Dr. Jones Portal",
    html: emailHtml
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }

  return data;
}
