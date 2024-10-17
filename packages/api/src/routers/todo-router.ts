import { HttpStatus } from "@/common/http/types"
import { validateBody } from "@/common/http/utils"
import { newTodoSchema } from "@/common/models/todo-models"
import { Hono } from "hono"
import { TodoService } from "../services/todo-service"

// TODO parse response with zod ??

export function buildTodoRouter(service: TodoService) {
    const router = new Hono()

    router.get("/todos", async (c) => {
        const todos = await service.getTodos()
        return c.json(todos)
    })

    router.get("/todos/:id", async (c) => {
        const { id } = c.req.param()
        const todo = await service.getTodo(id)

        return c.json(todo)
    })

    router.post("/todos", validateBody(newTodoSchema), async (c) => {
        const newTodo = c.req.valid("json")
        await service.createTodo({
            title: newTodo.title
        })

        return c.body(null, HttpStatus.NoContent)
    })

    return router
}
