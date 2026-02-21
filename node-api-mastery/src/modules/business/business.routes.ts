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
    201: {
      description: "Business created successfully",
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
    200: {
      description: "Business retrieved successfully",
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
    200: {
      description: "Business updated successfully",
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
    200: {
      description: "Business deleted successfully",
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
    200: {
      description: "Appointments retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.array(appointmentResponseSchema),
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
    200: {
      description: "Appointment status updated successfully",
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
    200: {
      description: "Business dashboard retrieved successfully",
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
    200: {
      description: "Businesses retrieved successfully",
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
    200: {
      description: "Business retrieved successfully",
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
    201: {
      description: "Service created successfully",
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
    200: {
      description: "Services retrieved successfully",
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
    200: {
      description: "Service updated successfully",
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
    200: {
      description: "Service deleted successfully",
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
    200: {
      description: "Appointments for a user",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            data: z.array(appointmentResponseSchema),
            success: z.boolean(),
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
    201: {
      description: "Appointment created successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            data: appointmentResponseSchema, // İstersen buraya tam randevu şemasını da verebilirsin
          }),
        },
      },
    },
    400: {
      description:
        "Validation error, time slot taken, or outside working hours",
    },
    404: {
      description: "Business or Service not found",
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
    200: {
      description: "Available slots for the given date",
      content: {
        "application/json": {
          schema: z.object({
            businessId: z.string(),
            serviceId: z.string(),
            date: z.string(),
            timeSlots: z.array(
              z.object({
                time: z.string(),
                startTime: z.string(),
                endTime: z.string(),
                isAvailable: z.boolean(),
              }),
            ),
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
    200: {
      description: "Appointment cancelled successfully",
    },
    400: {
      description:
        "Less than 2 hours left until the appointment, or the appointment has already passed.",
    },
    404: {
      description: "Appointment not found",
    },
  },
});
router.patch(
  "/appointments/:appointmentId/cancel",
  validate(cancelAppointmentRequestSchema),
  cancelAppointmentHandler,
);

export default router;
