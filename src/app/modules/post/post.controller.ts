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


const getAllPost = catchAsync(async(req ,res)=>{
    const result = await postService.getAllPostFromDB()

    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All post get successfully',
      data : result,
    })
  })
const getSingleUserPost = catchAsync(async(req ,res)=>{
    const {id}=req.params
    const result = await postService.getSingleUserPostFromDB(id)

    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Post retrieved successfully',
      data : result,
    })
  })

  export const postControllers = {
    createPost,
    getAllPost,
    getSingleUserPost
  }