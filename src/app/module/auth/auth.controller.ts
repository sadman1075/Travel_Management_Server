import { NextFunction, Request, Response } from "express"
import httpstatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { authService } from "./auth.service"
const credetialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const loginInfo = await authService.credetialsLogin(req.body)

        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user login successfully",
            data: loginInfo
        })
    } catch (error) {
        next(error)
    }
}



export const authController = {
    credetialsLogin
}