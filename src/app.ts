import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { categoryRoutes } from "./modules/category/category.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { providerRoutes } from "./modules/provider/provider.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

// 1. CORS Configuration
app.use(
    cors({
        origin: ["http://localhost:3000", "https://yourfrontend.com"],
        credentials: true,
    })
);

// 2. ⚠️ Mount Raw Body Parser for Stripe Webhook BEFORE express.json()
app.use("/api/payments/confirm", express.raw({ type: "application/json" }));

// 3. Standard Body Parsers for normal routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Base Health Check Route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "API Server is running successfully!",
    });
});

// 5. Application Feature Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// 6. 404 & Centralized Error Handlers (Always at the end)
app.use(notFound);
app.use(globalErrorHandler);

export default app;