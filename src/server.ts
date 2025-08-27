import { Server } from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server


const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);

        server = app.listen(envVars.PORT, () => {
            console.log(`server is running at port ${envVars.PORT}`)
        })


    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()



// unhandle rejection error-->promise ta handle na kora hole ai error ta show korbe
// uncaught rejection error-->unknown variable or varbale not use then its showing this error
// signal termination error--> cloud ar theke jokon off korbe server ta tokon aita error show korbe

process.on("unhandledRejection", () => {
    console.log("Unhandled Rejection Detected...server shuttin down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("uncaughtException", () => {
    console.log("Uncaught Rejection Detected...server shuttin down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})
process.on("SIGTERM", () => {
    console.log("Sigint signal received ...server shuttin down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})







