import { z } from "zod";
import { taskRegistry } from "../../core/lib/swagger";
import { TaskStatus, TaskPriority, TaskCategory } from "@prisma/client";

export const TaskSchema = taskRegistry.register(
  "Task",
  z.object({
    id: z
      .string()
      .uuid()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    title: z.string().min(3).openapi({ example: "Review API-Hub Docs" }),
    description: z
      .string()
      .optional()
      .openapi({ example: "Go through the new task module endpoints" }),

    // Enum'ları bu şekilde geçmek Swagger'da dropdown (açılır menü) olarak görünmesini sağlar
    status: z.nativeEnum(TaskStatus).openapi({ example: "IN_PROGRESS" }),
    priority: z.nativeEnum(TaskPriority).openapi({ example: "HIGH" }),
    category: z.nativeEnum(TaskCategory).openapi({ example: "WORK" }),

    // OpenAPI'da tarihlerin string (ISO8601) olduğunu belirtmek için:
    dueDate: z
      .string()
      .datetime()
      .optional()
      .openapi({ example: "2026-03-01T10:00:00Z" }),
    createdAt: z
      .string()
      .datetime()
      .openapi({ example: "2026-02-22T14:00:00Z" }),
    updatedAt: z
      .string()
      .datetime()
      .openapi({ example: "2026-02-22T14:00:00Z" }),
  }),
);

export const TaskHeaderSchema = z.object({
  "x-user-id": z
    .string()
    .uuid()
    .openapi({ example: "b5f9733e-16a2-461e-ac9a-c0d60425ff35" }),
});

export const TaskQuerySchema = z.object({
  status: z
    .nativeEnum(TaskStatus)
    .optional()
    .openapi({ example: "IN_PROGRESS" }),
  priority: z.nativeEnum(TaskPriority).optional().openapi({ example: "HIGH" }),
  category: z.nativeEnum(TaskCategory).optional().openapi({ example: "WORK" }),
  page: z.coerce.number().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().min(1).max(100).default(10).openapi({ example: 10 }),
});

export const CreateTaskSchema = z
  .object({
    ...TaskSchema.shape,
  })
  .pick({
    title: true,
    description: true,
    status: true,
    priority: true,
    category: true,
    dueDate: true,
  });

export const CreateTaskRequestSchema = z.object({
  headers: TaskHeaderSchema,
  body: CreateTaskSchema,
});

export const UpdateTaskSchema = z.object({
  body: CreateTaskSchema.partial(),
  params: z.object({
    taskId: z
      .string()
      .uuid()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  }),
  headers: TaskHeaderSchema,
});

export const GetAllTasksSchema = z.object({
  query: TaskQuerySchema,
  headers: TaskHeaderSchema,
});

export const DeleteTaskSchema = z.object({
  headers: TaskHeaderSchema,
  params: z.object({
    taskId: z
      .string()
      .uuid()
      .openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
  }),
});
