export enum HttpStatus {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    ImATeapot = 418,
    InternalError = 500
}

export type ApiError = {
    code: string
    message: string
    status: HttpStatus
    stack?: string
}
