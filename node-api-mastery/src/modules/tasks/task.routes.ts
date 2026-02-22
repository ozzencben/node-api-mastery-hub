import { Router } from "express";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  taskStats,
} from "./tasks.controller";
import { validate } from "../../core/middlewares/validate";
import {
  CreateTaskRequestSchema,
  TaskSchema,
  GetAllTasksSchema,
  UpdateTaskSchema,
  DeleteTaskSchema,
  TaskHeaderSchema,
} from "./task.schema";
import { taskRegistry } from "../../core/lib/swagger";
import { z } from "zod";

const router = Router();

// createTask /api/tasks POST
taskRegistry.registerPath({
  method: "post",
  path: "/api/tasks",
  summary: "Create a new task",
  tags: ["Task"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTaskRequestSchema.shape.body,
        },
      },
    },
    headers: CreateTaskRequestSchema.shape.headers,
  },
  responses: {
    201: {
      description: "Task created successfully",
      content: {
        "application/json": {
          schema: TaskSchema,
        },
      },
    },
    400: {
      description: "Validation Error / Database Constraint",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "title: Required, x-user-id: Invalid UUID" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    404: {
      description: "User not found or Record not found",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The record you are looking for was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
  },
});
router.post("/", validate(CreateTaskRequestSchema), createTask);

// getAllTasks /api/tasks GET
taskRegistry.registerPath({
  method: "get",
  path: "/api/tasks",
  summary: "Get all tasks",
  tags: ["Task"],
  request: {
    headers: GetAllTasksSchema.shape.headers,
    query: GetAllTasksSchema.shape.query,
  },
  responses: {
    200: {
      description: "Tasks fetched successfully with pagination information.",
      content: {
        "application/json": {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: "Tasks fetched successfully" }),
            tasks: z.array(TaskSchema), // Daha önce tanımladığımız ana Task şeması
            pagination: z.object({
              total: z.number().openapi({ example: 42 }),
              page: z.number().openapi({ example: 1 }),
              limit: z.number().openapi({ example: 10 }),
              totalPages: z.number().openapi({ example: 5 }),
            }),
          }),
        },
      },
    },
    400: {
      description: "Validation Error (Invalid Enum values or query parameters)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example:
                "status: Invalid option: expected one of 'TODO'|'IN_PROGRESS'...",
            }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized (Missing or invalid x-user-id header)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Unauthorized" }),
            status: z.number().openapi({ example: 401 }),
          }),
        },
      },
    },
  },
});
router.get("/", validate(GetAllTasksSchema), getAllTasks);

// updateTask /api/tasks/:taskId PATCH
taskRegistry.registerPath({
  method: "patch",
  path: "/api/tasks/{taskId}",
  summary: "Update a task",
  tags: ["Task"],
  request: {
    headers: UpdateTaskSchema.shape.headers,
    params: UpdateTaskSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: UpdateTaskSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Task updated successfully.",
      content: {
        "application/json": {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: "Task updated successfully" }),
            task: TaskSchema, // Güncellenmiş görevin son hali
          }),
        },
      },
    },
    400: {
      description:
        "Validation Error (Invalid UUID, Enum values or Body format)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "taskId: Invalid UUID, status: Invalid option...",
            }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
    404: {
      description: "Task not found or not owned by the user",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The record you are looking for was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
  },
});
router.patch("/:taskId", validate(UpdateTaskSchema), updateTask);

// deleteTask /api/tasks/:taskId DELETE
taskRegistry.registerPath({
  method: "delete",
  path: "/api/tasks/{taskId}",
  summary: "Delete a task",
  tags: ["Task"],
  request: {
    headers: DeleteTaskSchema.shape.headers,
    params: DeleteTaskSchema.shape.params,
  },
  responses: {
    200: {
      description: "Task deleted successfully.",
      content: {
        "application/json": {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: "Task deleted successfully" }),
          }),
        },
      },
    },
    404: {
      description: "Task not found or not owned by the user",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({
              example: "The record you are looking for was not found.",
            }),
            status: z.number().openapi({ example: 404 }),
          }),
        },
      },
    },
  },
});
router.delete("/:taskId", validate(DeleteTaskSchema), deleteTask);

// taskStats /api/tasks/stats GET
taskRegistry.registerPath({
  method: "get",
  path: "/api/tasks/stats",
  summary: "Get task dashboard statistics",
  tags: ["Task"],
  request: {
    headers: TaskHeaderSchema,
  },
  responses: {
    200: {
      description: "Task statistics fetched successfully.",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().openapi({ example: "Task stats fetched successfully" }),
            stats: z.object({
              total: z.number().openapi({ example: 1 }),
              byStatus: z.array(z.object({
                type: z.string().openapi({ example: "ARCHIVED" }),
                count: z.number().openapi({ example: 1 })
              })),
              byPriority: z.array(z.object({
                type: z.string().openapi({ example: "HIGH" }),
                count: z.number().openapi({ example: 1 })
              })),
              byCategory: z.array(z.object({
                type: z.string().openapi({ example: "WORK" }),
                count: z.number().openapi({ example: 1 })
              })),
              overdue: z.number().openapi({ example: 1 }),
              overdueTasks: z.array(z.object({
                title: z.string().openapi({ example: "Review API-Hub Docs" }),
                dueDate: z.string().openapi({ example: "2026-02-01T10:00:00.000Z" })
              }))
            }),
          }),
        },
      },
    },
    400: {
      description: "Validation Error (Missing x-user-id)",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "x-user-id: Invalid input" }),
            status: z.number().openapi({ example: 400 }),
          }),
        },
      },
    },
  },
});

router.get(
  "/stats",
  validate(z.object({ headers: TaskHeaderSchema })),
  taskStats
);

export default router;
