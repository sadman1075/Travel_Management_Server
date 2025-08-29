import { Router } from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


export const paymentRoutes =Router();


paymentRoutes.post("/init-payment/:bookingId", paymentController.initPayment);
paymentRoutes.post("/success", paymentController.successPayment);
paymentRoutes.post("/fail", paymentController.failPayment);
paymentRoutes.post("/cancel", paymentController.cancelPayment);
paymentRoutes.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), paymentController.getInvoiceDownloadUrl);
paymentRoutes.post("/validate-payment", paymentController.validatePayment)
