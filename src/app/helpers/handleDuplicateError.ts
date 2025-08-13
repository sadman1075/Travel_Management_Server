import { TGenericErrorResponse } from "../interface/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)

    return {
        statusCode: 40,
        message: `${matchedArray[1]} already exists!!`
    }
}