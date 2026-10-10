import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

// Customer creates checkout session for an order
router.post("/create", auth(Role.CUSTOMER), paymentController.createCheckoutSession);

// Public Stripe Webhook listener (validated cryptographically via raw body buffer)
router.post("/confirm", paymentController.handleWebhook);

// Payment audit and receipts
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getUserPayments);
router.get("/:id", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getPaymentById);

export const paymentRoutes = router;
