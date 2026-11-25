"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./module/index"));
const GlobalError_1 = require("./middleware/GlobalError");
const Responce_1 = require("./common/Responce/Responce");
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const configService_1 = require("./common/Config/configService");
const Connection_1 = require("./common/DataBase/Connection");
const Redis_service_1 = require("./common/Services/Redis.service");
const app = (0, express_1.default)();
const Limit = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000,
    limit: 200,
    message: "Too Many Request"
});
(0, Connection_1.DataBaseConnection)();
Redis_service_1.redisServices.connect();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use(index_1.default);
app.get("/get", async (req, res, next) => {
    try {
        (0, Responce_1.SuccessResponce)({ res, message: "Server is Running", data: "test" });
    }
    catch (err) {
        next(err);
    }
});
app.use(GlobalError_1.handlerError);
app.listen(configService_1.env.port, () => {
    console.log(`server is running on port ${configService_1.env.port}`);
});
