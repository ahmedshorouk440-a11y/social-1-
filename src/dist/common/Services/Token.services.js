"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = require("node:crypto");
const configService_1 = require("../Config/configService");
const Excption_1 = require("../Excption/Excption");
const generateToken = (user) => {
    let audience;
    let signature;
    let refreshSignature;
    switch (user.role) {
        case "admin":
            signature = configService_1.env.ADMINSIGNATUR;
            refreshSignature = configService_1.env.ADMINREFRESHSIGNATURE;
            audience = "admin";
            break;
        default:
            signature = configService_1.env.USERSIGNATUR;
            refreshSignature = configService_1.env.USERREFRESHSIGNATURE;
            audience = "user";
    }
    const payload = { id: String(user._id) };
    const accessToken = jsonwebtoken_1.default.sign(payload, signature, {
        expiresIn: "30m",
        audience,
        jwtid: (0, node_crypto_1.randomUUID)(),
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, refreshSignature, {
        expiresIn: "1y",
        audience,
        jwtid: (0, node_crypto_1.randomUUID)(),
    });
    return { accessToken, refreshToken };
};
exports.generateToken = generateToken;
const generateAccessToken = async (refreshToken) => {
    const data = jsonwebtoken_1.default.decode(refreshToken);
    if (!data || typeof data === "string") {
        throw new Excption_1.BadRequestExcption("Invalid Refresh Token");
    }
    let signature;
    let refreshSignature;
    let audience;
    switch (data.aud) {
        case "admin":
            signature = configService_1.env.ADMINSIGNATUR;
            refreshSignature = configService_1.env.ADMINREFRESHSIGNATURE;
            audience = "admin";
            break;
        case "user":
            signature = configService_1.env.USERSIGNATUR;
            refreshSignature = configService_1.env.USERREFRESHSIGNATURE;
            audience = "user";
            break;
        default:
            throw new Excption_1.BadRequestExcption("Invalid Token Audience");
    }
    let decodedDataRefresh;
    try {
        decodedDataRefresh = jsonwebtoken_1.default.verify(refreshToken, refreshSignature, { audience });
    }
    catch {
        throw new Excption_1.BadRequestExcption("Invalid or Expired Refresh Token");
    }
    return jsonwebtoken_1.default.sign({ id: decodedDataRefresh.id }, signature, {
        expiresIn: "30m",
        audience,
        jwtid: (0, node_crypto_1.randomUUID)(),
    });
};
exports.generateAccessToken = generateAccessToken;
