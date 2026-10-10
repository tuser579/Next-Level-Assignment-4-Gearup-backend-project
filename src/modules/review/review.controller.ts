import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewServices.createReview(req.user!.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: result,
    });
});

const getGearReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewServices.getGearReviews(req.params.gearId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Gear reviews retrieved successfully",
        data: result,
    });
});

export const reviewController = {
    createReview,
    getGearReviews,
};
