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

export const getBusinessAppointmentsSchema = z.object({
  headers: z
    .object({
      "x-user-id": z
        .string()
        .uuid()
        .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
    })
    .passthrough(),
  params: z.object({
    businessId: z.string().uuid().describe("Business ID"),
  }),
  query: z.object({
    status: z
      .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
      .optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("YYYY-MM-DD"),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  params: z.object({
    appointmentId: z
      .string()
      .uuid()
      .describe("Appointment ID")
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
    businessId: z
      .string()
      .uuid()
      .describe("Business ID")
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  }),
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).openapi({
      example: "CONFIRMED",
    }),
  }),
});

export const updateAppointmentHeaderSchema = z.object({
  "x-user-id": z
    .string()
    .uuid()
    .describe("[User ID] The ID of the user who owns the business")
    .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
});

export const getBusinessDashboardSchema = z.object({
  headers: z
    .object({
      "x-user-id": z
        .string()
        .uuid()
        .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
    })
    .passthrough(),
  params: z.object({
    businessId: z
      .string()
      .uuid()
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  }),
});

export const getBusinessesByUserRequestSchema = z.object({
  query: z.object({
    category: z.enum(CATEGORIES).optional().openapi({ example: "Technology" }),
    search: z.string().optional().openapi({ example: "Software" }),
    // String olarak gelse bile number'a dönüştür:
    page: z.coerce.number().int().min(1).optional().openapi({ example: 1 }),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .openapi({ example: 10 }),
  }),
});

export const getBusinessByIdRequestSchema = z.object({
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

export const appointmentResponseSchema = z.object({
  id: z.string().uuid(),
  startTime: z.date().or(z.string()), // Prisma'dan gelen tarih objesi veya string
  endTime: z.date().or(z.string()),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  businessId: z.string().uuid(),
  serviceId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  guestName: z.string().nullable(),
  guestPhone: z.string().nullable(),
  createdAt: z.date().or(z.string()),
});

export const createAppointmentBodySchema = z.object({
  businessId: z.string().uuid().openapi({ example: "business-uuid-here" }),
  serviceId: z.string().uuid().openapi({ example: "service-uuid-here" }),
  // .datetime() yerine sadece z.string() kullanıp manuel doğrula veya
  // Zod'un daha esnek olan .pipe() zincirini kullan:
  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid ISO datetime format",
    })
    .openapi({ example: "2026-02-21T15:30:00" }),
  guestName: z.string().optional().openapi({ example: "Özenç Dönmezer" }),
  guestPhone: z.string().optional().openapi({ example: "05551112233" }),
});

export const createAppointmentRequestSchema = z.object({
  body: createAppointmentBodySchema,
  headers: z
    .object({
      "x-user-id": z
        .string()
        .uuid()
        .optional()
        .describe("Optional: Provide if user is logged in"),
    })
    .passthrough(),
});

export const appointmentAvailabilityQuerySchema = z.object({
  businessId: z
    .string()
    .uuid()
    .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  serviceId: z
    .string()
    .uuid()
    .openapi({ example: "2313346a-e366-4f16-8878-0f36a391e921" }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format")
    .openapi({ example: "2026-02-21" }),
});

export const getUserAppointmentsSchema = z.object({
  headers: z
    .object({
      "x-user-id": z
        .string()
        .uuid()
        .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
    })
    .passthrough(),
});

export const cancelAppointmentRequestSchema = z.object({
  headers: z
    .object({
      "x-user-id": z
        .string()
        .uuid()
        .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
    })
    .passthrough(),
  params: z.object({
    appointmentId: z
      .string()
      .uuid()
      .openapi({ example: "3a83088c-d839-47a6-a6f3-8a694711023e" }),
  }),
});
