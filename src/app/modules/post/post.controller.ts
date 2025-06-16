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

const saveOrUnSavePost = catchAsync(async(req ,res)=>{
    const userId=req.user?._id
    const postId=req.params.id
    const result = await postService.saveOrUnsavePostIntoDB(userId,postId)

    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: result.isPostSaved? 'post unsaved successfully' : 'post saved successfully',
      data : result,
    })
  })

const deletePost = catchAsync(async(req ,res)=>{
    const userId=req.user?._id
    const postId=req.params.id
    const result = await postService.deletePostFromDB(userId,postId)

    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message:'Post deleted successfully',
      data : null,
    })
  })
const likeOrDislikePost = catchAsync(async(req ,res)=>{
    const userId=req.user?._id
    const postId=req.params.id
    const result = await postService.likeOrDislikePost(userId,postId)

    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: result.isLiked?'Post disliked successfully': 'Post liked successfully' ,
      data : null,
    })
  })

  export const postControllers = {
    createPost,
    getAllPost,
    getSingleUserPost,
    saveOrUnSavePost,
    deletePost,
    likeOrDislikePost
  }