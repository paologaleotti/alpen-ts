import { buildDbInstance } from "@/common/storage/db-config"
import { TodoStoragePg } from "@/common/storage/todo/todo-storage-impl"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { buildTodoRouter } from "./routers/todo-router"
import { TodoService } from "./services/todo-service"

export function buildServer() {
    const app = new Hono()

    const dbInstance = buildDbInstance({
        host: "localhost",
        user: "postgres",
        database: "postgres",
        password: "postgres",
        port: 5432,
        max: 10
    })

    const todoStorage = new TodoStoragePg(dbInstance)
    const todoService = new TodoService(todoStorage)

    const todoRouter = buildTodoRouter(todoService)

    // TODO HANDLE PANICS
    app.use(logger())
    app.route("/", todoRouter)

    return app
}
