import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";

const bookingRoutes = Router()

bookingRoutes.post("/",
     checkAuth(...Object.values(Role)), 
     validateRequest(createBookingZodSchema),
      
    )