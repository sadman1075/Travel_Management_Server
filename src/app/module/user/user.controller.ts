import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import httpstatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        console.log(req.body);
        const create = await userService.createUser(req.body)
        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user created successfully",
            data: create
        })

    } catch (err) {
        next(err)
    }

}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId=req.params.id ;
        const payload=req.body;
        const decodedToken=req.headers.authorization
        const VerifiedToken=verifyToken(decodedToken as string,envVars.JWT_ACCESS_SECRET)

        
        const update = await userService.updateUser(userId,payload,VerifiedToken as JwtPayload)
        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user created successfully",
            data: update
        })

    } catch (err) {
        next(err)
    }

}

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await userService.getAllUser()
        
        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user successfully retrived ",
            data: allUsers
        })
    } catch (error) {
        next(error)
    }
}
const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken=req.headers.authorization ;
        const verifiedToken=await verifyToken(decodedToken as string,envVars.JWT_ACCESS_SECRET)
        const result = await userService.getMe(verifiedToken)
        
        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "user successfully retrived ",
            data: result
        })
    } catch (error) {
        next(error)
    }
}




export const userController = {
    createUser,
    getAllUser,
    updateUser,
    getMe
    
}