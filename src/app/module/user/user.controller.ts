import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import httpstatus from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse";

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



export const userController = {
    createUser
}