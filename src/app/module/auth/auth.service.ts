/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError"
import { IAuthProvider, IsActive } from "../user/user.interface"
import { User } from "../user/user.model"
import httpstatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { generateToken, verifyToken } from "../../utils/jwt"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail"
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


const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
  
    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(404, "user not found")
    }

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpstatus.BAD_REQUEST, "you have already set your password .now you can change password from your profilepassword update")
    }

    const hashPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND))
    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }
    const auhts: IAuthProvider[] = [...user.auths, credentialProvider]

    user.password = hashPassword
    user.auths = auhts

    await user.save()

    return {}

}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPassword = await bcryptjs.compare(oldPassword, user?.password as string)
    if (!isOldPassword) {
        throw new AppError(httpstatus.BAD_REQUEST, "password is not matched")

    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save()

    return true


}


const forgotPassword = async (email: string) => {

    const isUserExist = await User.findOne({ email });


    if (!isUserExist) {
        throw new AppError(httpstatus.BAD_REQUEST, "User does not exist ")
    }
    if (!isUserExist.isVerified) {
        throw new AppError(httpstatus.BAD_REQUEST, "User is not verified")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpstatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpstatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

    /**
     * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
     */
}





export const authService = {

    getNewAccessToken,
    resetPassword,
    setPassword,
    changePassword,
    forgotPassword
}