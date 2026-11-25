"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const dataBaseRepositry_1 = require("../../common/Repositry/dataBaseRepositry");
const Authanction_model_1 = require("../../model/Authanction.model");
const Excption_1 = require("../../common/Excption/Excption");
const Hash_1 = require("../../common/Hash/Hash");
const Token_services_1 = require("../../common/Services/Token.services");
const otp_1 = require("../../common/Services/Email/otp");
const Redis_service_1 = require("../../common/Services/Redis.service");
const sendEmail_1 = require("../../common/Services/Email/sendEmail");
const Enum_1 = require("../../common/Enums/Enum");
const Email_Event_1 = require("../../common/Services/Email/Email.Event");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const configService_1 = require("../../common/Config/configService");
const mongoose_1 = __importDefault(require("mongoose"));
const Follow_model_1 = require("../../model/Follow.model");
class AuthService {
    AuthRepositry;
    FollowRepositry;
    client = new google_auth_library_1.OAuth2Client();
    constructor() {
        this.AuthRepositry = new dataBaseRepositry_1.DataBaseRepositry(Authanction_model_1.AuthModel);
        this.FollowRepositry = new dataBaseRepositry_1.DataBaseRepositry(Follow_model_1.FollowModel);
    }
    async register(data) {
        const { FullName, email, password } = data;
        const exists = await this.AuthRepositry.findOne({ filter: { email } });
        if (exists) {
            throw new Excption_1.BadRequestExcption('Email already exists');
        }
        const user = await this.AuthRepositry.create({
            FullName,
            email,
            password: await (0, Hash_1.hash)(password),
        });
        const code = (0, otp_1.createOtp)();
        await Redis_service_1.redisServices.set((0, sendEmail_1.UserEmailKey)({ email, subject: Enum_1.EmailSubjectEnum.VERIFY_EMAIL }), await (0, Hash_1.hash)(code.toString()), 120);
        let { accessToken } = (0, Token_services_1.generateToken)(user);
        let html = `
      <h1>Welcome</h1>
      <a href="http://localhost:3000/varify-account?token=${accessToken}"> Complete Your Varfication </a>
     `;
        Email_Event_1.emailEvent.emit('sendEmail', {
            recipients: { to: email },
            subject: 'Verify your account',
            html,
            data: { code },
        });
        return {
            user,
            message: 'User registered successfully',
        };
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.AuthRepositry.findOne({ filter: { email } });
        if (!user) {
            throw new Excption_1.BadRequestExcption('Invalid email or password');
        }
        const isMatch = await (0, Hash_1.compare)(password, user.password);
        if (!isMatch) {
            throw new Excption_1.BadRequestExcption('Invalid email or password');
        }
        const { accessToken, refreshToken } = await (0, Token_services_1.generateToken)(user);
        return {
            message: 'User logged in successfully',
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
    async GetUserById(id) {
        const user = await this.AuthRepositry.findById({ id });
        if (!user) {
            throw new Excption_1.NotFoundExcption('User Not Found');
        }
        return user;
    }
    async varfy(params) {
        let { token } = params;
        let decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.id) {
            throw new Excption_1.BadRequestExcption('Invalid Token');
        }
        let updateUser = await this.AuthRepositry.updateById({
            id: decoded.id,
            update: { isVerfied: true },
        });
        return { message: 'Account varifed' };
    }
    async RequestForgetPassword(email) {
        let account = await this.AuthRepositry.findOne({
            filter: { email },
        });
        if (!account) {
            throw new Excption_1.NotFoundExcption('User with this email not exists');
        }
        const code = (0, otp_1.createOtp)();
        await Redis_service_1.redisServices.set((0, sendEmail_1.UserEmailKey)({ email, subject: Enum_1.EmailSubjectEnum.FORGET_PASSWORD }), await (0, Hash_1.hash)(code.toString()), 120);
        Email_Event_1.emailEvent.emit('sendEmail', {
            recipients: { to: email },
            subject: Enum_1.EmailSubjectEnum.FORGET_PASSWORD,
            data: { code, name: account.FullName },
        });
        return { message: 'If the email exists, a reset code has been sent' };
    }
    async VerifyConfirmPassword(otp, email) {
        const data = await this.AuthRepositry.findOne({ filter: { email } });
        if (!data) {
            throw new Excption_1.NotFoundExcption('Invalid Account');
        }
        const hashedOtp = await Redis_service_1.redisServices.get((0, sendEmail_1.UserEmailKey)({ email, subject: Enum_1.EmailSubjectEnum.FORGET_PASSWORD }));
        if (!hashedOtp) {
            throw new Excption_1.BadRequestExcption('Code expired or not found');
        }
        const Ismatch = await (0, Hash_1.compare)(String(otp), hashedOtp);
        if (!Ismatch) {
            throw new Excption_1.BadRequestExcption('Invalid code');
        }
        return { message: 'verified password Successfully' };
    }
    async ResitPassword(otp, email, newPassword) {
        await this.VerifyConfirmPassword(otp, email);
        const account = await this.AuthRepositry.findOne({ filter: { email } });
        if (!account) {
            throw new Excption_1.BadRequestExcption('Invalid Account');
        }
        account.password = await (0, Hash_1.hash)(newPassword);
        await account.save();
        await Redis_service_1.redisServices.del((0, sendEmail_1.UserEmailKey)({ email, subject: Enum_1.EmailSubjectEnum.FORGET_PASSWORD }));
        return { message: 'Password reset successfully' };
    }
    async verifyGoogleAccount(idToken) {
        let payload;
        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: configService_1.env.WEB_CLIENT_ID,
            });
            payload = ticket.getPayload();
        }
        catch (error) {
            throw new Excption_1.BadRequestExcption('Invalid Google Account');
        }
        console.log('Google payload:', payload);
        if (!payload) {
            throw new Excption_1.BadRequestExcption('Invalid Google Account');
        }
        if (!payload.email_verified)
            throw new Excption_1.BadRequestExcption('Email Not Verifed');
        return payload;
    }
    async LoginWithGoogle(idToken) {
        const payload = await this.verifyGoogleAccount(idToken);
        const { email, name, picture } = payload;
        if (!email)
            throw new Excption_1.BadRequestExcption('Email not found in Google account');
        const fullName = name ?? email.split('@')[0] ?? 'User';
        let user = await this.AuthRepositry.findOne({ filter: { email } });
        if (!user) {
            user = await this.AuthRepositry.create({
                FullName: fullName,
                email,
                profileImage: picture,
                provider: Enum_1.ProviderEnum.GOOGLE,
                confirmEmail: new Date(),
            });
        }
        else {
            user.FullName = fullName;
            if (picture)
                user.profileImage = picture;
            if (!user.confirmEmail)
                user.confirmEmail = new Date();
            await user.save();
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, configService_1.env.USERSIGNATUR, {
            expiresIn: '1d',
        });
        return {
            user: {
                name: user.FullName,
                email: user.email,
                picture: user.profileImage,
            },
            token,
        };
    }
    async generateAccessToken(body) {
        const { refreshToken } = body;
        if (!refreshToken) {
            throw new Excption_1.BadRequestExcption('Refresh Token is required');
        }
        const accessToken = await (0, Token_services_1.generateAccessToken)(refreshToken);
        return { accessToken };
    }
    async GetMyProfile(userId) {
        try {
            if (typeof userId !== 'string' || !mongoose_1.default.isValidObjectId(userId)) {
                throw new Excption_1.BadRequestExcption('Invalid userId');
            }
            const user = await this.AuthRepositry.findById({
                id: userId,
                select: 'FullName profileImage bio',
            });
            if (!user) {
                throw new Excption_1.NotFoundExcption('User Not Found');
            }
            const followers = await this.FollowRepositry.findAll({
                filter: { followingId: userId, status: 'accepted' },
                select: null,
            });
            const following = await this.FollowRepositry.findAll({
                filter: { followerId: userId, status: 'accepted' },
                select: null,
            });
            return {
                user,
                followersCount: followers.length,
                followingCount: following.length,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateMyProfile(userId, body) {
        const update = {};
        if (typeof userId !== "string" || !mongoose_1.default.isValidObjectId(userId)) {
            throw new Excption_1.BadRequestExcption("invalid UserId");
        }
        if (body.FullName !== undefined) {
            if (typeof body.FullName !== 'string' || !body.FullName.trim()) {
                throw new Excption_1.BadRequestExcption("FullName can not be empty");
            }
            update.FullName = body.FullName.trim();
        }
        if (body.profileImage !== undefined)
            update.profileImage = body.profileImage;
        if (body.bio !== undefined)
            update.bio = body.bio;
        if (Object.keys(update).length === 0) {
            throw new Excption_1.BadRequestExcption('Nothing to update');
        }
        const user = await this.AuthRepositry.updateById({
            id: userId,
            update,
        });
        if (!user) {
            throw new Excption_1.NotFoundExcption('User Not Found');
        }
        return {
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                FullName: user.FullName,
                profileImage: user.profileImage,
                bio: user.bio,
            },
        };
    }
    async searchUsers(currentUserId, q) {
        if (typeof q !== 'string' || q.trim().length < 2) {
            throw new Excption_1.BadRequestExcption('Search text must be at least 2 characters');
        }
        const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const users = await this.AuthRepositry.findAll({
            filter: {
                FullName: { $regex: safe, $options: 'i' },
                _id: { $ne: new mongoose_1.default.Types.ObjectId(currentUserId) },
            },
            select: 'FullName profileImage',
        }).limit(20);
        return { count: users.length, users };
    }
    async Suggestions(currentUserId) {
        const myFollowing = await this.FollowRepositry.findAll({
            filter: { followerId: currentUserId },
            select: null,
        });
        const excludes = myFollowing.map((f) => new mongoose_1.default.Types.ObjectId(f.followingId.toString()));
        excludes.push(new mongoose_1.default.Types.ObjectId(currentUserId));
        const users = await this.AuthRepositry.findAll({
            filter: { _id: { $nin: excludes } },
            select: 'FullName profileImage',
        }).limit(10);
        return { count: users.length, users };
    }
    async updatePrivacy(userId, isPrivate) {
        if (typeof isPrivate !== 'boolean') {
            throw new Excption_1.BadRequestExcption('isPrivate must be true or false');
        }
        const user = await this.AuthRepositry.updateById({
            id: userId,
            update: { isPrivate },
        });
        if (!user)
            throw new Excption_1.NotFoundExcption('User Not Found');
        if (!isPrivate) {
            await Follow_model_1.FollowModel.updateMany({ followingId: new mongoose_1.default.Types.ObjectId(userId), status: 'pending' }, { status: 'accepted' });
        }
        return {
            message: isPrivate ? 'Account is now private' : 'Account is now public',
            isPrivate: user.isPrivate,
        };
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
