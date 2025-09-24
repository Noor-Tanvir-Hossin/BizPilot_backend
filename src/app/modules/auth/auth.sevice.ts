import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { Tuser } from "../user/user.interface";
import { User } from "../user/user.model";
import { generateOtp } from "../../utils/generateOtp";
import { loadTemplate } from "./auth.utils";
import { sendEmail } from "../../utils/email";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../../config";
import { HydratedDocument } from 'mongoose';


const registerIntoDB = async (payload: Partial<Tuser>) => {
    const { email,name, password }= payload

    const existingUser = await User.findOne({email})

    if(existingUser){
      throw new AppError(StatusCodes.BAD_REQUEST, "Email already exist")
    }

    // const otp= generateOtp()
    // const otpExpires= Date.now() + 24*60*60*1000;
    
    const newUser = await User.create({
      name,email,password
    });    
    let accessToken = "";



    // const htmlTemplate = loadTemplate("otpTemplate.hbs",{
    //   title:"Otp Verification",
    //   username: newUser.name,
    //   otp,
    //   message:"Your one-time password (OTP) for account verification : "
    // })
    const jwtPayload = {
        email: newUser?.email,
      };
    
     accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
        expiresIn: '10d',
      });
      const refreshToken = jwt.sign(
        jwtPayload,
        config.jwt_refresh_token as string,
        { expiresIn: '365d' },
      );

    // try {
    //   await sendEmail({
    //     email:newUser.email,
    //     subject: "OTP for Email Verfication",
    //     html: htmlTemplate
    //   })
    //   const jwtPayload = {
    //     email: newUser?.email,
    //   };
    
    //    accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    //     expiresIn: '10d',
    //   });
    //   const refreshToken = jwt.sign(
    //     jwtPayload,
    //     config.jwt_refresh_token as string,
    //     { expiresIn: '365d' },
    //   );
    
    // } catch (error) {
    //   console.error("Email sending failed", error);
    //   await User.findByIdAndDelete(newUser.id);
    //   throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,'There is an error while creating the account. Please try again later !')
    // }


    return {newUser, accessToken, refreshToken}
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

const login = async(email:string,password:string)=>{
  if(!email || !password){
    throw new AppError(StatusCodes.BAD_REQUEST,"Please provide email and password")
  }

  const user = await User.findOne({email}).select("+password")
  
  if(!user || !(await user.correctPassword(password,user.password))){
    throw new AppError(StatusCodes.UNAUTHORIZED,"Incorrect email or password")
  }

  const jwtPayload = {
    email: user?.email,
  };

   const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_token as string,
    { expiresIn: '365d' },
  );

  return {user, accessToken,refreshToken}

}

const forgetPassword= async(email:string)=>{
  const user = await User.findOne({email});
  if(!user){
    throw new AppError(StatusCodes.BAD_REQUEST,"User not found")
  }
  const otp = generateOtp();
  const resetOtpExpires= new Date(Date.now() + 300000);

  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpires = resetOtpExpires;

  await user.save({validateBeforeSave:false})

  const htmlTemplate = loadTemplate("otpTemplate.hbs",{
    title: "Reset Password OTP",
    username: user.name,
    otp,
    message: "Your Passsword reset otp is",
  })
  try {
    await sendEmail ({
      email: user.email,
      subject : "Password reset OTP (valid for 5min)",
      html:htmlTemplate
    })

  } catch (error) {
    console.log("Email sending error:", error);
    user.resetPasswordOtp= undefined,
    user.resetPasswordOtpExpires= undefined,
    await user.save({validateBeforeSave:false})
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"There was an error sending the email. Try again later!")

  }
}

const resetPassword = async(email:string, password:string, otp:string)=>{
  const user = await User.findOne({
    email,
    resetPasswordOtp:otp,
    resetPasswordOtpExpires:{$gt:new Date()}
  })

  if(!user){
    throw new AppError(StatusCodes.BAD_REQUEST,"No User Found")
  }
  user.password=password
  user.resetPasswordOtp=undefined
  user.resetPasswordOtpExpires=undefined

  await user.save()
  const jwtPayload = {
    email: user?.email,
  };

   const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });
  return{user, accessToken}
}

const changePassword = async(email:string, currentPass:string, newPass:string) => {

  const user = await User.findOne({email}).select("+password")
  if(!user){
    throw new AppError(StatusCodes.BAD_REQUEST,"User Not Found")
  }
  if(!(await user.correctPassword(currentPass,user.password))){
    throw new AppError(StatusCodes.BAD_REQUEST,"Incorret current password!")
  }
  user.password=newPass
  user.passwordChangeAt = new Date();
  await user.save()

  const jwtPayload = {
    email: user?.email,
  };

   const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });

  return{user, accessToken}

}
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
  }

  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string,
  ) as JwtPayload;

  const { email } = decoded;

  // checking if the user is exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
  };
};

export const AuthService = {
    registerIntoDB,
    verifyAccountByOtp,
    verifyByResendOtp,
    login,
    forgetPassword,
    resetPassword,
    changePassword,
    refreshToken
}