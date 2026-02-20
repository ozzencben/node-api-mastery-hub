import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { APIError } from "../utils/APIError";

export const validate =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((issue) => {
            const path = issue.path[1] || issue.path[0];
            return `${String(path)}: ${issue.message}`;
          })
          .join(", ");

        return next(new APIError(errorMessages, 400));
      }

      return next(error);
    }
  };
