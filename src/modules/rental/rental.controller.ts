import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalServices } from "./rental.service";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalServices.createRentalOrder(req.user!.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Rental order placed successfully",
        data: result,
    });
});

const getCustomerRentals = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalServices.getCustomerRentals(req.user!.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental history retrieved successfully",
        data: result,
    });
});

const getRentalById = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalServices.getRentalById(req.params.id as string, req.user!.id, req.user!.role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental order details retrieved successfully",
        data: result,
    });
});

const cancelRentalOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalServices.cancelRentalOrder(req.params.id as string, req.user!.id, req.user!.role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental order cancelled successfully",
        data: result,
    });
});

const getProviderIncomingOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalServices.getProviderIncomingOrders(req.user!.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Incoming rental orders retrieved successfully",
        data: result,
    });
});

const updateOrderStatusByProvider = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalServices.updateOrderStatusByProvider(req.params.id as string, req.user!.id, req.body.status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental order status updated successfully",
        data: result,
    });
});

const getAllRentalsForAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalServices.getAllRentalsForAdmin(req.query as any);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All rental orders retrieved successfully",
        data: result.rentals,
        meta: result.meta,
    });
});

export const rentalController = {
    createRentalOrder,
    getCustomerRentals,
    getRentalById,
    cancelRentalOrder,
    getProviderIncomingOrders,
    updateOrderStatusByProvider,
    getAllRentalsForAdmin,
};
