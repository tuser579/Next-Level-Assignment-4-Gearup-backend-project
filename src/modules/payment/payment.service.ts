import Stripe from "stripe";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";
import { RentalOrderStatus, PaymentStatus, PaymentMethod, Role } from "../../../generated/prisma/enums";

/**
 * 1. Create Dynamic Rental Checkout Session
 * Formats daily rental fees and refundable security deposits into distinct line items
 */
const createRentalCheckoutSession = async (rentalOrderId: string, customerId: string) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: rentalOrderId },
        include: {
            customer: true,
            items: { include: { gearItem: true } },
        },
    });

    // Verify ownership & order status
    if (order.customerId !== customerId) {
        const err: any = new Error("Forbidden: You cannot pay for another customer's order.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
        const err: any = new Error("This rental order has already been paid.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    if (order.status === RentalOrderStatus.PLACED) {
        const err: any = new Error("Provider cannot confirmed.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    if (order.status === RentalOrderStatus.PICKED_UP) {
        const err: any = new Error("Cutomer already paid and picked this order.So, you cannot again paid");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    if (order.status === RentalOrderStatus.CANCELLED) {
        const err: any = new Error("Cannot pay for a cancelled rental order.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    // Construct dynamic line items for Stripe Checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
        price_data: {
            currency: "bdt",
            product_data: {
                name: `${item.gearItem.title} (${order.totalDays} Days Rental)`,
                description: `Brand: ${item.gearItem.brand} | Model: ${item.gearItem.model || "Standard"} | Condition: ${item.gearItem.condition}`,
                images: item.gearItem.images.slice(0, 1),
            },
            unit_amount: Math.round(item.unitPricePerDay * order.totalDays * 100), // Cents conversion
        },
        quantity: item.quantity,
    }));

    // Add Refundable Security Deposit as a distinct line item if configured
    if (order.depositFee > 0) {
        lineItems.push({
            price_data: {
                currency: "bdt",
                product_data: {
                    name: "Refundable Security Deposit Fee",
                    description: "100% refundable upon safe return and inspection of equipment.",
                },
                unit_amount: Math.round(order.depositFee * 100),
            },
            quantity: 1,
        });
    }

    // Generate Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: order.customer.email,
        line_items: lineItems,
        success_url: `${config.app_url}/rentals/${order.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/rentals/${order.id}?payment=cancelled`,
        metadata: {
            rentalOrderId: order.id,
            customerId: order.customerId,
            orderNumber: order.orderNumber,
        },
    } as any);

    // Persist initial pending payment record
    await prisma.payment.upsert({
        where: { stripeSessionId: session.id },
        update: {},
        create: {
            transactionId: `txn_${session.id.slice(-14)}`,
            rentalOrderId: order.id,
            customerId: order.customerId,
            amount: order.totalAmount,
            currency: "bdt",
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.PENDING,
            stripeSessionId: session.id,
        },
    });

    return { paymentUrl: session.url, sessionId: session.id };
};

/**
 * 2. Universal Webhook Pipeline (Local CLI & Production Cloud)
 * Handles cryptographic signature validation, rolling secret fallback,
 * database idempotency, and atomic order state transitions
 */
const handleWebhook = async (payload: Buffer, signature: string) => {
    let event: Stripe.Event;

    // A. Cryptographic Signature Verification with Rolling Secret Rotation Fallback
    try {
        event = stripe.webhooks.constructEvent(payload, signature, config.stripe_webhook_secret);
    } catch (primaryErr: any) {
        if (config.stripe_webhook_secret_rolling) {
            try {
                event = stripe.webhooks.constructEvent(payload, signature, config.stripe_webhook_secret_rolling);
            } catch (rollingErr: any) {
                throw new Error(`Stripe signature verification failed: ${primaryErr.message}`);
            }
        } else {
            throw new Error(`Stripe signature verification failed: ${primaryErr.message}`);
        }
    }

    // B. Production Idempotency Guard (Prevents double fulfillment on retries)
    const alreadyHandled = await prisma.webhookLog.findUnique({
        where: { eventId: event.id },
    });

    if (alreadyHandled) {
        console.log(`ℹ️ [Stripe Webhook] Duplicate event ${event.id} detected. Skipping.`);
        return;
    }

    await prisma.webhookLog.create({
        data: { eventId: event.id, eventType: event.type },
    });

    // C. Event Dispatcher
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const rentalOrderId = session.metadata?.rentalOrderId;

            if (!rentalOrderId) {
                console.warn(`⚠️ [Webhook] No rentalOrderId found in session ${session.id} metadata.`);
                break;
            }

            await prisma.$transaction(async (tx) => {
                // 1. Mark Payment as PAID
                await tx.payment.updateMany({
                    where: { stripeSessionId: session.id },
                    data: {
                        status: PaymentStatus.PAID,
                        stripePaymentIntentId: session.payment_intent as string,
                        paidAt: new Date(),
                    },
                });

                // 2. Transition Rental Order from PLACED -> CONFIRMED & PAID
                const order = await tx.rentalOrder.update({
                    where: { id: rentalOrderId },
                    data: {
                        status: RentalOrderStatus.CONFIRMED,
                        paymentStatus: PaymentStatus.PAID,
                    },
                    include: { items: true },
                });

                // 3. Atomically decrement available stock for reserved gear
                for (const item of order.items) {
                    await tx.gearItem.update({
                        where: { id: item.gearItemId },
                        data: { availableStock: { decrement: item.quantity } },
                    });
                }

                console.log(`🎉 [Webhook] Rental Order ${order.orderNumber} successfully confirmed and inventory reserved.`);
            });
            break;
        }

        case "payment_intent.payment_failed": {
            const intent = event.data.object as Stripe.PaymentIntent;
            await prisma.$transaction(async (tx) => {
                await tx.payment.updateMany({
                    where: { stripePaymentIntentId: intent.id },
                    data: { status: PaymentStatus.FAILED },
                });

                const payment = await tx.payment.findFirst({
                    where: { stripePaymentIntentId: intent.id },
                });

                if (payment) {
                    await tx.rentalOrder.update({
                        where: { id: payment.rentalOrderId },
                        data: { paymentStatus: PaymentStatus.FAILED },
                    });
                }
            });
            console.warn(`❌ [Webhook] Payment failed for PaymentIntent ${intent.id}.`);
            break;
        }

        case "charge.refunded": {
            const charge = event.data.object as Stripe.Charge;
            const intentId = charge.payment_intent as string;
            const isFullRefund = charge.refunded; // true if 100% refunded, false if partial refund
            const totalRefunded = charge.amount_refunded / 100;

            await prisma.$transaction(async (tx) => {
                const payment = await tx.payment.findFirst({
                    where: { stripePaymentIntentId: intentId },
                    include: { rentalOrder: { include: { items: true } } },
                });

                if (payment) {
                    const currentOrderStatus = payment.rentalOrder.status;

                    // 1. Record each refund in the Refund table (idempotent upsert by stripeRefundId)
                    if (charge.refunds && charge.refunds.data && charge.refunds.data.length > 0) {
                        for (const ref of charge.refunds.data) {
                            await tx.refund.upsert({
                                where: { stripeRefundId: ref.id },
                                create: {
                                    stripeRefundId: ref.id,
                                    paymentId: payment.id,
                                    rentalOrderId: payment.rentalOrderId,
                                    amount: ref.amount / 100,
                                    currency: ref.currency,
                                    reason: (ref.metadata?.reason as string) || ref.reason || "Charge refunded",
                                    refundType: (ref.metadata?.refundType as string) || (isFullRefund ? "FULL" : "PARTIAL"),
                                    status: ref.status || "succeeded",
                                },
                                update: {
                                    status: ref.status || "succeeded",
                                    amount: ref.amount / 100,
                                },
                            });
                        }
                    }

                    if (isFullRefund) {
                        // 2. Full Refund: Mark payment status as REFUNDED
                        await tx.payment.update({
                            where: { id: payment.id },
                            data: { status: PaymentStatus.REFUNDED },
                        });

                        // 3. Mark Rental Order as REFUNDED and CANCELLED (if not already completed/returned)
                        await tx.rentalOrder.update({
                            where: { id: payment.rentalOrderId },
                            data: {
                                paymentStatus: PaymentStatus.REFUNDED,
                                ...(currentOrderStatus !== RentalOrderStatus.RETURNED && {
                                    status: RentalOrderStatus.CANCELLED,
                                }),
                            },
                        });

                        // 4. Restore gear inventory ONLY if it hasn't been restored already
                        if (
                            currentOrderStatus !== RentalOrderStatus.RETURNED &&
                            currentOrderStatus !== RentalOrderStatus.CANCELLED
                        ) {
                            for (const item of payment.rentalOrder.items) {
                                await tx.gearItem.update({
                                    where: { id: item.gearItemId },
                                    data: { availableStock: { increment: item.quantity } },
                                });
                            }
                        }

                        console.log(`🔄 [Webhook] Order ${payment.rentalOrder.orderNumber} FULLY refunded (${totalRefunded} ${charge.currency.toUpperCase()}). Stored in Refund table.`);
                    } else {
                        // Partial Refund (e.g., Security Deposit Refund after return)
                        // Preserve existing order status (e.g. RETURNED) and do NOT modify inventory
                        console.log(`💵 [Webhook] Order ${payment.rentalOrder.orderNumber} PARTIALLY refunded (${totalRefunded} ${charge.currency.toUpperCase()}). Stored in Refund table.`);
                    }
                }
            });
            break;
        }

        default:
            console.log(`ℹ️ [Webhook] Unhandled event type: ${event.type}`);
    }
};

/**
 * 3. User Payment History & Receipts
 */
const getUserPayments = async (userId: string, role: string, query: { page?: string; limit?: string }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereCondition = role === Role.ADMIN || role === Role.PROVIDER ? {} : { customerId: userId };

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where: whereCondition,
            skip,
            take: limit,
            include: {
                rentalOrder: {
                    select: { orderNumber: true, startDate: true, endDate: true, status: true },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.payment.count({ where: whereCondition }),
    ]);

    return { payments, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getPaymentById = async (paymentId: string, userId: string, role: string) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: { id: paymentId },
        include: {
            rentalOrder: {
                include: {
                    items: { include: { gearItem: { select: { title: true, brand: true } } } },
                },
            },
            refunds: true,
        },
    });

    if (role !== Role.ADMIN && role !== Role.PROVIDER && payment.customerId !== userId) {
        const err: any = new Error("Forbidden: You do not have access to this payment receipt.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    return payment;
};

/**
 * 3.1 Get All Refund Records (Paginated & Role-Filtered)
 */
const getAllRefunds = async (userId: string, role: string, query: { page?: string; limit?: string }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    let whereCondition: any = {};

    if (role === Role.ADMIN || role === Role.PROVIDER) {
        whereCondition = {};
    } else if (role === Role.CUSTOMER) {
        whereCondition = {
            rentalOrder: { customerId: userId },
        };
    }

    const [refunds, total] = await Promise.all([
        prisma.refund.findMany({
            where: whereCondition,
            skip,
            take: limit,
            include: {
                rentalOrder: {
                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                        depositFee: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        transactionId: true,
                        amount: true,
                        currency: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.refund.count({ where: whereCondition }),
    ]);

    return { refunds, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

/**
 * 3.2 Get Refund Details by ID
 */
const getRefundById = async (refundId: string, userId: string, role: string) => {
    const refund = await prisma.refund.findUniqueOrThrow({
        where: { id: refundId },
        include: {
            rentalOrder: {
                include: {
                    customer: { select: { id: true, name: true, email: true } },
                    items: { include: { gearItem: { select: { id: true, title: true, providerId: true } } } },
                },
            },
            payment: true,
        },
    });

    if (role === Role.CUSTOMER && refund.rentalOrder.customerId !== userId) {
        const err: any = new Error("Forbidden: You do not have access to this refund record.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    return refund;
};

/**
 * 4. Initiate Refund (Partial or Full)
 * Allows Admins or Providers to issue refunds via Stripe:
 * - If payload.amount is omitted: 100% full refund
 * - If payload.amount is given: Partial refund of that specific amount
 */
const initiateRefund = async (
    rentalOrderId: string,
    userId: string,
    userRole: string,
    payload?: { amount?: number; reason?: string }
) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: rentalOrderId },
        include: {
            payments: {
                where: { status: PaymentStatus.PAID },
                orderBy: { createdAt: "desc" },
            },
            items: { include: { gearItem: true } },
        },
    });


    const paidPayment = order.payments[0];
    if (!paidPayment || !paidPayment.stripePaymentIntentId) {
        const err: any = new Error("No completed Stripe payment found to refund for this order.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    const refundAmount = payload?.amount;

    if (refundAmount !== undefined) {
        if (refundAmount <= 0) {
            const err: any = new Error("Refund amount must be greater than zero.");
            err.statusCode = httpStatus.BAD_REQUEST;
            throw err;
        }
        if (refundAmount > paidPayment.amount) {
            const err: any = new Error(`Refund amount cannot exceed total paid amount (${paidPayment.amount}).`);
            err.statusCode = httpStatus.BAD_REQUEST;
            throw err;
        }
    }

    // Call Stripe Refund API
    const refund = await stripe.refunds.create({
        payment_intent: paidPayment.stripePaymentIntentId,
        ...(refundAmount && { amount: Math.round(refundAmount * 100) }),
        reason: "requested_by_customer",
        metadata: {
            rentalOrderId: order.id,
            refundType: refundAmount ? "PARTIAL" : "FULL",
            reason: payload?.reason || "Refund requested by admin/provider",
            initiatedBy: userId,
        },
    });

    return {
        refundId: refund.id,
        refundType: refundAmount ? "PARTIAL" : "FULL",
        amountRefunded: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
    };
};

/**
 * 5. Auto Refund Security Deposit
 * Automatically calculates and refunds the refundable deposit fee after equipment return inspection.
 * Supports optional damage deduction fee.
 */
const autoRefundSecurityDeposit = async (
    rentalOrderId: string,
    userId: string,
    userRole: string,
    payload?: { damageDeduction?: number; reason?: string }
) => {
    const order = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: rentalOrderId },
        include: {
            payments: {
                where: { status: PaymentStatus.PAID },
                orderBy: { createdAt: "desc" },
            },
            items: { include: { gearItem: true } },
        },
    });


    if (order.status !== RentalOrderStatus.RETURNED && userRole !== Role.ADMIN) {
        const err: any = new Error("Security deposit can only be automatically refunded after equipment has been marked as RETURNED.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    if (order.depositFee <= 0) {
        const err: any = new Error("This order does not have a refundable security deposit.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    const paidPayment = order.payments[0];
    if (!paidPayment || !paidPayment.stripePaymentIntentId) {
        const err: any = new Error("No paid transaction found to refund.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    const damageDeduction = payload?.damageDeduction || 0;

    if (damageDeduction < 0) {
        const err: any = new Error("Damage deduction cannot be negative.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    if (damageDeduction > order.depositFee) {
        const err: any = new Error(`Damage deduction (${damageDeduction}) cannot exceed the security deposit fee (${order.depositFee}).`);
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    const netRefundableDeposit = order.depositFee - damageDeduction;

    if (netRefundableDeposit <= 0) {
        return {
            rentalOrderId: order.id,
            originalDepositFee: order.depositFee,
            damageDeduction,
            amountRefunded: 0,
            message: "100% of the security deposit was retained to cover equipment damage/loss. No Stripe refund issued.",
        };
    }

    // Process partial Stripe refund for the net security deposit
    const refund = await stripe.refunds.create({
        payment_intent: paidPayment.stripePaymentIntentId,
        amount: Math.round(netRefundableDeposit * 100),
        reason: "requested_by_customer",
        metadata: {
            rentalOrderId: order.id,
            refundType: "SECURITY_DEPOSIT",
            originalDepositFee: String(order.depositFee),
            damageDeduction: String(damageDeduction),
            reason: payload?.reason || "Automatic deposit refund upon equipment return & inspection",
            initiatedBy: userId,
        },
    });

    return {
        refundId: refund.id,
        rentalOrderId: order.id,
        originalDepositFee: order.depositFee,
        damageDeduction,
        amountRefunded: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
    };
};

export const paymentServices = {
    createRentalCheckoutSession,
    handleWebhook,
    getUserPayments,
    getPaymentById,
    getAllRefunds,
    getRefundById,
    initiateRefund,
    autoRefundSecurityDeposit,
};
