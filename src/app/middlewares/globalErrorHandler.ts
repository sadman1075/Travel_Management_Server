/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        success: false,
        message: `something went wrong !! ${err.message} from global error `,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}