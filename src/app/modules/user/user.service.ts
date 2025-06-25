import { StatusCodes } from "http-status-codes"
import AppError from "../../error/AppError"
import { User } from "./user.model"
import { getDataUri } from "../../utils/datauri"
import { uploadToCloudinary } from "../../utils/cloudinary"
import mongoose from "mongoose";

const getUserProfileFromDB = async(id:string)=>{
    const user= await User.findById(id)
    .select("-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires")
    .populate({
        path:'posts',
        options:{sort:{createdAt: -1}}
    }).populate({
        path: "savePosts",
        options:{sort:{createdAt: -1}}
    })

    if(!user){
        throw new AppError(StatusCodes.NOT_FOUND,"User Not Found")
    }

    return user
}
const editUserProfileIntoDB = async(id:string, bio?:string, profilePicture?:Express.Multer.File)=>{
    let cloudResponse
    if(profilePicture){
        const fileuri= getDataUri(profilePicture)
        cloudResponse=await uploadToCloudinary(fileuri)
    }
    const user = await User.findById(id).select('password')

    if(!user){
        throw new AppError(StatusCodes.NOT_FOUND,"User Not Found")
    }
    if(bio){
        user.bio= bio
    }
    if(profilePicture){
        user.profilePicture= cloudResponse?.secure_url
    }
    await user.save();
    const updatedUser = await User.findById(id)
    .select('-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires');

    return updatedUser


}

const suggestedUserProfile= async(id:mongoose.Types.ObjectId)=>{
    if (!id ||!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Invalid ID");
      }
    const users = await User.find({_id:{$ne : id}}).select("-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires")
    return users
}

const followUnfollow = async(userId:mongoose.Types.ObjectId, targetedUserId:string)=>{

    if(userId.toString() === targetedUserId ){
        throw new AppError(StatusCodes.BAD_REQUEST,"You cannot follow/unfollow yourself")
    }
    const targetUser= await User.findById(targetedUserId)
    if(!targetUser){
        throw new AppError(StatusCodes.NOT_FOUND,"User Not Found")
    }
    const isFollowing= targetUser.followers?.includes(userId)
    if(isFollowing){
        await Promise.all([
            User.updateOne(
                {_id: userId},
                {$pull : {following: targetedUserId}}
            ),
            User.updateOne(
                {_id: targetedUserId},
                {$pull : {followers: userId}}
            ),
            
        ])
    }else{
        await Promise.all([
            User.updateOne(
                {_id: userId},
                {$addToSet : {following: targetedUserId}}
            ),
            User.updateOne(
                {_id: targetedUserId},
                {$addToSet : {followers: userId}}
            ),
            
        ])
    }
    const updateLoggedInUser= await User.findById(userId).select('-password')
    
    return{isFollowing, updateLoggedInUser}
}






export const UserService = {
    getUserProfileFromDB,
    editUserProfileIntoDB,
    suggestedUserProfile,
    followUnfollow

}