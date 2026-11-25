"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const Excption_1 = require("../Excption/Excption");
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                validationErrors.push({ key, issue: result.error.issues });
            }
        }
        if (validationErrors.length > 0) {
            throw new Excption_1.BadRequestExcption("Validation error", validationErrors);
        }
        next();
    };
};
exports.validation = validation;
