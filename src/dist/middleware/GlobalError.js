"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerError = void 0;
const handlerError = (err, req, res, next) => {
    console.log(JSON.stringify(err.cause, null, 2));
    const status = err.cause?.status || err.statusCode || err.status || 500;
    res.status(status).json({
        error: status === 500 ? "Internal server error" : err.message,
    });
};
exports.handlerError = handlerError;
