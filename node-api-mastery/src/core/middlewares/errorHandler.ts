import { APIError } from "../utils/APIError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any, // APIError dışındaki hataları da yakalamak için 'any' yaptık
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // 1. Kendi fırlattığın APIError'ları işle
  if (error instanceof APIError) {
    statusCode = error.statusCode;
    message = error.message;
  } 
  // 2. Prisma Unique Constraint (Zaten var olan kayıt) Hatası
  else if (error.code === "P2002") {
    statusCode = 400;
    const target = error.meta?.target || "field";
    message = `This ${target} is already in use. Please try another one.`;
  }
  // 3. Prisma Kayıt Bulunamadı Hatası
  else if (error.code === "P2025") {
    statusCode = 404;
    message = "The record you are looking for was not found.";
  }

  console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message: message, // Artık kullanıcı "P2002" yerine bu mesajı görecek
    status: statusCode,
    // Sadece development ortamında teknik detayı göster
    ...(process.env.NODE_ENV === "development" && { 
       error: error.name,
       prismaCode: error.code,
       stack: error.stack 
    }),
  });
};