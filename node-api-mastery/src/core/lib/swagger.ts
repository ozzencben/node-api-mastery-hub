import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Zod'u OpenAPI yetenekleriyle genişletiyoruz
extendZodWithOpenApi(z);

// Tüm şemaların ve yolların kaydedileceği defter
export const userRegistry = new OpenAPIRegistry();
export const financeRegistry = new OpenAPIRegistry();
export const businnessRegistry = new OpenAPIRegistry();
export const taskRegistry = new OpenAPIRegistry();

const renderUrl =
  process.env.RENDER_URL || "https://node-api-mastery-hub.onrender.com";

// USER SPECIFICATION
export const getUserSpec = () => {
  const generator = new OpenApiGeneratorV3(userRegistry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "User Management API Specification",
      version: "1.0.0",
    },
    servers: [
      {
        url: renderUrl,
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  });
};

// FINANCE SPECIFICATION
const apiDescription = [
  "## ⚠️ IMPORTANT: PREREQUISITE FOR TESTING",
  "> **Attention:** To test the endpoints in this module, a valid **userId** is required in the database.",
  `> If you haven't created a user yet, please generate one here first: [User API Specification](${renderUrl}/api-docs/users)`,
  "",
  "---",
  "",
  "## 💰 Finance & Automation Management API (v1.0)",
  "Welcome to the high-performance Finance Management API. This system is engineered to provide users with a robust framework for tracking personal finances and automating recurring wealth management with mathematical precision.",
  "",
  "### 🚀 Key Technical Features",
  "* **Real-time Financial Intelligence:** Automated calculation of Total Income, Total Expense, and live Balance tracking for manual transactions.",
  "* **Subscription Automation (Cron Engine):** A background service that monitors recurring templates and automatically generates transactions when their due date arrives.",
  "* **Financial Projections:** Intelligent summary logic that calculates estimated monthly/weekly net flow by normalizing different frequencies (e.g., Weekly x4).",
  "* **Strict Type Safety:** Fully validated by Zod and strictly typed with Prisma ORM for zero-fault data entry.",
  "",
  "### 🔄 Recurring Transactions Logic",
  "The system supports automated transaction scheduling with two primary frequencies:",
  "",
  "| Frequency | Required Parameter | Logic |",
  "| :--- | :--- | :--- |",
  "| **MONTHLY** | `dayOfMonth` (1-31) | Fires on the specific day every month. |",
  "| **WEEKLY** | `dayOfWeek` (0-6) | Fires on the specific day every week (0=Sunday). |",
  "",
  "### 🛡️ Business Logic & Validation Rules",
  "To maintain data integrity, the API enforces strict categorization and scheduling rules:",
  "",
  "| Transaction Type | Allowed Categories |",
  "| :--- | :--- |",
  "| **INCOME** | `SALARY`, `OTHER` |",
  "| **EXPENSE** | `FOOD`, `TRANSPORT`, `RENT`, `UTILITIES`, `SHOPPING`, `HEALTH`, `ENTERTAINMENT` |",
  "",
  "> ⚠️ **Validation Note:** Any attempt to cross-assign categories (e.g., `FOOD` for `INCOME`) or missing frequency-specific days (e.g., `WEEKLY` without `dayOfWeek`) will result in a `400 Bad Request`.",
  "",
  "### 📊 API Usage & Advanced Features",
  "",
  "#### 🔍 1. Smart Filtering & Reporting",
  "Retrieve manual transactions with precision querying using ISO 8601 timestamps:",
  "`GET /api/finances/{userId}?startDate=2026-01-01T00:00:00Z&endDate=2026-01-31T23:59:59Z`",
  "",
  "#### 📈 2. Subscription Analytics",
  "The `GET /api/recurring-transactions/{userId}` endpoint provides a projection of your future finances:",
  "* `estimatedMonthlyNet`: Your total expected monthly balance (Monthly + Weekly*4).",
  "* `isActive` Toggle: You can pause an automation by setting `isActive: false` via PATCH without deleting the template.",
  "",
  "#### 📑 3. Pagination & Performance",
  "All list endpoints utilize server-side pagination (`page`, `limit`) and dynamic sorting (`sortBy`, `sortOrder`) to ensure high performance even with thousands of records.",
  "",
  "---",
  "**Developed by Özenç** | *Focusing on scalable, maintainable, and document-first backend architectures.*",
].join("\n");

export const getFinanceSpec = () => {
  const generator = new OpenApiGeneratorV3(financeRegistry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Finance Management API Specification",
      description: apiDescription,
      version: "1.0.0",
    },
    servers: [
      {
        url: renderUrl,
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  });
};

// BUSINESS SPECIFICATION
const businessDesc = `
## ⚠️ IMPORTANT: PREREQUISITE FOR TESTING
> **Attention:** All business operations, service definitions, and appointment scheduling are linked to a specific user.
> You must provide a valid **x-user-id** in the request headers to proceed.
> If you don't have a user ID yet, please create one first: [User API Specification](${renderUrl}/api-docs/users)

---

## 🏢 Advanced Business & Appointment Engine

This module serves as the core engine for service-based businesses. It handles everything from **Business Management** and **Service Definitions** to **Smart Appointment Scheduling** and **Admin Insights**.

---

### ⚠️ Core Logic & Business Rules

1. **Identity & Security:**
   - **User Identity:** Identification is handled via the **x-user-id** header.
   - **Ownership Control:** Critical operations (Update/Delete/Dashboard) strictly verify if the **x-user-id** matches the **ownerId** of the business.

2. **Smart Scheduling Logic:**
   - **Working Hours:** Must follow the **HH:mm-HH:mm** format (e.g., 09:00-22:00). Appointments cannot be booked outside these hours.
   - **Automatic Overlap Prevention:** The system calculates the **endTime** using **Service.duration**. It automatically blocks time slots that overlap with existing **PENDING** or **CONFIRMED** appointments.
   - **Availability Engine:** The \`/availability\` endpoint dynamically calculates bookable slots for any given date, considering both business hours and existing bookings.

3. **Appointment Life Cycle:**
   - **Status Flow:** Appointments move through states: \`PENDING\` ➔ \`CONFIRMED\` / \`CANCELLED\` ➔ \`COMPLETED\`.
   - **The 2-Hour Rule:** Users can cancel their own appointments only if there are **more than 2 hours** remaining. Otherwise, they must contact the business directly.

---

### 🛠️ Operations Workflow

#### 🔹 For Businesses (Owners)
1. **Setup:** Create a Business and define Services (with duration and price).
2. **Management:** Use the **Dashboard** (\`/dashboard\`) to see daily stats, pending requests, and estimated revenue.
3. **Action:** Monitor and update appointment statuses via the Business Appointment List.

#### 🔹 For Users (Customers)
1. **Discovery:** Use \`/list\` with filters (category, search, pagination) to find businesses.
2. **Details:** Use \`/detail/{id}\` to view a business's full service menu.
3. **Booking:** Check availability and book a slot (Registered users or Guests).
4. **Tracking:** View personal appointment history and manage cancellations.

---

### 📊 Implementation Details (Technical)
- **Timezone:** All operations are normalized to **Europe/Istanbul** to ensure scheduling consistency.
- **Precision:** Financial data (Revenue) is calculated with precision from service prices.
- **Pagination:** Global search is optimized with **page** and **limit** parameters for high performance.

---

### ✅ Current Status: Production Ready
All Business, Service, and Appointment operations are fully validated with **Zod**, documented with **OpenAPI**, and integrated with **Prisma** for persistent storage.
`;

export const getBusinessSpec = () => {
  const generator = new OpenApiGeneratorV3(businnessRegistry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Business Management API Specification",
      description: businessDesc,
      version: "1.0.0",
    },
    servers: [
      {
        url: renderUrl,
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  });
};

// TASK SPECIFICATION
export const taskDesc = `
## 📝 Personal Task & Productivity Engine

Welcome to the **Task Management** module! This space is designed to demonstrate high-performance CRUD operations, advanced filtering, and real-time statistics.

You can use this module as your personal daily planner while testing my backend capabilities.

---

### 🚀 Key Features & Capabilities
This system demonstrates how a standalone service manages **Atomic Operations**, **State Lifecycle**, and **Complex Queries**.

* **Smart Filtering:** Use \`GET /tasks\` with pagination, search, and category/priority filters.
* **Advanced Statistics:** Use \`GET /tasks/stats\` for a bird's-eye view of your productivity and overdue tasks.
* **Focus Mode:** Get only what matters right now with \`GET /tasks/daily\`.
* **Bulk Operations:** Manage large task lists efficiently with \`POST /api/tasks/bulk\` (Bulk Delete).
* **Data Integrity:** Powered by **Zod** & **Prisma**, ensuring UUID validation and strict Enum controls.

---

### 🛠️ Strategic Workflow Example

1.  **Set Goals:** Create tasks using \`POST /tasks\` (e.g., "Refactor Finance Module").
2.  **Focus:** Check \`GET /tasks/daily\` every morning to see your "Today's Focus" list.
3.  **Track Health:** Use \`GET /tasks/stats\` to identify overdue tasks before they become a problem.
4.  **Clean Up:** Use the **Bulk Delete** feature to clear out multiple unwanted tasks in a single request.

---

### 🛡️ Business Logic & Guardrails
-   **Multi-tenancy:** All operations are strictly isolated by your **x-user-id**. You cannot access or modify tasks belonging to other users.
-   **Case-Insensitive Search:** The search engine finds your tasks regardless of capital letters in titles or descriptions.
-   **Pagination:** Large data sets are served in chunks (default 10 per page) to ensure fast response times.
-   **Time Precision:** Global ISO 8601 compatibility for \`dueDate\` ensures your deadlines are accurate across all time zones.

---
**Pro Tip:** Try searching for a specific keyword while filtering by 'HIGH' priority to see the power of our Prisma-driven query engine!
`;

export const getTaskSpec = () => {
  const generator = new OpenApiGeneratorV3(taskRegistry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Task & Productivity API Specification",
      description: taskDesc,
      version: "1.0.0",
    },
    servers: [
      {
        url: renderUrl,
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
  });
};
