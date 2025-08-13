/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpstatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"
import { authService } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { verifyToken } from "../../utils/jwt"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
import { createUserTokens } from "../../utils/userTokens"
import passport from "passport"
const credetialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate("local", async (err: any, user: any, info: any) => {

            if (err) {
                return next(err)
            }
            if (!user) {
                return next(err)
            }
            const userTokens = await createUserTokens(user)

            const { password: pass, ...rest } = user.toObject()

            setAuthCookie(res, userTokens)

            sendResponse(res, {
                success: true,
                statusCode: httpstatus.CREATED,
                message: "user login successfully",
                data: {
                    accessToken: userTokens.accessToken,
                    refreshToken: userTokens.refreshToken,
                    user: rest
                }
            })
        })(req, res, next)



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
        const newPassword = req.body.newPassword
        const decodedToken = req.headers.authorization
        const verifiedToken = verifyToken(decodedToken as string, envVars.JWT_ACCESS_SECRET)



        const updatePassword = await authService.resetPassword(oldPassword, newPassword, verifiedToken as JwtPayload)
        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user created successfully",
            data: true
        })
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


const googleCallBack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let redirectTo = req.query.redirectTo ? req.query.redirectTo as string : ""
        if (redirectTo.startsWith("/")) {
            redirectTo = redirectTo.slice(1)
        }
        const user = req.user;
        console.log("user", user);
        if (!user) {
            throw new AppError(500, "user not found")
        }

        const tokeninfo = await createUserTokens(user)


        setAuthCookie(res, tokeninfo)

        res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

    } catch (error) {
        next(error)
    }
}



export const authController = {
    credetialsLogin,
    getNewAccessToken,
    resetPassword,
    googleCallBack,
    logout
}