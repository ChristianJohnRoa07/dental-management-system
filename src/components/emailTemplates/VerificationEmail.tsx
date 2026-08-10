import * as React from "react";

interface VerificationEmailProps {
  firstName?: string;
  verificationLink: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  firstName,
  verificationLink,
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
        Dr. Jones Dental Portal
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
      <h3 style={{ marginTop: 0, color: "#0f172a" }}>
        Welcome{firstName ? `, ${firstName}` : ""}!
      </h3>
      <p style={{ lineHeight: "1.6", color: "#475569", fontSize: "15px" }}>
        Thank you for registering. Before you can access your dental dashboard
        and manage patient records, please confirm your email address.
      </p>

      <div style={{ margin: "28px 0", textAlign: "center" }}>
        <a
          href={verificationLink}
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
          Verify Email Address
        </a>
      </div>

      <div
        style={{
          backgroundColor: "#f1f5f9",
          borderLeft: "4px solid #0d9488",
          padding: "12px",
          borderRadius: "4px",
          fontSize: "13px",
          color: "#64748b",
        }}
      >
        <strong>Security note:</strong> This verification link will expire in{" "}
        <strong>24 hours</strong>. If you did not create an account, please
        ignore this email.
      </div>
    </div>
  </div>
);