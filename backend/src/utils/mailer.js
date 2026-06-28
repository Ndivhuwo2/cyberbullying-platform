const nodemailer = require('nodemailer');

const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  return transporter;
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = await createTransporter();

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  const info = await transporter.sendMail({
    from: '"CyberShield" <noreply@cybershield.com>',
    to: email,
    subject: 'Reset your CyberShield password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #be185d;">CyberShield Password Reset</h2>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #be185d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #888; font-size: 12px;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
      </div>
    `
  });

  console.log('Password reset email preview: ' + nodemailer.getTestMessageUrl(info));
};

module.exports = { sendPasswordResetEmail };