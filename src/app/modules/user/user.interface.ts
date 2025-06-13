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
    resetPasswordOtp:string | undefined ,
    resetPasswordOtpExpires: Date | undefined,
    role: string;
    passwordChangeAt: Date;
  }

  export interface IUserMethods {
    correctPassword: (userPassword: string, databasePassword: string) => Promise<boolean>;
  }
  