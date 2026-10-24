# 🏋️ GearUp - Sports & Outdoor Gear Rental Backend API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-indigo.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff.svg)](https://stripe.com/)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black.svg)](https://next-level-assignment-4-gearup-back-rose.vercel.app)

> A modern, multi-tier, enterprise-grade RESTful API built for a sports and outdoor equipment rental service. GearUp connects outdoor enthusiasts with equipment providers, featuring multi-role access control, inventory tracking, date-conflict rental reservations, and Stripe payment processing.

---

## 🔗 Quick Links & Submission Essentials

| Resource | Link / Details |
| :--- | :--- |
| **Live API Base URL** | [https://next-level-assignment-4-gearup-back-rose.vercel.app](https://next-level-assignment-4-gearup-back-rose.vercel.app) |
| **API Health Check** | [https://next-level-assignment-4-gearup-back-rose.vercel.app/api](https://next-level-assignment-4-gearup-back-rose.vercel.app/api) |
| **GitHub Repository** | [https://github.com/tuser579/Next-Level-Assignment-4-Gearup-backend-project](https://github.com/tuser579/Next-Level-Assignment-4-Gearup-backend-project) |
| **Postman Collection Link** | [Postman Collection Link](https://go.postman.co/collection/56711106-04df6a35-0c18-4d11-b772-02c1081361bb?source=collection_link) |
| **Postman File (Live)** | [`Live GearUp Backend Project.postman_collection.json`](./Live%20GearUp%20Backend%20Project.postman_collection.json) |
| **Postman File (Local)** | [`Local_GearUp Backend Project.postman_collection.json`](./Local_GearUp%20Backend%20Project.postman_collection.json) |

---

## 🔐 System Test Credentials

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@gearup.com` | `admin123` | Full system access, manage users, categories, all listings & orders |
| **PROVIDER** | `summit.sports@gearup.com` | `password123` | Manage gear inventory, track rental orders, update order fulfillment status |
| **CUSTOMER** | `john.customer@gmail.com` | `password123` | Browse gear, place rental orders, make Stripe payments, submit verified reviews |

---

## 🛠️ Technology Stack

- **Runtime & Language**: Node.js (v20+), TypeScript (Strict Mode)
- **Framework**: Express 5
- **Database & ORM**: PostgreSQL with Prisma ORM 7 (`@prisma/adapter-pg`, multi-file schema architecture)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing and cookie/header support
- **Payment Gateway**: Stripe SDK (Payment Intents, Checkout sessions, raw webhook signature verification)
- **Bundler & Tooling**: TSX (development hot-reload), ESBuild (serverless bundling for Vercel), Prisma Studio
- **Cloud Deployment**: Vercel Serverless Functions (`@vercel/node`)

---

## ✨ Key Features & Business Logic

### 1. 👥 Multi-Role Based Access Control (RBAC)
- 3 distinct system roles: `CUSTOMER`, `PROVIDER`, and `ADMIN`.
- Flexible registration with automatic role assignment and token-based permission guards.

### 2. 🎒 Sports & Outdoor Gear Catalog
- Categorized equipment listings with multifaceted filtering (category, price range, brand, condition, availability).
- Provider-specific inventory control: add, update, soft-delete, and modify pricing/stock.

### 3. 📅 Date-Conflict Aware Rental Booking System
- Complete date range booking with automatic total duration calculation and dynamic deposit handling.
- Concurrency and date-collision protection preventing overlapping equipment reservations.
- Multi-state lifecycle tracking: `PLACED` ➔ `CONFIRMED` ➔ `PICKED_UP` ➔ `RETURNED` / `CANCELLED`.

### 4. 💳 Mandatory Stripe Payment Integration
- Integration with Stripe for online payments.
- Real-time automated status updates via Stripe Webhooks with raw-body signature verification (`/api/payments/confirm`).
- Payment transaction tracking and refund handling.

### 5. ⭐ Verified Customer Reviews
- Reviews can only be submitted after rental orders are returned and verified.
- Unique constraints prevent duplicate feedback per rental order.

### 6. 🛡️ Robust Error Handling & Validation
- Standardized API response format for all success and error states:
  ```json
  {
    "statusCode": 400,
    "success": false,
    "message": "Validation Error",
    "errorDetails": [ ... ]
  }
  ```
- Graceful 404 handler for non-existent routes and centralized global error handling.

---

## 🗄️ Database Schema & Entities

The database utilizes Prisma's multi-file schema feature (`prisma/schema/`):
- `user.prisma`: Users with credentials, profile details, and role enums.
- `category.prisma`: Sports & outdoor categories with slug uniqueness.
- `gearItem.prisma`: Equipment listings with brand, condition, pricing, and stock.
- `rentalOrder.prisma`: Multi-item rental contracts with date ranges and fulfillment status.
- `payment.prisma`: Payment records linked to orders, Stripe transaction IDs, and timestamps.
- `refund.prisma`: Managed refund tracking.
- `review.prisma`: Ratings & reviews for completed rentals.
- `webhookLog.prisma`: Idempotency tracking table for Stripe events.

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`CUSTOMER` or `PROVIDER`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |

### Equipment & Categories (`/api/gear`, `/api/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/gear` | Public | List all available equipment with search & filters |
| `GET` | `/api/gear/:id` | Public | View detailed equipment specifications |
| `GET` | `/api/categories` | Public | List all gear categories |
| `GET` | `/api/categories/:id` | Public | Get single category details |

### Rentals & Bookings (`/api/rentals`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rentals` | `CUSTOMER` | Book equipment rental with date range |
| `GET` | `/api/rentals` | Authenticated | View authenticated user's rental history |
| `GET` | `/api/rentals/:id` | Authenticated | View single rental order details |

### Payments & Webhook (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create` | `CUSTOMER` | Initialize Stripe checkout session |
| `POST` | `/api/payments/confirm`| Public (Stripe) | Stripe webhook event handler (Raw body) |
| `GET` | `/api/payments` | Authenticated | Retrieve user payment transaction history |
| `GET` | `/api/payments/:id` | Authenticated | Retrieve payment receipt details |

### Provider Management (`/api/provider`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/provider/gear` | `PROVIDER` | Add new equipment listing |
| `PUT` | `/api/provider/gear/:id` | `PROVIDER` | Update equipment details |
| `DELETE` | `/api/provider/gear/:id` | `PROVIDER` | Soft-delete equipment listing |
| `GET` | `/api/provider/orders` | `PROVIDER` | View incoming orders for provider's gear |
| `PATCH` | `/api/provider/orders/:id` | `PROVIDER` | Update order status (`CONFIRMED`, `PICKED_UP`, `RETURNED`) |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | `CUSTOMER` | Submit review after equipment is `RETURNED` |
| `GET` | `/api/reviews/gear/:id`| Public | Fetch all reviews for specific gear |

### Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | `ADMIN` | List all registered users |
| `PATCH` | `/api/admin/users/:id` | `ADMIN` | Update user status (`ACTIVE` / `SUSPENDED`) |
| `GET` | `/api/admin/gear` | `ADMIN` | Oversee all gear listings across all providers |
| `GET` | `/api/admin/rentals` | `ADMIN` | View and manage all platform rental orders |
| `POST` | `/api/admin/categories`| `ADMIN` | Create new equipment category |

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Stripe Account (for API and Webhook testing)

### 1. Clone the repository
```bash
git clone https://github.com/tuser579/Next-Level-Assignment-4-Gearup-backend-project.git
cd Next-Level-Assignment-4-Gearup-backend-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/gearup_db?schema=public"
APP_URL="https://next-level-assignment-4-gearup-back-rose.vercel.app"
APP_URL_LOCAL="http://localhost:3000"
NODE_ENV="development"
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET="your_jwt_access_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Database Setup & Seeding
```bash
# Push schema migrations
npx prisma db push

# Seed test data (users, categories, gear items, rental orders, reviews)
npm run seed
```

### 5. Run the development server
```bash
npm run dev
```
The server will start on `http://localhost:5000`. Test the health check at `http://localhost:5000/api`.
