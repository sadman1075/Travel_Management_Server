import express from "express"
import cors from "cors";
import { userRoutes } from "./app/module/user/user.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFoundRoute } from "./app/middlewares/notFoundRoutes";
import { authRoutes } from "./app/module/auth/auth.route";
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import { envVars } from "./app/config/env";
import "./app/config/passport"
import { divisionRoutes } from "./app/module/division/division.route";
import { tourRoutes } from "./app/module/tour/tour.route";
import { bookingRoutes } from "./app/module/booking/booking.route";
import { paymentRoutes } from "./app/module/payment/payment.route";
import { otpRoutes } from "./app/module/otp/otp.route";


const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(
    {
        origin:envVars.FRONTEND_URL,
        credentials:true
    }
))
app.use(cookieParser())
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


app.use("/api/v1/user", userRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/division", divisionRoutes)
app.use("/api/v1/tour", tourRoutes)
app.use("/api/v1/tour", tourRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/booking", bookingRoutes)
app.use("/api/v1/otp", otpRoutes)

app.get("/", async (req, res) => {
    res.send("server is running man")
})

app.use(globalErrorHandler)
app.use(notFoundRoute)

export default app;
