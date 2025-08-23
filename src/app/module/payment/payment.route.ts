import { Router } from "express";
import { paymentController } from "./payment.controller";


export const paymentRoutes =Router();


// paymentRoutes.post("/init-payment/:bookingId", PaymentController.initPayment);
paymentRoutes.post("/success", paymentController.successPayment);
paymentRoutes.post("/fail", paymentController.failPayment);
paymentRoutes.post("/cancel", paymentController.cancelPayment);
// paymentRoutes.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentController.getInvoiceDownloadUrl);
// paymentRoutes.post("/validate-payment", PaymentController.validatePayment)
