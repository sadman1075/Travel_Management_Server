import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { DivisionController } from "./division.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";

export const divisionRoutes=Router()


divisionRoutes.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    // multerUpload.single("file"),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
);
divisionRoutes.get("/", DivisionController.getAllDivisions);
divisionRoutes.get("/:slug", DivisionController.getSingleDivision)
divisionRoutes.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    // multerUpload.single("file"),
    validateRequest(updateDivisionSchema),
    DivisionController.updateDivision
);
divisionRoutes.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision);