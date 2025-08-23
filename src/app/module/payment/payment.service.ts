/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpstatus from "http-status-codes"

const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId })
    if (!payment) {
        throw new AppError(httpstatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }


    const booking = await Booking.findById(payment.booking)
    console.log(booking);
    const address = (booking?.user as any).address
    const email = (booking?.user as any).email
    const phone = (booking?.user as any).phone
    const name = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: address,
        email: email,
        phoneNumber: phone,
        name: name,
        amount: payment.amount,
        transactionId: payment.transactionId

    }

    const sslPayment = await sslService.sslPaymentInit(sslPayload)
    return {
        paymentUrl: sslPayment.GatewayPageURL
    }


};
const successPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatepayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID

        }, { session })

        await Booking.findByIdAndUpdate(
            updatepayment?.booking,
            { status: BOOKING_STATUS.COMPLETE },
            { new: true, session },
        )

        await session.commitTransaction();
        session.endSession()

        return { success: true, message: "payment completed successfully" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }

};


const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatepayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED

        }, { session })

        await Booking.findByIdAndUpdate(
            updatepayment?.booking,
            { status: BOOKING_STATUS.FAILED },
            { new: true, session },
        )

        await session.commitTransaction();
        session.endSession()

        return { success: true, message: "payment failed" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
};
const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatepayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCEL

        }, { session })

        await Booking.findByIdAndUpdate(
            updatepayment?.booking,
            { status: BOOKING_STATUS.CANCEL },
            { new: true, session },
        )

        await session.commitTransaction();
        session.endSession()

        return { success: true, message: "payment cancel" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
};

const getInvoiceDownloadUrl = async () => {

    return
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl
};