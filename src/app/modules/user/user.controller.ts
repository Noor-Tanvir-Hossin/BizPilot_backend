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

const suggestedUserProfile = catchAsync(async(req ,res)=>{

    
    const id= req.user?._id
    console.log(id);
    
    const result = await UserService.suggestedUserProfile(id)
    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Suugested user profile get successfully',
      data : result,
    })
  })
const followUnfollow = catchAsync(async(req ,res)=>{

    
    const userId= req.user?._id
    const targetedUserId= req.params.id

    console.log(userId);
    
    const result = await UserService.followUnfollow(userId, targetedUserId )
    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: result.isFollowing ? 'Unfollowed successfully' : 'Followed Successfulyy' ,
      data : result.updateLoggedInUser,
    })
  })

const getMe = catchAsync(async(req ,res)=>{

    
    const user= req.user

    console.log(user);
    if(!user){
      throw new AppError(StatusCodes.NOT_FOUND,"User Not Authenticated")
    }

    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Authenticated User',
      data : user,
    })
  })

  export const UserControllers = {
    getUserProfile,
    editUserProfile,
    suggestedUserProfile,
    followUnfollow,
    getMe
  }