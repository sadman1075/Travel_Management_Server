import { Request, Response } from "express";
// import { userService } from "./user.service";
import httpstatus from "http-status-codes"
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const create = await User.create(req.body)
        res.status(httpstatus.CREATED).json({
            message: "user created successfully",
            user: create
        })

    } catch (error) {
        console.log(error);
        res.status(httpstatus.BAD_REQUEST).json({
            message: `something is wrong`,error
        })
    }

}

export const userController = {
    createUser
}