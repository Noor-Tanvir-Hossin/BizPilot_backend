import { StatusCodes } from "http-status-codes"
import catchAsync from "../../utils/cathchAsync"
import sendResponse from "../../utils/sendResponse"
import { UserService } from "../user/user.service"
import { IdeaService } from "./idea.service"

const createIdea = catchAsync(async(req ,res)=>{

    const userId= req.user?._id;
    const result = await IdeaService.createIdeaToDB(userId, req.body)
    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'create idea successfully',
      data : result,
    })
  })

const getIdea = catchAsync(async(req ,res)=>{

    const userId= req.user?._id;
    const result = await IdeaService.getIdeaFromDB(userId)
    sendResponse(res , {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'get idea successfully',
      data : result,
    })
  })

export const IdeaController = {
	createIdea,  
	getIdea            
}