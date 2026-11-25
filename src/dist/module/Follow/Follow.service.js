"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Excption_1 = require("../../common/Excption/Excption");
const dataBaseRepositry_1 = require("../../common/Repositry/dataBaseRepositry");
const Authanction_model_1 = require("../../model/Authanction.model");
const Follow_model_1 = require("../../model/Follow.model");
class FollowService {
    FollowRepositry;
    AuthRepositry;
    constructor() {
        this.AuthRepositry = new dataBaseRepositry_1.DataBaseRepositry(Authanction_model_1.AuthModel);
        this.FollowRepositry = new dataBaseRepositry_1.DataBaseRepositry(Follow_model_1.FollowModel);
    }
    async follow(currentUserId, targetId) {
        if (typeof targetId !== 'string' || !mongoose_1.default.isValidObjectId(targetId)) {
            throw new Excption_1.BadRequestExcption('Invalid TargetId');
        }
        if (currentUserId === targetId) {
            throw new Excption_1.BadRequestExcption("You can't follow yourself");
        }
        const target = await this.AuthRepositry.findById({ id: targetId });
        if (!target)
            throw new Excption_1.BadRequestExcption('User Not Found');
        const exists = await this.FollowRepositry.findOne({
            filter: { followerId: currentUserId, followingId: targetId },
        });
        if (exists)
            throw new Excption_1.BadRequestExcption('Already following this user');
        const status = target.isPrivate ? 'pending' : 'accepted';
        await this.FollowRepositry.create({
            followerId: new mongoose_1.default.Types.ObjectId(currentUserId),
            followingId: new mongoose_1.default.Types.ObjectId(targetId),
            status,
        });
        return {
            message: status === 'pending' ? 'Follow request sent' : 'Followed successfully',
        };
    }
    async unfollow(currentUserId, targetId) {
        if (typeof targetId !== 'string' || !mongoose_1.default.isValidObjectId(targetId)) {
            throw new Excption_1.BadRequestExcption('Invalid targetId');
        }
        const user = await this.AuthRepositry.findById({ id: targetId });
        if (!user) {
            throw new Excption_1.NotFoundExcption('User Not Found');
        }
        const result = await this.FollowRepositry.deleteOne({
            filter: {
                followerId: new mongoose_1.default.Types.ObjectId(currentUserId),
                followingId: new mongoose_1.default.Types.ObjectId(targetId),
            },
        });
        if (result.deletedCount === 0) {
            throw new Excption_1.BadRequestExcption('You are not following this user');
        }
        return { message: 'Unfollowed successfully' };
    }
    async getFollowers(userId) {
        if (typeof userId !== 'string' || !mongoose_1.default.isValidObjectId(userId)) {
            throw new Excption_1.BadRequestExcption('Invalid userId');
        }
        const followers = await this.FollowRepositry.findAll({
            filter: { followingId: userId, status: 'accepted' },
            select: null,
            populate: { path: 'followerId', select: 'FullName profileImage' },
        });
        return { count: followers.length, followers };
    }
    async getFollowing(userId) {
        if (typeof userId !== 'string' || !mongoose_1.default.isValidObjectId(userId)) {
            throw new Excption_1.BadRequestExcption('Invalid userId');
        }
        const following = await this.FollowRepositry.findAll({
            filter: { followerId: userId, status: 'accepted' },
            select: null,
            populate: { path: 'followingId', select: 'FullName profileImage' },
        });
        return { count: following.length, following };
    }
}
exports.FollowService = FollowService;
exports.default = new FollowService();
