import { Router } from "express";
import {
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} from "./recurringTransaction.controller";
import {
  RecurringTransactionSchema,
  RecurringTransactionBodySchema,
  createRecurringTransactionSchema,
  getRecurringTransactionsSchema,
  PaginationMetaSchema,
  RecurringSummarySchema,
  updateRecurringTransactionSchema,
  deleteRecurringTransactionSchema,
  updateRecurringTransactionRequestSchema,
} from "./recurringTransaction.schema";
import { validate } from "../../core/middlewares/validate";
import { financeRegistry } from "../../core/lib/swagger";
import { z } from "zod";

const router = Router();

// createRecurringTransaction /api/recurring-transactions/{userId} POST
financeRegistry.registerPath({
  method: "post",
  path: "/api/recurring-transactions/{userId}",
  summary: "Create a new recurring transaction for a user",
  description:
    "Creates a template for automated future transactions. For MONTHLY: dayOfMonth is required. For WEEKLY: dayOfWeek is required.",
  tags: ["Recurring Transactions"],
  request: {
    params: z.object({
      userId: z
        .string()
        .uuid()
        .openapi({ example: "987cdba2-bd96-41be-8cd4-fe60074810a8" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: RecurringTransactionBodySchema,
        },
      },
    },
  },
  responses: {
    "201": {
      description: "Recurring template created successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({
              example: "Recurring transaction created successfully",
            }),
            newRecurringTransaction: RecurringTransactionSchema,
          }),
        },
      },
    },
    "400": {
      description:
        "Validation error (e.g., Missing dayOfMonth for MONTHLY frequency)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "dayOfMonth is required for MONTHLY frequency",
            }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "404": {
      description: "User not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The record you are looking for was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.post(
  "/:userId",
  validate(createRecurringTransactionSchema),
  createRecurringTransaction,
);

// getRecurringTransactions /api/recurring-transactions/{userId} GET
financeRegistry.registerPath({
  method: "get",
  path: "/api/recurring-transactions/{userId}",
  summary: "Get recurring transactions with financial summary",
  description:
    "Fetches user's recurring templates with pagination and calculates estimated monthly/weekly projections.",
  tags: ["Recurring Transactions"],
  request: {
    params: getRecurringTransactionsSchema.shape.params,
    query: getRecurringTransactionsSchema.shape.query,
  },
  responses: {
    "200": {
      description: "Successfully fetched transactions",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({
                example: "Recurring transactions fetched successfully",
              }),
            data: z.array(RecurringTransactionSchema),
            summary: RecurringSummarySchema,
            meta: PaginationMetaSchema,
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid query parameters)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Invalid page or limit parameter" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "404": {
      description: "User not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({
                example: "The record you are looking for was not found.",
              }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/:userId",
  validate(getRecurringTransactionsSchema),
  getRecurringTransactions,
);

// updateRecurringTransaction /api/recurring-transactions/{userId}/{transactionId} PATCH
financeRegistry.registerPath({
  method: "patch",
  path: "/api/recurring-transactions/{userId}/{transactionId}",
  summary: "Update a recurring transaction",
  description:
    "Updates an existing recurring transaction. For MONTHLY: dayOfMonth is required. For WEEKLY: dayOfWeek is required.",
  tags: ["Recurring Transactions"],
  request: {
    params: updateRecurringTransactionRequestSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: updateRecurringTransactionRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Recurring transaction updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({
                example: "Recurring transaction updated successfully",
              }),
            data: updateRecurringTransactionSchema,
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid frequency data)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({
                example: "dayOfWeek is required for WEEKLY frequency",
              }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "404": {
      description: "Recurring transaction or User not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({
                example: "The record you are looking for was not found.",
              }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.patch(
  "/:userId/:transactionId",
  validate(updateRecurringTransactionSchema),
  updateRecurringTransaction,
);

// deleteRecurringTransaction /api/recurring-transactions/{userId}/{transactionId} DELETE
financeRegistry.registerPath({
  method: "delete",
  path: "/api/recurring-transactions/{userId}/{transactionId}",
  summary: "Delete a recurring transaction",
  tags: ["Recurring Transactions"],
  request: {
    params: deleteRecurringTransactionSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Recurring transaction deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({
              example: "Recurring transaction deleted successfully",
            }),
          }),
        },
      },
    },
    "404": {
      description: "Recurring transaction or User not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "The record you are looking for was not found." }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.delete(
  "/:userId/:transactionId",
  validate(deleteRecurringTransactionSchema),
  deleteRecurringTransaction,
);

export default router;
