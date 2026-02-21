import { Router } from "express";
import { validate } from "../../core/middlewares/validate";
import { financeRegistry } from "../../core/lib/swagger";
import {
  createTransactionSchema,
  createTransactionBodySchema,
  getTransactionsSchema,
  deleteTransactionSchema,
  updateTransactionSchema,
  TransactionSchema,
} from "./finance.schema";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "./finance.controller";
import { z } from "zod";

const router = Router();

// createTransaction /api/finances/{userId} POST
financeRegistry.registerPath({
  method: "post",
  path: "/api/finances/{userId}",
  summary: "Create a new transaction",
  tags: ["Transaction"],
  request: {
    params: createTransactionSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: createTransactionBodySchema,
        },
      },
    },
  },
  responses: {
    "201": {
      description: "Transaction created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: {
                type: "string",
                example: "Transaction recorded successfully",
              },
              data: { $ref: "#/components/schemas/Transaction" }, // TransactionSchema referansın
            },
          },
        },
      },
    },
    "400": {
      description:
        "Validation Error (e.g., Invalid category or negative amount)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: {
                type: "string",
                example: "Invalid category for transaction type INCOME",
              },
            },
          },
        },
      },
    },
    "404": {
      description: "User not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: {
                type: "string",
                example: "The specified User ID does not exist",
              },
            },
          },
        },
      },
    },
  },
});

router.post("/:userId", validate(createTransactionSchema), createTransaction);

// getTransactions /api/finances/{userId} GET
financeRegistry.registerPath({
  method: "get",
  path: "/api/finances/{userId}",
  summary: "Get all transactions for a user with summary and pagination",
  tags: ["Transaction"],
  request: {
    params: getTransactionsSchema.shape.params,
    query: getTransactionsSchema.shape.query,
  },
  responses: {
    "200": {
      description: "List of transactions",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            summary: z.object({
              totalIncome: z.number().openapi({ example: 1000 }),
              totalExpense: z.number().openapi({ example: 500 }),
              balance: z.number().openapi({ example: 500 }),
            }),
            data: z.array(TransactionSchema).openapi({
              example: [
                {
                  id: "1e2107f6-ece4-4418-9a04-51e1b7b2eba9",
                  amount: 12.99,
                  type: "EXPENSE",
                  category: "FOOD",
                  description: "Groceries",
                  date: "2026-02-19T10:00:00Z",
                  createdAt: "2026-02-19T10:00:00Z",
                },
              ],
            }),
            meta: z.object({
              page: z.number().openapi({ example: 1 }),
              limit: z.number().openapi({ example: 10 }),
              totalCount: z.number().openapi({ example: 10 }),
              totalPages: z.number().openapi({ example: 1 }),
            }),
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid query params)",
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
router.get("/:userId", validate(getTransactionsSchema), getTransactions);

// updateTransaction /api/finances/{userId}/{transactionId} DELETE
financeRegistry.registerPath({
  method: "delete",
  path: "/api/finances/{userId}/{transactionId}",
  summary: "Delete a transaction",
  tags: ["Transaction"],
  request: {
    params: deleteTransactionSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Transaction deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Transaction deleted successfully" }),
          }),
        },
      },
    },
    "404": {
      description: "Transaction or User not found",
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
router.delete(
  "/:userId/:transactionId",
  validate(deleteTransactionSchema),
  deleteTransaction,
);

// updateTransaction /api/finances/{userId}/{transactionId} PATCH
financeRegistry.registerPath({
  method: "patch",
  path: "/api/finances/{userId}/{transactionId}",
  summary: "Update a transaction",
  tags: ["Transaction"],
  request: {
    params: updateTransactionSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: updateTransactionSchema.shape.body,
        },
      },
    },
  },
  responses: {
    "200": {
      description: "Transaction updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Transaction updated successfully" }),
            data: TransactionSchema,
          }),
        },
      },
    },
    "400": {
      description: "Validation error or invalid update data",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Invalid category or transaction data" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "404": {
      description: "Transaction or User not found",
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
router.patch(
  "/:userId/:transactionId",
  validate(updateTransactionSchema),
  updateTransaction,
);

export default router;
