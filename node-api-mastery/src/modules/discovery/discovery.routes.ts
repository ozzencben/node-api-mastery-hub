import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { modules } from "./discovery.data";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5; // Sayfa başı 5 modül yeterli şimdilik

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = modules.slice(startIndex, endIndex);

    res.json({
      data: results,
      pagination: {
        total: modules.length,
        page,
        limit,
        totalPages: Math.ceil(modules.length / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
