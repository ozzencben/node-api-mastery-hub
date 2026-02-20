import prisma from "../../core/lib/prisma";
import { Request, Response, NextFunction } from "express";
import { Category } from "@prisma/client";
import da from "zod/v4/locales/da.js";

// Create a new recurring transaction /api/recurring-transactions/{userId} [POST]
export const createRecurringTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params as { userId: string };
    const {
      amount,
      type,
      category,
      description,
      frequency,
      dayOfMonth,
      dayOfWeek,
    } = req.body;

    const newRecurringTransaction = await prisma.recurringTransaction.create({
      data: {
        amount: amount,
        type: type,
        category: category as Category,
        description: description,
        frequency: frequency,
        dayOfMonth: dayOfMonth,
        dayOfWeek: dayOfWeek,
        userId,
      },
    });

    res.status(201).json({
      message: "Recurring transaction created successfully",
      newRecurringTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// Get all recurring transactions for a user /api/recurring-transactions/{userId} [GET]
export const getRecurringTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params as { userId: string };
    const { page = 1, limit = 10 } = req.query as {
      page?: string;
      limit?: string;
    };

    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder =
      (req.query.sortOrder as string) === "desc" ? "desc" : "asc";

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [recurrings, total, allActiveTemplates] = await Promise.all([
      prisma.recurringTransaction.findMany({
        where: { userId },
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.recurringTransaction.count({
        where: { userId },
      }),
      prisma.recurringTransaction.findMany({
        where: { userId, isActive: true },
      }),
    ]);

    let totalMonthlyIncome = 0;
    let totalMonthlyExpense = 0;
    let totalWeeklyIncome = 0;
    let totalWeeklyExpense = 0;

    allActiveTemplates.forEach((template) => {
      if (template.frequency === "MONTHLY") {
        if (template.type === "INCOME") {
          totalMonthlyIncome += template.amount;
        } else {
          totalMonthlyExpense += template.amount;
        }
      } else if (template.frequency === "WEEKLY") {
        if (template.type === "INCOME") {
          totalWeeklyIncome += template.amount;
        } else {
          totalWeeklyExpense += template.amount;
        }
      }
    });

    res.status(200).json({
      message: "Recurring transactions fetched successfully",
      data: recurrings,
      summary: {
        estimatedMonthlyNet:
          totalMonthlyIncome +
          totalWeeklyIncome * 4 -
          (totalMonthlyExpense + totalWeeklyExpense * 4),
        estimatedWeeklyNet: totalWeeklyIncome - totalWeeklyExpense,
        estimedMonthlyIncome: totalMonthlyIncome,
        estimatedMonthlyExpense: totalMonthlyExpense,
        estimatedWeeklyIncome: totalWeeklyIncome,
        estimatedWeeklyExpense: totalWeeklyExpense,
      },
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a recurring transaction /api/recurring-transactions/{userId}/{transactionId} [PUT]
export const updateRecurringTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, transactionId } = req.params as {
      userId: string;
      transactionId: string;
    };
    const updatedData = req.body;

    const updatedRecurringTransaction =
      await prisma.recurringTransaction.update({
        where: {
          id: transactionId,
          userId,
        },
        data: updatedData,
      });

    res.status(200).json({
      message: "Recurring transaction updated successfully",
      data: updatedRecurringTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a recurring transaction /api/recurring-transactions/{userId}/{transactionId} [DELETE]
export const deleteRecurringTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, transactionId } = req.params as {
      userId: string;
      transactionId: string;
    };

    await prisma.recurringTransaction.delete({
      where: {
        id: transactionId,
        userId,
      },
    });

    res.status(200).json({
      message: "Recurring transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
