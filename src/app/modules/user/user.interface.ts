import mongoose from "mongoose";

export interface Tuser {
    name: string;
    email: string;
    password: string;
    profilePicture?:string;
    bio?:string;
    followers?:mongoose.Types.ObjectId[];
    following?:mongoose.Types.ObjectId[];
    posts?:mongoose.Types.ObjectId[];
    savePosts?:mongoose.Types.ObjectId[];
    isVarified:boolean;
    otp:string | undefined,
    otpExpires:Date | undefined,
    resetPasswordOtp:string ,
    resetPasswordOtpExpires:string,
    role: string;
    passwordChangeAt: Date;
  }
  