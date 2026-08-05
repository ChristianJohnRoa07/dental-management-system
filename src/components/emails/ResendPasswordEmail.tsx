import * as React from "react";

interface ResetPasswordEmailProps {
  firstName: string;
  resetLink: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  firstName,
  resetLink,
}) => (
  <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
    <h2>Dr. Jones Dental Portal</h2>
    <p>Hello {firstName},</p>
    <p>We received a request to reset your password. Click the button below to set a new password:</p>
    <div style={{ margin: "20px 0" }}>
      <a
        href={resetLink}
        style={{
          backgroundColor: "#0d9488",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        Reset Password
      </a>
    </div>
    <p style={{ fontSize: "12px", color: "#666" }}>
      This link will expire in 15 minutes. If you did not request this, please ignore this email.
    </p>
  </div>
);