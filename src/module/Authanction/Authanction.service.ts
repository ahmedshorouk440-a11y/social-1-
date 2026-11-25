import { IAuth } from '../../common/Interface/Auth.interFace';
import { DataBaseRepositry } from '../../common/Repositry/dataBaseRepositry';
import { AuthModel } from '../../model/Authanction.model';
import {
  BadRequestExcption,
  NotFoundExcption,
} from '../../common/Excption/Excption';
import { compare, hash } from '../../common/Hash/Hash';
import {
  generateAccessToken,
  generateToken,
} from '../../common/Services/Token.services';
import { createOtp } from '../../common/Services/Email/otp';

import { redisServices } from '../../common/Services/Redis.service';
import { UserEmailKey } from '../../common/Services/Email/sendEmail';
import { EmailSubjectEnum, ProviderEnum } from '../../common/Enums/Enum';
import { emailEvent } from '../../common/Services/Email/Email.Event';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { env } from '../../common/Config/configService';
import mongoose from 'mongoose';
import { IFollow } from '../../common/Interface/Follow.interace';
import { FollowModel } from '../../model/Follow.model';
type RefreshTokenBody = {
  refreshToken: string;
};
type UpdateProfileBody = {
  FullName?: string;
  profileImage?: string;
  bio?: string;
};

export class AuthService {
  private AuthRepositry: DataBaseRepositry<IAuth>;
  private FollowRepositry: DataBaseRepositry<IFollow>;
  private client = new OAuth2Client();

  constructor() {
    this.AuthRepositry = new DataBaseRepositry<IAuth>(AuthModel);
    this.FollowRepositry = new DataBaseRepositry<IFollow>(FollowModel);
  }

  async register(data: IAuth) {
    const { FullName, email, password } = data;

    const exists = await this.AuthRepositry.findOne({ filter: { email } });
    if (exists) {
      throw new BadRequestExcption('Email already exists');
    }

    const user = await this.AuthRepositry.create({
      FullName,
      email,
      password: await hash(password),
    });

    const code = createOtp();
    await redisServices.set(
      UserEmailKey({ email, subject: EmailSubjectEnum.VERIFY_EMAIL }),
      await hash(code.toString()),
      120,
    );
    let { accessToken } = generateToken(user);
    let html = `
      <h1>Welcome</h1>
      <a href="http://localhost:3000/varify-account?token=${accessToken}"> Complete Your Varfication </a>
     `;
    emailEvent.emit('sendEmail', {
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

  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await this.AuthRepositry.findOne({ filter: { email } });
    if (!user) {
      throw new BadRequestExcption('Invalid email or password');
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestExcption('Invalid email or password');
    }
    const { accessToken, refreshToken } = await generateToken(user);

    return {
      message: 'User logged in successfully',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  async GetUserById(id: string) {
    const user = await this.AuthRepositry.findById({ id });
    if (!user) {
      throw new NotFoundExcption('User Not Found');
    }
    return user;
  }

  async varfy(params: any) {
    let { token } = params;

    let decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.id) {
      throw new BadRequestExcption('Invalid Token');
    }
    let updateUser = await this.AuthRepositry.updateById({
      id: decoded.id,
      update: { isVerfied: true },
    });
    return { message: 'Account varifed' };
  }
  async RequestForgetPassword(email: string) {
    let account = await this.AuthRepositry.findOne({
      filter: { email },
    });
    if (!account) {
      throw new NotFoundExcption('User with this email not exists');
    }
    const code = createOtp();
    await redisServices.set(
      UserEmailKey({ email, subject: EmailSubjectEnum.FORGET_PASSWORD }),
      await hash(code.toString()),
      120,
    );
    emailEvent.emit('sendEmail', {
      recipients: { to: email },
      subject: EmailSubjectEnum.FORGET_PASSWORD,
      data: { code, name: account.FullName },
    });
    return { message: 'If the email exists, a reset code has been sent' };
  }
  async VerifyConfirmPassword(otp: string, email: string) {
    const data = await this.AuthRepositry.findOne({ filter: { email } });

    if (!data) {
      throw new NotFoundExcption('Invalid Account');
    }
    const hashedOtp = await redisServices.get(
      UserEmailKey({ email, subject: EmailSubjectEnum.FORGET_PASSWORD }),
    );
    if (!hashedOtp) {
      throw new BadRequestExcption('Code expired or not found');
    }
    const Ismatch = await compare(String(otp), hashedOtp);
    if (!Ismatch) {
      throw new BadRequestExcption('Invalid code');
    }
    return { message: 'verified password Successfully' };
  }
  async ResitPassword(otp: string, email: string, newPassword: string) {
    await this.VerifyConfirmPassword(otp, email);
    const account = await this.AuthRepositry.findOne({ filter: { email } });
    if (!account) {
      throw new BadRequestExcption('Invalid Account');
    }
    account.password = await hash(newPassword);
    await account.save();
    await redisServices.del(
      UserEmailKey({ email, subject: EmailSubjectEnum.FORGET_PASSWORD }),
    );
    return { message: 'Password reset successfully' };
  }

  async verifyGoogleAccount(idToken: string) {
    let payload: TokenPayload | undefined;
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: env.WEB_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (error) {
      throw new BadRequestExcption('Invalid Google Account');
    }

    console.log('Google payload:', payload);
    if (!payload) {
      throw new BadRequestExcption('Invalid Google Account');
    }
    if (!payload.email_verified)
      throw new BadRequestExcption('Email Not Verifed');
    return payload;
  }

  async LoginWithGoogle(idToken: string) {
    const payload = await this.verifyGoogleAccount(idToken);
    const { email, name, picture } = payload;

    if (!email)
      throw new BadRequestExcption('Email not found in Google account');

    const fullName: string = name ?? email.split('@')[0] ?? 'User';

    let user = await this.AuthRepositry.findOne({ filter: { email } });

    if (!user) {
      user = await this.AuthRepositry.create({
        FullName: fullName,
        email,
        profileImage: picture,
        provider: ProviderEnum.GOOGLE,
        confirmEmail: new Date(),
      });
    } else {
      user.FullName = fullName;
      if (picture) user.profileImage = picture;
      if (!user.confirmEmail) user.confirmEmail = new Date();
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, env.USERSIGNATUR, {
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

  async generateAccessToken(
    body: RefreshTokenBody,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = body;

    if (!refreshToken) {
      throw new BadRequestExcption('Refresh Token is required');
    }

    const accessToken = await generateAccessToken(refreshToken);

    return { accessToken };
  }

  async GetMyProfile(userId: string) {
    try {
      if (typeof userId !== 'string' || !mongoose.isValidObjectId(userId)) {
        throw new BadRequestExcption('Invalid userId');
      }
      const user = await this.AuthRepositry.findById({
        id: userId,
        select: 'FullName profileImage bio',
      });
      if (!user) {
        throw new NotFoundExcption('User Not Found');
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
    } catch (error) {
      throw error;
    }
  }
  async updateMyProfile(userId:string , body:UpdateProfileBody){
     
         const update:Partial<IAuth> = {}

         if(typeof userId !== "string" || !mongoose.isValidObjectId(userId)){
          throw new BadRequestExcption("invalid UserId")
         }
         if(body.FullName !== undefined){
                if (typeof body.FullName !== 'string' || !body.FullName.trim()) {
          throw new BadRequestExcption("FullName can not be empty")
         }
      
         update.FullName = body.FullName.trim();


        }
        if(body.profileImage !== undefined) update.profileImage = body.profileImage;
      if(body.bio !== undefined) update.bio = body.bio;
        if(Object.keys(update).length ===0){
          throw new BadRequestExcption('Nothing to update')
        }
        const user = await this.AuthRepositry.updateById({
         
          id: userId,
            update,
        })
        if(!user){
           throw new NotFoundExcption('User Not Found');
        }
         return {
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        FullName: user.FullName,
        profileImage: user.profileImage,
        bio: user.bio,
      },
     }
  }
  async searchUsers(currentUserId: string, q: string) {
  if (typeof q !== 'string' || q.trim().length < 2) {
    throw new BadRequestExcption('Search text must be at least 2 characters');
  }

  
  const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const users = await this.AuthRepositry.findAll({
    filter: {
      FullName: { $regex: safe, $options: 'i' }, 
      _id: { $ne: new mongoose.Types.ObjectId(currentUserId) }, 
    },
    select: 'FullName profileImage',
  }).limit(20);

  return { count: users.length, users };
}
   async Suggestions(currentUserId:string){
     const myFollowing = await this.FollowRepositry.findAll({
      filter:{followerId: currentUserId},
        select: null,
     });
     const excludes = myFollowing.map(
      (f) => new mongoose.Types.ObjectId(f.followingId.toString())
     );
     excludes.push(new mongoose.Types.ObjectId(currentUserId))
     
     const users =await this.AuthRepositry.findAll({
      filter:{_id:{$nin: excludes}},
       select: 'FullName profileImage',

     }).limit(10)
      return { count: users.length, users };
    }


async updatePrivacy(userId: string, isPrivate: boolean) {
  if (typeof isPrivate !== 'boolean') {
    throw new BadRequestExcption('isPrivate must be true or false');
  }

  const user = await this.AuthRepositry.updateById({
    id: userId,
    update: { isPrivate },
  });
  if (!user) throw new NotFoundExcption('User Not Found');

  
  if (!isPrivate) {
    await FollowModel.updateMany(
      { followingId: new mongoose.Types.ObjectId(userId), status: 'pending' },
      { status: 'accepted' },
    );
  }

  return {
    message: isPrivate ? 'Account is now private' : 'Account is now public',
    isPrivate: user.isPrivate,
  };
}


   }

export default new AuthService();
