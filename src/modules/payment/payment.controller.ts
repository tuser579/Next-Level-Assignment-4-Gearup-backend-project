import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const { rentalOrderId } = req.body;

    if (!rentalOrderId) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "rentalOrderId is required to initiate payment.",
        });
    }

    const result = await paymentServices.createRentalCheckoutSession(rentalOrderId, customerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Stripe checkout session created successfully",
        data: result,
    });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Missing stripe-signature header in webhook request.",
        });
    }

    await paymentServices.handleWebhook(payload, signature);

    // Return prompt HTTP 200 acknowledgment to avoid Stripe retry loops
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Webhook event processed successfully",
        data: null,
    });
});

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentServices.getUserPayments(req.user!.id, req.user!.role, req.query as any);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments fetched successfully",
        data: result.payments,
        meta: result.meta,
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentServices.getPaymentById(req.params.id as string, req.user!.id, req.user!.role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment receipt retrieved successfully",
        data: result,
    });
});

export const paymentController = {
    createCheckoutSession,
    handleWebhook,
    getUserPayments,
    getPaymentById,
};
