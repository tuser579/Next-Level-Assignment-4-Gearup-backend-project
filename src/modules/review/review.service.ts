import httpStatus from "http-status";
import { RentalOrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateReviewPayload } from "./review.interface";

const createReview = async (customerId: string, payload: TCreateReviewPayload) => {
    if (payload.rating < 1 || payload.rating > 5) {
        const err: any = new Error("Rating must be between 1 and 5.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    // 1. Verify rental order belongs to this customer and status is RETURNED
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: payload.rentalOrderId },
        include: { items: true },
    });

    if (order.customerId !== customerId) {
        const err: any = new Error("You can only review rentals booked by your account.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    if (order.status !== RentalOrderStatus.RETURNED) {
        const err: any = new Error("Reviews can only be submitted after the gear item has been returned.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    // 2. Verify gear item was part of the rental
    const hasItem = order.items.some((i) => i.gearItemId === payload.gearItemId);
    if (!hasItem) {
        const err: any = new Error("Gear item was not in this rental order.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    // 3. Create review with idempotency constraint
    return await prisma.review.create({
        data: {
            customerId,
            rentalOrderId: payload.rentalOrderId,
            gearItemId: payload.gearItemId,
            rating: payload.rating,
            comment: payload.comment,
        },
    });
};

const getGearReviews = async (gearItemId: string) => {
    return await prisma.review.findMany({
        where: { gearItemId },
        include: { customer: { select: { id: true, name: true, profileImage: true } } },
        orderBy: { createdAt: "desc" },
    });
};

export const reviewServices = { createReview, getGearReviews };
