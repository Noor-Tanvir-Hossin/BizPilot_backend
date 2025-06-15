import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/cathchAsync";
import sendResponse from "../../utils/sendResponse";
import { postService } from "./post.service";

const createPost = catchAsync(async(req ,res)=>{

    
    const userId= req.user?._id;
    const image=req?.file;
    const {caption}=req.body

    
    const result = await postService.createPostIntoDB(caption,image as Express.Multer.File, userId )

    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Post created',
      data : result,
    })
  })

  export const postControllers = {
    createPost
  }