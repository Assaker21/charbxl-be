import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

import nodemailer from "nodemailer";

let transporter;
try {
  console.log("Process: ", process.env.SMTP_HOST);
  transporter = await nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} catch (err) {
  console.error(err);
}

export async function sendMail({ to, from, subject, body } = {}) {
  try {
    const info = await transporter.sendMail({
      from: from || "Forwarder <no-reply@charbxl.com>",
      to: to,
      subject: subject || "Website contact",
      text: body,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error while sending mail:", err);
    throw err;
  }
}
