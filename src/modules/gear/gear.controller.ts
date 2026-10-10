import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearServices } from "./gear.service";

const getAllGear = catchAsync(async (req: Request, res: Response) => {
    const result = await gearServices.getAllGear(req.query as any);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Gear retrieved successfully",
        data: result.items,
        meta: result.meta,
    });
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
    const result = await gearServices.getGearById(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Gear specifications retrieved successfully",
        data: result,
    });
});

const addGearByProvider = catchAsync(async (req: Request, res: Response) => {
    const result = await gearServices.addGearByProvider(req.user!.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Gear item added to inventory successfully",
        data: result,
    });
});

const updateGearByProvider = catchAsync(async (req: Request, res: Response) => {
    const result = await gearServices.updateGearByProvider(req.params.id as string, req.user!.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Gear item updated successfully",
        data: result,
    });
});

const deleteGearByProvider = catchAsync(async (req: Request, res: Response) => {
    const result = await gearServices.deleteGearByProvider(req.params.id as string, req.user!.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Gear item deleted successfully",
        data: result,
    });
});

const getProviderGear = catchAsync(async (req: Request, res: Response) => {
    const result = await gearServices.getProviderGear(req.user!.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Provider gear inventory retrieved successfully",
        data: result,
    });
});

export const gearController = {
    getAllGear,
    getGearById,
    addGearByProvider,
    updateGearByProvider,
    deleteGearByProvider,
    getProviderGear,
};
