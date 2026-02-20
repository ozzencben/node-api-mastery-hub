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
