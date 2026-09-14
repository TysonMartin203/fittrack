const nodemailer = require('nodemailer');

function getTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  const transport = getTransport();
  if (!transport) throw new Error('Email sending is not configured yet.');
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Reset your FitTrack password',
    text: `Someone requested a password reset for your FitTrack account. If this was you, reset your password here: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can safely ignore this email.`,
    html: `<p>Someone requested a password reset for your FitTrack account.</p><p>If this was you, <a href="${resetUrl}">click here to reset your password</a>. This link expires in 1 hour.</p><p>If you didn't request this, you can safely ignore this email.</p>`,
  });
}

module.exports = { sendPasswordResetEmail };
