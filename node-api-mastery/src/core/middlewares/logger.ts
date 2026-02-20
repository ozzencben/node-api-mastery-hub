import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { APIError } from "../utils/APIError";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - startTime;

    const { method, url, ip } = req;
    const { statusCode } = res;

    // try {
    //   await prisma.apiLog.create({
    //     data: {
    //       method: method,
    //       endpoint: url,
    //       status: statusCode,
    //       duration: duration,
    //     },
    //   });
    // } catch (error) {
    //   console.error(error);
    // }

    if (statusCode >= 500) {
      console.warn(
        `[SERVER ERROR] ${method} ${url} ${ip} ${statusCode} - ${duration}`,
      );
    } else if (statusCode >= 400) {
      console.error(
        `[INVALID REQUEST] ${method} ${url} ${ip} ${statusCode} - ${duration}`,
      );
    } else
      console.log(
        `[${new Date().toISOString()}] ${method} ${url} ${ip} ${statusCode} - ${duration}`,
      );
  });

  next();
};
