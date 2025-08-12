import { NextFunction, Request, Response } from "express"
import httpstatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { authService } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"
const credetialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const loginInfo = await authService.credetialsLogin(req.body)

        setAuthCookie(res, loginInfo)

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

const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const refreshToken = req.cookies.refreshToken
        const tokenInfo = await authService.getNewAccessToken(refreshToken)


        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user created successfully",
            data: tokenInfo
        })

    } catch (err) {
        next(err)
    }

}
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.password
        const decodedToken=req.headers.authorization

        const updatePassword=await authService.resetPassword(oldPassword,)

    } catch (err) {
        next(err)
    }

}
const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user logout successfully",
            data: null
        })

    } catch (err) {
        next(err)
    }

}



export const authController = {
    credetialsLogin,
    getNewAccessToken,
    resetPassword,
    logout
}