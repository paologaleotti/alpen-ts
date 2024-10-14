import { HttpStatus } from "@/common/http/types"
import { handleErrors, loggerMiddleware } from "@/common/http/utils"
import { buildDbInstance } from "@/common/storage/db-config"
import { TodoStoragePg } from "@/common/storage/todo/todo-storage-impl"
import { ServiceError } from "@/common/utils/errors"
import { Hono } from "hono"
import { match } from "ts-pattern"
import z from "zod"
import { ErrorCodes } from "./errors"
import { buildTodoRouter } from "./routers/todo-router"
import { TodoService } from "./services/todo-service"

export function buildServer() {
    const app = new Hono()
    const env = envSchema.parse(process.env)

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
    app.onError(handleErrors(mapErrorStatus))

    app.route("/", todoRouter)

    return app
}

const mapErrorStatus = (err: ServiceError<ErrorCodes>): HttpStatus =>
    match(err.code)
        .with("ForbiddenAction", () => HttpStatus.Forbidden)
        .with("ItemNotFound", () => HttpStatus.NotFound)
        .with("TodoAlreadyExists", () => HttpStatus.Conflict)
        .with("GenericError", () => HttpStatus.InternalError)
        .exhaustive()

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PG_HOST: z.string().default("localhost"),
    PG_USER: z.string().default("postgres"),
    PG_PASSWORD: z.string().default("postgres"),
    PG_DATABASE: z.string().default("postgres"),
    PG_PORT: z.number().default(5432)
})
