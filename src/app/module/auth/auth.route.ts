import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


export const authRoutes = Router()

authRoutes.post("/login", authController.credetialsLogin)
authRoutes.post("/refresh-token", authController.getNewAccessToken)
authRoutes.post("/logout", authController.logout)
authRoutes.post("/reset-password", checkAuth(...Object.values(Role)), authController.resetPassword)