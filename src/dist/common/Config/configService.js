"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(`./.env.${process.env.NODE_ENV}`) });
const port = process.env.PORT;
const DataBaseURL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;
const SALT = process.env.SALT;
const ADMINSIGNATUR = process.env.ADMINSIGNATUR;
const USERSIGNATUR = process.env.USERSIGNATUR;
const ADMINREFRESHSIGNATURE = process.env.ADMINREFRESHSIGNATURE;
const USERREFRESHSIGNATURE = process.env.USERREFRESHSIGNATURE;
const App_Password = process.env.App_Password;
const APP_EMAIL = process.env.APP_EMAIL;
const WEB_CLIENT_ID = process.env.WEB_CLIENT_ID;
exports.env = {
    port,
    DataBaseURL,
    REDIS_URL,
    SALT,
    ADMINSIGNATUR,
    USERSIGNATUR,
    ADMINREFRESHSIGNATURE,
    USERREFRESHSIGNATURE,
    App_Password,
    APP_EMAIL,
    WEB_CLIENT_ID
};
