
import {EventEmitter} from 'node:events'
import { sendEmail } from '../../Services/Email/sendEmail'
import { verifyEmailTemplete } from '../../Services/Email/Email.Templte.js'

export const emailEvent = new EventEmitter()



emailEvent.on("sendEmail", async ({ recipients, subject, data, html }) => {
  await sendEmail({
    ...recipients,
    subject,
    html: html ?? verifyEmailTemplete({ ...data, subject }),
  });
});