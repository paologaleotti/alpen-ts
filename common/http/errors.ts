import { ApplicationError } from "../utils/app-error"

export type ServerErrors = "RouteNotFound" | "InvalidRequest"

export function serverError(
    code: ServerErrors,
    message: string
): ApplicationError<ServerErrors> {
    return new ApplicationError(code, message)
}
