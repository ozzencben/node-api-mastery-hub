import prisma from "../../core/lib/prisma";
import { Request, Response, NextFunction } from "express";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, name } = req.body;

    const newUser = await prisma.user.create({ data: { email, name } });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search ? String(req.query.search) : undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";

    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    const skip = (page - 1) * limit;

    const whereConditions = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { name: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.user.count({
        where: whereConditions,
      }),
    ]);

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
