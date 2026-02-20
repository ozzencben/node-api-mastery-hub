import { z } from "zod";
import { Category, TransactionType, FrequencyType } from "@prisma/client";
import { financeRegistry } from "../../core/lib/swagger";

export const RecurringTransactionSchema = financeRegistry.register(
  "RecurringTransaction",
  z.object({
    id: z
      .string()
      .uuid()
      .openapi({ example: "987cdba2-bd96-41be-8cd4-fe60074810a8" }),
    amount: z.number().min(0.01).openapi({ example: 10000 }),
    type: z.enum(TransactionType).openapi({ example: "EXPENSE" }),
    category: z.enum(Category).openapi({ example: "RENT" }),
    description: z.string().optional().openapi({ example: "House rent" }),
    frequency: z.enum(FrequencyType).openapi({
      example: "MONTHLY",
    }),
    dayOfMonth: z.number().min(1).max(31).optional().openapi({ example: 1 }),
    dayOfWeek: z.number().min(0).max(6).optional().openapi({
      example: 1,
      description: "0: Sunday, 1: Monday, etc.",
    }),
  }),
);

export const RecurringTransactionBodySchema = z
  .object({
    amount: z.number().min(0.01).openapi({ example: 10000 }),
    type: z.enum(TransactionType).openapi({ example: "EXPENSE" }),
    category: z.enum(Category).openapi({ example: "RENT" }),
    description: z.string().optional().openapi({ example: "House rent" }),
    frequency: z.enum(FrequencyType).openapi({
      example: "MONTHLY",
    }),
    dayOfMonth: z
      .number()
      .min(1)
      .max(31)
      .default(1)
      .optional()
      .openapi({ example: 1 }),
    dayOfWeek: z.number().min(0).max(6).default(1).optional().openapi({
      example: 1,
      description: "0: Sunday, 1: Monday, etc.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.frequency === "MONTHLY" && !data.dayOfMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Monthly transactions require a dayOfMonth (1-31).",
        path: ["dayOfMonth"],
      });
    }

    if (data.frequency === "WEEKLY" && data.dayOfWeek === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Weekly transactions require a dayOfWeek (0-6).",
        path: ["dayOfWeek"],
      });
    }
  });

export const createRecurringTransactionSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: RecurringTransactionBodySchema,
});

export const getRecurringTransactionsSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z
      .enum(["createdAt", "amount", "frequency", "type"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

// Summary Objesi Şeması
export const RecurringSummarySchema = z.object({
  estimatedMonthlyNet: z.number(),
  estimatedWeeklyNet: z.number(),
  estimedMonthlyIncome: z.number(),
  estimatedMonthlyExpense: z.number(),
  estimatedWeeklyIncome: z.number(),
  estimatedWeeklyExpense: z.number(),
});

// Meta Bilgisi Şeması
export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const updateRecurringTransactionSchema = RecurringTransactionSchema.omit(
  {
    id: true,
  },
)
  .partial()
  .extend({
    isActive: z.boolean().optional().openapi({ example: true }),
  });

export const updateRecurringTransactionRequestSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
    transactionId: z.string().uuid(),
  }),
  body: updateRecurringTransactionSchema,
});

export const deleteRecurringTransactionSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
    transactionId: z.string().uuid(),
  }),
});
