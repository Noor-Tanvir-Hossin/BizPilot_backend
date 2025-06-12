import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { Tuser } from "../user/user.interface";
import { User } from "../user/user.model";
import { generateOtp } from "../../utils/generateOtp";
import { loadTemplate } from "./auth.utils";
import { sendEmail } from "../../utils/email";
import jwt from 'jsonwebtoken';
import config from "../../config";
import { HydratedDocument } from 'mongoose';


const registerIntoDB = async (payload: Partial<Tuser>) => {
    const { email,name, password }= payload

    const existingUser = await User.findOne({email})

    if(existingUser){
      throw new AppError(StatusCodes.BAD_REQUEST, "Email already exist")
    }

    const otp= generateOtp()
    const otpExpires= Date.now() + 24*60*60*1000;
    
    const newUser = await User.create({
      name,email,password,otp,otpExpires
    });

    const htmlTemplate = loadTemplate("otpTemplate.hbs",{
      title:"Otp Verification",
      username: newUser.name,
      otp,
      message:"Your one-time password (OTP) for account verification : "
    })
    let accessToken = "";

    try {
      await sendEmail({
        email:newUser.email,
        subject: "OTP for Email Verfication",
        html: htmlTemplate
      })
      const jwtPayload = {
        email: newUser?.email,
      };
    
       accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
        expiresIn: '10d',
      });
    
    } catch (error) {
      await User.findByIdAndDelete(newUser.id);
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,'There is an error while creating the account. Please try again later !')
    }


    return {newUser, accessToken}
  };


const verifyAccountByOtp = async(otp:string, user:HydratedDocument<Tuser>)=>{
  
    if(!otp){
      throw new AppError(StatusCodes.BAD_REQUEST,"Otp is required for verfication.")
    }

    if(user.otp !== otp){
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Otp")
    }
    if(!user.otpExpires || Date.now() > user.otpExpires.getTime()){
      throw new AppError(StatusCodes.BAD_REQUEST, 'Otp has expired. Please request a new otp')
    }

    const jwtPayload = {
      email: user?.email,
    };
  
     const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
      expiresIn: '10d',
    });
 
    user.isVarified=true;
    user.otp=undefined;
    user.otpExpires=undefined;
    
    await user.save({validateBeforeSave:false})
    return {user, accessToken}
    
  }


const verifyByResendOtp=async(user:HydratedDocument<Tuser>)=>{
  const email=user.email
  if(!email){
    throw new AppError(StatusCodes.BAD_REQUEST,"Email is required")
  }
  const dbUser = await User.findOne({email})
  if(!dbUser){
    throw new AppError(StatusCodes.BAD_REQUEST,"User not found")
  }
  if(dbUser.isVarified){
    throw new AppError(StatusCodes.BAD_REQUEST,"Account is verified")
  }
  const otp= generateOtp()
  const otpExpires=new Date(Date.now() + 24 * 60 * 60 * 1000);
  dbUser.otp= otp
  dbUser.otpExpires=otpExpires

  await dbUser.save({validateBeforeSave: false})
  const htmlTemplate = loadTemplate("otpTemplate.hbs",{
    title:"Otp Verification",
    username: dbUser.name,
    otp,
    message:"Your one-time password (OTP) for account verification : "
  })
  
  try {
    await sendEmail({
      email:dbUser.email,
      subject: "Resend otp for email verificaiton",
      html: htmlTemplate
    })
  } catch (error) {
    dbUser.otp=undefined;
    dbUser.otpExpires=undefined;
    await dbUser.save({validateBeforeSave:false})
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"There is an wrror sending email. Try again later!")
  }
}

export const AuthService = {
    registerIntoDB,
    verifyAccountByOtp,
    verifyByResendOtp
}