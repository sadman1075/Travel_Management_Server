import { Router } from "express";
import { authController } from "./auth.controller";


export const authRoutes = Router()

authRoutes.post("/login", authController.credetialsLogin)
authRoutes.post("/refresh-token", authController.getNewAccessToken)