import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import {
    Role,
    UserStatus,
    ItemCondition,
    GearStatus,
    RentalOrderStatus,
    PaymentStatus,
    PaymentMethod,
} from "../generated/prisma/enums";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GEARUP ENTERPRISE DATABASE SEED SCRIPT
 * ═══════════════════════════════════════════════════════════════════════
 *  - Deterministic test data with realistic Bangladeshi locations & BDT
 *  - Complete rental order lifecycles (PLACED, CONFIRMED, PICKED_UP, RETURNED, CANCELLED)
 *  - Fully populated Refund table demonstrating Partial, Full, and Security Deposit refunds
 *  - Production safety guardrail to protect live data
 * ═══════════════════════════════════════════════════════════════════════
 */

async function main() {
    console.log("\n=======================================================");
    console.log("   🚀 GEARUP: Enterprise Database Seeder Initialized   ");
    console.log("=======================================================\n");

    // 0. Production Safety Guardrail
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_PROD_SEED !== "true") {
        console.error("⛔ [Safety Guard] Seeding blocked in PRODUCTION environment without ALLOW_PROD_SEED=true.");
        process.exit(1);
    }

    console.time("⏱️ Total Execution Time");

    // 1. Purge Existing Records (Reverse Relational Order)
    // console.log("🧹 [1/6] Cleaning existing database records...");
    // await prisma.$transaction([
    //     prisma.refund.deleteMany(),
    //     prisma.webhookLog.deleteMany(),
    //     prisma.review.deleteMany(),
    //     prisma.payment.deleteMany(),
    //     prisma.rentalOrderItem.deleteMany(),
    //     prisma.rentalOrder.deleteMany(),
    //     prisma.gearItem.deleteMany(),
    //     prisma.category.deleteMany(),
    //     prisma.user.deleteMany(),
    // ]);
    // console.log("   ✔ Previous database state cleanly wiped.\n");

    // 2. Pre-hash Passwords (reused across accounts for high performance)
    console.log("🔐 [2/6] Generating cryptographic credential hashes...");
    const adminPasswordHash = await bcrypt.hash("admin123", 12);
    const standardPasswordHash = await bcrypt.hash("password123", 12);

    // 3. Seed Users across All 3 RBAC Roles
    console.log("👥 [3/6] Seeding system users (Admin, Providers, Customers)...");
    const [admin, provider1, provider2, customer1, customer2, customer3] = await Promise.all([
        prisma.user.create({
            data: {
                name: "GearUp Super Admin",
                email: "admin@gearup.com",
                password: adminPasswordHash,
                role: Role.ADMIN,
                status: UserStatus.ACTIVE,
                phone: "+880-1700-000001",
                address: "Gulshan-2, Dhaka 1212, Bangladesh",
                profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
            },
        }),
        prisma.user.create({
            data: {
                name: "Summit Outdoor Outfitter",
                email: "summit.sports@gearup.com",
                password: standardPasswordHash,
                role: Role.PROVIDER,
                status: UserStatus.ACTIVE,
                phone: "+880-1700-000002",
                address: "Road 11, Banani, Dhaka 1213, Bangladesh",
                profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            },
        }),
        prisma.user.create({
            data: {
                name: "Bengal Coast & Marine Hub",
                email: "cascade.rentals@gearup.com",
                password: standardPasswordHash,
                role: Role.PROVIDER,
                status: UserStatus.ACTIVE,
                phone: "+880-1700-000003",
                address: "Marine Drive, Cox's Bazar 4700, Bangladesh",
                profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
            },
        }),
        prisma.user.create({
            data: {
                name: "John Trekkers",
                email: "john.customer@gmail.com",
                password: standardPasswordHash,
                role: Role.CUSTOMER,
                status: UserStatus.ACTIVE,
                phone: "+880-1700-000004",
                address: "Sector 4, Uttara, Dhaka 1230, Bangladesh",
                profileImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
            },
        }),
        prisma.user.create({
            data: {
                name: "Sarah Outdoors",
                email: "sarah.gear@gmail.com",
                password: standardPasswordHash,
                role: Role.CUSTOMER,
                status: UserStatus.ACTIVE,
                phone: "+880-1700-000005",
                address: "Dhanmondi 27, Dhaka 1209, Bangladesh",
                profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            },
        }),
        prisma.user.create({
            data: {
                name: "Tariq Explorer",
                email: "tariq.explorer@gmail.com",
                password: standardPasswordHash,
                role: Role.CUSTOMER,
                status: UserStatus.ACTIVE,
                phone: "+880-1700-000006",
                address: "Zindabazar, Sylhet 3100, Bangladesh",
                profileImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400",
            },
        }),
    ]);
    console.log("   ✔ 1 Admin, 2 Providers, and 3 Customers created.\n");

    // 4. Seed Gear Categories
    console.log("📂 [4/6] Seeding equipment categories...");
    const [catCamping, catCycling, catWater, catClimbing] = await Promise.all([
        prisma.category.create({
            data: {
                name: "Camping & Hiking",
                slug: "camping-hiking",
                description: "Ultralight tents, weather-resistant sleeping bags, multi-fuel stoves, and trekking backpacks.",
                iconUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
            },
        }),
        prisma.category.create({
            data: {
                name: "Cycling & Mountain Biking",
                slug: "cycling-mountain-biking",
                description: "Full-suspension trail bikes, gravel cruisers, aerodynamic helmets, and bike packing panniers.",
                iconUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600",
            },
        }),
        prisma.category.create({
            data: {
                name: "Water Sports & Marine",
                slug: "water-sports-marine",
                description: "Touring kayaks, inflatable stand-up paddleboards, neoprene wetsuits, and certified life jackets.",
                iconUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
            },
        }),
        prisma.category.create({
            data: {
                name: "Mountaineering & Climbing",
                slug: "mountaineering-climbing",
                description: "Dynamic climbing ropes, modular safety harnesses, locking carabiners, and climbing helmets.",
                iconUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600",
            },
        }),
    ]);
    console.log("   ✔ 4 Categories configured.\n");

    // 5. Seed Gear Inventory Catalog
    console.log("🏕️ [5/6] Seeding premium gear items across providers...");
    const [gearTent, gearBike, gearKayak, gearRope, gearSleepingBag] = await Promise.all([
        prisma.gearItem.create({
            data: {
                title: "MSR Hubba Hubba 3P Ultralight Backpacking Tent",
                slug: "msr-hubba-hubba-3p-tent",
                description: "Freestanding 3-season tent engineered with Easton Syclone composite poles and DuraShield waterproof coating. Ideal for Keokradong & Bandarban trails.",
                brand: "MSR",
                model: "Hubba Hubba 3P",
                condition: ItemCondition.EXCELLENT,
                rentalPricePerDay: 500.0,
                depositFee: 1500.0,
                totalStock: 6,
                availableStock: 5,
                location: "Dhaka, Bangladesh",
                images: [
                    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
                    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
                ],
                specifications: { capacity: "3 Person", packedWeight: "1.72 kg", floorArea: "3.67 sq m", rainflyWaterproof: "3000mm" },
                status: GearStatus.AVAILABLE,
                providerId: provider1.id,
                categoryId: catCamping.id,
            },
        }),
        prisma.gearItem.create({
            data: {
                title: "Trek Fuel EX 8 Gen 6 Full Suspension Mountain Bike",
                slug: "trek-fuel-ex-8-mountain-bike",
                description: "Trail-ready alloy MTB featuring FOX Rhythm 36 Float fork (150mm), FOX Performance Float shock (140mm), and Shimano XT 12-speed drivetrain.",
                brand: "Trek",
                model: "Fuel EX 8",
                condition: ItemCondition.NEW,
                rentalPricePerDay: 1500.0,
                depositFee: 3000.0,
                totalStock: 3,
                availableStock: 2,
                location: "Dhaka, Bangladesh",
                images: [
                    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800",
                ],
                specifications: { frame: "Alpha Platinum Aluminum", wheelSize: "29 inch", brakes: "Shimano 4-piston hydraulic", frameSize: "Large" },
                status: GearStatus.AVAILABLE,
                providerId: provider1.id,
                categoryId: catCycling.id,
            },
        }),
        prisma.gearItem.create({
            data: {
                title: "Oru Kayak Inlet Foldable Touring Kayak with Paddle",
                slug: "oru-kayak-inlet-foldable",
                description: "Origami-engineered fold-out kayak that collapses into a lightweight backpack box in under 3 minutes. Perfect for Kaptai Lake & Nafakhum.",
                brand: "Oru Kayak",
                model: "Inlet",
                condition: ItemCondition.EXCELLENT,
                rentalPricePerDay: 1000.0,
                depositFee: 2000.0,
                totalStock: 4,
                availableStock: 4,
                location: "Cox's Bazar, Bangladesh",
                images: [
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
                ],
                specifications: { length: "10 ft", weight: "9 kg", maxCapacity: "125 kg", setupTime: "3 minutes" },
                status: GearStatus.AVAILABLE,
                providerId: provider2.id,
                categoryId: catWater.id,
            },
        }),
        prisma.gearItem.create({
            data: {
                title: "Petzl Volta 9.2mm Dry Climbing Rope (60m) & Harness Set",
                slug: "petzl-volta-dry-climbing-rope",
                description: "Ultralight single rope with Guide UIAA Dry treatment, bundled with Petzl Corax adjustable harness and locking carabiner kit.",
                brand: "Petzl",
                model: "Volta Guide 9.2mm",
                condition: ItemCondition.NEW,
                rentalPricePerDay: 400.0,
                depositFee: 1200.0,
                totalStock: 5,
                availableStock: 5,
                location: "Dhaka, Bangladesh",
                images: [
                    "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800",
                ],
                specifications: { length: "60 m", diameter: "9.2 mm", impactForce: "8.6 kN", cert: "CE EN 892" },
                status: GearStatus.AVAILABLE,
                providerId: provider1.id,
                categoryId: catClimbing.id,
            },
        }),
        prisma.gearItem.create({
            data: {
                title: "The North Face Eco Trail Down -7°C Sleeping Bag",
                slug: "tnf-eco-trail-down-sleeping-bag",
                description: "600-fill recycled water-resistant down insulation designed to deliver dependable warmth in sub-zero highland conditions.",
                brand: "The North Face",
                model: "Eco Trail Bed 20",
                condition: ItemCondition.EXCELLENT,
                rentalPricePerDay: 300.0,
                depositFee: 1000.0,
                totalStock: 8,
                availableStock: 8,
                location: "Dhaka, Bangladesh",
                images: [
                    "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800",
                ],
                specifications: { tempRating: "-7°C (20°F)", insulation: "600-fill down", weight: "1.3 kg" },
                status: GearStatus.AVAILABLE,
                providerId: provider1.id,
                categoryId: catCamping.id,
            },
        }),
    ]);
    console.log("   ✔ 5 High-tier gear catalog items seeded.\n");

    // 6. Seed Complete Rental Lifecycle Orders, Payments & Refunds
    console.log("💳 [6/6] Seeding complete order lifecycles, Stripe records & Refunds...");

    // ───────────────────────────────────────────────────────────────────
    // Scenario 1: Completed, Returned, Deposit Fully Refunded + 5★ Review
    // ───────────────────────────────────────────────────────────────────
    const order1 = await prisma.rentalOrder.create({
        data: {
            orderNumber: "ORD-2026-0001",
            customerId: customer1.id,
            startDate: new Date("2026-06-01T09:00:00Z"),
            endDate: new Date("2026-06-04T18:00:00Z"),
            totalDays: 3,
            rentalFee: 1500.0, // 500/day * 3
            depositFee: 1500.0,
            totalAmount: 3000.0,
            status: RentalOrderStatus.RETURNED,
            paymentStatus: PaymentStatus.PAID,
            notes: "Please pack with extra ground tarp.",
            items: {
                create: {
                    gearItemId: gearTent.id,
                    quantity: 1,
                    unitPricePerDay: 500.0,  
                    depositPerUnit: 1500.0,
                    subtotal: 3000.0,
                },
            },
        },
    });

    const payment1 = await prisma.payment.create({
        data: {
            transactionId: "txn_demo_complete_001",
            rentalOrderId: order1.id,
            customerId: customer1.id,
            amount: 3000.0,
            currency: "bdt",
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.PAID,
            stripeSessionId: "cs_test_completed_session_001",
            stripePaymentIntentId: "pi_test_completed_intent_001",
            paidAt: new Date("2026-06-01T08:30:00Z"),
        },
    });

    // Auto Security Deposit Refund upon safe return
    await prisma.refund.create({
        data: {
            stripeRefundId: "re_demo_deposit_001",
            paymentId: payment1.id,
            rentalOrderId: order1.id,
            amount: 1500.0,
            currency: "bdt",
            refundType: "SECURITY_DEPOSIT",
            reason: "Automatic 100% deposit refund upon safe equipment inspection",
            status: "succeeded",
        },
    });

    await prisma.review.create({
        data: {
            customerId: customer1.id,
            gearItemId: gearTent.id,
            rentalOrderId: order1.id,
            rating: 5,
            comment: "Tent was pristine, lightweight, and withstood heavy thunderstorm winds in Bandarban without any leak!",
        },
    });

    // ───────────────────────────────────────────────────────────────────
    // Scenario 2: Active Ongoing Rental (Paid & In-Use / Picked Up)
    // ───────────────────────────────────────────────────────────────────
    const order2 = await prisma.rentalOrder.create({
        data: {
            orderNumber: "ORD-2026-0002",
            customerId: customer2.id,
            startDate: new Date("2026-07-01T10:00:00Z"),
            endDate: new Date("2026-07-03T18:00:00Z"),
            totalDays: 2,
            rentalFee: 3000.0, // 1500/day * 2
            depositFee: 3000.0,
            totalAmount: 6000.0,
            status: RentalOrderStatus.PICKED_UP,
            paymentStatus: PaymentStatus.PAID,
            notes: "Helmet size Large requested.",
            items: {
                create: {
                    gearItemId: gearBike.id,
                    quantity: 1,
                    unitPricePerDay: 1500.0,
                    depositPerUnit: 3000.0,
                    subtotal: 6000.0,
                },
            },
        },
    });

    await prisma.payment.create({
        data: {
            transactionId: "txn_demo_active_002",
            rentalOrderId: order2.id,
            customerId: customer2.id,
            amount: 6000.0,
            currency: "bdt",
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.PAID,
            stripeSessionId: "cs_test_active_session_002",
            stripePaymentIntentId: "pi_test_active_intent_002",
            paidAt: new Date("2026-07-01T09:15:00Z"),
        },
    });

    // ───────────────────────────────────────────────────────────────────
    // Scenario 3: Cancelled Order with Full 100% Stripe Refund
    // ───────────────────────────────────────────────────────────────────
    const order3 = await prisma.rentalOrder.create({
        data: {
            orderNumber: "ORD-2026-0003",
            customerId: customer3.id,
            startDate: new Date("2026-07-15T09:00:00Z"),
            endDate: new Date("2026-07-17T18:00:00Z"),
            totalDays: 2,
            rentalFee: 2000.0, // 1000/day * 2
            depositFee: 2000.0,
            totalAmount: 4000.0,
            status: RentalOrderStatus.CANCELLED,
            paymentStatus: PaymentStatus.REFUNDED,
            notes: "Trip cancelled due to cyclone alert.",
            items: {
                create: {
                    gearItemId: gearKayak.id,
                    quantity: 1,
                    unitPricePerDay: 1000.0,
                    depositPerUnit: 2000.0,
                    subtotal: 4000.0,
                },
            },
        },
    });

    const payment3 = await prisma.payment.create({
        data: {
            transactionId: "txn_demo_cancelled_003",
            rentalOrderId: order3.id,
            customerId: customer3.id,
            amount: 4000.0,
            currency: "bdt",
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.REFUNDED,
            stripeSessionId: "cs_test_cancelled_session_003",
            stripePaymentIntentId: "pi_test_cancelled_intent_003",
            paidAt: new Date("2026-07-10T11:00:00Z"),
        },
    });

    await prisma.refund.create({
        data: {
            stripeRefundId: "re_demo_full_cancel_003",
            paymentId: payment3.id,
            rentalOrderId: order3.id,
            amount: 4000.0,
            currency: "bdt",
            refundType: "FULL",
            reason: "Full refund issued upon customer cancellation prior to pickup",
            status: "succeeded",
        },
    });

    // ───────────────────────────────────────────────────────────────────
    // Scenario 4: Confirmed & Paid (Upcoming reservation)
    // ───────────────────────────────────────────────────────────────────
    const order4 = await prisma.rentalOrder.create({
        data: {
            orderNumber: "ORD-2026-0004",
            customerId: customer2.id,
            startDate: new Date("2026-08-10T09:00:00Z"),
            endDate: new Date("2026-08-14T18:00:00Z"),
            totalDays: 4,
            rentalFee: 1600.0, // 400/day * 4
            depositFee: 1200.0,
            totalAmount: 2800.0,
            status: RentalOrderStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
            items: {
                create: {
                    gearItemId: gearRope.id,
                    quantity: 1,
                    unitPricePerDay: 400.0,
                    depositPerUnit: 1200.0,
                    subtotal: 2800.0,
                },
            },
        },
    });

    await prisma.payment.create({
        data: {
            transactionId: "txn_demo_confirmed_004",
            rentalOrderId: order4.id,
            customerId: customer2.id,
            amount: 2800.0,
            currency: "bdt",
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.PAID,
            stripeSessionId: "cs_test_confirmed_session_004",
            stripePaymentIntentId: "pi_test_confirmed_intent_004",
            paidAt: new Date("2026-08-01T14:20:00Z"),
        },
    });

    // ───────────────────────────────────────────────────────────────────
    // Scenario 5: Newly Placed Order (Awaiting Checkout / PENDING)
    // ───────────────────────────────────────────────────────────────────
    await prisma.rentalOrder.create({
        data: {
            orderNumber: "ORD-2026-0005",
            customerId: customer3.id,
            startDate: new Date("2026-08-20T09:00:00Z"),
            endDate: new Date("2026-08-23T18:00:00Z"),
            totalDays: 3,
            rentalFee: 900.0, // 300/day * 3
            depositFee: 1000.0,
            totalAmount: 1900.0,
            status: RentalOrderStatus.PLACED,
            paymentStatus: PaymentStatus.PENDING,
            items: {
                create: {
                    gearItemId: gearSleepingBag.id,
                    quantity: 1,
                    unitPricePerDay: 300.0,
                    depositPerUnit: 1000.0,
                    subtotal: 1900.0,
                },
            },
        },
    });

    console.log("   ✔ 5 Complete Lifecycle Orders, Stripe Payments & Refunds created.\n");

    // 7. Verification Audit Summary
    const [userCount, catCount, gearCount, orderCount, paymentCount, refundCount, reviewCount] = await Promise.all([
        prisma.user.count(),
        prisma.category.count(),
        prisma.gearItem.count(),
        prisma.rentalOrder.count(),
        prisma.payment.count(),
        prisma.refund.count(),
        prisma.review.count(),
    ]);

    console.log("═══════════════════════════════════════════════════════");
    console.log("             📊 DATABASE AUDIT SUMMARY                 ");
    console.log("═══════════════════════════════════════════════════════");
    console.table([
        { Entity: "Users (Admin, Provider, Customer)", Count: userCount },
        { Entity: "Categories", Count: catCount },
        { Entity: "Gear Items (Active Inventory)", Count: gearCount },
        { Entity: "Rental Orders (All Lifecycles)", Count: orderCount },
        { Entity: "Payments (Completed & Paid)", Count: paymentCount },
        { Entity: "Refunds (Deposits & Cancellations)", Count: refundCount },
        { Entity: "Reviews & Ratings", Count: reviewCount },
    ]);

    console.timeEnd("⏱️ Total Execution Time");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log("✨ All data seeded successfully. Ready for manual or automated testing!\n");
}

main()
    .catch((error) => {
        console.error("\n💥 [Fatal Seeding Error]:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
