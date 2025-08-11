import { NextFunction, Request, Response } from "express"
import httpstatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
const credetialsLogin=async(req:Request,res:Response,next:NextFunction)=>{
try {
    
         sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user login successfully",
            data: create
        })
} catch (error) {
    next(error)
}
}



export const authController={
    credetialsLogin
}