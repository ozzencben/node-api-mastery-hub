import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

import { startCronJobs } from "./core/services/cron.service";

import { requestLogger } from "./core/middlewares/logger";
import {
  getFinanceSpec,
  getUserSpec,
  getBusinessSpec,
} from "./core/lib/swagger";

import DiscoveryRoutes from "./modules/discovery/discovery.routes";
import UserRoutes from "./modules/user/user.routes";
import FinanceRoutes from "./modules/finance/finance.routes";
import RecurringFrequencyRoutes from "./modules/finance/recurringTransaction.routes";
import BusinessRoutes from "./modules/business/business.routes";

import { errorHandler } from "./core/middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logger Middleware
app.use(requestLogger);

// Swagger Routess

// /api-docs/users
app.use(
  "/api-docs/users",
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const spec = getUserSpec();
    swaggerUi.setup(spec)(req, res, next);
  },
);

// /api-docs/finances
app.use(
  "/api-docs/finances",
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const spec = getFinanceSpec();
    swaggerUi.setup(spec)(req, res, next);
  },
);

// /api-docs/business
app.use(
  "/api-docs/business",
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const spec = getBusinessSpec();
    swaggerUi.setup(spec)(req, res, next);
  },
);

// Routes
app.use("/api/discovery", DiscoveryRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/finances", FinanceRoutes);
app.use("/api/recurring-transactions", RecurringFrequencyRoutes);
app.use("/api/businesses", BusinessRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Define a route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Start cron jobs
startCronJobs();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
