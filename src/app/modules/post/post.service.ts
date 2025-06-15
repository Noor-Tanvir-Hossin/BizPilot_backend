import mongoose from "mongoose";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";
import sharp from 'sharp'
import { Express } from 'express';
import { uploadToCloudinary } from "../../utils/cloudinary";
import { Post } from "./post.model";
import { User } from "../user/user.model";


const createPostIntoDB= async(caption:string, image:Express.Multer.File, userId:mongoose.Types.ObjectId)=>{

    if(!image){
        throw new AppError(StatusCodes.BAD_REQUEST,"Image is required for the post")
    }
    const optimizedImageBuffer= await sharp(image.buffer).resize({
        width:800,
        height:800,
        fit:"inside"
    }).toFormat('jpeg',{quality:80})
    .toBuffer()

    const fileUri= `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`
    const cloudResponse= await uploadToCloudinary(fileUri)
    let post = await Post.create({
        caption,
        image:{
            url:cloudResponse.secure_url,
            publicId:cloudResponse.public_id
        },
        user:userId
    })
    const user = await User.findById(userId)
    if(user){
        user.posts?.push(post.id)
        await user.save({validateBeforeSave:false})
    }
    post = await post.populate({
        path:'user',
        select:"username email bio profilePicture"
    })

    return post
    
}

const 

export const postService={
    createPostIntoDB
}