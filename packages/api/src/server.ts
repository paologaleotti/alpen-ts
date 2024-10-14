import { loggerMiddleware, recoverPanic } from "@/common/http/utils"
import { logger } from "@/common/logger"
import { buildDbInstance } from "@/common/storage/db-config"
import { TodoStoragePg } from "@/common/storage/todo/todo-storage-impl"
import { Hono } from "hono"
import z from "zod"
import { buildTodoRouter } from "./routers/todo-router"
import { TodoService } from "./services/todo-service"

export function buildServer() {
    const app = new Hono()
    const env = envSchema.parse(process.env)
    logger.info("Loaded env", env)

    const dbInstance = buildDbInstance({
        host: env.PG_HOST,
        user: env.PG_USER,
        database: env.PG_DATABASE,
        password: env.PG_PASSWORD,
        port: env.PG_PORT,
        max: 10
    })

    const todoStorage = new TodoStoragePg(dbInstance)
    const todoService = new TodoService(todoStorage)

    const todoRouter = buildTodoRouter(todoService)

    app.use(loggerMiddleware)
    app.onError(recoverPanic)

    app.route("/", todoRouter)

    return app
}

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PG_HOST: z.string().default("localhost"),
    PG_USER: z.string().default("postgres"),
    PG_PASSWORD: z.string().default("postgres"),
    PG_DATABASE: z.string().default("postgres"),
    PG_PORT: z.number().default(5432)
})
