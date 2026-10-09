import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL!,
    node_env: process.env.NODE_ENV || "development",
    app_url: process.env.APP_URL || "http://localhost:5000",
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
    stripe_webhook_secret_rolling: process.env.STRIPE_WEBHOOK_SECRET_ROLLING || "",
    stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID!,
};