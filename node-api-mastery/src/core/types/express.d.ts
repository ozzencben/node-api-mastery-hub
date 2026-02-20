import { User } from "@prisma/client";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {}; // Bu dosyanın bir modül olarak algılanması için şart
