import prisma from "../../core/lib/prisma";
import { Request, Response, NextFunction } from "express";
import { Category } from "@prisma/client";

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { amount, type, category, description } = req.body;
    const { userId } = req.params as { userId: string };

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: amount,
        type: type,
        category: category,
        description: description,
        user: { connect: { id: userId } },
      },
    });

    res
      .status(201)
      .json({ message: "Transaction created successfully", newTransaction });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params as { userId: string };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const type = req.query.type as "INCOME" | "EXPENSE" | undefined;
    const category = req.query.category as Category | undefined;

    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const where: any = {
      userId,
      ...(type && { type }),
      ...(category && { category }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    const [transactions, totalCount, allStats] = await Promise.all([
      prisma.transaction.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.groupBy({
        by: ["type"],
        where,
        _sum: {
          amount: true,
        },
      }),
    ]);

    const summary = {
      totalIncome: allStats.find((s) => s.type === "INCOME")?._sum.amount || 0,
      totalExpense:
        allStats.find((s) => s.type === "EXPENSE")?._sum.amount || 0,
    };

    const balance = summary.totalIncome - summary.totalExpense;

    res.status(200).json({
      success: true,
      data: transactions,
      summary: { ...summary, balance },
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, transactionId } = req.params as {
      userId: string;
      transactionId: string;
    };

    await prisma.transaction.delete({
      where: {
        id: transactionId,
        userId,
      },
    });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
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

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
        userId,
      },
      data: updatedData,
    });

    res.status(200).json({
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};
