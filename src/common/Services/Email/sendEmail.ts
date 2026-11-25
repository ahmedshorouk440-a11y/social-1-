
import nodemailer from "nodemailer";
import { BadRequestExcption } from "../../Excption/Excption";
import { env } from "../../Config/configService";

export const UserEmailKey = ({ email, subject }:{email:string , subject:string}) => {
  return `User::${email}::${subject}::OTP`;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.APP_EMAIL,
    pass: env.App_Password,
  },
});

export const sendEmail = async ({ to, cc, bcc, subject, text, html }: { to?: string[]; cc?: string[]; bcc?: string[]; subject: string; text?: string; html?: string}) => {
  if (!to?.length && !cc?.length && !bcc?.length) {
    throw new BadRequestExcption("Missing Email Recipients");
  }
  if (!text?.length && !html?.length) {
    throw new BadRequestExcption("Missing Email Content");
  }

  return transporter.sendMail({
    from: `${process.env.APPLICATION_NAME} <${process.env.APP_EMAIL}>`,
    to,
    cc,
    bcc,
    subject,
    text,
    html,
  });
};