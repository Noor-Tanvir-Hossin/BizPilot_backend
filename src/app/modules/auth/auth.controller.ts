import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/cathchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.sevice";
import { Tuser } from "../user/user.interface";
import { HydratedDocument } from "mongoose";


const register = catchAsync(async(req, res)=>{
    const result = await AuthService.register(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Registration succesfull. Check your email for otp verfication.',
        token:result?.accessToken as string,
        data: result?.newUser,
      });
})

const verifyAccount = catchAsync(async(req, res)=>{
    console.log(req.user)
    console.log(req.body)
    const{otp}=req.body
    const user=req.user as HydratedDocument<Tuser>
    const result = await AuthService.verifyAccount(otp, user);
    
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Email has been verified.',
        token: result?.accessToken,
        data: result?.user,
      });
})





export const AuthControllers = {
    register,
    verifyAccount
}