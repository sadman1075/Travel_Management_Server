import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IsActive } from "../module/user/user.interface";
import { User } from "../module/user/user.model";
import httpstatus from "http-status-codes"

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(403, "No Token Receieved")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpstatus.BAD_REQUEST, "User not exists")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpstatus.BAD_REQUEST, "User is blocked or Inactive")
        }


        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to veiw this route")
        }

        next()


    } catch (error) {
        next(error)
    }

}




