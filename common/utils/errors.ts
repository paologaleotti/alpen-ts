export class ServiceError<T extends string> extends Error {
    code: T

    constructor(code: T, message: string) {
        super(message)
        this.code = code
        this.name = ServiceError.name
    }
}
