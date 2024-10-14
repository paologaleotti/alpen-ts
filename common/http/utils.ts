import { Context } from "hono"
import { createMiddleware } from "hono/factory"
import { HTTPResponseError } from "hono/types"
import { validator } from "hono/validator"
import { z, ZodSchema } from "zod"
import { fromError } from "zod-validation-error"
import { ServiceError } from "../utils/errors"
import { logger } from "../utils/logger"
import { ApiError, HttpStatus } from "./types"

/**
 * `validatePayload` accepts a Zod schema,
 * parses it against the JSON body and replies
 * with a Bad Request error if it is invalid.
 */
export function validatePayload<T extends ZodSchema>(schema: T) {
    return validator("json", (value, c): z.infer<T> | Response => {
        const parsed = schema.safeParse(value)
        if (!parsed.success) {
            const message = fromError(parsed.error).toString()
            return c.json<ApiError>(
                {
                    code: "InvalidRequest",
                    message,
                    status: HttpStatus.BadRequest
                },
                HttpStatus.BadRequest
            )
        }
        return parsed.data
    })
}

/**
 * `handleErrors` catches unhandled exceptions and
 * renders them to the client using the provided status mapper
 */
export function handleErrors<T extends string>(
    mapper: (err: ServiceError<T>) => HttpStatus
) {
    return (err: Error | HTTPResponseError, c: Context) => {
        if (err instanceof ServiceError) {
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

        return c.json<ApiError>(
            {
                code: "UnkownError",
                message: err.message,
                status: HttpStatus.InternalError
            },
            HttpStatus.InternalError
        )
    }
}

/**
 * `loggerMiddleware` is a Hono middleware that logs the request method, status, path and duration
 * of the request in milliseconds.
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
