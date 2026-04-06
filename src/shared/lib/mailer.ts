import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

export const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.YANDEX_EMAIL,
    pass: process.env.YANDEX_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
} as SMTPTransport.Options)
