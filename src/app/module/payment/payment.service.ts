import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";


const initPayment = async () => {


    return {
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
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")


        await session.commitTransaction();
        session.endSession()

        return { success: true, message: "payment completed successfully" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }

};


const failPayment = async () => {

};
const cancelPayment = async () => {

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