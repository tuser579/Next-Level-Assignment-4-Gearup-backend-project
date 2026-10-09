import app from "./app";
import { prisma } from "./lib/prisma";
import { config } from "./config";

const PORT = config.port;

async function bootstrap() {
    try {
        // 1. Verify database connection before binding HTTP port
        await prisma.$connect();
        console.log("✅ Database connected successfully");

        // 2. Start HTTP listener
        app.listen(PORT, () => {
            console.log(`🚀 Server listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

bootstrap();