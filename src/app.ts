import express from "express"
import cors from "cors";
import { userRoutes } from "./app/module/user/user.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFoundRoute } from "./app/middlewares/notFoundRoutes";

const app = express()

app.use(express.json())
app.use(cors())


app.use("/api/v1/user", userRoutes)

app.get("/", async (req, res) => {
    res.send("server is running man")
})

app.use(globalErrorHandler)
app.use(notFoundRoute)

export default app;
