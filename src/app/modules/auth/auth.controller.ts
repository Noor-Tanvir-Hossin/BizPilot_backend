import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/cathchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.sevice";


const register = catchAsync(async(req, res)=>{
    const result = await AuthService.register(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User created succesfully',
        data: result,
      });
})



export const AuthControllers = {
    register,
    
}