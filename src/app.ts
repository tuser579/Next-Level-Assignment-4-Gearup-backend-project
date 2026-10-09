import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./modules/user/user.route";
// import { paymentRoutes } from "./modules/payment/payment.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

// 1. CORS Configuration
app.use(cors({
    origin: ["http://localhost:3000", "https://yourfrontend.com"],
    credentials: true,
}));

// 2. ⚠️ Mount Raw Webhook parser BEFORE express.json()
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// 3. Standard Body Parsers for normal routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Health Check Route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "API Server is running successfully!",
    });
});

// 5. Application Feature Routes
app.use("/api/users", userRoutes);
// app.use("/api/payment", paymentRoutes);

// 6. 404 & Centralized Error Handlers (Always at the end)
app.use(notFound);
app.use(globalErrorHandler);

export default app;