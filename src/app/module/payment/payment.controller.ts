import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";


const initPayment = async (req: Request, res: Response) => {

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: {},
    });
};
const successPayment = async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)
    if (result.success) {
        res.redirect(envVars.SSL.SSL_SUCCESS_FRONTEND_URL)
    }
};
const failPayment = async (req: Request, res: Response) => {

};
const cancelPayment = async (req: Request, res: Response) => {

};

const getInvoiceDownloadUrl =
    async (req: Request, res: Response) => {

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Invoice download URL retrieved successfully",
            data: {},
        });
    };
const validatePayment =
    async (req: Request, res: Response) => {

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment Validated Successfully",
            data: null,
        });
    };

export const paymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl,
    validatePayment
};