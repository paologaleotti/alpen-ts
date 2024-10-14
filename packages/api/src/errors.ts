import { ServiceError } from "@/common/utils/errors"

export type ErrorCodes =
    | "GenericError"
    | "ForbiddenAction"
    | "ItemNotFound"
    | "TodoAlreadyExists"

export function serviceError(
    code: ErrorCodes,
    message: string
): ServiceError<ErrorCodes> {
    return new ServiceError(code, message)
}
