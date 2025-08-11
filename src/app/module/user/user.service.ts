import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import httpstatus from "http-status-codes"

const createUser = async (payload: IUser) => {
    const { email, password } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpstatus.BAD_REQUEST, "User already Exists")
    }
    const hashpassword = await bcryptjs.hash(password as string, 10)
    payload.password = hashpassword;
    const create = await User.create(payload)
    return create
}

const getAllUser = async () => {
    const allUsers = await User.find({})
    return allUsers
}


export const userService = {
    createUser,
    getAllUser
}