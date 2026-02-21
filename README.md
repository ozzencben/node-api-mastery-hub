# Node-API Mastery Hub

> **A Modular, Multi-Service API Ecosystem & Backend Framework**

## 🎯 Project Vision

This project serves as a centralized hub for independent API services, built with a focus on clean architecture, modular documentation, and robust automation.

---

## 🏗️ Core Architectural Principles

### 🧩 Modular Documentation

Each API module has its own dedicated Swagger endpoint, allowing for isolated testing and clear separation of concerns.

### 🛡️ Strict Validation

Request and response integrity is enforced via Zod schemas, which also serve as the source of truth for the OpenAPI documentation.

### 🤖 Automated Workflows

A centralized Cron Service handles background tasks like financial automation, ensuring data consistency without manual intervention.

---

## 📂 Integrated API Systems

Explore our specialized API modules through their dedicated interactive documentation:

### 🏢 Business & Appointment System (New!)

- **Description:** A robust engine for service-based businesses to manage bookings and daily operations.
- **Interactive Docs:** [`/api-docs/business`](https://node-api-mastery-hub.onrender.com/api-docs/business)
- **Key Features:**
  - **Smart Availability Engine:** Calculates real-time bookable slots based on business working hours and service durations.
  - **Overlap Prevention:** Automatically blocks conflicting appointments to ensure data integrity.
  - **Admin Dashboard:** Provides business owners with daily stats (Pending/Confirmed/Cancelled) and estimated revenue calculations.
  - **Flexible Booking:** Supports both authenticated user bookings and guest checkout with phone/name validation.
  - **Business Rules Enforcement:** Implements critical logic like the "2-Hour Cancellation Rule" to protect service providers.
  - **Advanced Discovery:** Filtered business listing with full pagination support.

### 💰 Finance & Automation System

- **Description:** A high-performance engine for personal finance tracking and subscription automation.
- **Interactive Docs:** [`/api-docs/finances`](https://node-api-mastery-hub.onrender.com/api-docs/finances)
- **Key Features:**
  - Real-time Balance & Projection logic.
  - Automated Recurring Transaction Engine.
  - Advanced Pagination & Normalized Filtering.

### 👤 User Management System

- **Description:** Handles identity, user profiles, and foundational security logic.
- **Interactive Docs:** [`/api-docs/users`](https://node-api-mastery-hub.onrender.com/api-docs/users)
- **Key Features:**
  - Full User CRUD operations.
  - Modular route protection using identity headers.

---

## 🗺️ Future Expansion

- [ ] **E-Commerce Module** (`/api-docs/shop`)
- [ ] **Auth & OAuth Provider** (`/api-docs/auth`)
- [ ] **Notification Center** (`/api-docs/notifications`)

---

## 📂 Directory Structure

```text
node-api-mastery
├── src
│   ├── modules       # 🚀 Feature-specific API systems
│   ├── core          # 🏗️ Framework backbone (Middlewares, Cron, Libs)
│   └── server.ts     # Main Entry Point & Swagger Routing
└── prisma            # Multi-model Database Management
```

---

## 🚀 Quick Start

1. **Install:** `npm install`
2. **Database:** Update `.env` and run `npx prisma migrate dev`
3. **Launch:** `npm run dev`
4. **Test:** Navigate to any of the documentation links listed above.

---

**Developed by Özenç** | _Building scalable, document-first backend environments._
