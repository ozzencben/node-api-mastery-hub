import { z } from "zod";
import { businnessRegistry } from "../../core/lib/swagger";

export const CATEGORIES = [
  "Technology",
  "Health",
  "Beauty",
  "Education",
  "Sports",
] as const;

// Business Schema
export const createBusinessBodySchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name must be at most 100 characters long")
    .trim()
    .openapi({ example: "Tech Solutions Inc." }),
  category: z.enum(CATEGORIES).openapi({ example: "Technology" }),
  description: z.string().optional().openapi({
    example: "A leading provider of tech solutions.",
  }),
  workingHours: z
    .string()
    .regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, "The format should be 09:00-18:00.")
    .openapi({
      example: "09:00-18:00",
    }),
});

export const createBusinessHeaderSchema = z.object({
  "x-user-id": z
    .string()
    .uuid()
    .describe("[User ID] The ID of the user who owns the business")
    .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
});

export const createBusinessRequestSchema = z.object({
  body: createBusinessBodySchema,
  headers: createBusinessHeaderSchema.passthrough(),
});

export const getBusinessRequestSchema = z.object({
  headers: z
    .object({
      "x-user-id": z
        .string()
        .uuid()
        .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
    })
    .passthrough(),
});

export const updateBusinessBodySchema = z.object({
  body: createBusinessBodySchema.partial(),
  headers: createBusinessHeaderSchema.passthrough(),
  params: z.object({
    businessId: z
      .string()
      .uuid()
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  }),
});

export const deleteBusinessRequestSchema = z.object({
  headers: createBusinessHeaderSchema.passthrough(),
  params: z.object({
    businessId: z
      .string()
      .uuid()
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  }),
});

// Service Schemas
export const createServiceBodySchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name must be at most 100 characters long")
    .trim()
    .openapi({ example: "Software Development" }),
  description: z.string().optional().openapi({
    example: "We offer custom software development services.",
  }),
  duration: z
    .number()
    .int("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute")
    .positive("Duration must be a positive number")
    .openapi({ example: 30 }),
  price: z
    .number()
    .positive("Price must be a positive number")
    .describe("Price in USD/TRY")
    .openapi({ example: 1000 }),
  businessId: z
    .string()
    .uuid()
    .describe("[Business ID] The ID of the business that offers this service")
    .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
});

export const createServiceHeaderSchema = z.object({
  "x-user-id": z
    .string()
    .uuid()
    .describe("[User ID] The ID of the user who owns the business")
    .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
});

export const createServiceRequestSchema = z.object({
  body: createServiceBodySchema,
  headers: createServiceHeaderSchema.passthrough(),
});

export const getServicesByBusinessRequestSchema = z.object({
  headers: z
    .object({
      "x-user-id": z
        .string()
        .uuid()
        .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
    })
    .passthrough(),
});

export const getServicesByBusinessParamsSchema = z
  .object({
    businessId: z
      .string()
      .uuid()
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  })
  .passthrough();

export const updateServiceBodySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name must be at least 1 character long")
      .max(100, "Name must be at most 100 characters long")
      .trim()
      .optional()
      .openapi({ example: "Software Development" }),
    description: z.string().optional().openapi({
      example: "We offer custom software development services.",
    }),
    duration: z
      .number()
      .int("Duration must be an integer")
      .min(1, "Duration must be at least 1 minute")
      .positive("Duration must be a positive number")
      .optional()
      .openapi({ example: 30 }),
    price: z
      .number()
      .positive("Price must be a positive number")
      .describe("Price in USD/TRY")
      .optional()
      .openapi({ example: 1000 }),
  }),
  headers: createServiceHeaderSchema.passthrough(),
  params: z.object({
    serviceId: z
      .string()
      .uuid()
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  }),
});

export const deleteServiceRequestSchema = z.object({
  headers: createServiceHeaderSchema.passthrough(),
  params: z.object({
    serviceId: z
      .string()
      .uuid()
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  }),
});

// Appointment Schemas
