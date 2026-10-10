import Stripe from "stripe";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";
import { RentalOrderStatus, PaymentStatus, PaymentMethod } from "../../../generated/prisma/enums";

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

    if (order.status === RentalOrderStatus.CANCELLED) {
        const err: any = new Error("Cannot pay for a cancelled rental order.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    // Construct dynamic line items for Stripe Checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
        price_data: {
            currency: "usd",
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
                currency: "usd",
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
            currency: "usd",
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

            await prisma.$transaction(async (tx) => {
                const payment = await tx.payment.findFirst({
                    where: { stripePaymentIntentId: intentId },
                    include: { rentalOrder: { include: { items: true } } },
                });

                if (payment) {
                    await tx.payment.update({
                        where: { id: payment.id },
                        data: { status: PaymentStatus.REFUNDED },
                    });

                    await tx.rentalOrder.update({
                        where: { id: payment.rentalOrderId },
                        data: { paymentStatus: PaymentStatus.REFUNDED, status: RentalOrderStatus.CANCELLED },
                    });

                    // Restore gear inventory upon refund/cancellation
                    for (const item of payment.rentalOrder.items) {
                        await tx.gearItem.update({
                            where: { id: item.gearItemId },
                            data: { availableStock: { increment: item.quantity } },
                        });
                    }
                    console.log(`🔄 [Webhook] Order ${payment.rentalOrder.orderNumber} refunded and stock restored.`);
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

    const whereCondition = role === "ADMIN" ? {} : { customerId: userId };

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
        },
    });

    if (role !== "ADMIN" && payment.customerId !== userId) {
        const err: any = new Error("Forbidden: You do not have access to this payment receipt.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    return payment;
};

export const paymentServices = {
    createRentalCheckoutSession,
    handleWebhook,
    getUserPayments,
    getPaymentById,
};
