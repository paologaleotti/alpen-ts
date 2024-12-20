import { Context } from "hono"
import { createMiddleware } from "hono/factory"
import { HTTPResponseError } from "hono/types"
import { validator } from "hono/validator"
import { z, ZodSchema } from "zod"
import { fromError } from "zod-validation-error"
import { ApplicationError } from "../utils/app-error"
import { logger } from "../utils/logger"
import { serverError } from "./errors"
import { ApiError, HttpStatus } from "./types"

/**
 * `validateBody` accepts a Zod schema,
 * parses it against the JSON body and replies
 * with a Bad Request error if it is invalid.
 */
export function validateBody<T extends ZodSchema>(schema: T) {
    // https://hono.dev/docs/guides/validation
    return validator("json", (value): z.infer<T> | Response => {
        const parsed = schema.safeParse(value)
        if (parsed.success) {
            return parsed.data
        }

        const message = fromError(parsed.error).toString()
        throw serverError("InvalidRequest", `Invalid body. ${message}`)
    })
}

/**
 * `validateQuery` accepts a Zod schema,
 * parses it against the query parameters and replies
 * with a Bad Request error if it is invalid.
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
    // https://hono.dev/docs/guides/validation
    return validator("query", (value): z.infer<T> | Response => {
        const parsed = schema.safeParse(value)
        if (parsed.success) {
            return parsed.data
        }

        const message = fromError(parsed.error).toString()
        throw serverError("InvalidRequest", `Invalid query params. ${message}`)
    })
}

/**
 * `loggerMiddleware` is a Hono middleware that logs the request method, status, path and duration of the request in milliseconds.
 */
export const loggerMiddleware = createMiddleware(async (c, next) => {
    const start = Date.now()
    const reqId = crypto.randomUUID()

    logger.info("request", {
        method: c.req.method,
        path: c.req.path,
        reqId
    })

    await next()
    const ms = Date.now() - start

    logger.log(c.res.status < 400 ? "info" : "error", "response", {
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        ms,
        reqId
    })
})

export const handleRouteNotFound = () => {
    throw serverError("RouteNotFound", "The requested route is invalid or not mounted")
}

/**
 * `handleErrors` catches unhandled exceptions and
 * renders them to the client using the provided status mapper.
 * If the error is unknown, it will log the error and return a 500 status by default.
 * The stack trace is only returned in dev environment.
 */
export function handleErrors<T extends string>(
    mapper: (err: ApplicationError<T>) => HttpStatus
) {
    return (err: Error | HTTPResponseError, c: Context) => {
        if (err instanceof ApplicationError) {
            const status = mapper(err)
            return c.json<ApiError>(
                {
                    code: err.code,
                    message: err.message,
                    status
                },
                status
            )
        }

        logger.error("Unhandled error", err)
        return c.json<ApiError>(
            {
                code: "UnkownError",
                message: `${err.name}: ${err.message}`,
                status: HttpStatus.InternalError,
                stack: process.env.NODE_ENV !== "production" ? err.stack : undefined
            },
            HttpStatus.InternalError
        )
    }
}
