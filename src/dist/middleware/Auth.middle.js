"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configService_1 = require("../common/Config/configService");
const Excption_1 = require("../common/Excption/Excption");
const signature = {
    admin: configService_1.env.ADMINSIGNATUR,
    user: configService_1.env.USERSIGNATUR
};
const auth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            throw new Excption_1.BadRequestExcption("Token Not Found");
        }
        const [flag, token] = header.split(" ");
        if (flag !== "Bearer" || !token) {
            throw new Excption_1.BadRequestExcption("Invalid Authorization");
        }
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded)
            throw new Excption_1.UnauthrizedExption("Invalid token");
        const audience = decoded.aud;
        const signatures = signature[audience];
        if (!signatures)
            throw new Excption_1.BadRequestExcption("Invalid Audience");
        const verified = jsonwebtoken_1.default.verify(token, signatures, { audience });
        req.userId = verified.id;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.auth = auth;
