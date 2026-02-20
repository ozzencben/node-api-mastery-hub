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

export default router;
