"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.SignUpScema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignUpScema = {
    body: zod_1.default.object({
        FullName: zod_1.default.string(),
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(8),
        confirmPassword: zod_1.default.string().min(6).optional(),
    }).superRefine((data, ctx) => {
        if (data.password != data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: 'Password and Confirm Password Does not Match'
            });
        }
    })
};
exports.LoginSchema = {
    body: zod_1.default.object({
        email: zod_1.default.string().email(),
        password: zod_1.default.string().min(8)
    })
};
