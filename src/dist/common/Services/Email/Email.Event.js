"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const node_events_1 = require("node:events");
const sendEmail_1 = require("../../Services/Email/sendEmail");
const Email_Templte_js_1 = require("../../Services/Email/Email.Templte.js");
exports.emailEvent = new node_events_1.EventEmitter();
exports.emailEvent.on("sendEmail", async ({ recipients, subject, data, html }) => {
    await (0, sendEmail_1.sendEmail)({
        ...recipients,
        subject,
        html: html ?? (0, Email_Templte_js_1.verifyEmailTemplete)({ ...data, subject }),
    });
});
