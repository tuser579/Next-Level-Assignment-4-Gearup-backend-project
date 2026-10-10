import httpStatus from "http-status";
import { PaymentStatus, RentalOrderStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateRentalPayload, TRentalFilterQuery } from "./rental.interface";

const createRentalOrder = async (customerId: string, payload: TCreateRentalPayload) => {
    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        const err: any = new Error("Rental end date must be after start date.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    return await prisma.$transaction(async (tx) => {
        let calculatedRentalFee = 0;
        let calculatedDepositFee = 0;
        const orderItemsData: any[] = [];

        for (const item of payload.items) {
            const gear = await tx.gearItem.findUniqueOrThrow({ where: { id: item.gearItemId } });

            if (gear.availableStock < item.quantity) {
                const err: any = new Error(`Item ${gear.title} does not have enough stock available.`);
                err.statusCode = httpStatus.BAD_REQUEST;
                throw err;
            }

            const itemRentalCost = gear.rentalPricePerDay * diffDays * item.quantity;
            const itemDepositCost = gear.depositFee * item.quantity;

            calculatedRentalFee += itemRentalCost;
            calculatedDepositFee += itemDepositCost;

            orderItemsData.push({
                gearItemId: gear.id,
                quantity: item.quantity,
                unitPricePerDay: gear.rentalPricePerDay,
                depositPerUnit: gear.depositFee,
                subtotal: itemRentalCost + itemDepositCost,
            });
        }

        const totalAmount = calculatedRentalFee + calculatedDepositFee;
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

        const newOrder = await tx.rentalOrder.create({
            data: {
                orderNumber,
                customerId,
                startDate: start,
                endDate: end,
                totalDays: diffDays,
                rentalFee: calculatedRentalFee,
                depositFee: calculatedDepositFee,
                totalAmount,
                status: RentalOrderStatus.PLACED,
                paymentStatus: PaymentStatus.PENDING,
                notes: payload.notes,
                items: { create: orderItemsData },
            },
            include: { items: { include: { gearItem: true } } },
        });

        return newOrder;
    });
};

const getCustomerRentals = async (customerId: string) => {
    return await prisma.rentalOrder.findMany({
        where: { customerId },
        include: { items: { include: { gearItem: { select: { title: true, images: true } } } }, payments: true },
        orderBy: { createdAt: "desc" },
    });
};

const getRentalById = async (orderId: string, userId: string, userRole: Role) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: {
            customer: { select: { id: true, name: true, email: true, phone: true } },
            items: { include: { gearItem: true } },
            payments: true,
            reviews: true,
        },
    });

    if (userRole === Role.CUSTOMER && order.customerId !== userId) {
        const err: any = new Error("Forbidden: You cannot access another customer's rental order.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    if (userRole === Role.PROVIDER) {
        const ownsItem = order.items.some((i) => i.gearItem.providerId === userId);
        if (!ownsItem) {
            const err: any = new Error("Forbidden: Order does not contain gear items owned by you.");
            err.statusCode = httpStatus.FORBIDDEN;
            throw err;
        }
    }

    return order;
};

const cancelRentalOrder = async (orderId: string, userId: string, userRole: string) => {
    return await prisma.$transaction(async (tx) => {
        const order = await tx.rentalOrder.findUniqueOrThrow({
            where: { id: orderId },
            include: { items: true },
        });

        if (userRole !== "ADMIN" && order.customerId !== userId) {
            const err: any = new Error("Forbidden: You cannot cancel this order.");
            err.statusCode = httpStatus.FORBIDDEN;
            throw err;
        }

        if (order.status === RentalOrderStatus.PICKED_UP || order.status === RentalOrderStatus.RETURNED) {
            const err: any = new Error("Cannot cancel an order that has already been picked up or completed.");
            err.statusCode = httpStatus.BAD_REQUEST;
            throw err;
        }

        // Release stock if it was previously confirmed/paid
        if (order.paymentStatus === PaymentStatus.PAID) {
            for (const item of order.items) {
                await tx.gearItem.update({
                    where: { id: item.gearItemId },
                    data: { availableStock: { increment: item.quantity } },
                });
            }
        }

        return await tx.rentalOrder.update({
            where: { id: orderId },
            data: { status: RentalOrderStatus.CANCELLED },
        });
    });
};

const getProviderIncomingOrders = async (providerId: string) => {
    return await prisma.rentalOrder.findMany({
        where: {
            items: { some: { gearItem: { providerId } } },
        },
        include: {
            customer: { select: { id: true, name: true, phone: true } },
            items: { include: { gearItem: true } },
            payments: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

const updateOrderStatusByProvider = async (orderId: string, providerId: string, nextStatus: RentalOrderStatus) => {
    return await prisma.$transaction(async (tx) => {
        const order = await tx.rentalOrder.findUniqueOrThrow({
            where: { id: orderId },
            include: { items: { include: { gearItem: true } } },
        });

        // Verify provider owns at least one item in the order
        const ownsItem = order.items.some((i) => i.gearItem.providerId === providerId);
        if (!ownsItem) {
            const err: any = new Error("Forbidden: Order does not contain gear items owned by you.");
            err.statusCode = httpStatus.FORBIDDEN;
            throw err;
        }

        // Restore gear stock upon physical equipment return
        if (nextStatus === RentalOrderStatus.RETURNED && order.status !== RentalOrderStatus.RETURNED) {
            for (const item of order.items) {
                await tx.gearItem.update({
                    where: { id: item.gearItemId },
                    data: { availableStock: { increment: item.quantity } },
                });
            }
        }

        return await tx.rentalOrder.update({
            where: { id: orderId },
            data: { status: nextStatus },
        });
    });
};

const getAllRentalsForAdmin = async (query: TRentalFilterQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus;

    const [rentals, total] = await Promise.all([
        prisma.rentalOrder.findMany({
            where,
            skip,
            take: limit,
            include: {
                customer: { select: { id: true, name: true, email: true } },
                items: { include: { gearItem: { select: { id: true, title: true } } } },
                payments: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.rentalOrder.count({ where }),
    ]);

    return { rentals, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const rentalServices = {
    createRentalOrder,
    getCustomerRentals,
    getRentalById,
    cancelRentalOrder,
    getProviderIncomingOrders,
    updateOrderStatusByProvider,
    getAllRentalsForAdmin,
};
