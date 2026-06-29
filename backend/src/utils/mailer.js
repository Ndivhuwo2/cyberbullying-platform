const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `https://cybershield-5nz3.onrender.com/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: '"CyberShield" <noreply@cybershield.com>',
    to: email,
    subject: 'Reset your CyberShield password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #6d28d9;">CyberShield Password Reset</h2>
        <p>You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #888; font-size: 12px;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
      </div>
    `
  });
};

module.exports = { sendPasswordResetEmail };