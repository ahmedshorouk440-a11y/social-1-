

import mongoose, { Schema, Types } from 'mongoose';
import { IFollow } from '../common/Interface/Follow.interace';
const followSchema = new Schema<IFollow>(
  { followerId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  },
  { timestamps: true },
);
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const FollowModel = mongoose.model<IFollow>('Follow', followSchema);