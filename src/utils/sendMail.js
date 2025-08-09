import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // false для порта 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER, // твой email от Brevo
    pass: process.env.SMTP_PASSWORD, // SMTP ключ
  },
});

export async function sendMail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM, // от кого письмо
    to,
    subject,
    text, // обычный текст письма
    html, // HTML версия письма
  });

  console.log('Email sent:', info.messageId);
  return info;
}
