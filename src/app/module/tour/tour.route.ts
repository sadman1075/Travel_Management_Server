import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";

export const tourRoutes=Router()


tourRoutes.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType
);

tourRoutes.get("/tour-types", TourController.getAllTourTypes);


tourRoutes.get(
    "/tour-types/:id",
    TourController.getSingleTourType
);
tourRoutes.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.updateTourType
);

tourRoutes.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType);

/* --------------------- TOUR ROUTES ---------------------- */


tourRoutes.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    // multerUpload.array("files"),
    validateRequest(createTourZodSchema),
    TourController.createTour
);
tourRoutes.get("/", TourController.getAllTours);

tourRoutes.get(
    "/:slug",
    TourController.getSingleTour
);
tourRoutes.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    // multerUpload.array("files"),
    validateRequest(updateTourZodSchema),
    TourController.updateTour
);

tourRoutes.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour);
