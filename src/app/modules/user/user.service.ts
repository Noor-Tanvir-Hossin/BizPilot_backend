import { StatusCodes } from "http-status-codes"
import AppError from "../../error/AppError"
import { User } from "./user.model"
import { getDataUri } from "../../utils/datauri"
import { uploadToCloudinary } from "../../utils/cloudinary"

const getUserProfileFromDB = async(id:string)=>{
    const user= await User.findById(id)
    .select("-password -otp -otpExpires -resetPasswordOtp -resetPasswordOtpExpires")
    .populate({
        path:'post',
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
const editUserProfileIntoDB = async(id:string, bio:string, profilePicture?:Express.Multer.File)=>{
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

    return user


}






export const UserService = {
    getUserProfileFromDB,
    editUserProfileIntoDB
}