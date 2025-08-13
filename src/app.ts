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


const app = express()


app.use(express.json())
app.use(cors())
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
app.use("/api/v1/division",divisionRoutes)

app.get("/", async (req, res) => {
    res.send("server is running man")
})

app.use(globalErrorHandler)
app.use(notFoundRoute)

export default app;
