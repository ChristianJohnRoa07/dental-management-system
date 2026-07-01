import nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, url: string) {
  // For development, you can use a testing service like Ethereal or Mailtrap, 
  // or use your actual SMTP details (Gmail, SendGrid, Resend, etc.) via env variables.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Your Dental Management Team" <noreply@dentalmanagementsystem.com>',
    to,
    subject: "🦷 Verify your Dental Management account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email address</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f9; padding: 40px 0;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
                
                <tr>
                  <td align="center" style="background-color: #02c723; padding: 35px 20px;">
                    <span style="font-size: 32px; margin-bottom: 5px; display: block;">🦷</span>
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Dental Management System</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px; text-align: left;">
                    <h2 style="color: #1e293b; margin-top: 0; margin-bottom: 16px; font-size: 20px; font-weight: 600;">Welcome to the Team!</h2>
                    <p style="color: #475569; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                      Thank you for registering. Before you can access your dental dashboard, schedule appointments, or manage patient records, we just need to confirm your email address.
                    </p>
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="${url}" target="_blank" style="background-color: #19c702; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 16px; font-weight: 600; border-radius: 6px; display: inline-block; box-shadow: 0 2px 5px rgba(2, 132, 199, 0.25);">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-left: 4px solid #bafdba; border-radius: 4px;">
                      <tr>
                        <td style="padding: 12px 16px; color: #64748b; font-size: 13px; line-height: 18px;">
                          <strong>Security note:</strong> This verification link will remain active for <strong>24 hours only</strong>. If you did not sign up for this account, please securely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 30px 30px 30px; text-align: center;">
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0 0 6px 0;">
                      &copy; 2026 Dental Management System. All rights reserved.
                    </p>
                    <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                      Automated security message. Do not reply directly to this inbox.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}