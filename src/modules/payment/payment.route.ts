import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

// Customer creates checkout session for an order
router.post("/create", auth(Role.CUSTOMER), paymentController.createCheckoutSession);

// Public Stripe Webhook listener (validated cryptographically via raw body buffer)
router.post("/confirm", paymentController.handleWebhook);

// Refund Operations (Partial or Full Refunds & Auto Security Deposit Refunds)
router.post("/refund", auth(Role.PROVIDER, Role.ADMIN), paymentController.initiateRefund);
router.post("/auto-refund-deposit/:rentalOrderId", auth(Role.PROVIDER, Role.ADMIN), paymentController.autoRefundSecurityDeposit);

// Refund Query Operations (Auditing & History - placed before /:id)
router.get("/refunds", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), paymentController.getAllRefunds);
router.get("/refunds/:id", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), paymentController.getRefundById);

// Payment audit and receipts
router.get("/", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), paymentController.getUserPayments);
router.get("/:id", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), paymentController.getPaymentById);

export const paymentRoutes = router;