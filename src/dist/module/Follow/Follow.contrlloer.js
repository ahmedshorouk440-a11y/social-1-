"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Follow_service_1 = __importDefault(require("./Follow.service"));
const Responce_1 = require("../../common/Responce/Responce");
const Auth_middle_1 = require("../../middleware/Auth.middle");
const Excption_1 = require("../../common/Excption/Excption");
const router = (0, express_1.Router)();
router.post("/:id/follow", Auth_middle_1.auth, async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Excption_1.UnauthrizedExption('Unauthorized');
        const data = await Follow_service_1.default.follow(req.userId, req.params.id);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
router.delete("/:id/unfollow", Auth_middle_1.auth, async (req, res, next) => {
    try {
        console.log("unfollow route hit", req.userId, req.params.id);
        if (!req.userId)
            throw new Excption_1.UnauthrizedExption('Unauthorized');
        let data = await Follow_service_1.default.unfollow(req.userId, req.params.id);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id/followers", Auth_middle_1.auth, async (req, res, next) => {
    try {
        let data = await Follow_service_1.default.getFollowers(req.params.id);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id/following", Auth_middle_1.auth, async (req, res, next) => {
    try {
        let data = await Follow_service_1.default.getFollowing(req.params.id);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
