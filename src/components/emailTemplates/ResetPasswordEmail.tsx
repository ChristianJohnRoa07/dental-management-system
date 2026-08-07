import * as React from "react";

interface ResetPasswordEmailProps {
  firstName: string;
  resetLink: string;
}

export const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  firstName,
  resetLink,
}) => (
  <div
    style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px",
      color: "#1e293b",
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      maxWidth: "550px",
      margin: "0 auto",
    }}
  >
    <div style={{ textAlign: "center", paddingBottom: "16px" }}>
      <h2 style={{ color: "#0d9488", margin: "0 0 8px 0" }}>
        🦷 Dr. Jones Dental Portal
      </h2>
      <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
        Dental Management System
      </p>
    </div>

    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
      }}
    >
      <p style={{ fontSize: "15px", color: "#334155" }}>Hello {firstName},</p>
      <p style={{ lineHeight: "1.6", color: "#475569", fontSize: "15px" }}>
        We received a request to reset your password. Click the button below to
        set a new password:
      </p>

      <div style={{ margin: "28px 0", textAlign: "center" }}>
        <a
          href={resetLink}
          style={{
            backgroundColor: "#0d9488",
            color: "#ffffff",
            padding: "12px 28px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "15px",
            display: "inline-block",
          }}
        >
          Reset Password
        </a>
      </div>

      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
        This link will expire in 15 minutes. If you did not request this, please
        safely ignore this email.
      </p>
    </div>
  </div>
);