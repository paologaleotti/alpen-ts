import { Context } from "hono"
import { HTTPResponseError } from "hono/types"
import { validator } from "hono/validator"
import { ZodSchema } from "zod"
import { fromError } from "zod-validation-error"

/**
 * `validatePayload` accepts a Zod schema,
 * parses it against the JSON body and replies
 * with a 400 error if it is invalid.
 */
export function validatePayload<T extends ZodSchema>(schema: T) {
    // https://hono.dev/docs/guides/validation
    return validator("json", (value, c) => {
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
