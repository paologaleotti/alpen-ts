import { Context } from "hono"
import { createMiddleware } from "hono/factory"
import { HTTPResponseError } from "hono/types"
import { validator } from "hono/validator"
import { z, ZodSchema } from "zod"
import { fromError } from "zod-validation-error"
import { logger } from "../logger"

/**
 * `validatePayload` accepts a Zod schema,
 * parses it against the JSON body and replies
 * with a 400 error if it is invalid.
 */
export function validatePayload<T extends ZodSchema>(schema: T) {
    return validator("json", (value, c): z.infer<T> | Response => {
        const parsed = schema.safeParse(value)
        if (!parsed.success) {
            const message = fromError(parsed.error).toString()
            return c.text(message, 401) // TODO proper error types!!
        }
        return parsed.data
    })
}

/**
 * `recoverPanic` catches unhandled exceptions and
 * renders them to the client as a custom 500 error including the error message.
 */
export function recoverPanic(err: Error | HTTPResponseError, c: Context) {
    return c.text(`${err}`, 500) // TODO proper error types!!
}

/**
 * `loggerMiddleware` is a Hono middleware that logs the request method, status, path and duration
 * of the request in milliseconds.
 */
export const loggerMiddleware = createMiddleware(async (c, next) => {
    const start = Date.now()

    logger.info("request", {
        method: c.req.method,
        path: c.req.path
    })

    await next()
    const ms = Date.now() - start

    logger.log(c.res.status < 400 ? "info" : "error", "response", {
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        ms: ms
    })
})
