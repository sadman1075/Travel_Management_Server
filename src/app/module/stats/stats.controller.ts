/* eslint-disable @typescript-eslint/no-explicit-any */
// controllers/stats.controller.ts
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { statsService } from "./stats.service";

const getBookingStats = async (req: Request, res: Response) => {
    try {
        const stats = await statsService.getBookingStats();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking stats fetched successfully",
            data: stats,
        });
    } catch (error:any) {
        throw new AppError(401, "something went wrong", error.message)

    }
};

const getPaymentStats = async (req: Request, res: Response) => {
    try {
        const stats = await statsService.getPaymentStats();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment stats fetched successfully",
            data: stats,
        });
    } catch (error: any) {
        throw new AppError(401, "something went wrong", error.message)
    }
};

const getUserStats = async (req: Request, res: Response) => {
    try {
        const stats = await statsService.getUserStats();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User stats fetched successfully",
            data: stats,
        });
    } catch (error: any) {
        throw new AppError(401, "something went wrong", error.message)
    }
};

const getTourStats = async (req: Request, res: Response) => {
    try {
        const stats = await statsService.getTourStats();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Tour stats fetched successfully",
            data: stats,
        });
    } catch (error: any) {
        throw new AppError(401, "something went wrong", error.message)
    }
};

export const statsController = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats,
};