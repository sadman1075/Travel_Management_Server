import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";


export const authRoutes = Router()

authRoutes.post("/login", authController.credetialsLogin)
authRoutes.post("/refresh-token", authController.getNewAccessToken)
authRoutes.post("/logout", authController.logout)
authRoutes.post("/reset-password", checkAuth(...Object.values(Role)), authController.resetPassword)
authRoutes.get("/google",(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope:["profile","email"]})(req,res,next)
})
authRoutes.get("/google/callback",passport.authenticate("google",{failureRedirect:"/login"}),authController.googleCallBack)