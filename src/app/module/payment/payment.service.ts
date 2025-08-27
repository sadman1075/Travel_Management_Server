/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
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

        const updateBooking = await Booking.findByIdAndUpdate(
            updatepayment?.booking,
            { status: BOOKING_STATUS.COMPLETE },
            { new: true, session },
        ).populate("tour", "title")
            .populate("user", "name email")

        if (!updateBooking) {
            throw new AppError(401, "booking not found")
        }
        if (!updatepayment) {
            throw new AppError(401, "payment not found")
        }

        const invoiceData: IInvoiceData = {
            bookingDate: updateBooking?.createdAt as Date,
            guestCount: updateBooking?.guestCount,
            totalAmount: updatepayment?.amount,
            tourTitle: (updateBooking?.tour as unknown as ITour).title,
            transactionId: updatepayment?.transactionId,
            userName: (updateBooking.user as unknown as IUser).name

        }

        const pdfBuffer = await generatePdf(invoiceData)
        const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")
        if (!cloudinaryResult) {
            throw new AppError(401, "Error update pdf")
        }
        await Payment.findByIdAndUpdate(updatepayment._id, { invoiceUrl: cloudinaryResult?.secure_url }, { runValidators: true, session })

        await sendEmail({
            to: (updateBooking.user as unknown as IUser).email,
            subject: "Your Booking Invoice",
            templateName: "Invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]

        })

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

const getInvoiceDownloadUrl = async (paymentId: string) => {

    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl")

    if (!payment) {
        throw new AppError(401, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    }

    return payment.invoiceUrl
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl
};