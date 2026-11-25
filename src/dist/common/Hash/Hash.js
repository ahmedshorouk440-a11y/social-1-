"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const configService_1 = require("../Config/configService");
const hash = (PlainText, saltRounds = Number(configService_1.env.SALT)) => {
    return bcrypt_1.default.hash(PlainText, saltRounds);
};
exports.hash = hash;
const compare = (PlainText, hashText) => {
    return bcrypt_1.default.compare(PlainText, hashText);
};
exports.compare = compare;
