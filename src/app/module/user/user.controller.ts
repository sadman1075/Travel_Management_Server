import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import httpstatus from "http-status-codes"

const createUser = async (req: Request, res: Response,next:NextFunction) => {
    try {
        
        console.log(req.body);
        const create = await userService.createUser(req.body)
        res.status(httpstatus.CREATED).json({
            message: "user created successfully",
            user: create
        })

    } catch (err) {
       next(err)
    }

}



export const userController = {
    createUser
}