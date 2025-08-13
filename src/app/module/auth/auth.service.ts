import AppError from "../../errorHelpers/AppError"
import { IsActive } from "../user/user.interface"
import { User } from "../user/user.model"
import httpstatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { generateToken, verifyToken } from "../../utils/jwt"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"

// const credetialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload
//     const isUserExist = await User.findOne({ email })
//     if (!isUserExist) {
//         throw new AppError(httpstatus.BAD_REQUEST, "User is not Exists")
//     }

//     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
//     if (!isPasswordMatched) {
//         throw new AppError(httpstatus.BAD_REQUEST, "Incorrect Password")
//     }

//     const jwtPayload = {
//         userId: isUserExist._id,
//         email: isUserExist.email,
//         role: isUserExist.role
//     }

//     const accessToken = await generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
//     const refreshToken = await generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)


//     return {
//         email: isUserExist.email,
//         accessToken: accessToken,
//         refreshToken: refreshToken
//     }
// }


const getNewAccessToken = async (refreshToken: string) => {
    const VerifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: VerifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpstatus.BAD_REQUEST, "User not exists")
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpstatus.BAD_REQUEST, "User is blocked or Inactive")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = await generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    return {

        accessToken: accessToken

    }


}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
    const user = await User.findById(decodedToken.userId)
    

    const isOldPassword = await bcryptjs.compare(oldPassword, user?.password as string)
    if (!isOldPassword) {
        throw new AppError(httpstatus.BAD_REQUEST, "password is not matched")

    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save()

    return true


}








export const authService = {
    
    getNewAccessToken,
    resetPassword
}