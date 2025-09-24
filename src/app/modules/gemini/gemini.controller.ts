import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/cathchAsync";
import sendResponse from "../../utils/sendResponse";
import { geminiService } from "./gemini.service";

const itegrateGemini = catchAsync(async(req ,res)=>{

    
    const result = await geminiService.integratingGemeni(req.body)
    sendResponse(res , {
      success: true,
      statusCode: StatusCodes
      .OK,
      message: 'create idea successfully',
      data : result,
    })
  })

  export const geminiController={
    itegrateGemini
  }

