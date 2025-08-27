// src/modules/otp/otp.routes.ts
import express from "express";
import { otpController } from "./otp.controller";

export const otpRoutes = express.Router();

otpRoutes.post("/send", otpController.sendOTP);
otpRoutes.post("/verify", otpController.verifyOTP);
