import { Request, Response, NextFunction } from "express";
import { APIError } from "../../core/utils/APIError";
import prisma from "../../core/lib/prisma";
import {
  CreateTaskSchema,
  TaskHeaderSchema,
  TaskQuerySchema,
  UpdateTaskSchema,
  BulkDeleteTasksSchema,
} from "./task.schema";
import { z } from "zod";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const body = req.body as z.infer<typeof CreateTaskSchema>;

    const task = await prisma.task.create({
      data: {
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as z.infer<
      typeof TaskHeaderSchema
    >["x-user-id"];

    const {
      status,
      priority,
      category,
      search,
      page = 1,
      limit = 10,
    } = req.query as unknown as z.infer<typeof TaskQuerySchema>;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const where = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const taskId = req.params["taskId"] as string;
    const body = req.body as z.infer<typeof UpdateTaskSchema>["body"];

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId: userId,
      },
      data: {
        ...body,
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
      },
    });

    res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const taskId = req.params["taskId"] as string;

    await prisma.task.delete({
      where: {
        id: taskId,
        userId: userId,
      },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const taskStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    const [
      statusStats,
      priorityStats,
      categoryStats,
      overdueCount,
      overdueTasksDetay,
      totalCount,
    ] = await Promise.all([
      prisma.task.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
        where: {
          userId,
        },
      }),
      prisma.task.groupBy({
        by: ["priority"],
        _count: {
          _all: true,
        },
        where: {
          userId,
        },
      }),
      prisma.task.groupBy({
        by: ["category"],
        _count: {
          _all: true,
        },
        where: {
          userId,
        },
      }),
      prisma.task.count({
        where: {
          userId,
          status: { not: "COMPLETED" },
          dueDate: {
            lt: new Date(),
          },
        },
        orderBy: {
          dueDate: "asc",
        },
      }),
      prisma.task.findMany({
        where: {
          userId,
          status: { not: "COMPLETED" },
          dueDate: {
            lt: new Date(),
          },
        },
        select: {
          title: true,
          dueDate: true,
        },
        orderBy: {
          dueDate: "asc",
        },
      }),
      prisma.task.count({
        where: {
          userId,
        },
      }),
    ]);

    res.status(200).json({
      message: "Task stats fetched successfully",
      stats: {
        total: totalCount,
        byStatus: statusStats.map((s) => ({
          type: s.status,
          count: s._count._all,
        })),
        byPriority: priorityStats.map((p) => ({
          type: p.priority,
          count: p._count._all,
        })),
        byCategory: categoryStats.map((c) => ({
          type: c.category,
          count: c._count._all,
        })),
        overdue: overdueCount,
        overdueTasks: overdueTasksDetay,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getDailyFocus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: "COMPLETED" },
      },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    });

    res.status(200).json({
      message: tasks.length <= 0 ? "No tasks today" : "Tasks fetched",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const { taskIds } = req.body;

    const result = await prisma.task.deleteMany({
      where: {
        id: { in: taskIds },
        userId: userId,
      },
    });

    res.status(200).json({
      message: "Tasks deleted successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    next(error);
  }
};
