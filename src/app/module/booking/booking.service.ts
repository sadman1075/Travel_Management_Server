import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import httpstatus from "http-status-codes"
import { Booking } from "./booking.model"
import { Payment } from "../payment/payment.model"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { Tour } from "../tour/tour.model"

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const isUserExists = await User.findById(userId)
    const transactionId = getTransactionId()
    const tour = await Tour.findById(payload.tour).select("costFrom")
    if (!tour?.costFrom) {
        throw new AppError(httpstatus.BAD_REQUEST, "not tour cost found")
    }
    if (!isUserExists?.phone || !isUserExists?.address) {
        throw new AppError(httpstatus.BAD_REQUEST, "please update your profile to book a four")
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    const booking = await Booking.create({
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    })


    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        amount: amount

    })

    const updatedBooking = await Booking.findByIdAndUpdate(
        booking._id,
        { payment: payment._id },
        { new: true },
    )
    return updatedBooking
}
const getUserBooking = async () => {
    return {}
}
const getBookingById = async () => {
    return {}
}
const updateBookingStatus = async () => {
    return {}
}
const getAllBooking = async () => {
    return {}
}


export const BookingService = {
    createBooking,
    getAllBooking,
    getBookingById,
    getUserBooking,
    updateBookingStatus
}