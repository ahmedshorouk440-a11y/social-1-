"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authanction_service_1 = __importDefault(require("./Authanction.service"));
const validation_services_1 = require("../../common/Services/validation.services");
const Authanction_validation_1 = require("./Authanction.validation");
const Responce_1 = require("../../common/Responce/Responce");
const Auth_middle_1 = require("../../middleware/Auth.middle");
const Excption_1 = require("../../common/Excption/Excption");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json('Auth is Running Successfully');
});
router.post("/Register", (0, validation_services_1.validation)(Authanction_validation_1.SignUpScema), async (req, res, next) => {
    try {
        let data = await Authanction_service_1.default.register(req.body);
        res.json({ message: "done", data });
    }
    catch (error) {
        next(error);
    }
});
router.post("/Login", (0, validation_services_1.validation)(Authanction_validation_1.LoginSchema), async (req, res) => {
    let data = await Authanction_service_1.default.login(req.body);
    res.json({ message: "Done", data });
});
router.get("/GetUserById", Auth_middle_1.auth, async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Excption_1.BadRequestExcption('Unauthorized');
        let data = await Authanction_service_1.default.GetUserById(req.userId);
        (0, Responce_1.SuccessResponce)({ res, data, message: "User registered successfully", status: 201 });
    }
    catch (error) {
        next(error);
    }
});
router.post("/Generate-Access-Token", async (req, res, next) => {
    try {
        let data = await Authanction_service_1.default.generateAccessToken(req.body);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.get("/MyProfile", Auth_middle_1.auth, async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Excption_1.BadRequestExcption("Unauthorized");
        let data = await Authanction_service_1.default.GetMyProfile(req.userId);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/Update-my-profile/:id", Auth_middle_1.auth, async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Excption_1.BadRequestExcption("Unauthorized");
        let data = await Authanction_service_1.default.updateMyProfile(req.userId, req.body);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.get("/Search", Auth_middle_1.auth, async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Excption_1.UnauthrizedExption("Unauthorized");
        let data = await Authanction_service_1.default.searchUsers(req.userId, req.query.q);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.get("/suggestions", Auth_middle_1.auth, async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Excption_1.BadRequestExcption("Unauthorized");
        let data = await Authanction_service_1.default.Suggestions(req.userId);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/UpdatePrivacy", Auth_middle_1.auth, async (req, res, next) => {
    try {
        if (!req.userId)
            throw new Excption_1.BadRequestExcption("Unauthorized");
        let data = await Authanction_service_1.default.updatePrivacy(req.userId, req.body.isPrivate);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.get("/varify-account", async (req, res, next) => {
    try {
        let data = await Authanction_service_1.default.varfy(req.query);
        (0, Responce_1.SuccessResponce)({ res, data, message: "account varifed" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/Request-Forget-Password", async (req, res, next) => {
    try {
        const { email } = req.body;
        let data = await Authanction_service_1.default.RequestForgetPassword(email);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/Verify-confirm-password", async (req, res, next) => {
    try {
        let { otp, email } = req.body;
        let data = await Authanction_service_1.default.VerifyConfirmPassword(otp, email);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/ResitPassword", async (req, res, next) => {
    try {
        let { otp, email, newPassword } = req.body;
        let data = await Authanction_service_1.default.ResitPassword(otp, email, newPassword);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        next(error);
    }
});
router.post("/auth/google", async (req, res, next) => {
    try {
        let data = await Authanction_service_1.default.LoginWithGoogle(req.body.idToken);
        (0, Responce_1.SuccessResponce)({ res, data, message: "Done" });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.default = router;
