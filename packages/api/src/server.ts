import { HttpStatus } from "@/common/http/types"
import { handleErrors, handleRouteNotFound, loggerMiddleware } from "@/common/http/utils"
import { buildDbInstance } from "@/common/storage/db-config"
import { TodoStoragePg } from "@/common/storage/todo/todo-storage-impl"
import { ApplicationError } from "@/common/utils/app-error"
import { Hono } from "hono"
import { match } from "ts-pattern"
import z from "zod"
import { AllErrors } from "./errors"
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
    app.notFound(handleRouteNotFound)
    app.onError(handleErrors(mapErrorStatus))

    app.route("/", todoRouter)

    return app
}

const mapErrorStatus = (err: ApplicationError<AllErrors>): HttpStatus =>
    match(err.code)
        .with("GenericError", () => HttpStatus.InternalError)
        .with("InvalidRequest", () => HttpStatus.BadRequest)
        .with("RouteNotFound", "ItemNotFound", () => HttpStatus.NotFound)
        .with("ForbiddenAction", () => HttpStatus.Forbidden)
        .with("TodoAlreadyExists", () => HttpStatus.Conflict)
        .exhaustive()

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PG_HOST: z.string().default("localhost"),
    PG_USER: z.string().default("postgres"),
    PG_PASSWORD: z.string().default("postgres"),
    PG_DATABASE: z.string().default("postgres"),
    PG_PORT: z.number().default(5432)
})
