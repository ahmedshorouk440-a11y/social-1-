import mongoose from 'mongoose';
import {
  BadRequestExcption,
  NotFoundExcption,
} from '../../common/Excption/Excption';
import { IAuth } from '../../common/Interface/Auth.interFace';
import { IFollow } from '../../common/Interface/Follow.interace';
import { DataBaseRepositry } from '../../common/Repositry/dataBaseRepositry';
import { AuthModel } from '../../model/Authanction.model';
import { FollowModel } from '../../model/Follow.model';

export class FollowService {
  private FollowRepositry: DataBaseRepositry<IFollow>;
  private AuthRepositry: DataBaseRepositry<IAuth>;

  constructor() {
    this.AuthRepositry = new DataBaseRepositry<IAuth>(AuthModel);
    this.FollowRepositry = new DataBaseRepositry<IFollow>(FollowModel);
  }
  async follow(currentUserId: string, targetId: string) {
    if (typeof targetId !== 'string' || !mongoose.isValidObjectId(targetId)) {
      throw new BadRequestExcption('Invalid TargetId');
    }
    if (currentUserId === targetId) {
      throw new BadRequestExcption("You can't follow yourself");
    }
    const target = await this.AuthRepositry.findById({ id: targetId });
    if (!target) throw new BadRequestExcption('User Not Found');
    const exists = await this.FollowRepositry.findOne({
      filter: { followerId: currentUserId, followingId: targetId },
    });
    if (exists) throw new BadRequestExcption('Already following this user');

    const status = target.isPrivate ? 'pending' : 'accepted';

await this.FollowRepositry.create({
  followerId: new mongoose.Types.ObjectId(currentUserId),
  followingId: new mongoose.Types.ObjectId(targetId),
  status,
});

return {
  message: status === 'pending' ? 'Follow request sent' : 'Followed successfully',
};
  }
  async unfollow(currentUserId: string, targetId: string) {
    if (typeof targetId !== 'string' || !mongoose.isValidObjectId(targetId)) {
      throw new BadRequestExcption('Invalid targetId');
    }
    const user = await this.AuthRepositry.findById({ id: targetId });
    if (!user) {
      throw new NotFoundExcption('User Not Found');
    }
    const result = await this.FollowRepositry.deleteOne({
      filter: {
        followerId: new mongoose.Types.ObjectId(currentUserId),
        followingId: new mongoose.Types.ObjectId(targetId),
      },
    });

    if (result.deletedCount === 0) {
      throw new BadRequestExcption('You are not following this user');
    }

    return { message: 'Unfollowed successfully' };
  }
  async getFollowers(userId: string) {
    if (typeof userId !== 'string' || !mongoose.isValidObjectId(userId)) {
      throw new BadRequestExcption('Invalid userId');
    }

    const followers = await this.FollowRepositry.findAll({
      filter: { followingId: userId, status: 'accepted' },
      select: null,
      populate: { path: 'followerId', select: 'FullName profileImage' },
    });

    return { count: followers.length, followers };
  }

  async getFollowing(userId: string) {
    if (typeof userId !== 'string' || !mongoose.isValidObjectId(userId)) {
      throw new BadRequestExcption('Invalid userId');
    }

    const following = await this.FollowRepositry.findAll({
      filter: { followerId: userId, status: 'accepted' },
      select: null,
      populate: { path: 'followingId', select: 'FullName profileImage' },
    });

    return { count: following.length, following };
  }
}
export default new FollowService();
