import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsController } from "./stats.controller";


export const statsroutes = express.Router();

statsroutes.get(
    "/booking",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    statsController.getBookingStats
);
statsroutes.get(
    "/payment",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    statsController.getPaymentStats
);
statsroutes.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    statsController.getUserStats
);
statsroutes.get(
    "/tour",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    statsController.getTourStats
);

