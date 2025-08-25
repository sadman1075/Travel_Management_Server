import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

export const userRoutes = Router()


userRoutes.post("/register", validateRequest(createUserZodSchema), userController.createUser)
userRoutes.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN) , userController.getAllUser)
userRoutes.get("/me",checkAuth(...Object.values(Role)),userController.getMe)
userRoutes.patch("/:id", validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)), userController.updateUser)
