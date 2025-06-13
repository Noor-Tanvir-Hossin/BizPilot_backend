import AppError from "../../error/AppError";
import catchAsync from "../../utils/cathchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import { StatusCodes } from 'http-status-codes';

const getUserProfile = catchAsync(async(req ,res)=>{

    const{id}=req.params
    const result = await UserService.getUserProfileFromDB(id)
    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User profile get successfully',
      data : result,
    })
  })

const editUserProfile = catchAsync(async(req ,res)=>{

    
    const id= req.user?.id
    const{bio}=req.body
    const profilePicture=req.file
    const result = await UserService.editUserProfileIntoDB(id, bio, profilePicture)
    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User profile updated successfully',
      data : result,
    })
  })

  export const UserControllers = {
    getUserProfile,
    editUserProfile
  }