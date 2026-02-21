import { createUser, getUser } from "./user.controller";
import { Router } from "express";
import { getUserQuerySchema, createUserSchema } from "./user.schema";
import { validate } from "../../core/middlewares/validate";
import { userRegistry } from "../../core/lib/swagger";

const router = Router();

// createUser /api/users POST
userRegistry.registerPath({
  method: "post",
  path: "/api/users",
  summary: "Create a new user",
  tags: ["User"],
  request: {
    body: {
      description: "User registration details",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CreateUserInput" },
        },
      },
    },
  },
  responses: {
    "201": {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "User created successfully" },
              data: { $ref: "#/components/schemas/User" } // Başarılı olduğunda dönen veri
            },
          },
        },
      },
    },
    "400": {
      description: "Validation failed or user already exists",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "Email already in use or invalid input data" },
            },
          },
        },
      },
    },
  },
});

router.post("/", validate(createUserSchema), createUser);

// getUser /api/users GET
userRegistry.registerPath({
  method: "get",
  path: "/api/users",
  summary: "Get all users",
  tags: ["User"],
  responses: {
    "200": {
      description: "List of users retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              message: { type: "string", example: "Users retrieved successfully" },
              data: {
                type: "object",
                properties: {
                  users: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                  total: {
                    type: "number",
                    example: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: false },
              message: { type: "string", example: "An error occurred while fetching users" },
            },
          },
        },
      },
    },
  },
});

router.get("/", validate(getUserQuerySchema), getUser);

export default router;
