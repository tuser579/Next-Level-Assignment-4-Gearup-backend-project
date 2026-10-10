import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAllUsers(req.query as any);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users fetched successfully",
        data: result.users,
        meta: result.meta,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;

    const result = await adminServices.updateUserStatus(id as string, status as UserStatus);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAllRentals(req.query as any);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All rental orders retrieved successfully",
        data: result.rentals,
        meta: result.meta,
    });
});

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllRentals,
};