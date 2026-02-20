import { APIError } from "../utils/APIError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: APIError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error instanceof APIError ? error.statusCode : 500;
  const message = error.message || "Internal Server Error";

  console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);

  res.status(statusCode).json({
    message: message,
    success: false,
    status: statusCode,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
