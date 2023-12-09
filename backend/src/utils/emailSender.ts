const nodemailer = require('nodemailer');

import { SYSTEM_EMAIL, SYSTEM_EMAIL_PASS } from '../utils/secrets';

export async function sendReminderEmail(task: any) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: SYSTEM_EMAIL,
      pass: SYSTEM_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: SYSTEM_EMAIL,
    to: task.user.email,
    subject: `Reminder: ${task.title}`,
    text: `This is a reminder for your task: ${task.title}. Description: ${task.description}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent successfully for task: ${task.title}`);
  } catch (error) {
    console.error(
      `Error sending reminder email for task: ${task.title}`,
      error
    );
  }
}
