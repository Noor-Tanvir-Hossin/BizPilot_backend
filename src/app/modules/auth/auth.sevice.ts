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


const register = async (payload: Partial<Tuser>) => {
    const { email,name, password }= payload

    const existingUser = await User.findOne({email})

    if(existingUser){
      throw new AppError(StatusCodes.BAD_REQUEST, "Email already exist")
    }

    const otp= generateOtp()
    const otpExpires= Date.now() + 24*60*60*100;
    
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

  const verifyAccount = async(otp:string, user:HydratedDocument<Tuser>)=>{
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

export const AuthService = {
    register,
    verifyAccount
}