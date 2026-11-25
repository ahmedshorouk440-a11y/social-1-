"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AuthScema = new mongoose_1.default.Schema({
    FullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }, phone: {
        type: String,
    },
    profileImage: {
        type: String
    },
    isVerfied: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
    },
    role: { type: String,
        enum: ["admin", "user"],
        default: "user" },
});
exports.AuthModel = mongoose_1.default.model('user', AuthScema);
