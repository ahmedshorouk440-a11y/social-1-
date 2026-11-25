"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponce = void 0;
const SuccessResponce = ({ res, message = "Done", status = 200, data }) => {
    res.status(status).json({ message, data });
};
exports.SuccessResponce = SuccessResponce;
