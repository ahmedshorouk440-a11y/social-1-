"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authanction_contrlloer_1 = __importDefault(require("./Authanction/Authanction.contrlloer"));
const Follow_contrlloer_1 = __importDefault(require("./Follow/Follow.contrlloer"));
const router = (0, express_1.Router)();
router.use(Authanction_contrlloer_1.default);
router.use(Follow_contrlloer_1.default);
exports.default = router;
