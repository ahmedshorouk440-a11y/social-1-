import { Types } from "mongoose";

export interface IFollow {
  followerId: Types.ObjectId | string;
  followingId: Types.ObjectId |string; 
  status: 'pending' | 'accepted'; 
}