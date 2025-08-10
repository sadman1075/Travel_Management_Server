import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

export const userRoutes = Router()


userRoutes.post("/register", validateRequest(createUserZodSchema),userController.createUser)