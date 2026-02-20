import { z } from "zod";
import { financeRegistry } from "../../core/lib/swagger";
import { Category, TransactionType } from "@prisma/client";

export const TransactionSchema = financeRegistry.register(
  "Transaction",
  z.object({
    id: z
      .string()
      .uuid()
      .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
    amount: z.number().min(0.01).openapi({ example: "1200.99" }),
    type: z.enum(TransactionType).openapi({ example: "INCOME" }),
    category: z.enum(Category).openapi({ example: "OTHER" }),
    description: z.string().optional().openapi({ example: "Groceries" }),
    date: z.date().openapi({ example: "2026-02-19T10:00:00Z" }),
    createdAt: z.date().openapi({ example: "2026-02-19T10:00:00Z" }),
  }),
);

export const createTransactionBodySchema = z
  .object({
    amount: z.number().min(0.01).openapi({ example: 12.99 }),
    type: z.enum(["INCOME", "EXPENSE"]).openapi({
      example: "EXPENSE",
      description: "Transaction type: INCOME or EXPENSE",
    }),
    category: z.nativeEnum(Category).openapi({
      example: "FOOD",
      description:
        "Allowed for INCOME: SALARY, OTHER. Allowed for EXPENSE: FOOD, RENT, etc.", // Buraya not düşüyoruz
    }),
    description: z.string().optional(),
  })
  .openapi("CreateTransactionBody");

export const createTransactionSchema = z.object({
  body: z
    .object({
      amount: z.number().min(0.01).openapi({ example: 12.99 }),
      type: z.enum(TransactionType).openapi({ example: "EXPENSE" }),
      category: z.nativeEnum(Category).openapi({ example: "FOOD" }),
      description: z.string().optional().openapi({ example: "Groceries" }),
    })
    .superRefine((data, ctx) => {
      const { type, category } = data;

      const incomeCategories: Category[] = [Category.SALARY, Category.OTHER];
      const expenseCategories: Category[] = [
        Category.FOOD,
        Category.TRANSPORT,
        Category.RENT,
        Category.UTILITIES,
        Category.SHOPPING,
        Category.HEALTH,
        Category.ENTERTAINMENT,
      ];

      if (type === "INCOME" && !incomeCategories.includes(category)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `The ${category} category cannot be used in INCOME transactions.`,
          path: ["body", "category"],
        });
      }

      if (type === "EXPENSE" && !expenseCategories.includes(category)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `The ${category} category cannot be used in EXPENSE transactions.`,
          path: ["body", "category"],
        });
      }
    }),
  params: z.object({ userId: z.string().uuid() }),
});

export const getTransactionsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    type: z.enum(TransactionType).optional(),
    category: z.nativeEnum(Category).optional(),
    sstartDate: z.string().datetime().optional().openapi({
      example: "2026-02-01T00:00:00Z",
      description: "Start date in ISO 8601 format",
    }),
    endDate: z.string().datetime().optional().openapi({
      example: "2026-02-28T23:59:59Z",
      description: "ISO 8601 format expiry date",
    }),
  }),
  params: z.object({ userId: z.string().uuid() }),
});

export const deleteTransactionSchema = z.object({
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ example: "1e2107f6-ece4-4418-9a04-51e1b7b2eba9" }),
    transactionId: z
      .string()
      .uuid()
      .openapi({ example: "1e2107f6-ece4-4418-9a04-51e1b7b2eba9" }),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().min(0.01).openapi({ example: 12.99 }),
    type: z.enum(TransactionType).optional().openapi({ example: "EXPENSE" }),
    category: z.nativeEnum(Category).optional().openapi({ example: "FOOD" }),
    description: z.string().optional().openapi({ example: "Groceries" }),
  }),
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ example: "1e2107f6-ece4-4418-9a04-51e1b7b2eba9" }),
    transactionId: z
      .string()
      .uuid()
      .openapi({ example: "1e2107f6-ece4-4418-9a04-51e1b7b2eba9" }),
  }),
});
