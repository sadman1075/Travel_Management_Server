import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";
import { divisionService } from "./division.service";

const createDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.file);
        const payload: IDivision = {
            ...req.body,
            thumbnail: req.file?.path
        }
        const result = await divisionService.createDivision(payload);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Division created",
            data: result,
        });
    } catch (error) {
        next(error)
    }
};
const getAllDivisions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const result = await divisionService.getAllDivisions(query as Record<string, string>);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Divisions retrieved",
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        next(error)
    }
};
const getSingleDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.params.slug
        const result = await divisionService.getSingleDivision(slug);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Divisions retrieved",
            data: result.data,
        });
    } catch (error) {
        next(error)
    }
};
const updateDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const payload: IDivision = {
            ...req.body,
            thumbnail: req.file?.path
        }
        const result = await divisionService.updateDivision(id, payload);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Division updated",
            data: result,
        });
    } catch (error) {
        next(error)
    }
};
const deleteDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await divisionService.deleteDivision(req.params.id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Division deleted",
            data: result,
        });
    } catch (error) {
        next(error)
    }
};


export const DivisionController = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};