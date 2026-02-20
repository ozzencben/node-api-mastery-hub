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
      content: {
        "application/json": {
          schema: createUserSchema.shape.body,
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
            $ref: "#/components/schemas/User",
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
      description: "List of users",
      content: {
        "application/json": {
          schema: {
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
              },
            },
          },
        },
      },
    },
  },
});
router.get("/", validate(getUserQuerySchema), getUser);

export default router;
