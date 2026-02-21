import { Router } from "express";
import { validate } from "../../core/middlewares/validate";
import {
  createBusinessHandler,
  createServiceHandler,
  getBusinessHandler,
  getServicesByBusinessHandler,
  updateBusinessHandler,
  updateServiceHandler,
  deleteBusinessHandler,
  deleteServiceHandler,
  createAppointmentHandler,
  getAvailabilityHandler,
  getBusinessAppointmentsHandler,
  updateAppointmentStatusHandler,
  getBusinessDashboardHandler,
  getUserAppointmentsHandler,
  cancelAppointmentHandler,
  getBusinessesHandler,
  getBusinessDetailsHandler,
} from "./business.controller";
import {
  createBusinessBodySchema,
  createBusinessHeaderSchema,
  createBusinessRequestSchema,
  createServiceRequestSchema,
  createServiceBodySchema,
  createServiceHeaderSchema,
  getBusinessRequestSchema,
  getServicesByBusinessRequestSchema,
  getServicesByBusinessParamsSchema,
  updateBusinessBodySchema,
  updateServiceBodySchema,
  deleteBusinessRequestSchema,
  deleteServiceRequestSchema,
  createAppointmentBodySchema,
  createAppointmentRequestSchema,
  appointmentResponseSchema,
  appointmentAvailabilityQuerySchema,
  getBusinessAppointmentsSchema,
  updateAppointmentStatusSchema,
  updateAppointmentHeaderSchema,
  getBusinessDashboardSchema,
  getUserAppointmentsSchema,
  cancelAppointmentRequestSchema,
  getBusinessesByUserRequestSchema,
  getBusinessByIdRequestSchema,
} from "./business.schema";
import { businnessRegistry } from "../../core/lib/swagger";
import { z } from "zod";

const router = Router();

// Business Routes
// createBusiness /api/businesses POST
businnessRegistry.registerPath({
  method: "post",
  path: "/api/businesses",
  summary: "Create a new business",
  tags: ["Business"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createBusinessBodySchema,
        },
      },
    },
    headers: createBusinessHeaderSchema,
  },
  responses: {
    "201": {
      description: "Business created successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Business created successfully" }),
            data: z.any(), // Buraya istersen BusinessSchema'nı koyabilirsin
          }),
        },
      },
    },
    "400": {
      description: "Validation error or business already exists",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "This business name is already in use." }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing or invalid userId in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.post("/", validate(createBusinessRequestSchema), createBusinessHandler);

// getBusiness /api/businesses GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses",
  summary: "Get a business by user ID",
  tags: ["Business"],
  request: {
    headers: getBusinessRequestSchema.shape.headers,
  },
  responses: {
    "200": {
      description: "Business retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Business details fetched successfully" }),
            data: z.any(), // Buraya varsa BusinessSchema objeni koyabilirsin
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Business not found for this user",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "No business found associated with this user.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get("/", validate(getBusinessRequestSchema), getBusinessHandler);

// updateBusiness /api/businesses PATCH
businnessRegistry.registerPath({
  method: "patch",
  path: "/api/businesses/{businessId}",
  summary: "Update a business by business ID",
  tags: ["Business"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateBusinessBodySchema.shape.body,
        },
      },
    },
    headers: updateBusinessBodySchema.shape.headers,
    params: updateBusinessBodySchema.shape.params,
  },
  responses: {
    "200": {
      description: "Business updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Business updated successfully" }),
            data: z.any(), // Varsa BusinessSchema'nı buraya gömebilirsin
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid body data or params)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Invalid data provided for update" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Business not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The business you are trying to update was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.patch(
  "/:businessId",
  validate(updateBusinessBodySchema),
  updateBusinessHandler,
);

// deleteBusiness /api/businesses/:businessId DELETE
businnessRegistry.registerPath({
  method: "delete",
  path: "/api/businesses/{businessId}",
  summary: "Delete a business by business ID",
  tags: ["Business"],
  request: {
    headers: deleteBusinessRequestSchema.shape.headers,
    params: deleteBusinessRequestSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Business deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({
              example: "Business and associated data deleted successfully",
            }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Business not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example:
                "The business record you are trying to delete was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.delete(
  "/:businessId",
  validate(deleteBusinessRequestSchema),
  deleteBusinessHandler,
);

// getBusinessAppointments /api/businesses/:businessId/appointments GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses/{businessId}/appointments",
  summary: "Get all appointments for a business",
  tags: ["Business"],
  request: {
    headers: getBusinessAppointmentsSchema.shape.headers,
    params: getBusinessAppointmentsSchema.shape.params,
    query: getBusinessAppointmentsSchema.shape.query,
  },
  responses: {
    "200": {
      description: "Appointments retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Appointments fetched successfully" }),
            data: z.array(appointmentResponseSchema),
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid query or params)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Invalid date range or business ID format" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Business or Appointments not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "No appointments found for this business." }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/:businessId/appointments",
  validate(getBusinessAppointmentsSchema),
  getBusinessAppointmentsHandler,
);

// updateAppointmentStatus /api/businesses/:businessId/appointments/:appointmentId/status PATCH
businnessRegistry.registerPath({
  method: "patch",
  path: "/api/businesses/{businessId}/appointments/{appointmentId}/status",
  summary: "Update the status of an appointment by appointment ID",
  tags: ["Business"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateAppointmentStatusSchema.shape.body,
        },
      },
    },
    headers: updateAppointmentHeaderSchema,
    params: updateAppointmentStatusSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Appointment status updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Appointment status changed successfully" }),
            data: z.any(), // Buraya istersen güncellenmiş randevu şemasını ekleyebilirsin
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid status value or IDs)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Invalid status value provided" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Appointment or Business not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The specific appointment record was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.patch(
  "/:businessId/appointments/:appointmentId/status",
  validate(
    z.object({
      body: updateAppointmentStatusSchema.shape.body,
      headers: updateAppointmentHeaderSchema,
      params: updateAppointmentStatusSchema.shape.params,
    }),
  ),
  updateAppointmentStatusHandler,
);

// getBusinessDashboard /api/businesses/:businessId/dashboard GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses/{businessId}/dashboard",
  summary: "Get a business dashboard by business ID",
  tags: ["Business"],
  request: {
    headers: getBusinessDashboardSchema.shape.headers,
    params: getBusinessDashboardSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Business dashboard retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({
              example: "Dashboard statistics fetched successfully",
            }),
            data: z.any(), // Dashboard verilerinin (stats, counts vb.) olduğu şema
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Business not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "Business records not found for dashboard generation.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/:businessId/dashboard",
  validate(getBusinessDashboardSchema),
  getBusinessDashboardHandler,
);

// getBusinessesByUser /api/businesses/list GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses/list",
  summary: "Get all businesses by user ID",
  tags: ["Business"],
  request: {
    query: getBusinessesByUserRequestSchema.shape.query,
  },
  responses: {
    "200": {
      description: "Businesses retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Businesses listed successfully" }),
            data: z.array(z.any()), // Buraya BusinessSchema objeni array içinde koyabilirsin
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid query parameters)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in query parameters" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "404": {
      description: "No businesses found for this user",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "No businesses found associated with this user.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/list",
  validate(getBusinessesByUserRequestSchema),
  getBusinessesHandler,
);

// getBusinessById /api/businesses/detail/:businessId GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses/detail/{businessId}",
  summary: "Get a business by business ID",
  tags: ["Business"],
  request: {
    params: getBusinessByIdRequestSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Business retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Business details retrieved successfully" }),
            data: z.any(), // Buraya BusinessSchema objeni yerleştirebilirsin
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid businessId format)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Invalid business ID format" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "404": {
      description: "Business not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The business you are looking for was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/detail/:businessId",
  validate(getBusinessByIdRequestSchema),
  getBusinessDetailsHandler,
);

// Service Routes
// createService /api/businesses/services POST
businnessRegistry.registerPath({
  method: "post",
  path: "/api/businesses/services",
  summary: "Create a new service for a business",
  tags: ["Service"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createServiceBodySchema,
        },
      },
    },
    headers: createServiceHeaderSchema,
  },
  responses: {
    "201": {
      description: "Service created successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Service created successfully" }),
            data: z.any(), // Varsa ServiceSchema'nı buraya ekleyebilirsin
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid service data)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Service name and price are required" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.post(
  "/services",
  validate(createServiceRequestSchema),
  createServiceHandler,
);

// getServicesByBusiness /api/businesses/:businessId/services GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses/services",
  summary: "Get all services for a business",
  tags: ["Service"],
  request: {
    params: getServicesByBusinessParamsSchema,
    headers: getServicesByBusinessRequestSchema.shape.headers,
  },
  responses: {
    "200": {
      description: "Services retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Services fetched successfully" }),
            data: z.array(z.any()), // Buraya ServiceSchema array'ini koyabilirsin
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "No services found or business not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "No services found for this business." }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/services",
  validate(getServicesByBusinessRequestSchema),
  getServicesByBusinessHandler,
);

// updateService /api/businesses/services/:serviceId PATCH
businnessRegistry.registerPath({
  method: "patch",
  path: "/api/businesses/services/{serviceId}",
  summary: "Update a service by service ID",
  tags: ["Service"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateServiceBodySchema.shape.body,
        },
      },
    },
    headers: updateServiceBodySchema.shape.headers,
    params: updateServiceBodySchema.shape.params,
  },
  responses: {
    "200": {
      description: "Service updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Service updated successfully" }),
            data: z.any(), // Güncellenmiş hizmet verisi
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid body data or params)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Invalid data provided for service update" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Service not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The service you are trying to update was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.patch(
  "/services/:serviceId",
  validate(updateServiceBodySchema),
  updateServiceHandler,
);

// deleteService /api/businesses/services/:serviceId DELETE
businnessRegistry.registerPath({
  method: "delete",
  path: "/api/businesses/services/{serviceId}",
  summary: "Delete a service by service ID",
  tags: ["Service"],
  request: {
    headers: deleteServiceRequestSchema.shape.headers,
    params: deleteServiceRequestSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Service deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Service deleted successfully" }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - Missing user identification in headers",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Service not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The service you are trying to delete was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.delete(
  "/services/:serviceId",
  validate(deleteServiceRequestSchema),
  deleteServiceHandler,
);

// Appointment Routes
// getUserAppointments /api/businesses/user/appointments GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses/user/appointments",
  summary: "Get appointments for a user",
  tags: ["Appointment"],
  request: {
    headers: getUserAppointmentsSchema.shape.headers,
  },
  responses: {
    "200": {
      description: "User appointments retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "User appointments fetched successfully" }),
            data: z.array(appointmentResponseSchema),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - User identification missing",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "No appointments found for this user",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "No appointments found for the given user.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/appointments/user",
  validate(getUserAppointmentsSchema),
  getUserAppointmentsHandler,
);

// createAppointment /api/businesses/appointments POST
businnessRegistry.registerPath({
  method: "post",
  path: "/api/businesses/appointments",
  summary: "Create a new appointment for a business",
  tags: ["Appointment"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createAppointmentBodySchema,
        },
      },
    },
    headers: createAppointmentRequestSchema.shape.headers,
  },
  responses: {
    "201": {
      description: "Appointment created successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Appointment created successfully" }),
            data: appointmentResponseSchema,
          }),
        },
      },
    },
    "400": {
      description:
        "Validation error (Time slot taken, outside hours, or invalid data)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The selected time slot is already booked.",
            }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - User identification missing",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Business or Service not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The business or service record was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.post(
  "/appointments",
  validate(createAppointmentRequestSchema),
  createAppointmentHandler,
);

// getAvailability /api/businesses/appointments/availability GET
businnessRegistry.registerPath({
  method: "get",
  path: "/api/businesses/appointments/availability", // URL yolu
  summary: "Get available slots",
  tags: ["Appointment"],
  request: {
    // BURASI ÖNEMLİ: Body yerine query kullanıyoruz
    query: appointmentAvailabilityQuerySchema,
  },
  responses: {
    "200": {
      description: "Available slots for the given date retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Availability slots fetched successfully" }),
            data: z.object({
              businessId: z.string().openapi({ example: "bus_123" }),
              serviceId: z.string().openapi({ example: "ser_456" }),
              date: z.string().openapi({ example: "2026-02-25" }),
              timeSlots: z.array(
                z.object({
                  time: z.string().openapi({ example: "10:00" }),
                  startTime: z.string().openapi({ example: "10:00" }),
                  endTime: z.string().openapi({ example: "10:30" }),
                  isAvailable: z.boolean().openapi({ example: true }),
                }),
              ),
            }),
          }),
        },
      },
    },
    "400": {
      description: "Validation error (Invalid date format or missing IDs)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Invalid businessId or date format" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "404": {
      description: "Business or Service not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({
                example:
                  "The requested business or service could not be found.",
              }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({
                example: "Internal Server Error while calculating availability",
              }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.get(
  "/appointments/availability",
  validate(
    z.object({
      query: appointmentAvailabilityQuerySchema,
    }),
  ),
  getAvailabilityHandler,
);

// cancelAppointment /api/businesses/appointments/:appointmentId/cancel PATCH
businnessRegistry.registerPath({
  method: "patch",
  path: "/api/businesses/appointments/{appointmentId}/cancel",
  summary: "Cancel an appointment",
  tags: ["Appointment"],
  request: {
    headers: cancelAppointmentRequestSchema.shape.headers,
    params: cancelAppointmentRequestSchema.shape.params,
  },
  responses: {
    "200": {
      description: "Appointment cancelled successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Appointment has been cancelled successfully" }),
          }),
        },
      },
    },
    "400": {
      description: "Cancellation policy violation or invalid request",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ 
              example: "Cannot cancel appointment: Less than 2 hours remaining or appointment already passed." 
            }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    "401": {
      description: "Unauthorized - User identification missing",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "User ID is required in headers" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
    "404": {
      description: "Appointment not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "The appointment you are trying to cancel was not found." }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Internal Server Error during cancellation" }),
            status: z.number().openapi({ example: 500 }),
          }),
        },
      },
    },
  },
});
router.patch(
  "/appointments/:appointmentId/cancel",
  validate(cancelAppointmentRequestSchema),
  cancelAppointmentHandler,
);

export default router;
