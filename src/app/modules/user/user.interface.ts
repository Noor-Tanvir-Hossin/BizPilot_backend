import mongoose from "mongoose";

export interface Tuser {
    name: string;
    email: string;
    password: string;
    profilePicture?:string;
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
  