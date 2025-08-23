import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";

export const bookingRoutes = Router()

bookingRoutes.post("/",
     checkAuth(...Object.values(Role)), 
     validateRequest(createBookingZodSchema),
     BookingController.createBooking
    )