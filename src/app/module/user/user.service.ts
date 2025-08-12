import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import httpstatus from "http-status-codes"

const createUser = async (payload: IUser) => {
    const { email, password } = payload
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpstatus.BAD_REQUEST, "User already Exists")
    }
    const hashpassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    payload.password = hashpassword;
    const create = await User.create(payload)
    return create
}

const updateUser = async (userId: string,payload: IUser, decodedToken: JwtPayload) => {
  

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpstatus.FORBIDDEN, "You are not authorized");
        }
        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpstatus.FORBIDDEN, "You are not authorized");

        }
    }

    const isUserExist = await User.findById(userId)
    
    if (!isUserExist) {
        throw new AppError(httpstatus.FORBIDDEN, "User not found");

    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpstatus.FORBIDDEN, "You are not authorized");
        }
    }


    const hashpassword = await bcryptjs.hash(isUserExist.password as string, Number(envVars.BCRYPT_SALT_ROUND))
    payload.password = hashpassword;

    const updateUserInfo = await User.findByIdAndUpdate(userId, payload, { new: true })
    console.log(updateUserInfo);
    
}

const getAllUser = async () => {
    const allUsers = await User.find({})
    return allUsers
}


export const userService = {
    createUser,
    getAllUser,
    updateUser
}




