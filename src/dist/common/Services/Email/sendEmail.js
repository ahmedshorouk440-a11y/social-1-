"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.UserEmailKey = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Excption_1 = require("../../Excption/Excption");
const configService_1 = require("../../Config/configService");
const UserEmailKey = ({ email, subject }) => {
    return `User::${email}::${subject}::OTP`;
};
exports.UserEmailKey = UserEmailKey;
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: configService_1.env.APP_EMAIL,
        pass: configService_1.env.App_Password,
    },
});
const sendEmail = async ({ to, cc, bcc, subject, text, html }) => {
    if (!to?.length && !cc?.length && !bcc?.length) {
        throw new Excption_1.BadRequestExcption("Missing Email Recipients");
    }
    if (!text?.length && !html?.length) {
        throw new Excption_1.BadRequestExcption("Missing Email Content");
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
exports.sendEmail = sendEmail;
