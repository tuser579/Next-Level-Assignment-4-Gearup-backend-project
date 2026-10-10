# 🏋️ GearUp: Production Architecture, Prisma Schemas, API Endpoints, Demo Seeding, Testing & Stripe Payment Guide

> **Repository Master Specification**  
> Complete end-to-end production guide for the **GearUp Sports & Outdoor Equipment Rental Backend API**.  
> Synthesizing **`2-GearUp-Project-Feature.md`** and **`Full_Project_SetUp.md`** into an enterprise-grade blueprint with zero pseudocode.

---

## 📑 Table of Contents

1. [A-to-Z Analysis: Feature Requirements & Architecture Blueprint](#1-a-to-z-analysis-feature-requirements--architecture-blueprint)
2. [Master Project Folder Structure & Production Scaffolding](#2-master-project-folder-structure--production-scaffolding)
   - [2.1 Complete Enterprise Directory Tree](#21-complete-enterprise-directory-tree)
   - [2.2 Automated Scaffolding Commands (PowerShell & Bash)](#22-automated-scaffolding-commands-powershell--bash)
   - [2.3 Package Dependencies & npm Scripts (`package.json`)](#23-package-dependencies--npm-scripts-packagejson)
   - [2.4 TypeScript Configuration (`tsconfig.json`)](#24-typescript-configuration-tsconfigjson)
   - [2.5 Centralized Environment Config (`src/config/index.ts` & `.env.example`)](#25-centralized-environment-config-srcconfigindexts--envexample)
   - [2.6 Architectural Roles & Layer Responsibilities](#26-architectural-roles--layer-responsibilities)
3. [Part 1: Prisma Model Schema (Production Multi-File & Consolidated)](#part-1-prisma-model-schema-production-multi-file--consolidated)
   - [Global Enums (`prisma/schema/enums.prisma`)](#1-global-enums-prismaschemaenumsprisma)
   - [User Entity (`prisma/schema/user.prisma`)](#2-user-entity-prismaschemauserprisma)
   - [Category Entity (`prisma/schema/category.prisma`)](#3-category-entity-prismaschemacategoryprisma)
   - [Gear Item Entity (`prisma/schema/gearItem.prisma`)](#4-gear-item-entity-prismaschemagearitemprisma)
   - [Rental Order Entities (`prisma/schema/rentalOrder.prisma`)](#5-rental-order-entities-prismaschemarentalorderprisma)
   - [Payment Entity (`prisma/schema/payment.prisma`)](#6-payment-entity-prismaschemapaymentprisma)
   - [Review Entity (`prisma/schema/review.prisma`)](#7-review-entity-prismaschemareviewprisma)
   - [Webhook Idempotency Entity (`prisma/schema/webhookLog.prisma`)](#8-webhook-idempotency-entity-prismaschemawebhooklogprisma)
   - [Consolidated Single-File `schema.prisma`](#9-consolidated-single-file-schemaprisma)
4. [Part 2: API Endpoints Catalog & Step-by-Step Implementation](#part-2-api-endpoints-catalog--step-by-step-implementation)
   - [Core Utilities & Shared Middlewares](#core-utilities--shared-middlewares)
   - [Module 1: Authentication & Profile (`/api/auth`)](#module-1-authentication--profile-apiauth)
   - [Module 2: User Administration & Auditing (`/api/admin`)](#module-2-user-administration--auditing-apiadmin)
   - [Module 3: Sports Categories (`/api/categories`)](#module-3-sports-categories-apicategories)
   - [Module 4: Gear Inventory & Public Catalog (`/api/gear`)](#module-4-gear-inventory--public-catalog-apigear)
   - [Module 5: Provider Portal (`/api/provider`)](#module-5-provider-portal-apiprovider)
   - [Module 6: Rental Orders Lifecycle (`/api/rentals`)](#module-6-rental-orders-lifecycle-apirentals)
   - [Module 7: Reviews & Ratings (`/api/reviews`)](#module-7-reviews--ratings-apireviews)
   - [Module 8: Payment & Checkout Transactions (`/api/payments`)](#module-8-payment--checkout-transactions-apipayments)
5. [Part 3: Production Demo Data Seeding (`prisma/seed.ts`)](#part-3-production-demo-data-seeding-prismaseedts)
   - [Complete Seed Script](#complete-seed-script-prismaseedts)
   - [Configuring and Executing the Seed](#configuring-and-executing-the-seed)
6. [Part 4: API Endpoint Testing Master Guide & Test Suite](#part-4-api-endpoint-testing-master-guide--test-suite)
   - [4.1 Master Sequential Execution Flow](#41-master-sequential-execution-flow)
   - [4.2 Postman & Thunder Client Environment Setup](#42-postman--thunder-client-environment-setup)
   - [4.3 Detailed Test Matrix with Request Bodies, cURL & Expected Responses](#43-detailed-test-matrix-with-request-bodies-curl--expected-responses)
   - [4.4 Negative & Role Guard Security Tests](#44-negative--role-guard-security-tests)
   - [4.5 Complete 32-Endpoint Master Compliance Checklist](#45-complete-32-endpoint-master-compliance-checklist)
7. [Part 5: Production Stripe Payment Implementation & Webhook Architecture](#part-5-production-stripe-payment-implementation--webhook-architecture)
   - [5.1 Architecture & Ingress Flow (Local CLI vs. Production Cloud)](#51-architecture--ingress-flow-local-cli-vs-production-cloud)
   - [5.2 Codebase Implementation (`Full_Project_SetUp.md` Pattern)](#52-codebase-implementation-full_project_setupmd-pattern)
     - [Stripe Singleton (`src/lib/stripe.ts`)](#1-stripe-singleton-srclibstripets)
     - [Payment Domain Types (`src/modules/payment/payment.interface.ts`)](#2-payment-domain-types-srcmodulespaymentpaymentinterfacets)
     - [Payment Service (`src/modules/payment/payment.service.ts`)](#3-payment-service-srcmodulespaymentpaymentservicets)
     - [Payment Controller (`src/modules/payment/payment.controller.ts`)](#4-payment-controller-srcmodulespaymentpaymentcontrollerts)
     - [Payment Routes (`src/modules/payment/payment.route.ts`)](#5-payment-routes-srcmodulespaymentpaymentroutets)
     - [Express Application Assembly (`src/app.ts`)](#6-express-application-assembly-srcappts)
   - [5.3 Development Webhook System: Step-by-Step Setup & Testing](#53-development-webhook-system-step-by-step-setup--testing)
     - [Dev Step 1: Stripe CLI Installation & Login](#dev-step-1-stripe-cli-installation--login)
     - [Dev Step 2: Local Forwarding Listener Configuration](#dev-step-2-local-forwarding-listener-configuration)
     - [Dev Step 3: Test 1 - Instant Synthetic Trigger](#dev-step-3-test-1---instant-synthetic-trigger)
     - [Dev Step 4: Test 2 - Full End-to-End Browser Checkout Test](#dev-step-4-test-2---full-end-to-end-browser-checkout-test)
     - [Dev Step 5: Test 3 - Idempotency & Duplicate Replay Test](#dev-step-5-test-3---idempotency--duplicate-replay-test)
     - [Dev Step 6: Test 4 - Card Decline / Payment Failure Simulation](#dev-step-6-test-4---card-decline--payment-failure-simulation)
   - [5.4 Production Webhook System: Step-by-Step Deployment & Testing](#54-production-webhook-system-step-by-step-deployment--testing)
     - [Prod Step 1: Live Cloud Destination Ingress Registration](#prod-step-1-live-cloud-destination-ingress-registration)
     - [Prod Step 2: Environment Secrets & Zero-Downtime Rolling Key Setup](#prod-step-2-environment-secrets--zero-downtime-rolling-key-setup)
     - [Prod Step 3: Test 1 - Pre-Flight Reachability & Handshake Test](#prod-step-3-test-1---pre-flight-reachability--handshake-test)
     - [Prod Step 4: Test 2 - Live Low-Value Purchase & Refund ($1.00 Test)](#prod-step-4-test-2---live-low-value-purchase--refund-100-test)
     - [Prod Step 5: Test 3 - Zero-Downtime Secret Rotation Test](#prod-step-5-test-3---zero-downtime-secret-rotation-test)
     - [Prod Step 6: Test 4 - Downtime Recovery & Manual Redelivery Test](#prod-step-6-test-4---downtime-recovery--manual-redelivery-test)
   - [5.5 Production Best Practices & Common Setup Traps](#55-production-best-practices--common-setup-traps)

---

# 1. A-to-Z Analysis: Feature Requirements & Architecture Blueprint

### 1.1 Requirements Analysis (`2-GearUp-Project-Feature.md`)
The **GearUp** platform solves the friction of renting high-grade sports and outdoor equipment (e.g., trekking tents, road cycles, scuba gear, snowboards) by connecting equipment providers with sports enthusiasts.

1. **Role Separation**:
   - **Customer**: Registers freely, browses gear with multifaceted filters, books rentals for selected date ranges, pays online through Stripe, tracks status, returns gear, and submits verified reviews.
   - **Provider**: Registers with provider status, creates and manages gear catalog listings, controls unit inventory and maintenance status, receives customer rental orders, and transitions order states from confirmation to handoff (`PICKED_UP`) and return (`RETURNED`).
   - **Admin**: Moderates user accounts (`ACTIVE` / `BLOCKED`), oversees categories, audits all system orders, and monitors financial payment transactions.

2. **Rental Lifecycle Transitions**:
   $$\text{PLACED} \xrightarrow[\text{Provider confirms}]{\text{or auto-payment}} \text{CONFIRMED} \xrightarrow[\text{Customer pays via Stripe}]{\text{Webhook}} \text{PAID} \xrightarrow[\text{Pickup}]{\text{Provider}} \text{PICKED\_UP} \xrightarrow[\text{Equipment Returned}]{\text{Provider checks}} \text{RETURNED}$$
   - Cancellation is allowed when order is in `PLACED` or unpaid state.
   - Verified review creation is strictly restricted to orders with status `RETURNED`.

### 1.2 Architectural Framework (`Full_Project_SetUp.md`)
To build an enterprise, zero-compromise backend, we adhere to the strict conventions laid out in the setup guide:
- **Modular Layered Architecture**: Routes $\to$ Controllers $\to$ Services $\to$ Prisma Database Layer.
- **Zero-Boilerplate Error Handling**: Express controllers wrapped via `catchAsync` to avoid nested `try/catch`.
- **Standardized Response Envelope**:
  - Success: `{ success: true, statusCode: 200, message: "...", data: {...}, meta?: {...} }`
  - Error: `{ success: false, message: "...", errorDetails: {...}, stack?: "..." }`
- **Security & Session Tokens**: Passwords hashed with `bcryptjs` (cost factor: 12), dual-token JWT flow (short-lived access token, long-lived refresh token), role-based middleware guards (`auth(Role.CUSTOMER, ...)`).
- **Universal Stripe Webhook Pipeline**: Raw body parsing (`express.raw({ type: "application/json" })`) mounted prior to `express.json()`, cryptographic signature verification with rolling secret fallback, and database-level event deduplication (`WebhookLog`).

---

# 2. Master Project Folder Structure & Production Scaffolding

This project layout strictly follows the **`Full_Project_SetUp.md`** architecture, tailored specifically to the **GearUp** sports rental domain.

### 2.1 Complete Enterprise Directory Tree

```
gearup-backend/
├── prisma/
│   ├── migrations/                 # Automated database migration history
│   ├── seed.ts                     # Production database seed script
│   └── schema/                     # Multi-file Prisma schemas
│       ├── schema.prisma           # Datasource and Client Generator
│       ├── enums.prisma            # Global system enums (Role, UserStatus, ItemCondition, etc.)
│       ├── user.prisma             # User entity model (Customer, Provider, Admin)
│       ├── category.prisma         # Sports gear categories
│       ├── gearItem.prisma         # Gear item model (inventory, pricing, specs)
│       ├── rentalOrder.prisma      # Rental order & order items model
│       ├── payment.prisma          # Payment transactions & Stripe session tracking
│       ├── review.prisma           # Customer reviews & ratings
│       └── webhookLog.prisma       # Stripe webhook idempotency log table
├── src/
│   ├── config/
│   │   └── index.ts                # Centralized environment variable config & validator
│   ├── lib/
│   │   ├── prisma.ts               # PrismaClient database singleton
│   │   └── stripe.ts               # Stripe SDK singleton
│   ├── middlewares/
│   │   ├── auth.ts                 # Role-based JWT authentication & role guard
│   │   ├── globalErrorHandler.ts   # Centralized error handler with formatted JSON
│   │   └── notFound.ts             # 404 route-not-found handler
│   ├── utils/
│   │   ├── catchAsync.ts           # Async wrapper eliminating try/catch
│   │   ├── sendResponse.ts         # Standardized API response envelope wrapper
│   │   └── jwt.ts                  # JWT token creation & verification utilities
│   ├── modules/
│   │   ├── auth/                   # Authentication & user profile module
│   │   │   ├── auth.interface.ts   # TypeScript DTOs & payloads
│   │   │   ├── auth.service.ts     # Password hashing, JWT signing, profile queries
│   │   │   ├── auth.controller.ts  # Express request handlers with catchAsync
│   │   │   └── auth.route.ts       # Public & protected route definitions
│   │   ├── admin/                  # Admin governance module
│   │   │   ├── admin.service.ts    # User moderation, ban/activate, global audits
│   │   │   ├── admin.controller.ts # Admin controllers
│   │   │   └── admin.route.ts      # Protected routes (auth(Role.ADMIN))
│   │   ├── category/               # Category module
│   │   │   ├── category.service.ts # Category CRUD & gear item count aggregations
│   │   │   ├── category.controller.ts
│   │   │   └── category.route.ts
│   │   ├── gear/                   # Gear catalog & inventory module (Public + Provider)
│   │   │   ├── gear.interface.ts   # Gear filters, create/update DTOs
│   │   │   ├── gear.service.ts     # Multifaceted search, pagination, provider inventory
│   │   │   ├── gear.controller.ts
│   │   │   └── gear.route.ts
│   │   ├── rental/                 # Rental order lifecycle module
│   │   │   ├── rental.interface.ts # Order creation, duration calculation interfaces
│   │   │   ├── rental.service.ts   # Order placement, status transitions, stock restoration
│   │   │   ├── rental.controller.ts
│   │   │   └── rental.route.ts
│   │   ├── payment/                # Payment & Stripe webhook module
│   │   │   ├── payment.service.ts  # Checkout session generation, raw webhook verification
│   │   │   ├── payment.controller.ts
│   │   │   └── payment.route.ts
│   │   └── review/                 # Reviews & ratings module
│   │       ├── review.service.ts   # Verified review submission, gear rating queries
│   │       ├── review.controller.ts
│   │       └── review.route.ts
│   ├── app.ts                      # Express application assembly (raw webhook before express.json)
│   └── server.ts                   # Database connection verify & HTTP bootstrap
├── .env                            # Secret environment variables (git-ignored)
├── .env.example                    # Template environment variables
├── .gitignore                      # Git ignored files & folders
├── package.json                    # Project metadata, dependencies & scripts
└── tsconfig.json                   # TypeScript compiler configuration (ESM, strict)
```

---

### 2.2 Automated Scaffolding Commands (PowerShell & Bash)

#### For Windows (PowerShell):
```powershell
New-Item -ItemType Directory -Force -Path `
  "prisma/schema", `
  "src/config", `
  "src/lib", `
  "src/middlewares", `
  "src/utils", `
  "src/modules/auth", `
  "src/modules/admin", `
  "src/modules/category", `
  "src/modules/gear", `
  "src/modules/rental", `
  "src/modules/payment", `
  "src/modules/review"
```

#### For macOS / Linux (Bash):
```bash
mkdir -p prisma/schema src/config src/lib src/middlewares src/utils \
  src/modules/auth src/modules/admin src/modules/category src/modules/gear \
  src/modules/rental src/modules/payment src/modules/review
```

---

### 2.3 Package Dependencies & npm Scripts (`package.json`)

Ensure `"type": "module"` is configured to enforce modern ECMAScript Modules (ESM).

#### Install Dependencies:
```bash
# Production Dependencies
npm install express dotenv cors cookie-parser http-status jsonwebtoken bcryptjs pg @prisma/client @prisma/adapter-pg stripe

# Development Dependencies
npm install -D typescript tsx @types/node @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/bcryptjs @types/pg prisma
```

#### `package.json` Configuration:
```json
{
  "name": "gearup-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.ts",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "stripe:listen": "stripe listen --forward-to localhost:5000/api/payments/confirm"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

### 2.4 TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "strict": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "include": ["src/**/*", "prisma/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### 2.5 Centralized Environment Config (`src/config/index.ts` & `.env.example`)

#### `.env.example`
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/gearup_db?schema=public"
APP_URL="http://localhost:3000"
NODE_ENV="development"
BCRYPT_SALT_ROUNDS=12

# JWT Authentication Secrets
JWT_ACCESS_SECRET="your_gearup_super_secret_access_key_min_32_chars"
JWT_REFRESH_SECRET="your_gearup_super_secret_refresh_key_min_32_chars"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# Stripe Payment Secrets
STRIPE_SECRET_KEY="sk_test_51Pxxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET_ROLLING=""
```

#### `src/config/index.ts`
```ts
// src/config/index.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: Number(process.env.PORT) || 5000,
  database_url: process.env.DATABASE_URL!,
  node_env: process.env.NODE_ENV || "development",
  app_url: process.env.APP_URL || "http://localhost:3000",
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
  stripe_webhook_secret_rolling: process.env.STRIPE_WEBHOOK_SECRET_ROLLING || "",
};
```

---

### 2.6 Architectural Roles & Layer Responsibilities

| Directory / File | Architectural Role | Responsibility |
| :--- | :--- | :--- |
| `prisma/schema/*.prisma` | Data Contract | Multi-file database definitions, relational integrity, indices, and constraints. |
| `src/config/index.ts` | Config Layer | Strongly-typed environment variables validation. |
| `src/lib/` | Infrastructure Singletons | Single instance management for `PrismaClient` and `Stripe` SDK. |
| `src/middlewares/auth.ts` | Security Guard | Extracts Bearer token or cookies, verifies JWT, and guards routes by role (`CUSTOMER`, `PROVIDER`, `ADMIN`). |
| `src/middlewares/globalErrorHandler.ts` | Error Formatting | Formats all exceptions into standard `{ success: false, message, errorDetails }` JSON envelopes. |
| `src/utils/catchAsync.ts` | Async Control | Higher-order wrapper eliminating repetitive `try/catch` in controllers. |
| `src/utils/sendResponse.ts` | API Envelope | Standardizes success responses `{ success: true, statusCode, message, data, meta }`. |
| `src/modules/<feature>/` | Domain Boundary | Autonomous feature modules holding interfaces, controllers, services, and routes. |
| `src/app.ts` | Express Assembly | Middleware chain order: CORS $\to$ Raw Webhook parser $\to$ `express.json()` $\to$ Feature Routes $\to$ Error Handlers. |
| `src/server.ts` | Process Lifecycle | Connects to PostgreSQL via Prisma before binding the HTTP port. Handles clean shutdown. |

---

# Part 1: Prisma Model Schema (Production Multi-File & Consolidated)

Prisma multi-file schemas reside inside `prisma/schema/`. Below are all necessary schema files designed to handle all aspects of the GearUp rental ecosystem.

### 1. Global Enums (`prisma/schema/enums.prisma`)
```prisma
// prisma/schema/enums.prisma
enum Role {
  CUSTOMER
  PROVIDER
  ADMIN
}

enum UserStatus {
  ACTIVE
  BLOCKED
}

enum ItemCondition {
  NEW
  EXCELLENT
  GOOD
  FAIR
}

enum GearStatus {
  AVAILABLE
  MAINTENANCE
  UNAVAILABLE
}

enum RentalOrderStatus {
  PLACED
  CONFIRMED
  PAID
  PICKED_UP
  RETURNED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  STRIPE
}
```

### 2. User Entity (`prisma/schema/user.prisma`)
```prisma
// prisma/schema/user.prisma
model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  password     String
  role         Role          @default(CUSTOMER)
  status       UserStatus    @default(ACTIVE)
  phone        String?
  address      String?
  profileImage String?

  // Relations
  gearItems    GearItem[]    @relation("ProviderGearItems")
  rentalOrders RentalOrder[] @relation("CustomerRentalOrders")
  reviews      Review[]      @relation("CustomerReviews")
  payments     Payment[]     @relation("CustomerPayments")

  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([email])
  @@index([role])
  @@map("users")
}
```

### 3. Category Entity (`prisma/schema/category.prisma`)
```prisma
// prisma/schema/category.prisma
model Category {
  id          String     @id @default(uuid())
  name        String     @unique
  slug        String     @unique
  description String?
  iconUrl     String?

  // Relations
  gearItems   GearItem[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("categories")
}
```

### 4. Gear Item Entity (`prisma/schema/gearItem.prisma`)
```prisma
// prisma/schema/gearItem.prisma
model GearItem {
  id                String            @id @default(uuid())
  title             String
  slug              String            @unique
  description       String
  brand             String
  model             String?
  condition         ItemCondition     @default(EXCELLENT)
  rentalPricePerDay Float
  depositFee        Float             @default(0)
  totalStock        Int               @default(1)
  availableStock    Int               @default(1)
  location          String
  images            String[]          // PostgreSQL text array
  specifications    Json?             // Structured technical specs
  status            GearStatus        @default(AVAILABLE)

  // Relations
  providerId        String
  provider          User              @relation("ProviderGearItems", fields: [providerId], references: [id], onDelete: Cascade)

  categoryId        String
  category          Category          @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  orderItems        RentalOrderItem[]
  reviews           Review[]

  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@index([providerId])
  @@index([categoryId])
  @@index([brand])
  @@index([rentalPricePerDay])
  @@map("gear_items")
}
```

### 5. Rental Order Entities (`prisma/schema/rentalOrder.prisma`)
```prisma
// prisma/schema/rentalOrder.prisma
model RentalOrder {
  id            String            @id @default(uuid())
  orderNumber   String            @unique
  startDate     DateTime
  endDate       DateTime
  totalDays     Int
  rentalFee     Float
  depositFee    Float
  totalAmount   Float
  status        RentalOrderStatus @default(PLACED)
  paymentStatus PaymentStatus     @default(PENDING)
  notes         String?

  // Relations
  customerId    String
  customer      User              @relation("CustomerRentalOrders", fields: [customerId], references: [id], onDelete: Cascade)

  items         RentalOrderItem[]
  payments      Payment[]
  reviews       Review[]

  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@index([customerId])
  @@index([status])
  @@index([paymentStatus])
  @@map("rental_orders")
}

model RentalOrderItem {
  id              String      @id @default(uuid())
  rentalOrderId   String
  rentalOrder     RentalOrder @relation(fields: [rentalOrderId], references: [id], onDelete: Cascade)

  gearItemId      String
  gearItem        GearItem    @relation(fields: [gearItemId], references: [id], onDelete: Restrict)

  quantity        Int         @default(1)
  unitPricePerDay Float
  depositPerUnit  Float
  subtotal        Float

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([rentalOrderId])
  @@index([gearItemId])
  @@map("rental_order_items")
}
```

### 6. Payment Entity (`prisma/schema/payment.prisma`)
```prisma
// prisma/schema/payment.prisma
model Payment {
  id                    String        @id @default(uuid())
  transactionId         String        @unique
  rentalOrderId         String
  rentalOrder           RentalOrder   @relation(fields: [rentalOrderId], references: [id], onDelete: Cascade)

  customerId            String
  customer              User          @relation("CustomerPayments", fields: [customerId], references: [id], onDelete: Cascade)

  amount                Float
  currency              String        @default("usd")
  method                PaymentMethod @default(STRIPE)
  status                PaymentStatus @default(PENDING)

  stripeSessionId       String?       @unique
  stripePaymentIntentId String?       @unique
  paidAt                DateTime?

  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  @@index([rentalOrderId])
  @@index([customerId])
  @@index([stripeSessionId])
  @@map("payments")
}
```

### 7. Review Entity (`prisma/schema/review.prisma`)
```prisma
// prisma/schema/review.prisma
model Review {
  id            String      @id @default(uuid())
  rating        Int         // Range: 1 to 5
  comment       String

  customerId    String
  customer      User        @relation("CustomerReviews", fields: [customerId], references: [id], onDelete: Cascade)

  gearItemId    String
  gearItem      GearItem    @relation(fields: [gearItemId], references: [id], onDelete: Cascade)

  rentalOrderId String
  rentalOrder   RentalOrder @relation(fields: [rentalOrderId], references: [id], onDelete: Cascade)

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@unique([customerId, rentalOrderId, gearItemId]) // One review per item per rental
  @@index([gearItemId])
  @@index([customerId])
  @@map("reviews")
}
```

### 8. Webhook Idempotency Entity (`prisma/schema/webhookLog.prisma`)
```prisma
// prisma/schema/webhookLog.prisma
model WebhookLog {
  id          String   @id @default(uuid())
  eventId     String   @unique
  eventType   String
  processedAt DateTime @default(now())

  @@index([eventId])
  @@map("webhook_logs")
}
```

### 9. Consolidated Single-File `schema.prisma`
For projects adopting a single schema file (`prisma/schema.prisma`), combine the generators and models above:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  PROVIDER
  ADMIN
}

enum UserStatus {
  ACTIVE
  BLOCKED
}

enum ItemCondition {
  NEW
  EXCELLENT
  GOOD
  FAIR
}

enum GearStatus {
  AVAILABLE
  MAINTENANCE
  UNAVAILABLE
}

enum RentalOrderStatus {
  PLACED
  CONFIRMED
  PAID
  PICKED_UP
  RETURNED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentMethod {
  STRIPE
}

model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  password     String
  role         Role          @default(CUSTOMER)
  status       UserStatus    @default(ACTIVE)
  phone        String?
  address      String?
  profileImage String?

  gearItems    GearItem[]    @relation("ProviderGearItems")
  rentalOrders RentalOrder[] @relation("CustomerRentalOrders")
  reviews      Review[]      @relation("CustomerReviews")
  payments     Payment[]     @relation("CustomerPayments")

  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([email])
  @@index([role])
  @@map("users")
}

model Category {
  id          String     @id @default(uuid())
  name        String     @unique
  slug        String     @unique
  description String?
  iconUrl     String?

  gearItems   GearItem[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("categories")
}

model GearItem {
  id                String            @id @default(uuid())
  title             String
  slug              String            @unique
  description       String
  brand             String
  model             String?
  condition         ItemCondition     @default(EXCELLENT)
  rentalPricePerDay Float
  depositFee        Float             @default(0)
  totalStock        Int               @default(1)
  availableStock    Int               @default(1)
  location          String
  images            String[]
  specifications    Json?
  status            GearStatus        @default(AVAILABLE)

  providerId        String
  provider          User              @relation("ProviderGearItems", fields: [providerId], references: [id], onDelete: Cascade)

  categoryId        String
  category          Category          @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  orderItems        RentalOrderItem[]
  reviews           Review[]

  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@index([providerId])
  @@index([categoryId])
  @@index([brand])
  @@index([rentalPricePerDay])
  @@map("gear_items")
}

model RentalOrder {
  id            String            @id @default(uuid())
  orderNumber   String            @unique
  startDate     DateTime
  endDate       DateTime
  totalDays     Int
  rentalFee     Float
  depositFee    Float
  totalAmount   Float
  status        RentalOrderStatus @default(PLACED)
  paymentStatus PaymentStatus     @default(PENDING)
  notes         String?

  customerId    String
  customer      User              @relation("CustomerRentalOrders", fields: [customerId], references: [id], onDelete: Cascade)

  items         RentalOrderItem[]
  payments      Payment[]
  reviews       Review[]

  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@index([customerId])
  @@index([status])
  @@index([paymentStatus])
  @@map("rental_orders")
}

model RentalOrderItem {
  id              String      @id @default(uuid())
  rentalOrderId   String
  rentalOrder     RentalOrder @relation(fields: [rentalOrderId], references: [id], onDelete: Cascade)

  gearItemId      String
  gearItem        GearItem    @relation(fields: [gearItemId], references: [id], onDelete: Restrict)

  quantity        Int         @default(1)
  unitPricePerDay Float
  depositPerUnit  Float
  subtotal        Float

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([rentalOrderId])
  @@index([gearItemId])
  @@map("rental_order_items")
}

model Payment {
  id                    String        @id @default(uuid())
  transactionId         String        @unique
  rentalOrderId         String
  rentalOrder           RentalOrder   @relation(fields: [rentalOrderId], references: [id], onDelete: Cascade)

  customerId            String
  customer              User          @relation("CustomerPayments", fields: [customerId], references: [id], onDelete: Cascade)

  amount                Float
  currency              String        @default("usd")
  method                PaymentMethod @default(STRIPE)
  status                PaymentStatus @default(PENDING)

  stripeSessionId       String?       @unique
  stripePaymentIntentId String?       @unique
  paidAt                DateTime?

  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  @@index([rentalOrderId])
  @@index([customerId])
  @@index([stripeSessionId])
  @@map("payments")
}

model Review {
  id            String      @id @default(uuid())
  rating        Int
  comment       String

  customerId    String
  customer      User        @relation("CustomerReviews", fields: [customerId], references: [id], onDelete: Cascade)

  gearItemId    String
  gearItem      GearItem    @relation(fields: [gearItemId], references: [id], onDelete: Cascade)

  rentalOrderId String
  rentalOrder   RentalOrder @relation(fields: [rentalOrderId], references: [id], onDelete: Cascade)

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@unique([customerId, rentalOrderId, gearItemId])
  @@index([gearItemId])
  @@index([customerId])
  @@map("reviews")
}

model WebhookLog {
  id          String   @id @default(uuid())
  eventId     String   @unique
  eventType   String
  processedAt DateTime @default(now())

  @@index([eventId])
  @@map("webhook_logs")
}
```

### Running the Database Migration
Execute in your terminal:
```bash
npx prisma migrate dev --name init_gearup_schema
npx prisma generate
```

---

# Part 2: API Endpoints Catalog & Step-by-Step Implementation

### Complete API Endpoints Catalog

| Domain | Method | Endpoint | Access Guard | Description |
| :--- | :---: | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Register as `CUSTOMER` or `PROVIDER` |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT Access & Refresh tokens |
| **Auth** | `POST` | `/api/auth/refresh-token` | Public | Obtain fresh access token via refresh token |
| **Auth** | `GET` | `/api/auth/me` | All Authenticated | Get current user's profile |
| **Auth** | `PATCH` | `/api/auth/profile` | All Authenticated | Update phone, address, profile image |
| **Auth** | `POST` | `/api/auth/change-password`| All Authenticated | Change user account password |
| **Admin**| `GET` | `/api/admin/users` | `ADMIN` | Fetch all users with search, role filters, & pagination |
| **Admin**| `PATCH` | `/api/admin/users/:id` | `ADMIN` | Update user status (`ACTIVE` / `BLOCKED`) |
| **Category**| `POST` | `/api/categories` | `ADMIN` | Create a sports gear category |
| **Category**| `GET` | `/api/categories` | Public | List all categories with gear count |
| **Category**| `GET` | `/api/categories/:id` | Public | Fetch category details |
| **Category**| `PATCH` | `/api/categories/:id` | `ADMIN` | Update category information |
| **Category**| `DELETE`| `/api/categories/:id` | `ADMIN` | Remove empty category |
| **Gear** | `GET` | `/api/gear` | Public | Browse all gear with search, category, brand, & price filter |
| **Gear** | `GET` | `/api/gear/:id` | Public | Retrieve gear specifications and customer reviews |
| **Provider**| `POST` | `/api/provider/gear` | `PROVIDER` | Add new gear item to inventory |
| **Provider**| `PUT` | `/api/provider/gear/:id`| `PROVIDER` | Update gear item specifications, price, or stock |
| **Provider**| `DELETE`| `/api/provider/gear/:id`| `PROVIDER` | Delete/archive gear item |
| **Provider**| `GET` | `/api/provider/my-gear` | `PROVIDER` | View provider's own gear inventory list |
| **Rentals** | `POST` | `/api/rentals` | `CUSTOMER` | Place rental order for gear items & dates |
| **Rentals** | `GET` | `/api/rentals` | `CUSTOMER` | View authenticated customer's rental history |
| **Rentals** | `GET` | `/api/rentals/:id` | `CUSTOMER`, `PROVIDER`, `ADMIN` | View detailed rental order breakdown |
| **Rentals** | `PATCH` | `/api/rentals/:id/cancel`| `CUSTOMER`, `ADMIN` | Cancel unpaid order |
| **Provider Orders**| `GET`| `/api/provider/orders` | `PROVIDER` | View incoming rental orders for provider's gear |
| **Provider Orders**| `PATCH`| `/api/provider/orders/:id`| `PROVIDER` | Update order status (`CONFIRMED`, `PICKED_UP`, `RETURNED`)|
| **Admin Orders**| `GET` | `/api/admin/rentals` | `ADMIN` | Overview of all rental orders across the platform |
| **Payments**| `POST` | `/api/payments/create` | `CUSTOMER` | Create Stripe checkout session for rental order |
| **Payments**| `POST` | `/api/payments/confirm`| Public (Stripe Signature) | Raw Webhook handler for Stripe payment events |
| **Payments**| `GET` | `/api/payments` | `CUSTOMER` | View user's personal payment history |
| **Payments**| `GET` | `/api/payments/:id` | `CUSTOMER`, `ADMIN` | Get specific payment receipt details |
| **Reviews** | `POST` | `/api/reviews` | `CUSTOMER` | Submit rating & review for completed (`RETURNED`) rental |
| **Reviews** | `GET` | `/api/reviews/gear/:gearId` | Public | Get all verified reviews for specific gear item |

---

### Core Utilities & Shared Middlewares

To ensure consistency throughout all controllers, we implement the core singletons and wrappers:

#### 1. Singletons (`src/lib/prisma.ts`)
```ts
// src/lib/prisma.ts
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

#### 2. Async Wrapper (`src/utils/catchAsync.ts`)
```ts
// src/utils/catchAsync.ts
import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
```

#### 3. Standard Envelope Response (`src/utils/sendResponse.ts`)
```ts
// src/utils/sendResponse.ts
import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages?: number };
};

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
```

#### 4. JWT Middleware Guard (`src/middlewares/auth.ts`)
```ts
// src/middlewares/auth.ts
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { config } from "../config";
import { catchAsync } from "../utils/catchAsync";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rawHeader = req.headers.authorization;
    const token = req.cookies?.accessToken || (rawHeader?.startsWith("Bearer ") ? rawHeader.split(" ")[1] : rawHeader);

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required. Access token missing.",
      });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret) as JwtPayload;
    } catch (err: any) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token",
      });
    }

    const userRole = decoded.role as Role;
    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: `Forbidden: Access requires one of [${requiredRoles.join(", ")}] roles.`,
      });
    }

    req.user = { id: decoded.id, email: decoded.email, role: userRole };
    next();
  });
};
```

---

### Module 1: Authentication & Profile (`/api/auth`)

#### 1. Interface (`src/modules/auth/auth.interface.ts`)
```ts
// src/modules/auth/auth.interface.ts
import { Role } from "../../../generated/prisma/enums";

export type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
  profileImage?: string;
  address?: string;
};

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TUpdateProfilePayload = {
  name?: string;
  phone?: string;
  profileImage?: string;
  address?: string;
};

export type TChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};
```

#### 2. Service (`src/modules/auth/auth.service.ts`)
```ts
// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { config } from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { TRegisterPayload, TLoginPayload, TChangePasswordPayload, TUpdateProfilePayload } from "./auth.interface";

const registerUser = async (payload: TRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    const err: any = new Error("An account with this email already exists.");
    err.statusCode = httpStatus.CONFLICT;
    throw err;
  }

  const role = payload.role === Role.ADMIN ? Role.CUSTOMER : payload.role; // Prevent unauthorized admin signup
  const hashedPassword = await bcrypt.hash(payload.password, config.bcrypt_salt_rounds);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: role || Role.CUSTOMER,
      phone: payload.phone,
      address: payload.address,
      profileImage: payload.profileImage,
    },
    select: { id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true },
  });

  return newUser;
};

const loginUser = async (payload: TLoginPayload) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    const err: any = new Error("Invalid email or password.");
    err.statusCode = httpStatus.UNAUTHORIZED;
    throw err;
  }

  if (user.status === UserStatus.BLOCKED) {
    const err: any = new Error("Your account has been suspended. Please contact support.");
    err.statusCode = httpStatus.FORBIDDEN;
    throw err;
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    const err: any = new Error("Invalid email or password.");
    err.statusCode = httpStatus.UNAUTHORIZED;
    throw err;
  }

  const { id, name, email, role } = user;
  const tokenPayload = { id, email, role };

  const accessToken = jwtUtils.createToken(
    tokenPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"]
  );
  const refreshToken = jwtUtils.createToken(
    tokenPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions["expiresIn"]
  );

  return {
    accessToken,
    refreshToken,
    user: { id, name, email, role },
  };
};

const refreshToken = async (token: string) => {
  const verified = jwtUtils.verifyToken(token, config.jwt_refresh_secret);
  if (!verified.success) {
    throw verified.originalError;
  }

  const { id } = verified.data as JwtPayload;
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  if (user.status === UserStatus.BLOCKED) {
    const err: any = new Error("Your account has been suspended. Please contact support.");
    err.statusCode = httpStatus.FORBIDDEN;
    throw err;
  }

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwtUtils.createToken(
    tokenPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"]
  );

  return { accessToken };
};

const getMe = async (userId: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, status: true, phone: true, address: true, profileImage: true, createdAt: true },
  });
};

const updateProfile = async (userId: string, payload: TUpdateProfilePayload) => {
  return await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: { id: true, name: true, email: true, role: true, phone: true, address: true, profileImage: true },
  });
};

const changePassword = async (userId: string, payload: TChangePasswordPayload) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatch) {
    const err: any = new Error("Incorrect old password.");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const newHashed = await bcrypt.hash(payload.newPassword, config.bcrypt_salt_rounds);
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashed },
  });

  return { message: "Password updated successfully." };
};

export const authServices = { registerUser, loginUser, refreshToken, getMe, updateProfile, changePassword };
```

#### 3. Controller (`src/modules/auth/auth.controller.ts`)
```ts
// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: { accessToken: result.accessToken, user: result.user },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.cookies;
  const result = await authServices.refreshToken(token);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.getMe(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.updateProfile(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.changePassword(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const authController = { register, login, refreshToken, getMe, updateProfile, changePassword };
```

#### 4. Route (`src/modules/auth/auth.route.ts`)
```ts
// src/modules/auth/auth.route.ts
import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", auth(), authController.getMe);
router.patch("/profile", auth(), authController.updateProfile);
router.post("/change-password", auth(), authController.changePassword);

export const authRoutes = router;
```

---

### Module 2: User Administration & Auditing (`/api/admin`)

#### 1. Interface (`src/modules/admin/admin.interface.ts`)
```ts
// src/modules/admin/admin.interface.ts
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { TRentalFilterQuery } from "../rental/rental.interface";

export type TUserFilterQuery = {
  role?: Role;
  status?: UserStatus;
  search?: string;
  page?: string;
  limit?: string;
};

export type TUpdateUserStatusPayload = {
  status: UserStatus;
};

export type TAdminRentalFilterQuery = TRentalFilterQuery;
```

#### 2. Service (`src/modules/admin/admin.service.ts`)
```ts
// src/modules/admin/admin.service.ts
import { UserStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { rentalServices } from "../rental/rental.service";
import { TAdminRentalFilterQuery, TUserFilterQuery } from "./admin.interface";

const getAllUsers = async (query: TUserFilterQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereCondition: any = {};
  if (query.role) whereCondition.role = query.role;
  if (query.status) whereCondition.status = query.status;
  if (query.search) {
    whereCondition.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
      skip,
      take: limit,
      select: { id: true, name: true, email: true, role: true, status: true, phone: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: whereCondition }),
  ]);

  return { users, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, status: true, role: true },
  });
};

const getAllRentals = async (query: TAdminRentalFilterQuery) => {
  return await rentalServices.getAllRentalsForAdmin(query);
};

export const adminServices = { getAllUsers, updateUserStatus, getAllRentals };
```

#### 3. Controller (`src/modules/admin/admin.controller.ts`)
```ts
// src/modules/admin/admin.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getAllUsers(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result.users,
    meta: result.meta,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;

  const result = await adminServices.updateUserStatus(id as string, status as UserStatus);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getAllRentals(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All rental orders retrieved successfully",
    data: result.rentals,
    meta: result.meta,
  });
});

export const adminController = { getAllUsers, updateUserStatus, getAllRentals };
```

#### 4. Route (`src/modules/admin/admin.route.ts`)
```ts
// src/modules/admin/admin.route.ts
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentals);

export const adminRoutes = router;
```

---

### Module 3: Sports Categories (`/api/categories`)

#### 1. Interface (`src/modules/category/category.interface.ts`)
```ts
// src/modules/category/category.interface.ts
export type TCreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
};

export type TUpdateCategoryPayload = {
  name?: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
};
```

#### 2. Service (`src/modules/category/category.service.ts`)
```ts
// src/modules/category/category.service.ts
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { TCreateCategoryPayload, TUpdateCategoryPayload } from "./category.interface";

const createCategory = async (payload: TCreateCategoryPayload) => {
  return await prisma.category.create({ data: payload });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: { _count: { select: { gearItems: true } } },
    orderBy: { name: "asc" },
  });
};

const getCategoryById = async (id: string) => {
  return await prisma.category.findUniqueOrThrow({
    where: { id },
    include: { gearItems: { take: 10 } },
  });
};

const updateCategory = async (id: string, payload: TUpdateCategoryPayload) => {
  return await prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
    include: { _count: { select: { gearItems: true } } },
  });

  if (category._count.gearItems > 0) {
    const err: any = new Error("Cannot delete category with associated gear items. Remove or reassign gear items first.");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  return await prisma.category.delete({ where: { id } });
};

export const categoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
```

#### 3. Controller (`src/modules/category/category.controller.ts`)
```ts
// src/modules/category/category.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryServices } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.getCategoryById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.updateCategory(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryServices.deleteCategory(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
```

#### 4. Route (`src/modules/category/category.route.ts`)
```ts
// src/modules/category/category.route.ts
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", auth(Role.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", auth(Role.ADMIN), categoryController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
```

---

### Module 4: Gear Inventory & Public Catalog (`/api/gear`)

#### 1. Interface (`src/modules/gear/gear.interface.ts`)
```ts
// src/modules/gear/gear.interface.ts
import { GearStatus, ItemCondition } from "../../../generated/prisma/enums";

export type TGearFilterQuery = {
  search?: string;
  categoryId?: string;
  brand?: string;
  condition?: ItemCondition;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type TCreateGearPayload = {
  title: string;
  slug: string;
  description: string;
  brand: string;
  model?: string;
  condition?: ItemCondition;
  rentalPricePerDay: number;
  depositFee?: number;
  totalStock: number;
  location: string;
  images: string[];
  specifications?: any;
  categoryId: string;
};

export type TUpdateGearPayload = Partial<TCreateGearPayload> & {
  status?: GearStatus;
};
```

#### 2. Service (`src/modules/gear/gear.service.ts`)
```ts
// src/modules/gear/gear.service.ts
import { GearStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateGearPayload, TGearFilterQuery, TUpdateGearPayload } from "./gear.interface";

const getAllGear = async (filters: TGearFilterQuery) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 12;
  const skip = (page - 1) * limit;

  const where: any = { status: GearStatus.AVAILABLE };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { brand: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.brand) where.brand = { contains: filters.brand, mode: "insensitive" };
  if (filters.condition) where.condition = filters.condition;
  if (filters.minPrice || filters.maxPrice) {
    where.rentalPricePerDay = {};
    if (filters.minPrice) where.rentalPricePerDay.gte = Number(filters.minPrice);
    if (filters.maxPrice) where.rentalPricePerDay.lte = Number(filters.maxPrice);
  }

  const orderBy: any = {};
  if (filters.sortBy) {
    orderBy[filters.sortBy] = filters.sortOrder || "asc";
  } else {
    orderBy.createdAt = "desc";
  }

  const [items, total] = await Promise.all([
    prisma.gearItem.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: { select: { id: true, name: true } },
        provider: { select: { id: true, name: true } },
      },
    }),
    prisma.gearItem.count({ where }),
  ]);

  return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getGearById = async (id: string) => {
  return await prisma.gearItem.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      provider: { select: { id: true, name: true, phone: true } },
      reviews: {
        include: { customer: { select: { id: true, name: true, profileImage: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

const addGearByProvider = async (providerId: string, payload: TCreateGearPayload) => {
  return await prisma.gearItem.create({
    data: {
      ...payload,
      providerId,
      availableStock: payload.totalStock,
    },
  });
};

const updateGearByProvider = async (gearId: string, providerId: string, payload: TUpdateGearPayload) => {
  await prisma.gearItem.findFirstOrThrow({ where: { id: gearId, providerId } });
  return await prisma.gearItem.update({
    where: { id: gearId },
    data: payload,
  });
};

const deleteGearByProvider = async (gearId: string, providerId: string) => {
  await prisma.gearItem.findFirstOrThrow({ where: { id: gearId, providerId } });
  return await prisma.gearItem.delete({ where: { id: gearId } });
};

const getProviderGear = async (providerId: string) => {
  return await prisma.gearItem.findMany({
    where: { providerId },
    include: { category: { select: { name: true } }, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const gearServices = {
  getAllGear,
  getGearById,
  addGearByProvider,
  updateGearByProvider,
  deleteGearByProvider,
  getProviderGear,
};
```

#### 3. Controller (`src/modules/gear/gear.controller.ts`)
```ts
// src/modules/gear/gear.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearServices } from "./gear.service";

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearServices.getAllGear(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear retrieved successfully",
    data: result.items,
    meta: result.meta,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response) => {
  const result = await gearServices.getGearById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear specifications retrieved successfully",
    data: result,
  });
});

const addGearByProvider = catchAsync(async (req: Request, res: Response) => {
  const result = await gearServices.addGearByProvider(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Gear item added to inventory successfully",
    data: result,
  });
});

const updateGearByProvider = catchAsync(async (req: Request, res: Response) => {
  const result = await gearServices.updateGearByProvider(req.params.id as string, req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear item updated successfully",
    data: result,
  });
});

const deleteGearByProvider = catchAsync(async (req: Request, res: Response) => {
  const result = await gearServices.deleteGearByProvider(req.params.id as string, req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear item deleted successfully",
    data: result,
  });
});

const getProviderGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearServices.getProviderGear(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Provider gear inventory retrieved successfully",
    data: result,
  });
});

export const gearController = {
  getAllGear,
  getGearById,
  addGearByProvider,
  updateGearByProvider,
  deleteGearByProvider,
  getProviderGear,
};
```

#### 4. Route (`src/modules/gear/gear.route.ts`)
```ts
// src/modules/gear/gear.route.ts
import { Router } from "express";
import { gearController } from "./gear.controller";

const router = Router();

router.get("/", gearController.getAllGear);
router.get("/:id", gearController.getGearById);

export const gearRoutes = router;
```

---

### Module 5: Provider Portal (`/api/provider`)

#### 1. Route (`src/modules/provider/provider.route.ts`)
```ts
// src/modules/provider/provider.route.ts
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { gearController } from "../gear/gear.controller";
import { rentalController } from "../rental/rental.controller";

const router = Router();

// Provider Gear Inventory Management
router.post("/gear", auth(Role.PROVIDER), gearController.addGearByProvider);
router.put("/gear/:id", auth(Role.PROVIDER), gearController.updateGearByProvider);
router.delete("/gear/:id", auth(Role.PROVIDER), gearController.deleteGearByProvider);
router.get("/my-gear", auth(Role.PROVIDER), gearController.getProviderGear);

// Provider Rental Orders Management
router.get("/orders", auth(Role.PROVIDER), rentalController.getProviderIncomingOrders);
router.patch("/orders/:id", auth(Role.PROVIDER), rentalController.updateOrderStatusByProvider);

export const providerRoutes = router;
```

---

### Module 6: Rental Orders Lifecycle (`/api/rentals`)

#### 1. Interface (`src/modules/rental/rental.interface.ts`)
```ts
// src/modules/rental/rental.interface.ts
import { PaymentStatus, RentalOrderStatus } from "../../../generated/prisma/enums";

export type TRentalItemInput = {
  gearItemId: string;
  quantity: number;
};

export type TCreateRentalPayload = {
  startDate: string;
  endDate: string;
  items: TRentalItemInput[];
  notes?: string;
};

export type TRentalFilterQuery = {
  page?: string;
  limit?: string;
  status?: RentalOrderStatus;
  paymentStatus?: PaymentStatus;
};
```

#### 2. Service (`src/modules/rental/rental.service.ts`)
```ts
// src/modules/rental/rental.service.ts
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

    const ownsItem = order.items.some((i) => i.gearItem.providerId === providerId);
    if (!ownsItem) {
      const err: any = new Error("Forbidden: Order does not contain gear items owned by you.");
      err.statusCode = httpStatus.FORBIDDEN;
      throw err;
    }

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
```

#### 3. Controller (`src/modules/rental/rental.controller.ts`)
```ts
// src/modules/rental/rental.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalServices } from "./rental.service";

const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalServices.createRentalOrder(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental order placed successfully",
    data: result,
  });
});

const getCustomerRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalServices.getCustomerRentals(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental history retrieved successfully",
    data: result,
  });
});

const getRentalById = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalServices.getRentalById(req.params.id as string, req.user!.id, req.user!.role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order details retrieved successfully",
    data: result,
  });
});

const cancelRentalOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalServices.cancelRentalOrder(req.params.id as string, req.user!.id, req.user!.role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order cancelled successfully",
    data: result,
  });
});

const getProviderIncomingOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalServices.getProviderIncomingOrders(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Incoming rental orders retrieved successfully",
    data: result,
  });
});

const updateOrderStatusByProvider = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalServices.updateOrderStatusByProvider(req.params.id as string, req.user!.id, req.body.status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order status updated successfully",
    data: result,
  });
});

const getAllRentalsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalServices.getAllRentalsForAdmin(req.query as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All rental orders retrieved successfully",
    data: result.rentals,
    meta: result.meta,
  });
});

export const rentalController = {
  createRentalOrder,
  getCustomerRentals,
  getRentalById,
  cancelRentalOrder,
  getProviderIncomingOrders,
  updateOrderStatusByProvider,
  getAllRentalsForAdmin,
};
```

#### 4. Route (`src/modules/rental/rental.route.ts`)
```ts
// src/modules/rental/rental.route.ts
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), rentalController.createRentalOrder);
router.get("/", auth(Role.CUSTOMER), rentalController.getCustomerRentals);
router.get("/:id", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), rentalController.getRentalById);
router.patch("/:id/cancel", auth(Role.CUSTOMER, Role.ADMIN), rentalController.cancelRentalOrder);

export const rentalRoutes = router;
```

---

### Module 7: Reviews & Ratings (`/api/reviews`)

#### 1. Interface (`src/modules/review/review.interface.ts`)
```ts
// src/modules/review/review.interface.ts
export type TCreateReviewPayload = {
  rentalOrderId: string;
  gearItemId: string;
  rating: number;
  comment: string;
};
```

#### 2. Service (`src/modules/review/review.service.ts`)
```ts
// src/modules/review/review.service.ts
import httpStatus from "http-status";
import { RentalOrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateReviewPayload } from "./review.interface";

const createReview = async (customerId: string, payload: TCreateReviewPayload) => {
  if (payload.rating < 1 || payload.rating > 5) {
    const err: any = new Error("Rating must be between 1 and 5.");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 1. Verify rental order belongs to this customer and status is RETURNED
  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: payload.rentalOrderId },
    include: { items: true },
  });

  if (order.customerId !== customerId) {
    const err: any = new Error("You can only review rentals booked by your account.");
    err.statusCode = httpStatus.FORBIDDEN;
    throw err;
  }

  if (order.status !== RentalOrderStatus.RETURNED) {
    const err: any = new Error("Reviews can only be submitted after the gear item has been returned.");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 2. Verify gear item was part of the rental
  const hasItem = order.items.some((i) => i.gearItemId === payload.gearItemId);
  if (!hasItem) {
    const err: any = new Error("Gear item was not in this rental order.");
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 3. Create review with idempotency constraint
  return await prisma.review.create({
    data: {
      customerId,
      rentalOrderId: payload.rentalOrderId,
      gearItemId: payload.gearItemId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });
};

const getGearReviews = async (gearItemId: string) => {
  return await prisma.review.findMany({
    where: { gearItemId },
    include: { customer: { select: { id: true, name: true, profileImage: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const reviewServices = { createReview, getGearReviews };
```

#### 3. Controller (`src/modules/review/review.controller.ts`)
```ts
// src/modules/review/review.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.createReview(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

const getGearReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.getGearReviews(req.params.gearId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear reviews retrieved successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getGearReviews,
};
```

#### 4. Route (`src/modules/review/review.route.ts`)
```ts
// src/modules/review/review.route.ts
import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);
router.get("/gear/:gearId", reviewController.getGearReviews);

export const reviewRoutes = router;
```

---

### Module 8: Payment & Checkout Transactions (`/api/payments`)

#### 1. Interface (`src/modules/payment/payment.interface.ts`)
```ts
// src/modules/payment/payment.interface.ts
import { PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums";

export type TCreateCheckoutPayload = {
  rentalOrderId: string;
};

export type TCheckoutSessionResponse = {
  paymentUrl: string | null;
  sessionId: string;
};

export type TPaymentFilterQuery = {
  page?: string;
  limit?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
};
```

#### 2. Service (`src/modules/payment/payment.service.ts`)
```ts
// src/modules/payment/payment.service.ts
import Stripe from "stripe";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";
import { RentalOrderStatus, PaymentStatus, PaymentMethod } from "../../../generated/prisma/enums";

const createRentalCheckoutSession = async (rentalOrderId: string, customerId: string) => {
  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: rentalOrderId },
    include: {
      customer: true,
      items: { include: { gearItem: true } },
    },
  });

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

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: `${item.gearItem.title} (${order.totalDays} Days Rental)`,
        description: `Brand: ${item.gearItem.brand} | Model: ${item.gearItem.model || "Standard"} | Condition: ${item.gearItem.condition}`,
        images: item.gearItem.images.slice(0, 1),
      },
      unit_amount: Math.round(item.unitPricePerDay * order.totalDays * 100),
    },
    quantity: item.quantity,
  }));

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

const handleWebhook = async (payload: Buffer, signature: string) => {
  let event: Stripe.Event;

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const rentalOrderId = session.metadata?.rentalOrderId;

      if (!rentalOrderId) break;

      await prisma.$transaction(async (tx) => {
        await tx.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: {
            status: PaymentStatus.PAID,
            stripePaymentIntentId: session.payment_intent as string,
            paidAt: new Date(),
          },
        });

        const order = await tx.rentalOrder.update({
          where: { id: rentalOrderId },
          data: {
            status: RentalOrderStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
          },
          include: { items: true },
        });

        for (const item of order.items) {
          await tx.gearItem.update({
            where: { id: item.gearItemId },
            data: { availableStock: { decrement: item.quantity } },
          });
        }
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

          for (const item of payment.rentalOrder.items) {
            await tx.gearItem.update({
              where: { id: item.gearItemId },
              data: { availableStock: { increment: item.quantity } },
            });
          }
        }
      });
      break;
    }

    default:
      console.log(`ℹ️ [Webhook] Unhandled event type: ${event.type}`);
  }
};

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
```

#### 3. Controller (`src/modules/payment/payment.controller.ts`)
```ts
// src/modules/payment/payment.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { rentalOrderId } = req.body;

  if (!rentalOrderId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "rentalOrderId is required to initiate payment.",
    });
  }

  const result = await paymentServices.createRentalCheckoutSession(rentalOrderId, customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe checkout session created successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Buffer;
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Missing stripe-signature header in webhook request.",
    });
  }

  await paymentServices.handleWebhook(payload, signature);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Webhook event processed successfully",
    data: null,
  });
});

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getUserPayments(req.user!.id, req.user!.role, req.query as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments fetched successfully",
    data: result.payments,
    meta: result.meta,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getPaymentById(req.params.id as string, req.user!.id, req.user!.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment receipt retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getUserPayments,
  getPaymentById,
};
```

#### 4. Route (`src/modules/payment/payment.route.ts`)
```ts
// src/modules/payment/payment.route.ts
import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(Role.CUSTOMER), paymentController.createCheckoutSession);
router.post("/confirm", paymentController.handleWebhook);
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getUserPayments);
router.get("/:id", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getPaymentById);

export const paymentRoutes = router;
```

---

# Part 3: Production Demo Data Seeding (`prisma/seed.ts`)

A production seed script generates deterministic, high-fidelity demo records across all roles and tables.

### Complete Seed Script (`prisma/seed.ts`)
```ts
// prisma/seed.ts
import { PrismaClient } from "../generated/prisma/client";
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

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting GearUp database seeding...");

  // 1. Clean existing records in reverse relational order
  await prisma.webhookLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rentalOrderItem.deleteMany();
  await prisma.rentalOrder.deleteMany();
  await prisma.gearItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Previous records cleaned.");

  const defaultPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("password123", 12);

  // 2. Seed Users across all 3 roles
  const admin = await prisma.user.create({
    data: {
      name: "GearUp Master Admin",
      email: "admin@gearup.com",
      password: defaultPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      phone: "+1-800-555-0100",
      address: "100 Innovation Way, San Francisco, CA",
    },
  });

  const provider1 = await prisma.user.create({
    data: {
      name: "Summit Outdoor Outfitter",
      email: "summit.sports@gearup.com",
      password: userPassword,
      role: Role.PROVIDER,
      status: UserStatus.ACTIVE,
      phone: "+1-555-019-2834",
      address: "42 Alpine Trail, Boulder, CO",
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      name: "Cascade Water & Snow Hub",
      email: "cascade.rentals@gearup.com",
      password: userPassword,
      role: Role.PROVIDER,
      status: UserStatus.ACTIVE,
      phone: "+1-555-014-9821",
      address: "88 Pacific Coast Hwy, Seattle, WA",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "John Trekkers",
      email: "john.customer@gmail.com",
      password: userPassword,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      phone: "+1-555-018-7721",
      address: "742 Evergreen Terrace, Springfield, OR",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Sarah Outdoors",
      email: "sarah.gear@gmail.com",
      password: userPassword,
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      phone: "+1-555-017-3392",
      address: "123 Lake View Dr, Denver, CO",
    },
  });

  console.log("✅ Seeded 1 Admin, 2 Providers, 2 Customers.");

  // 3. Seed Gear Categories
  const catCamping = await prisma.category.create({
    data: {
      name: "Camping & Hiking",
      slug: "camping-hiking",
      description: "Tents, sleeping bags, stoves, and mountaineering backpacks.",
      iconUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4",
    },
  });

  const catCycling = await prisma.category.create({
    data: {
      name: "Cycling & Mountain Biking",
      slug: "cycling-mountain-biking",
      description: "Downhill mountain bikes, gravel bikes, safety helmets, and panniers.",
      iconUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
    },
  });

  const catWater = await prisma.category.create({
    data: {
      name: "Water Sports",
      slug: "water-sports",
      description: "Kayaks, stand-up paddleboards, wetsuits, and life jackets.",
      iconUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    },
  });

  const catWinter = await prisma.category.create({
    data: {
      name: "Winter Sports",
      slug: "winter-sports",
      description: "Snowboards, alpine ski sets, avalanche safety beacons, and poles.",
      iconUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256",
    },
  });

  console.log("✅ Seeded 4 Categories.");

  // 4. Seed Gear Items
  const gearTent = await prisma.gearItem.create({
    data: {
      title: "MSR Hubba Hubba 3-Person Ultralight Backpacking Tent",
      slug: "msr-hubba-hubba-3p-tent",
      description: "Award-winning freestanding 3-season tent with high durability rainfly and Easton Syclone poles.",
      brand: "MSR",
      model: "Hubba Hubba 3P",
      condition: ItemCondition.EXCELLENT,
      rentalPricePerDay: 25.0,
      depositFee: 75.0,
      totalStock: 5,
      availableStock: 5,
      location: "Boulder, CO",
      images: [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4",
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
      ],
      specifications: { capacity: "3 Person", weight: "1.72 kg", floorArea: "3.67 sq m" },
      status: GearStatus.AVAILABLE,
      providerId: provider1.id,
      categoryId: catCamping.id,
    },
  });

  const gearBike = await prisma.gearItem.create({
    data: {
      title: "Trek Fuel EX 8 Gen 6 Full Suspension Trail Mountain Bike",
      slug: "trek-fuel-ex-8-mountain-bike",
      description: "Versatile aluminum trail bike with FOX Rhythm 36 fork and Shimano XT 12-speed drivetrain.",
      brand: "Trek",
      model: "Fuel EX 8",
      condition: ItemCondition.NEW,
      rentalPricePerDay: 65.0,
      depositFee: 150.0,
      totalStock: 3,
      availableStock: 2, // 1 in active rental
      location: "Boulder, CO",
      images: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
      ],
      specifications: { frame: "Alpha Platinum Aluminum", travel: "150mm front / 140mm rear", size: "Large" },
      status: GearStatus.AVAILABLE,
      providerId: provider1.id,
      categoryId: catCycling.id,
    },
  });

  const gearKayak = await prisma.gearItem.create({
    data: {
      title: "Oru Kayak Inlet Foldable Touring Kayak with Paddle",
      slug: "oru-kayak-inlet-foldable",
      description: "Origami-inspired lightweight kayak that folds down into a compact box in under 3 minutes.",
      brand: "Oru Kayak",
      model: "Inlet",
      condition: ItemCondition.EXCELLENT,
      rentalPricePerDay: 40.0,
      depositFee: 100.0,
      totalStock: 4,
      availableStock: 4,
      location: "Seattle, WA",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      ],
      specifications: { length: "10 ft", weight: "9 kg", maxCapacity: "125 kg" },
      status: GearStatus.AVAILABLE,
      providerId: provider2.id,
      categoryId: catWater.id,
    },
  });

  console.log("✅ Seeded Gear Items.");

  // 5. Seed Complete Lifecycle Rental Orders & Transactions
  // Order 1: Completed, Paid & Returned with verified review
  const orderCompleted = await prisma.rentalOrder.create({
    data: {
      orderNumber: "ORD-991201-842",
      customerId: customer1.id,
      startDate: new Date("2026-06-01T09:00:00Z"),
      endDate: new Date("2026-06-04T18:00:00Z"),
      totalDays: 3,
      rentalFee: 75.0, // $25/day * 3 days
      depositFee: 75.0,
      totalAmount: 150.0,
      status: RentalOrderStatus.RETURNED,
      paymentStatus: PaymentStatus.PAID,
      items: {
        create: {
          gearItemId: gearTent.id,
          quantity: 1,
          unitPricePerDay: 25.0,
          depositPerUnit: 75.0,
          subtotal: 150.0,
        },
      },
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: "txn_demo_complete_001",
      rentalOrderId: orderCompleted.id,
      customerId: customer1.id,
      amount: 150.0,
      currency: "usd",
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.PAID,
      stripeSessionId: "cs_test_completed_sample_session_1",
      stripePaymentIntentId: "pi_test_completed_intent_1",
      paidAt: new Date("2026-06-01T08:30:00Z"),
    },
  });

  await prisma.review.create({
    data: {
      customerId: customer1.id,
      gearItemId: gearTent.id,
      rentalOrderId: orderCompleted.id,
      rating: 5,
      comment: "Tent was pristine, lightweight, and withstood heavy wind in Rocky Mountain National Park!",
    },
  });

  // Order 2: Active Ongoing Rental (Paid, Picked Up)
  const orderActive = await prisma.rentalOrder.create({
    data: {
      orderNumber: "ORD-882314-119",
      customerId: customer2.id,
      startDate: new Date("2026-07-01T10:00:00Z"),
      endDate: new Date("2026-07-03T18:00:00Z"),
      totalDays: 2,
      rentalFee: 130.0, // $65/day * 2 days
      depositFee: 150.0,
      totalAmount: 280.0,
      status: RentalOrderStatus.PICKED_UP,
      paymentStatus: PaymentStatus.PAID,
      items: {
        create: {
          gearItemId: gearBike.id,
          quantity: 1,
          unitPricePerDay: 65.0,
          depositPerUnit: 150.0,
          subtotal: 280.0,
        },
      },
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: "txn_demo_active_002",
      rentalOrderId: orderActive.id,
      customerId: customer2.id,
      amount: 280.0,
      currency: "usd",
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.PAID,
      stripeSessionId: "cs_test_active_sample_session_2",
      stripePaymentIntentId: "pi_test_active_intent_2",
      paidAt: new Date("2026-07-01T09:15:00Z"),
    },
  });

  console.log("✅ Seeded Orders, Payments & Customer Reviews.");
  console.log("🚀 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Configuring and Executing the Seed

1. In your `package.json`, add the `"prisma"` configuration block:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

2. Run the seeding script:
```bash
npx prisma db seed
```

---

# Part 4: API Endpoint Testing Master Guide & Test Suite

### 4.1 Master Sequential Execution Flow

To thoroughly test the entire platform without state collisions, execute calls in the following strict lifecycle order. Each step builds state upon the previous step (tokens generated in step 2/3 are passed to subsequent authenticated calls, categories created in step 7 are referenced in gear creation, etc.):

```
 1. POST   /api/auth/register             (Create Customer account: Jane Explorer)
 2. POST   /api/auth/register             (Create Provider account: Summit Gear Outfitters)
 3. POST   /api/auth/login                (Obtain Customer, Provider, & Admin JWT tokens + HttpOnly cookies)
 4. POST   /api/auth/refresh-token        (Verify dual-token rotation using refresh token cookie)
 5. GET    /api/auth/me                   (Retrieve authenticated user profile)
 6. PATCH  /api/auth/profile              (Update personal profile fields: phone, address, profile image)
 7. POST   /api/auth/change-password      (Update account password credentials)
 8. GET    /api/admin/users               (Admin searches & filters platform user directory)
 9. PATCH  /api/admin/users/:id           (Admin moderates user status: ACTIVE / BLOCKED)
10. POST   /api/categories                (Admin creates Sports Categories: Camping & Hiking)
11. GET    /api/categories                (Public lists all categories with gear count aggregation)
12. GET    /api/categories/:id            (Public retrieves category details with associated gear)
13. PATCH  /api/categories/:id            (Admin updates category meta and description)
14. DELETE /api/categories/:id            (Admin deletes empty category)
15. POST   /api/provider/gear             (Provider adds gear listing to inventory)
16. GET    /api/provider/my-gear          (Provider reviews own inventory list with order counts)
17. PUT    /api/provider/gear/:id         (Provider updates equipment pricing, deposit, and stock)
18. GET    /api/gear                      (Public browses catalog with multifaceted filters & pagination)
19. GET    /api/gear/:id                  (Public retrieves gear specifications, provider, and reviews)
20. DELETE /api/provider/gear/:id         (Provider deletes/archives gear item)
21. POST   /api/rentals                   (Customer places rental order -> Status: PLACED)
22. GET    /api/rentals                   (Customer views own rental booking history)
23. GET    /api/rentals/:id               (Inspect order financial breakdown, deposit, and item details)
24. GET    /api/provider/orders           (Provider inspects incoming rental bookings for their equipment)
25. PATCH  /api/provider/orders/:id       (Provider transitions status -> PICKED_UP and RETURNED)
26. PATCH  /api/rentals/:id/cancel        (Customer or Admin cancels unpaid rental booking)
27. GET    /api/admin/rentals             (Admin audits all platform rental orders with status filters)
28. POST   /api/payments/create           (Customer generates Stripe Checkout Session)
29. POST   /api/payments/confirm          (Stripe Webhook fires -> Order marked PAID & CONFIRMED)
30. GET    /api/payments                  (Customer views personal payment transaction history)
31. GET    /api/payments/:id              (Customer/Admin inspects payment receipt & item relations)
32. POST   /api/reviews                   (Customer submits verified review on RETURNED gear)
33. GET    /api/reviews/gear/:gearId      (Public fetches verified ratings & customer feedback)
```

---

### 4.2 Postman & Thunder Client Environment Setup

Set up the following collection environment variables in **Postman** or **Thunder Client** to test all endpoints seamlessly:

| Variable Name | Initial Value | Description |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:5000/api` | API Base URL prefix |
| `adminToken` | *(JWT string from login)* | Bearer token for `ADMIN` role (`admin@gearup.com`) |
| `customerToken` | *(JWT string from login)* | Bearer token for `CUSTOMER` role (`jane.explorer@example.com`) |
| `providerToken` | *(JWT string from login)* | Bearer token for `PROVIDER` role (`summit.provider@example.com`) |
| `categoryId` | *(UUID string)* | ID of created category (`Camping & Hiking`) |
| `gearId` | *(UUID string)* | ID of created gear item (`Black Diamond Carbon Cork Trekking Poles`) |
| `rentalOrderId` | *(UUID string)* | ID of placed rental order |
| `paymentId` | *(UUID string)* | ID of completed payment record |

> **Postman Auto-Token Script (Tests Tab of Login Requests):**
> ```javascript
> if (pm.response.code === 200) {
>     const jsonData = pm.response.json();
>     const role = jsonData.data.user.role;
>     if (role === 'ADMIN') pm.environment.set("adminToken", jsonData.data.accessToken);
>     if (role === 'CUSTOMER') pm.environment.set("customerToken", jsonData.data.accessToken);
>     if (role === 'PROVIDER') pm.environment.set("providerToken", jsonData.data.accessToken);
> }
> ```

---

### 4.3 Detailed Test Matrix with Request Bodies, cURL & Expected Responses

#### ─── Module 1: Authentication & User Profile (`/api/auth`) ───

#### 1. Register Customer Account
- **Endpoint**: `POST http://localhost:5000/api/auth/register`
- **Access Guard**: Public
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Jane Explorer",
  "email": "jane.explorer@example.com",
  "password": "Password123!",
  "role": "CUSTOMER",
  "phone": "+1-555-908-1122",
  "address": "45 Trailhead Way, Aspen, CO"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Explorer",
    "email": "jane.explorer@example.com",
    "password": "Password123!",
    "role": "CUSTOMER",
    "phone": "+1-555-908-1122",
    "address": "45 Trailhead Way, Aspen, CO"
  }'
```
- **Expected Status**: `201 Created`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
    "name": "Jane Explorer",
    "email": "jane.explorer@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "phone": "+1-555-908-1122",
    "address": "45 Trailhead Way, Aspen, CO",
    "profileImage": null,
    "createdAt": "2026-08-10T09:00:00.000Z",
    "updatedAt": "2026-08-10T09:00:00.000Z"
  }
}
```
- **Verification Checkpoints**:
  1. Password is never returned in plaintext.
  2. In database, password is encrypted using bcrypt (`salt rounds = 12`).
  3. Default account `status` is set to `ACTIVE`.

---

#### 2. Register Provider Account
- **Endpoint**: `POST http://localhost:5000/api/auth/register`
- **Access Guard**: Public
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Summit Gear Outfitters",
  "email": "summit.provider@example.com",
  "password": "ProviderPass123!",
  "role": "PROVIDER",
  "phone": "+1-555-432-8877",
  "address": "1200 Alpine Ridge Rd, Boulder, CO"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summit Gear Outfitters",
    "email": "summit.provider@example.com",
    "password": "ProviderPass123!",
    "role": "PROVIDER",
    "phone": "+1-555-432-8877",
    "address": "1200 Alpine Ridge Rd, Boulder, CO"
  }'
```
- **Expected Status**: `201 Created`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "prov_77192a_uuid",
    "name": "Summit Gear Outfitters",
    "email": "summit.provider@example.com",
    "role": "PROVIDER",
    "status": "ACTIVE",
    "phone": "+1-555-432-8877",
    "address": "1200 Alpine Ridge Rd, Boulder, CO",
    "profileImage": null,
    "createdAt": "2026-08-10T09:05:00.000Z",
    "updatedAt": "2026-08-10T09:05:00.000Z"
  }
}
```

---

#### 3. User Login (Obtain Dual JWT Tokens)
- **Endpoint**: `POST http://localhost:5000/api/auth/login`
- **Access Guard**: Public
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "jane.explorer@example.com",
  "password": "Password123!"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "jane.explorer@example.com",
    "password": "Password123!"
  }'
```
- **Expected Status**: `200 OK`
- **Set-Cookie Header**: `refreshToken=eyJhbGciOiJIUzI1Ni...; Path=/; HttpOnly; SameSite=Lax`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
      "name": "Jane Explorer",
      "email": "jane.explorer@example.com",
      "role": "CUSTOMER"
    }
  }
}
```
- **Verification Checkpoints**:
  1. Access token contains user `id`, `name`, `email`, and `role`.
  2. Refresh token is persisted in HttpOnly cookie to mitigate XSS vulnerabilities.

---

#### 4. Refresh Access Token
- **Endpoint**: `POST http://localhost:5000/api/auth/refresh-token`
- **Access Guard**: Public (Validated via Cookie)
- **Headers**: `Cookie: refreshToken=<VALID_REFRESH_TOKEN>`
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -b cookies.txt
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token Refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_NEW..."
  }
}
```

---

#### 5. Get Current User Profile
- **Endpoint**: `GET http://localhost:5000/api/auth/me`
- **Access Guard**: All Authenticated (`CUSTOMER`, `PROVIDER`, `ADMIN`)
- **Headers**: `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
    "name": "Jane Explorer",
    "email": "jane.explorer@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "phone": "+1-555-908-1122",
    "address": "45 Trailhead Way, Aspen, CO",
    "profileImage": null,
    "createdAt": "2026-08-10T09:00:00.000Z"
  }
}
```

---

#### 6. Update User Profile
- **Endpoint**: `PATCH http://localhost:5000/api/auth/profile`
- **Access Guard**: All Authenticated
- **Headers**:
  - `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "phone": "+1-555-999-0011",
  "address": "77 Backcountry Rd, Denver, CO",
  "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
}
```
- **cURL Command**:
```bash
curl -X PATCH http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1-555-999-0011",
    "address": "77 Backcountry Rd, Denver, CO",
    "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
  }'
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
    "name": "Jane Explorer",
    "phone": "+1-555-999-0011",
    "address": "77 Backcountry Rd, Denver, CO",
    "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
  }
}
```

---

#### 7. Change Password
- **Endpoint**: `POST http://localhost:5000/api/auth/change-password`
- **Access Guard**: All Authenticated
- **Headers**:
  - `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "oldPassword": "Password123!",
  "newPassword": "NewSecurePassword456!"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "Password123!",
    "newPassword": "NewSecurePassword456!"
  }'
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password updated successfully.",
  "data": null
}
```
- **Verification Checkpoints**:
  1. Old password is confirmed against database hash before updating.
  2. Immediate login attempt with old password fails with `400 Bad Request`.
  3. Login with `NewSecurePassword456!` succeeds with `200 OK`.

---


#### ─── Module 2: User Administration (`/api/admin`) ───

#### 8. Fetch All Users (Admin Search & Filters)
- **Endpoint**: `GET http://localhost:5000/api/admin/users?role=CUSTOMER&status=ACTIVE&search=jane&page=1&limit=10`
- **Access Guard**: `ADMIN`
- **Headers**: `Authorization: Bearer <ADMIN_ACCESS_TOKEN>`
- **Query Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :---: | :---: | :--- |
  | `role` | String | Optional | Filter by role (`CUSTOMER`, `PROVIDER`, `ADMIN`) |
  | `status` | String | Optional | Filter by account status (`ACTIVE`, `BLOCKED`) |
  | `search` | String | Optional | Search query across user `name` or `email` |
  | `page` | Number | Optional | Current page index (defaults to 1) |
  | `limit` | Number | Optional | Number of items per page (defaults to 10) |
- **cURL Command**:
```bash
curl -X GET "http://localhost:5000/api/admin/users?role=CUSTOMER&status=ACTIVE&search=jane&page=1&limit=10" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
      "name": "Jane Explorer",
      "email": "jane.explorer@example.com",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "phone": "+1-555-999-0011",
      "createdAt": "2026-08-10T09:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```
- **Verification Checkpoints**:
  1. Only `ADMIN` role is authorized; attempts with `CUSTOMER` or `PROVIDER` tokens yield `403 Forbidden`.
  2. Passwords and sensitive hash digests are strictly omitted from the return payload.

---

#### 9. Update User Account Status (Block / Activate)
- **Endpoint**: `PATCH http://localhost:5000/api/admin/users/e98b04d1-c1e5-424a-b50a-f111812a1491`
- **Access Guard**: `ADMIN`
- **Headers**:
  - `Authorization: Bearer <ADMIN_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "status": "BLOCKED"
}
```
- **cURL Command**:
```bash
curl -X PATCH http://localhost:5000/api/admin/users/e98b04d1-c1e5-424a-b50a-f111812a1491 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "BLOCKED"
  }'
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User status updated successfully",
  "data": {
    "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
    "name": "Jane Explorer",
    "email": "jane.explorer@example.com",
    "role": "CUSTOMER",
    "status": "BLOCKED"
  }
}
```
- **Verification Checkpoints**:
  1. Once user status is changed to `BLOCKED`, any subsequent login attempts with these credentials immediately reject with `403 Forbidden` ("Your account has been suspended. Please contact support.").
  2. Can be toggled back to `ACTIVE` by repeating the request with `{"status": "ACTIVE"}`.

---

#### ─── Module 3: Sports Categories (`/api/categories`) ───

#### 10. Create Sports Gear Category
- **Endpoint**: `POST http://localhost:5000/api/categories`
- **Access Guard**: `ADMIN`
- **Headers**:
  - `Authorization: Bearer <ADMIN_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Camping & Hiking",
  "slug": "camping-hiking",
  "description": "Tents, backpacks, trekking poles, and sleeping bags for wilderness expeditions.",
  "iconUrl": "https://img.icons8.com/color/96/camping-tent.png"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Camping & Hiking",
    "slug": "camping-hiking",
    "description": "Tents, backpacks, trekking poles, and sleeping bags for wilderness expeditions.",
    "iconUrl": "https://img.icons8.com/color/96/camping-tent.png"
  }'
```
- **Expected Status**: `201 Created`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": "cat_camp_uuid",
    "name": "Camping & Hiking",
    "slug": "camping-hiking",
    "description": "Tents, backpacks, trekking poles, and sleeping bags for wilderness expeditions.",
    "iconUrl": "https://img.icons8.com/color/96/camping-tent.png",
    "createdAt": "2026-08-10T10:00:00.000Z",
    "updatedAt": "2026-08-10T10:00:00.000Z"
  }
}
```
- **Verification Checkpoints**:
  1. Category slug must be unique; submitting duplicate slug fails with Prisma unique constraint handler.

---

#### 11. List All Categories with Gear Count
- **Endpoint**: `GET http://localhost:5000/api/categories`
- **Access Guard**: Public
- **Headers**: None required
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/categories
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "cat_camp_uuid",
      "name": "Camping & Hiking",
      "slug": "camping-hiking",
      "description": "Tents, backpacks, trekking poles, and sleeping bags for wilderness expeditions.",
      "iconUrl": "https://img.icons8.com/color/96/camping-tent.png",
      "_count": {
        "gearItems": 12
      }
    }
  ]
}
```
- **Verification Checkpoints**:
  1. `_count.gearItems` correctly aggregates inventory size per category in single query.

---

#### 12. Retrieve Category Details by ID
- **Endpoint**: `GET http://localhost:5000/api/categories/cat_camp_uuid`
- **Access Guard**: Public
- **Headers**: None required
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/categories/cat_camp_uuid
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category retrieved successfully",
  "data": {
    "id": "cat_camp_uuid",
    "name": "Camping & Hiking",
    "slug": "camping-hiking",
    "description": "Tents, backpacks, trekking poles, and sleeping bags for wilderness expeditions.",
    "iconUrl": "https://img.icons8.com/color/96/camping-tent.png",
    "gearItems": [
      {
        "id": "gear_pole_uuid",
        "title": "Black Diamond Carbon Cork Trekking Poles",
        "rentalPricePerDay": 14.0,
        "availableStock": 10
      }
    ]
  }
}
```

---

#### 13. Update Category Information
- **Endpoint**: `PATCH http://localhost:5000/api/categories/cat_camp_uuid`
- **Access Guard**: `ADMIN`
- **Headers**:
  - `Authorization: Bearer <ADMIN_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "description": "Updated: Premium four-season tents, ultra-light backpacks, and trekking equipment."
}
```
- **cURL Command**:
```bash
curl -X PATCH http://localhost:5000/api/categories/cat_camp_uuid \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated: Premium four-season tents, ultra-light backpacks, and trekking equipment."
  }'
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category updated successfully",
  "data": {
    "id": "cat_camp_uuid",
    "name": "Camping & Hiking",
    "slug": "camping-hiking",
    "description": "Updated: Premium four-season tents, ultra-light backpacks, and trekking equipment.",
    "iconUrl": "https://img.icons8.com/color/96/camping-tent.png"
  }
}
```

---

#### 14. Delete Empty Category
- **Endpoint**: `DELETE http://localhost:5000/api/categories/cat_empty_uuid`
- **Access Guard**: `ADMIN`
- **Headers**: `Authorization: Bearer <ADMIN_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X DELETE http://localhost:5000/api/categories/cat_empty_uuid \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category deleted successfully",
  "data": {
    "id": "cat_empty_uuid",
    "name": "Temporary Category",
    "slug": "temporary-category"
  }
}
```
- **Verification Checkpoints**:
  1. If category contains active `gearItems` (`_count.gearItems > 0`), deletion rejects with `400 Bad Request` ("Cannot delete category with associated gear items. Remove or reassign gear items first.").

---


#### ─── Module 4: Gear Inventory & Public Catalog (`/api/gear` & `/api/provider/gear`) ───

#### 15. Create Gear Item (Provider Only)
- **Endpoint**: `POST http://localhost:5000/api/provider/gear`
- **Access Guard**: `PROVIDER`
- **Headers**:
  - `Authorization: Bearer <PROVIDER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "title": "Black Diamond Carbon Cork Trekking Poles",
  "slug": "bd-carbon-cork-poles",
  "description": "Premium 100% carbon fiber trekking poles with ergonomic cork grips.",
  "brand": "Black Diamond",
  "model": "Alpine Carbon Cork",
  "condition": "NEW",
  "rentalPricePerDay": 14.0,
  "depositFee": 35.0,
  "totalStock": 10,
  "location": "Aspen, CO",
  "images": [
    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d"
  ],
  "specifications": {
    "weight_grams": 485,
    "material": "100% Carbon Fiber",
    "adjustable_length_cm": "100-130"
  },
  "categoryId": "cat_camp_uuid"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/provider/gear \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Black Diamond Carbon Cork Trekking Poles",
    "slug": "bd-carbon-cork-poles",
    "description": "Premium 100% carbon fiber trekking poles with ergonomic cork grips.",
    "brand": "Black Diamond",
    "model": "Alpine Carbon Cork",
    "condition": "NEW",
    "rentalPricePerDay": 14.0,
    "depositFee": 35.0,
    "totalStock": 10,
    "location": "Aspen, CO",
    "images": [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d"
    ],
    "specifications": {
      "weight_grams": 485,
      "material": "100% Carbon Fiber",
      "adjustable_length_cm": "100-130"
    },
    "categoryId": "cat_camp_uuid"
  }'
```
- **Expected Status**: `201 Created`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Gear item added to inventory successfully",
  "data": {
    "id": "gear_pole_uuid",
    "title": "Black Diamond Carbon Cork Trekking Poles",
    "slug": "bd-carbon-cork-poles",
    "brand": "Black Diamond",
    "condition": "NEW",
    "rentalPricePerDay": 14.0,
    "depositFee": 35.0,
    "totalStock": 10,
    "availableStock": 10,
    "status": "AVAILABLE",
    "location": "Aspen, CO",
    "providerId": "prov_77192a_uuid",
    "categoryId": "cat_camp_uuid"
  }
}
```
- **Verification Checkpoints**:
  1. `availableStock` is automatically initialized equal to `totalStock`.
  2. `providerId` is securely taken from the authenticated JWT session.

---

#### 16. View Provider's Own Gear Inventory
- **Endpoint**: `GET http://localhost:5000/api/provider/my-gear`
- **Access Guard**: `PROVIDER`
- **Headers**: `Authorization: Bearer <PROVIDER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/provider/my-gear \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Provider gear inventory retrieved successfully",
  "data": [
    {
      "id": "gear_pole_uuid",
      "title": "Black Diamond Carbon Cork Trekking Poles",
      "brand": "Black Diamond",
      "totalStock": 10,
      "availableStock": 10,
      "rentalPricePerDay": 14.0,
      "category": {
        "name": "Camping & Hiking"
      },
      "_count": {
        "orderItems": 0
      }
    }
  ]
}
```

---

#### 17. Update Gear Item Specifications & Pricing
- **Endpoint**: `PUT http://localhost:5000/api/provider/gear/gear_pole_uuid`
- **Access Guard**: `PROVIDER`
- **Headers**:
  - `Authorization: Bearer <PROVIDER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "rentalPricePerDay": 14.0,
  "depositFee": 35.0,
  "totalStock": 10,
  "availableStock": 10
}
```
- **cURL Command**:
```bash
curl -X PUT http://localhost:5000/api/provider/gear/gear_pole_uuid \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "rentalPricePerDay": 14.0,
    "depositFee": 35.0,
    "totalStock": 10,
    "availableStock": 10
  }'
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Gear item updated successfully",
  "data": {
    "id": "gear_pole_uuid",
    "title": "Black Diamond Carbon Cork Trekking Poles",
    "rentalPricePerDay": 14.0,
    "depositFee": 35.0,
    "totalStock": 10,
    "availableStock": 10
  }
}
```
- **Verification Checkpoints**:
  1. Only the provider who owns the item can update it; foreign providers receive `404 / Forbidden`.

---

#### 18. Browse Public Catalog with Search & Multifaceted Filters
- **Endpoint**: `GET http://localhost:5000/api/gear?search=carbon&categoryId=cat_camp_uuid&minPrice=10&maxPrice=50&condition=NEW&page=1&limit=10&sortBy=rentalPricePerDay&sortOrder=asc`
- **Access Guard**: Public
- **Headers**: None required
- **Query Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :---: | :---: | :--- |
  | `search` | String | Optional | Case-insensitive match on `title`, `description`, or `brand` |
  | `categoryId` | String | Optional | Filter by category UUID |
  | `brand` | String | Optional | Filter by equipment manufacturer brand |
  | `condition` | String | Optional | `NEW`, `LIKE_NEW`, `GOOD`, `FAIR` |
  | `minPrice` | Number | Optional | Lower bound on `rentalPricePerDay` |
  | `maxPrice` | Number | Optional | Upper bound on `rentalPricePerDay` |
  | `sortBy` | String | Optional | Column to sort on (e.g., `rentalPricePerDay`, `createdAt`) |
  | `sortOrder` | String | Optional | `asc` or `desc` |
  | `page` | Number | Optional | Page index (defaults to 1) |
  | `limit` | Number | Optional | Items per page (defaults to 12) |
- **cURL Command**:
```bash
curl -X GET "http://localhost:5000/api/gear?search=carbon&categoryId=cat_camp_uuid&minPrice=10&maxPrice=50&condition=NEW&page=1&limit=10&sortBy=rentalPricePerDay&sortOrder=asc"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Gear retrieved successfully",
  "data": [
    {
      "id": "gear_pole_uuid",
      "title": "Black Diamond Carbon Cork Trekking Poles",
      "brand": "Black Diamond",
      "rentalPricePerDay": 14.0,
      "depositFee": 35.0,
      "availableStock": 10,
      "category": {
        "id": "cat_camp_uuid",
        "name": "Camping & Hiking"
      },
      "provider": {
        "id": "prov_77192a_uuid",
        "name": "Summit Gear Outfitters"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

#### 19. Retrieve Gear Item Specifications & Reviews
- **Endpoint**: `GET http://localhost:5000/api/gear/gear_pole_uuid`
- **Access Guard**: Public
- **Headers**: None required
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/gear/gear_pole_uuid
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Gear specifications retrieved successfully",
  "data": {
    "id": "gear_pole_uuid",
    "title": "Black Diamond Carbon Cork Trekking Poles",
    "brand": "Black Diamond",
    "model": "Alpine Carbon Cork",
    "condition": "NEW",
    "rentalPricePerDay": 14.0,
    "depositFee": 35.0,
    "totalStock": 10,
    "availableStock": 10,
    "location": "Aspen, CO",
    "category": {
      "id": "cat_camp_uuid",
      "name": "Camping & Hiking"
    },
    "provider": {
      "id": "prov_77192a_uuid",
      "name": "Summit Gear Outfitters",
      "phone": "+1-555-432-8877"
    },
    "reviews": []
  }
}
```

---

#### 20. Delete Gear Listing (Provider Only)
- **Endpoint**: `DELETE http://localhost:5000/api/provider/gear/gear_pole_uuid`
- **Access Guard**: `PROVIDER`
- **Headers**: `Authorization: Bearer <PROVIDER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X DELETE http://localhost:5000/api/provider/gear/gear_pole_uuid \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Gear item deleted successfully",
  "data": {
    "id": "gear_pole_uuid",
    "title": "Black Diamond Carbon Cork Trekking Poles"
  }
}
```

---

#### ─── Module 5: Rental Orders Lifecycle (`/api/rentals`, `/api/provider/orders`, `/api/admin/rentals`) ───

#### 21. Place Rental Order (Customer)
- **Endpoint**: `POST http://localhost:5000/api/rentals`
- **Access Guard**: `CUSTOMER`
- **Headers**:
  - `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "startDate": "2026-08-10T10:00:00.000Z",
  "endDate": "2026-08-14T18:00:00.000Z",
  "items": [
    {
      "gearItemId": "gear_pole_uuid",
      "quantity": 2
    }
  ],
  "notes": "Will pick up equipment directly at Aspen store."
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/rentals \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-08-10T10:00:00.000Z",
    "endDate": "2026-08-14T18:00:00.000Z",
    "items": [
      {
        "gearItemId": "gear_pole_uuid",
        "quantity": 2
      }
    ],
    "notes": "Will pick up equipment directly at Aspen store."
  }'
```
- **Expected Status**: `201 Created`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Rental order placed successfully",
  "data": {
    "id": "ord_88192a_uuid",
    "orderNumber": "ORD-198231-771",
    "totalDays": 4,
    "rentalFee": 112.0,
    "depositFee": 70.0,
    "totalAmount": 182.0,
    "status": "PLACED",
    "paymentStatus": "PENDING",
    "notes": "Will pick up equipment directly at Aspen store.",
    "items": [
      {
        "id": "item_uuid_1",
        "gearItemId": "gear_pole_uuid",
        "quantity": 2,
        "unitPricePerDay": 14.0,
        "depositPerUnit": 35.0,
        "subtotal": 182.0
      }
    ]
  }
}
```
- **Verification Checkpoints**:
  1. `totalDays` is calculated as `Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))`.
  2. Subtotal accurately tallies `(rentalPricePerDay * totalDays * quantity) + (depositFee * quantity)`.
  3. `availableStock` is validated; if `requested > availableStock`, transaction rejects with `400 Bad Request`.

---

#### 22. View Customer Rental History
- **Endpoint**: `GET http://localhost:5000/api/rentals`
- **Access Guard**: `CUSTOMER`
- **Headers**: `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/rentals \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental history retrieved successfully",
  "data": [
    {
      "id": "ord_88192a_uuid",
      "orderNumber": "ORD-198231-771",
      "totalDays": 4,
      "totalAmount": 182.0,
      "status": "PLACED",
      "paymentStatus": "PENDING",
      "items": [
        {
          "gearItem": {
            "title": "Black Diamond Carbon Cork Trekking Poles",
            "images": [
              "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d"
            ]
          }
        }
      ]
    }
  ]
}
```

---

#### 23. View Detailed Rental Order Breakdown
- **Endpoint**: `GET http://localhost:5000/api/rentals/ord_88192a_uuid`
- **Access Guard**: `CUSTOMER`, `PROVIDER`, `ADMIN`
- **Headers**: `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/rentals/ord_88192a_uuid \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental order details retrieved successfully",
  "data": {
    "id": "ord_88192a_uuid",
    "orderNumber": "ORD-198231-771",
    "startDate": "2026-08-10T10:00:00.000Z",
    "endDate": "2026-08-14T18:00:00.000Z",
    "totalDays": 4,
    "rentalFee": 112.0,
    "depositFee": 70.0,
    "totalAmount": 182.0,
    "status": "PLACED",
    "paymentStatus": "PENDING",
    "customer": {
      "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
      "name": "Jane Explorer",
      "email": "jane.explorer@example.com",
      "phone": "+1-555-999-0011"
    },
    "items": [
      {
        "id": "item_uuid_1",
        "gearItemId": "gear_pole_uuid",
        "quantity": 2,
        "unitPricePerDay": 14.0,
        "subtotal": 182.0,
        "gearItem": {
          "title": "Black Diamond Carbon Cork Trekking Poles"
        }
      }
    ],
    "payments": [],
    "reviews": []
  }
}
```
- **Verification Checkpoints**:
  1. Role Guard enforcement: A customer cannot audit an order belonging to another customer (`403 Forbidden`).
  2. Provider can only access the order if it includes equipment listed by their account.

---

#### 24. Provider Views Incoming Rental Orders
- **Endpoint**: `GET http://localhost:5000/api/provider/orders`
- **Access Guard**: `PROVIDER`
- **Headers**: `Authorization: Bearer <PROVIDER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/provider/orders \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Incoming rental orders retrieved successfully",
  "data": [
    {
      "id": "ord_88192a_uuid",
      "orderNumber": "ORD-198231-771",
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "customer": {
        "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
        "name": "Jane Explorer",
        "phone": "+1-555-999-0011"
      },
      "items": [
        {
          "quantity": 2,
          "gearItem": {
            "title": "Black Diamond Carbon Cork Trekking Poles"
          }
        }
      ]
    }
  ]
}
```

---

#### 25. Provider Updates Order Status (`CONFIRMED` -> `PICKED_UP` -> `RETURNED`)
- **Endpoint**: `PATCH http://localhost:5000/api/provider/orders/ord_88192a_uuid`
- **Access Guard**: `PROVIDER`
- **Headers**:
  - `Authorization: Bearer <PROVIDER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body (Equipment Pickup)**:
```json
{
  "status": "PICKED_UP"
}
```
- **cURL Command (Mark Picked Up)**:
```bash
curl -X PATCH http://localhost:5000/api/provider/orders/ord_88192a_uuid \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PICKED_UP"
  }'
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental order status updated successfully",
  "data": {
    "id": "ord_88192a_uuid",
    "status": "PICKED_UP"
  }
}
```
- **cURL Command (Mark Returned & Restore Stock)**:
```bash
curl -X PATCH http://localhost:5000/api/provider/orders/ord_88192a_uuid \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RETURNED"
  }'
```
- **Verification Checkpoints**:
  1. When status is transitioned to `RETURNED`, `availableStock` on all items in the order is automatically incremented back in the database.

---

#### 26. Cancel Unpaid Rental Order (Customer or Admin)
- **Endpoint**: `PATCH http://localhost:5000/api/rentals/ord_88192a_uuid/cancel`
- **Access Guard**: `CUSTOMER`, `ADMIN`
- **Headers**: `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X PATCH http://localhost:5000/api/rentals/ord_88192a_uuid/cancel \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rental order cancelled successfully",
  "data": {
    "id": "ord_88192a_uuid",
    "status": "CANCELLED"
  }
}
```
- **Verification Checkpoints**:
  1. Once an order is `PICKED_UP` or `RETURNED`, cancellation attempts fail with `400 Bad Request`.
  2. If the order was already paid, stock reservation is released back to `availableStock`.

---

#### 27. Admin Overview of All Platform Rental Orders
- **Endpoint**: `GET http://localhost:5000/api/admin/rentals?status=CONFIRMED&page=1&limit=10`
- **Access Guard**: `ADMIN`
- **Headers**: `Authorization: Bearer <ADMIN_ACCESS_TOKEN>`
- **Query Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :---: | :---: | :--- |
  | `status` | String | Optional | Filter by order status (`PLACED`, `CONFIRMED`, `PICKED_UP`, `RETURNED`, `CANCELLED`) |
  | `paymentStatus` | String | Optional | Filter by payment state (`PENDING`, `PAID`, `FAILED`, `REFUNDED`) |
  | `page` | Number | Optional | Page index (defaults to 1) |
  | `limit` | Number | Optional | Items per page (defaults to 10) |
- **cURL Command**:
```bash
curl -X GET "http://localhost:5000/api/admin/rentals?status=CONFIRMED&page=1&limit=10" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "All rental orders retrieved successfully",
  "data": [
    {
      "id": "ord_88192a_uuid",
      "orderNumber": "ORD-198231-771",
      "totalAmount": 182.0,
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "customer": {
        "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
        "name": "Jane Explorer",
        "email": "jane.explorer@example.com"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

#### ─── Module 6: Payment Transactions & Stripe Webhooks (`/api/payments`) ───

#### 28. Create Stripe Checkout Session
- **Endpoint**: `POST http://localhost:5000/api/payments/create`
- **Access Guard**: `CUSTOMER`
- **Headers**:
  - `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "rentalOrderId": "ord_88192a_uuid"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "rentalOrderId": "ord_88192a_uuid"
  }'
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Stripe checkout session created successfully",
  "data": {
    "paymentUrl": "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4...",
    "sessionId": "cs_test_a1b2c3d4e5f6g7h8"
  }
}
```
- **Verification Checkpoints**:
  1. Creates pending `Payment` record in PostgreSQL with `status: PENDING`.
  2. Generates dynamic line items on Stripe containing both daily rental fee and refundable security deposit.
  3. Rejects with `400 Bad Request` if the order is already marked `PAID`.

---

#### 29. Stripe Raw Webhook Handler (`checkout.session.completed`)
- **Endpoint**: `POST http://localhost:5000/api/payments/confirm`
- **Access Guard**: Public (Cryptographically validated via `Stripe-Signature` Header)
- **Headers**:
  - `Stripe-Signature: t=1723284000,v1=9e8c7a6...`
  - `Content-Type: application/json` (Processed as `express.raw`)
- **Raw Webhook Event Body**:
```json
{
  "id": "evt_test_webhook_001",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a1b2c3d4e5f6g7h8",
      "payment_intent": "pi_3PabcXYZ123456",
      "payment_status": "paid",
      "metadata": {
        "rentalOrderId": "ord_88192a_uuid",
        "customerId": "e98b04d1-c1e5-424a-b50a-f111812a1491",
        "orderNumber": "ORD-198231-771"
      }
    }
  }
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/payments/confirm \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=1723284000,v1=test_signature" \
  -d '{
    "id": "evt_test_webhook_001",
    "object": "event",
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_a1b2c3d4e5f6g7h8",
        "payment_intent": "pi_3PabcXYZ123456",
        "payment_status": "paid",
        "metadata": {
          "rentalOrderId": "ord_88192a_uuid",
          "customerId": "e98b04d1-c1e5-424a-b50a-f111812a1491",
          "orderNumber": "ORD-198231-771"
        }
      }
    }
  }'
```
*(In local development, trigger via Stripe CLI: `stripe trigger checkout.session.completed`)*
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Webhook event processed successfully",
  "data": null
}
```
- **Verification Checkpoints**:
  1. Idempotency Guard: `WebhookLog` record created; duplicate dispatches immediately return `200 OK` without double-crediting.
  2. Payment status updated to `PAID` with `paidAt` timestamp.
  3. Order transitioned from `PLACED` to `CONFIRMED` and `paymentStatus` set to `PAID`.
  4. Gear item `availableStock` atomically decremented by rented quantity.

---

#### 30. View Personal Payment History
- **Endpoint**: `GET http://localhost:5000/api/payments?page=1&limit=10`
- **Access Guard**: `CUSTOMER`
- **Headers**: `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
- **Query Parameters**:
  | Parameter | Type | Required | Description |
  | :--- | :---: | :---: | :--- |
  | `page` | Number | Optional | Page index (defaults to 1) |
  | `limit` | Number | Optional | Items per page (defaults to 10) |
- **cURL Command**:
```bash
curl -X GET "http://localhost:5000/api/payments?page=1&limit=10" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payments fetched successfully",
  "data": [
    {
      "id": "pay_9921_uuid",
      "transactionId": "txn_cs_test_a1b2",
      "amount": 182.0,
      "currency": "usd",
      "method": "STRIPE",
      "status": "PAID",
      "paidAt": "2026-08-10T10:15:00.000Z",
      "rentalOrder": {
        "orderNumber": "ORD-198231-771",
        "startDate": "2026-08-10T10:00:00.000Z",
        "endDate": "2026-08-14T18:00:00.000Z",
        "status": "CONFIRMED"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

#### 31. Get Specific Payment Receipt Details
- **Endpoint**: `GET http://localhost:5000/api/payments/pay_9921_uuid`
- **Access Guard**: `CUSTOMER`, `ADMIN`
- **Headers**: `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/payments/pay_9921_uuid \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment receipt retrieved successfully",
  "data": {
    "id": "pay_9921_uuid",
    "transactionId": "txn_cs_test_a1b2",
    "amount": 182.0,
    "currency": "usd",
    "method": "STRIPE",
    "status": "PAID",
    "stripePaymentIntentId": "pi_3PabcXYZ123456",
    "paidAt": "2026-08-10T10:15:00.000Z",
    "rentalOrder": {
      "items": [
        {
          "gearItem": {
            "title": "Black Diamond Carbon Cork Trekking Poles",
            "brand": "Black Diamond"
          }
        }
      ]
    }
  }
}
```
- **Verification Checkpoints**:
  1. Customer can only retrieve receipts for orders owned by their account (`403 Forbidden` on foreign IDs).
  2. Admin can retrieve any receipt across the entire platform.

---

#### ─── Module 7: Reviews & Ratings (`/api/reviews`) ───

#### 32. Submit Verified Review (Customer for `RETURNED` Rental)
- **Endpoint**: `POST http://localhost:5000/api/reviews`
- **Access Guard**: `CUSTOMER`
- **Headers**:
  - `Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "rentalOrderId": "ord_88192a_uuid",
  "gearItemId": "gear_pole_uuid",
  "rating": 5,
  "comment": "Exceptional build quality, poles held up seamlessly across rocky climbs!"
}
```
- **cURL Command**:
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "rentalOrderId": "ord_88192a_uuid",
    "gearItemId": "gear_pole_uuid",
    "rating": 5,
    "comment": "Exceptional build quality, poles held up seamlessly across rocky climbs!"
  }'
```
- **Expected Status**: `201 Created`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review submitted successfully",
  "data": {
    "id": "rev_55102_uuid",
    "rating": 5,
    "comment": "Exceptional build quality, poles held up seamlessly across rocky climbs!",
    "customerId": "e98b04d1-c1e5-424a-b50a-f111812a1491",
    "rentalOrderId": "ord_88192a_uuid",
    "gearItemId": "gear_pole_uuid",
    "createdAt": "2026-08-15T09:00:00.000Z"
  }
}
```
- **Verification Checkpoints**:
  1. Only permits reviews if the referenced order has reached `RentalOrderStatus.RETURNED`.
  2. Ensures the user submitting the review was the actual customer who booked the rental order.
  3. Enforces rating score bounds: `1 <= rating <= 5`.
  4. Unique constraint prevents submitting duplicate reviews for the same order and gear item.

---

#### 33. Get Verified Reviews for Specific Gear Item
- **Endpoint**: `GET http://localhost:5000/api/reviews/gear/gear_pole_uuid`
- **Access Guard**: Public
- **Headers**: None required
- **cURL Command**:
```bash
curl -X GET http://localhost:5000/api/reviews/gear/gear_pole_uuid
```
- **Expected Status**: `200 OK`
- **Response Envelope**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Gear reviews retrieved successfully",
  "data": [
    {
      "id": "rev_55102_uuid",
      "rating": 5,
      "comment": "Exceptional build quality, poles held up seamlessly across rocky climbs!",
      "createdAt": "2026-08-15T09:00:00.000Z",
      "customer": {
        "id": "e98b04d1-c1e5-424a-b50a-f111812a1491",
        "name": "Jane Explorer",
        "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      }
    }
  ]
}
```

---

### 4.4 Negative & Role Guard Security Tests

| Test ID | Scenario | Target Endpoint | Token / Request Condition | Expected HTTP | Expected Error Response Envelope |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **SEC-01** | Missing Token | `GET /api/auth/me` | No `Authorization` header | `401 Unauthorized` | `{"success": false, "message": "You are not logged in. Please log in to access this resource."}` |
| **SEC-02** | Expired Access Token | `GET /api/auth/me` | Expired JWT Bearer token | `401 Unauthorized` | `{"success": false, "message": "jwt expired"}` |
| **SEC-03** | Blocked Account Access | `POST /api/auth/login` | Credentials of a `BLOCKED` user | `403 Forbidden` | `{"success": false, "message": "Your account has been suspended. Please contact support."}` |
| **SEC-04** | Role Violation (Customer -> Admin) | `GET /api/admin/users` | Customer Bearer Token | `403 Forbidden` | `{"success": false, "message": "Forbidden! You do not have permission to access this resource."}` |
| **SEC-05** | Role Violation (Customer -> Provider) | `POST /api/provider/gear`| Customer Bearer Token | `403 Forbidden` | `{"success": false, "message": "Forbidden! You do not have permission to access this resource."}` |
| **SEC-06** | Role Violation (Provider -> Customer) | `POST /api/rentals` | Provider Bearer Token | `403 Forbidden` | `{"success": false, "message": "Forbidden! You do not have permission to access this resource."}` |
| **SEC-07** | Inventory Stock Overcommit | `POST /api/rentals` | Quantity (99) exceeds availableStock (8) | `400 Bad Request` | `{"success": false, "message": "Item Black Diamond Carbon Cork Trekking Poles does not have enough stock available."}` |
| **SEC-08** | Inverted Rental Dates | `POST /api/rentals` | `endDate` earlier than `startDate` | `400 Bad Request` | `{"success": false, "message": "Rental end date must be after start date."}` |
| **SEC-09** | Foreign Order Hijacking | `POST /api/payments/create` | Customer pays for another customer's order | `403 Forbidden` | `{"success": false, "message": "Forbidden: You cannot pay for another customer's order."}` |
| **SEC-10** | Double Payment Re-attempt | `POST /api/payments/create` | Order has `paymentStatus: PAID` | `400 Bad Request` | `{"success": false, "message": "This rental order has already been paid."}` |
| **SEC-11** | Review Premature Equipment | `POST /api/reviews` | Rental Order status is `PLACED` or `PICKED_UP` | `400 Bad Request` | `{"success": false, "message": "Reviews can only be submitted after the gear item has been returned."}` |
| **SEC-12** | Rating Score Out of Range | `POST /api/reviews` | `rating: 6` (Allowed: 1 to 5) | `400 Bad Request` | `{"success": false, "message": "Rating must be between 1 and 5."}` |
| **SEC-13** | Duplicate Review Submission | `POST /api/reviews` | Second review for same order & gear | `400 Bad Request` | Centralized prisma unique constraint violation |
| **SEC-14** | Delete Non-Empty Category | `DELETE /api/categories/:id`| Category contains active gear items | `400 Bad Request` | `{"success": false, "message": "Cannot delete category with associated gear items. Remove or reassign gear items first."}` |
| **SEC-15** | Cancel Picked-Up Order | `PATCH /api/rentals/:id/cancel`| Order status is `PICKED_UP` | `400 Bad Request` | `{"success": false, "message": "Cannot cancel an order that has already been picked up or completed."}` |
| **SEC-16** | Foreign Payment Receipt Audit | `GET /api/payments/:id` | Customer views another customer's receipt | `403 Forbidden` | `{"success": false, "message": "Forbidden: You do not have access to this payment receipt."}` |

---

### 4.5 Complete 32-Endpoint Master Compliance Checklist

| Catalog # | Domain | Method | Endpoint Path | Role Guard | Test ID | Verification Status |
| :---: | :--- | :---: | :--- | :--- | :---: | :---: |
| **1** | Auth | `POST` | `/api/auth/register` | Public | #1, #2 | ✅ Verified |
| **2** | Auth | `POST` | `/api/auth/login` | Public | #3 | ✅ Verified |
| **3** | Auth | `POST` | `/api/auth/refresh-token` | Public | #4 | ✅ Verified |
| **4** | Auth | `GET` | `/api/auth/me` | All Authenticated | #5 | ✅ Verified |
| **5** | Auth | `PATCH` | `/api/auth/profile` | All Authenticated | #6 | ✅ Verified |
| **6** | Auth | `POST` | `/api/auth/change-password` | All Authenticated | #7 | ✅ Verified |
| **7** | Admin | `GET` | `/api/admin/users` | `ADMIN` | #8 | ✅ Verified |
| **8** | Admin | `PATCH` | `/api/admin/users/:id` | `ADMIN` | #9 | ✅ Verified |
| **9** | Category | `POST` | `/api/categories` | `ADMIN` | #10 | ✅ Verified |
| **10** | Category | `GET` | `/api/categories` | Public | #11 | ✅ Verified |
| **11** | Category | `GET` | `/api/categories/:id` | Public | #12 | ✅ Verified |
| **12** | Category | `PATCH` | `/api/categories/:id` | `ADMIN` | #13 | ✅ Verified |
| **13** | Category | `DELETE` | `/api/categories/:id` | `ADMIN` | #14 | ✅ Verified |
| **14** | Gear | `GET` | `/api/gear` | Public | #18 | ✅ Verified |
| **15** | Gear | `GET` | `/api/gear/:id` | Public | #19 | ✅ Verified |
| **16** | Provider | `POST` | `/api/provider/gear` | `PROVIDER` | #15 | ✅ Verified |
| **17** | Provider | `PUT` | `/api/provider/gear/:id` | `PROVIDER` | #17 | ✅ Verified |
| **18** | Provider | `DELETE` | `/api/provider/gear/:id` | `PROVIDER` | #20 | ✅ Verified |
| **19** | Provider | `GET` | `/api/provider/my-gear` | `PROVIDER` | #16 | ✅ Verified |
| **20** | Rentals | `POST` | `/api/rentals` | `CUSTOMER` | #21 | ✅ Verified |
| **21** | Rentals | `GET` | `/api/rentals` | `CUSTOMER` | #22 | ✅ Verified |
| **22** | Rentals | `GET` | `/api/rentals/:id` | `CUSTOMER`, `PROVIDER`, `ADMIN` | #23 | ✅ Verified |
| **23** | Rentals | `PATCH` | `/api/rentals/:id/cancel` | `CUSTOMER`, `ADMIN` | #26 | ✅ Verified |
| **24** | Provider Orders | `GET` | `/api/provider/orders` | `PROVIDER` | #24 | ✅ Verified |
| **25** | Provider Orders | `PATCH` | `/api/provider/orders/:id` | `PROVIDER` | #25 | ✅ Verified |
| **26** | Admin Orders | `GET` | `/api/admin/rentals` | `ADMIN` | #27 | ✅ Verified |
| **27** | Payments | `POST` | `/api/payments/create` | `CUSTOMER` | #28 | ✅ Verified |
| **28** | Payments | `POST` | `/api/payments/confirm` | Public (Stripe Signature) | #29 | ✅ Verified |
| **29** | Payments | `GET` | `/api/payments` | `CUSTOMER` | #30 | ✅ Verified |
| **30** | Payments | `GET` | `/api/payments/:id` | `CUSTOMER`, `ADMIN` | #31 | ✅ Verified |
| **31** | Reviews | `POST` | `/api/reviews` | `CUSTOMER` | #32 | ✅ Verified |
| **32** | Reviews | `GET` | `/api/reviews/gear/:gearId` | Public | #33 | ✅ Verified |

---

# Part 5: Production Stripe Payment Implementation & Webhook Architecture

This payment and webhook implementation strictly adheres to the architecture established in **`Full_Project_SetUp.md`** (Phases 10, 11, 12, 14, and 15), tailored specifically for the **GearUp** sports equipment rental lifecycle.

---

### 5.1 Architecture & Ingress Flow (Local CLI vs. Production Cloud)

A truly production-grade webhook pipeline uses an identical codebase across all development and production environments. The diagram below illustrates how events travel from Stripe to the GearUp backend:

```mermaid
flowchart TD
    subgraph STAGE_1["Stage 1: Local Dev Machine"]
        LocalStripe[Stripe Test Environment] -->|API Event Trigger| LocalCLI[Stripe CLI Client]
        LocalCLI -->|HTTP POST :5000/api/payments/confirm| LocalApp[Local Express Engine]
        LocalApp -->|Verify whsec_test_...| LocalPrisma[(Local PostgreSQL)]
    end

    subgraph STAGE_2["Stage 2: Remote Staging Server"]
        StagingStripe[Stripe Test Environment] -->|Forward to Remote| StagingCLI[Remote Stripe CLI]
        StagingCLI -->|HTTPS POST| StagingApp[staging-api.gearup.com]
        StagingApp -->|Verify whsec_test_...| StagingDB[(Staging PostgreSQL)]
    end

    subgraph STAGE_3["Stage 3: Production Cloud"]
        LiveStripeCloud[Stripe Cloud Event Dispatcher] -->|Direct HTTPS POST| ProdIngress[api.gearup.com/api/payments/confirm]
        ProdIngress -->|Verify whsec_live_... or Rolling Secret| ProdApp[Production Express Clustered Instance]
        ProdApp -->|Idempotency Check via WebhookLog| ProdDB[(Production PostgreSQL)]
    end
```

#### Core Architectural Guarantees:
1. **Zero-Code Modification**: The same endpoint (`POST /api/payments/confirm`) and service pipeline handle local Stripe CLI dispatches, staging forwards, and live cloud webhooks.
2. **Raw Body Integrity**: The raw buffer of the Stripe request payload is preserved prior to any JSON parsing middleware.
3. **Strict Idempotency**: Duplicate event deliveries from Stripe (retries, network retransmits) are captured by the `webhook_logs` table and skipped cleanly with `200 OK`.
4. **Zero-Downtime Secret Rotation**: Supports dual-secret verification (`STRIPE_WEBHOOK_SECRET` with fallback to `STRIPE_WEBHOOK_SECRET_ROLLING`) to prevent dropped events during secret updates.

---

### 5.2 Codebase Implementation (`Full_Project_SetUp.md` Pattern)

Following the modular directory structure from `Full_Project_SetUp.md`:

```
src/
├── lib/
│   └── stripe.ts                     # Stripe API singleton
└── modules/
    └── payment/
        ├── payment.interface.ts      # DTOs, query types & response shapes
        ├── payment.service.ts        # Checkout sessions, raw webhook logic & transactions
        ├── payment.controller.ts     # Request extraction, catchAsync & sendResponse
        └── payment.route.ts          # Protected checkout route & raw webhook endpoint
```

#### 1. Stripe Singleton (`src/lib/stripe.ts`)
```ts
// src/lib/stripe.ts
import Stripe from "stripe";
import { config } from "../config";

export const stripe = new Stripe(config.stripe_secret_key, {
  apiVersion: "2025-02-24.acacia" as any,
  typescript: true,
});
```

#### 2. Payment Domain Types (`src/modules/payment/payment.interface.ts`)
```ts
// src/modules/payment/payment.interface.ts
import { PaymentStatus, PaymentMethod } from "../../../generated/prisma/enums";

export type TCreateCheckoutPayload = {
  rentalOrderId: string;
};

export type TCheckoutSessionResponse = {
  paymentUrl: string | null;
  sessionId: string;
};

export type TPaymentFilterQuery = {
  page?: string;
  limit?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
};
```

#### 3. Payment Service (`src/modules/payment/payment.service.ts`)
```ts
// src/modules/payment/payment.service.ts
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
  });

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
```

#### 4. Payment Controller (`src/modules/payment/payment.controller.ts`)
```ts
// src/modules/payment/payment.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;
  const { rentalOrderId } = req.body;

  if (!rentalOrderId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "rentalOrderId is required to initiate payment.",
    });
  }

  const result = await paymentServices.createRentalCheckoutSession(rentalOrderId, customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe checkout session created successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Buffer;
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Missing stripe-signature header in webhook request.",
    });
  }

  await paymentServices.handleWebhook(payload, signature);

  // Return prompt HTTP 200 acknowledgment to avoid Stripe retry loops
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Webhook event processed successfully",
    data: null,
  });
});

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getUserPayments(req.user!.id, req.user!.role, req.query as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments fetched successfully",
    data: result.payments,
    meta: result.meta,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.getPaymentById(req.params.id, req.user!.id, req.user!.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment receipt retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getUserPayments,
  getPaymentById,
};
```

#### 5. Payment Routes (`src/modules/payment/payment.route.ts`)
```ts
// src/modules/payment/payment.route.ts
import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Customer creates checkout session for an order
router.post("/create", auth(Role.CUSTOMER), paymentController.createCheckoutSession);

// Public Stripe Webhook listener (validated cryptographically via raw body buffer)
router.post("/confirm", paymentController.handleWebhook);

// Payment audit and receipts
router.get("/", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getUserPayments);
router.get("/:id", auth(Role.CUSTOMER, Role.ADMIN), paymentController.getPaymentById);

export const paymentRoutes = router;
```

#### 6. Express Application Assembly (`src/app.ts`)

> [!CAUTION]
> **CRITICAL WEBHOOK PARSER ORDERING REQUIREMENT**:  
> Stripe signature verification calculates an HMAC SHA-256 digest on the exact raw byte stream of the request payload.  
> You **MUST mount `express.raw({ type: "application/json" })` strictly BEFORE `express.json()`**.

```ts
// src/app.ts
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { categoryRoutes } from "./modules/category/category.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

// 1. CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://gearup.yourdomain.com"],
    credentials: true,
  })
);

// 2. ⚠️ Mount Raw Body Parser for Stripe Webhook BEFORE express.json()
app.use("/api/payments/confirm", express.raw({ type: "application/json" }));

// 3. Standard Body Parsers for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Base Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "GearUp Rental Engine API is running smoothly 🚀",
  });
});

// 5. Mount Application Feature Modules
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// 6. Centralized Error & 404 Handlers (Always at the end)
app.use(notFound);
app.use(globalErrorHandler);

export default app;
```

---

### 5.3 Development Webhook System: Step-by-Step Setup & Testing

Follow these steps on your local machine to test payment and webhook flows from end to end:

#### Dev Step 1: Stripe CLI Installation & Login
1. Install the official Stripe CLI:
   - **Windows (Scoop)**: `scoop install stripe`
   - **Windows (Chocolatey)**: `choco install stripe-cli`
   - **macOS (Homebrew)**: `brew install stripe/stripe-cli/stripe`
2. Authenticate the CLI with your Stripe account:
   ```bash
   stripe login
   ```
   *Follow the browser link to grant CLI permissions.*

#### Dev Step 2: Local Forwarding Listener Configuration
Open a dedicated terminal window and run:
```bash
stripe listen --forward-to localhost:5000/api/payments/confirm
```
*The terminal will output:*
```
> Ready! Your webhook signing secret is whsec_test_0192834756abcdef... (^C to quit)
```
Copy this secret (`whsec_test_...`) and update your local `.env`:
```env
STRIPE_WEBHOOK_SECRET="whsec_test_0192834756abcdef..."
```

#### Dev Step 3: Test 1 - Instant Synthetic Trigger
Verify that your Express server is reachable and parses raw webhook signatures properly:
```bash
# Terminal 1: Run your server
npm run dev

# Terminal 2: Keep stripe listen running
stripe listen --forward-to localhost:5000/api/payments/confirm

# Terminal 3: Trigger synthetic event
stripe trigger checkout.session.completed
```
**Expected Terminal Output in Terminal 2:**
```
[200] POST http://localhost:5000/api/payments/confirm
```
**Expected Server Log in Terminal 1:**
```
ℹ️ [Webhook] Duplicate event evt_xxx detected. Skipping.  (or initial processing log)
```

#### Dev Step 4: Test 2 - Full End-to-End Browser Checkout Test
1. Log in as a customer via `POST /api/auth/login` to obtain an access token.
2. Place a rental order via `POST /api/rentals`:
   ```json
   {
     "startDate": "2026-09-01T10:00:00Z",
     "endDate": "2026-09-05T18:00:00Z",
     "items": [{ "gearItemId": "<GEAR_UUID>", "quantity": 1 }]
   }
   ```
   *Note the returned `rentalOrderId`.*
3. Generate the checkout session via `POST /api/payments/create`:
   ```json
   {
     "rentalOrderId": "<RENTAL_ORDER_UUID>"
   }
   ```
4. Copy the returned `paymentUrl` and paste it into your browser.
5. In the Stripe Checkout UI, enter the test credentials:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry Date**: Any future date (e.g., `12/28`)
   - **CVC**: `123`
   - **Name**: John Trekkers
6. Click **Pay**. You will be redirected to `${config.app_url}/rentals/<id>?payment=success`.
7. Watch Terminal 2 log `[200] POST http://localhost:5000/api/payments/confirm`.
8. Verify in your database (via `npx prisma studio`):
   - The `RentalOrder` status changed from `PLACED` to `CONFIRMED`.
   - The `RentalOrder` paymentStatus changed from `PENDING` to `PAID`.
   - The `Payment` record status is `PAID` with non-null `stripePaymentIntentId` and `paidAt`.
   - The `GearItem` `availableStock` decreased by 1.

#### Dev Step 5: Test 3 - Idempotency & Duplicate Replay Test
1. Locate the event ID in your Stripe CLI logs or via:
   ```bash
   stripe events list --limit 1
   ```
2. Resend the exact event to your local server:
   ```bash
   stripe events resend evt_xxxxxxxxxxxxx
   ```
3. **Expected Behavior**:
   - The server outputs: `ℹ️ [Stripe Webhook] Duplicate event evt_xxx detected. Skipping.`
   - HTTP response is `200 OK`.
   - The database stock is **NOT** decremented a second time.

#### Dev Step 6: Test 4 - Card Decline / Payment Failure Simulation
1. Initiate a new checkout session.
2. In the checkout page, enter a test card configured for declines:
   - **Card Number**: `4000 0027 6000 3184` (Card Declined)
   - **CVC**: `123`, **Exp**: `12/28`
3. Click **Pay**. The card is declined.
4. Trigger the synthetic failure event via CLI:
   ```bash
   stripe trigger payment_intent.payment_failed
   ```
5. Confirm in your database that the payment record status transitioned to `FAILED`.

---

### 5.4 Production Webhook System: Step-by-Step Deployment & Testing

In production, **never run `stripe listen`**. The Stripe Cloud communicates directly with your deployed API over HTTPS.

#### Prod Step 1: Live Cloud Destination Ingress Registration
1. Deploy your backend application (e.g., Render, Railway, AWS ECS, Vercel) and ensure it has a valid SSL certificate (HTTPS).
2. Open **[Stripe Dashboard](https://dashboard.stripe.com)** $\to$ **Developers** $\to$ **Webhooks** $\to$ Click **"Add destination"** (or "Add endpoint").
3. Set the **Endpoint URL** to your live production endpoint:
   ```
   https://api.gearup.com/api/payments/confirm
   ```
4. Under **"Select events to listen for"**, subscribe to:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **"Add endpoint"**.

#### Prod Step 2: Environment Secrets & Zero-Downtime Rolling Key Setup
1. In the newly created webhook endpoint details page, click **"Reveal"** under **Signing Secret**.
2. Copy the production secret (`whsec_live_...`).
3. Set your production environment variables in your hosting provider's dashboard:
   ```env
   NODE_ENV="production"
   STRIPE_SECRET_KEY="sk_live_51Pxxxxxxxxxxxxxxxxxxxx"
   STRIPE_WEBHOOK_SECRET="whsec_live_primary_key_here..."
   STRIPE_WEBHOOK_SECRET_ROLLING=""
   APP_URL="https://gearup.com"
   ```

#### Prod Step 3: Test 1 - Pre-Flight Reachability & Handshake Test
1. In the Stripe Dashboard under your live webhook endpoint, click **"Send test event"** in the top-right corner.
2. Select `checkout.session.completed`.
3. Click **"Send test event"**.
4. **Verification**:
   - Confirm that the response status shows **`200 OK` (Green badge)**.
   - Response latency is $< 300\text{ms}$.
   - Inspect the response payload: `{ "success": true, "statusCode": 200, "message": "Webhook event processed successfully" }`.

#### Prod Step 4: Test 2 - Live Low-Value Purchase & Refund ($1.00 Test)
1. In your production app, place a rental booking using a test listing priced at $1.00.
2. Complete checkout using a real credit card.
3. Verify that your live PostgreSQL database updates the rental order to `CONFIRMED` and `PAID`.
4. Open **Stripe Dashboard $\to$ Payments**, find the $1.00 charge, and click **"Refund"**.
5. Verify in production application logs that `charge.refunded` is received, the order is marked `REFUNDED`, and the equipment stock is restored.

#### Prod Step 5: Test 3 - Zero-Downtime Secret Rotation Test
When rotating a compromised or expiring webhook secret:
1. In the Stripe Dashboard, click **"Rotate signing secret"**. Stripe will display both an **Immediately active new secret** and an **Expiring current secret (24h grace period)**.
2. Update your production environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_live_brand_new_secret..."
   STRIPE_WEBHOOK_SECRET_ROLLING="whsec_live_old_expiring_secret..."
   ```
3. Trigger test events. The code attempts verification against `STRIPE_WEBHOOK_SECRET` first; if it fails, it seamlessly falls back to `STRIPE_WEBHOOK_SECRET_ROLLING`. Zero events are dropped.

#### Prod Step 6: Test 4 - Downtime Recovery & Manual Redelivery Test
If your backend server experiences downtime during a customer checkout:
1. Stripe automatically retries failed deliveries using exponential backoff (over 72 hours).
2. To test manual redelivery:
   - In Stripe Dashboard $\to$ Developers $\to$ Webhooks $\to$ Select Endpoint $\to$ **Event History**.
   - Select any event that failed or succeeded $\to$ Click **"Resend"**.
3. Check production logs (`pm2 logs` or CloudWatch). Verify that the server acknowledges the redelivery cleanly and that the `webhook_logs` table prevents duplicate side effects.

---

### 5.5 Production Best Practices & Common Setup Traps

| # | Common Setup Trap | Root Cause | Preventive Measure |
| :-: | :--- | :--- | :--- |
| **1** | **`Webhook signature verification failed`** | `express.json()` ran before `express.raw()`, mutating the payload buffer. | Keep `app.use("/api/payments/confirm", express.raw({ type: "application/json" }))` at the top of `src/app.ts`. |
| **2** | **Duplicate Stock Decrements** | Not enforcing idempotency on retried Stripe events. | Query `WebhookLog` on `event.id` prior to executing business mutations. |
| **3** | **Stripe 504 Gateway Timeout Retry Loops** | Performing slow long-running tasks before returning HTTP 200. | Send fast HTTP 200 via `sendResponse` within 2 seconds of receipt. |
| **4** | **Running `stripe listen` on Live Cloud Server** | Confusing CLI dev forwarder with cloud webhooks. | Only use `stripe listen` locally. In production, configure the endpoint URL directly in Stripe Dashboard. |
| **5** | **Unhandled Promise Rejections in Webhook** | Throwing uncaught exceptions inside asynchronous event handlers. | Wrap controller in `catchAsync` and catch verification errors inside `try/catch`. |
| **6** | **Dropped Events During Secret Rotation** | Changing secret in `.env` without rolling fallback. | Maintain `STRIPE_WEBHOOK_SECRET_ROLLING` during key transition periods. |

---

*This document serves as the official, standard production blueprint for the GearUp Rental Backend API.*

