import { ServerErrors } from "@/common/http/errors"
import { ApplicationError } from "@/common/utils/app-error"

export type AllErrors = ServiceErrors | ServerErrors

export type ServiceErrors =
    | "GenericError"
    | "ForbiddenAction"
    | "ItemNotFound"
    | "TodoAlreadyExists" // example of a custom error code

export function serviceError(
    code: ServiceErrors,
    message: string
): ApplicationError<ServiceErrors> {
    return new ApplicationError(code, message)
}
