import AppError from "../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpstatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { generateToken } from "../../utils/jwt"
import { envVars } from "../../config/env"

const credetialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpstatus.BAD_REQUEST, "User is not Exists")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
    if (!isPasswordMatched) {
        throw new AppError(httpstatus.BAD_REQUEST, "Incorrect Password")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = await generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)


    return {
        email: isUserExist.email,
        accessToken: accessToken
    }
}








export const authService = {
    credetialsLogin
}