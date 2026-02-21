import { z } from "zod";
import { userRegistry } from "../../core/lib/swagger";

export const UserSchema = userRegistry.register(
  "User",
  z.object({
    id: z
      .string()
      .uuid()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    name: z.string().min(3).openapi({ example: "Özenç Donmezer" }),
    email: z.string().email().openapi({ example: "ozenc@test.com" }),
    phone: z.string().min(10).max(15).openapi({ example: "05551112233" }),
    createdAt: z.date().openapi({ example: "2026-02-19T10:00:00Z" }),
  }),
);

export const getUserQuerySchema = z.object({
  query: z.object({
    sortBy: z.enum(["email", "name", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters")
      .openapi({ example: "Ozenc Donmezer" }),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email")
      .openapi({
        example: "ozzenc@example.com",
      }),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number must be at most 15 characters")
      .openapi({ example: "555-555-5555" }),
  }),
});

userRegistry.register("CreateUserInput", createUserSchema.shape.body);
