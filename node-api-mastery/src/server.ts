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
  getTaskSpec,
} from "./core/lib/swagger";

import DiscoveryRoutes from "./modules/discovery/discovery.routes";
import UserRoutes from "./modules/user/user.routes";
import FinanceRoutes from "./modules/finance/finance.routes";
import RecurringFrequencyRoutes from "./modules/finance/recurringTransaction.routes";
import BusinessRoutes from "./modules/business/business.routes";
import TaskRoutes from "./modules/tasks/task.routes";

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

// Swagger Spec and JSON Endpoint
app.get("/specs/users-spec.json", (req, res) => {
  res.json(getUserSpec());
});

app.get("/specs/finances-spec.json", (req, res) => {
  res.json(getFinanceSpec());
});

app.get("/specs/business-spec.json", (req, res) => {
  res.json(getBusinessSpec());
});

app.get("/specs/tasks-spec.json", (req, res) => {
  res.json(getTaskSpec());
});

const specResolvers: Record<string, () => any> = {
  users: getUserSpec,
  finances: getFinanceSpec,
  business: getBusinessSpec,
  tasks: getTaskSpec,
};

const swaggerSetup = (specName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resolver = specResolvers[specName];

    if (!resolver) {
      return res.status(404).send("Spec not found");
    }

    const spec = resolver();

    return res.send(
      swaggerUi.generateHTML(spec, {
        swaggerOptions: {
          url: `/specs/${specName}-spec.json`,
        },
      }),
    );
  };
};

app.use("/api-docs/users", swaggerUi.serve, swaggerSetup("users"));
app.use("/api-docs/finances", swaggerUi.serve, swaggerSetup("finances"));
app.use("/api-docs/business", swaggerUi.serve, swaggerSetup("business"));
app.use("/api-docs/tasks", swaggerUi.serve, swaggerSetup("tasks"));

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.send("API-Hub is active and running!");
});

// Routes
app.use("/api/discovery", DiscoveryRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/finances", FinanceRoutes);
app.use("/api/recurring-transactions", RecurringFrequencyRoutes);
app.use("/api/businesses", BusinessRoutes);
app.use("/api/tasks", TaskRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start cron jobs
startCronJobs();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
