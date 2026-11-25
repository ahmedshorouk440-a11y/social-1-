"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configService_1 = require("../Config/configService");
const DataBaseConnection = () => {
    mongoose_1.default.connect(configService_1.env.DataBaseURL).then(() => {
        console.log("DataBase Connected");
    }).catch((err) => {
        console.log(err);
    });
};
exports.DataBaseConnection = DataBaseConnection;
