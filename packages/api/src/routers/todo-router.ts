import { newTodoSchema } from "@/common/models/todo-models"
import { Hono } from "hono"
import { validator } from "hono/validator"
import { ZodSchema } from "zod"
import { TodoService } from "../services/todo-service"
// TODO parse response with zod

export function buildTodoRouter(service: TodoService) {
    const router = new Hono()

    router.get("/todos", async (c) => {
        const todos = await service.getTodos()
        c.json(todos)
    })

    router.get("/todos/:id", async (c) => {
        const { id } = c.req.param()
        const todo = await service.getTodo(id)
        c.json(todo)
    })

    router.post("/todos", validatePayload(newTodoSchema), async (c) => {
        const newTodo = c.req.valid("json")
        await service.createTodo({
            title: newTodo.title
        })

        return c.status(201)
    })

    return router
}

function validatePayload<T extends ZodSchema>(schema: T) {
    return validator("json", (value, c) => {
        const parsed = schema.safeParse(value)
        if (!parsed.success) {
            return c.text("Invalid!", 401)
        }
        return parsed.data
    })
}
