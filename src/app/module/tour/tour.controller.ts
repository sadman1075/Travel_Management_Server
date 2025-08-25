
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { ITour } from './tour.interface';
import { TourService } from './tour.service';

const createTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
       
        const payload: ITour = {
            ...req.body,
            images: (req.files as Express.Multer.File[]).map(file => file.path)
        }
        const result = await TourService.createTour(payload);
        
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Tour created successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};

const getAllTours = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const query = req.query
        const result = await TourService.getAllTours(query as Record<string, string>);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tours retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        next(error)
    }
};

const getSingleTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.params.slug
        const result = await TourService.getSingleTour(slug);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tour retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};
const updateTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: ITour = {
            ...req.body,
            images: (req.files as Express.Multer.File[]).map(file => file.path)
        }
        const result = await TourService.updateTour(req.params.id, payload);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tour updated successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};
const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await TourService.deleteTour(id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tour deleted successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};
const getSingleTourType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const result = await TourService.getSingleTourType(id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tour type retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};
const getAllTourTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const result = await TourService.getAllTourTypes(query as Record<string, string>);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tour types retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};

const createTourType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const result = await TourService.createTourType(name);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'Tour type created successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};

const updateTourType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const result = await TourService.updateTourType(id, name);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tour type updated successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};
const deleteTourType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await TourService.deleteTourType(id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Tour type deleted successfully',
            data: result,
        });
    } catch (error) {
        next(error)
    }
};

export const TourController = {
    createTour,
    createTourType,
    getAllTourTypes,
    getSingleTourType,
    deleteTourType,
    updateTourType,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
};