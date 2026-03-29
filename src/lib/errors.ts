import type { Route } from "./routes"

/**
 * API Error
 *
 * @remarks
 * This is a response from the backend when a response fails.
 * Do note that this is not an actual error type. Use []
 *
 * @param reason - The reason the response failed.
 * @param trace - More information about the error.
 * @param timestamp - The time at which the error occurred.
 */
export interface APIError {
    reason: string
    trace: string | null
    timestamp: number
}

/**
 * Paste Error
 *
 * @remarks
 * This is a response from the backend when a response fails.
 *
 * @param message - The message that will be shown in the error.
 */
export class PasteError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "PasteError"
        Object.setPrototypeOf(this, PasteError.prototype)
    }
}

/**
 * Paste Unknown Error
 *
 * @remarks
 * This is a response when an error is unknown.
 *
 * @param message - The message that will be shown in the error.
 */
export class PasteUnknownError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "PasteUnknownError"
        Object.setPrototypeOf(this, PasteUnknownError.prototype)
    }
}

/**
 * Paste Timeout Error
 *
 * @remarks
 * This is a response returned when a rate limit will not reset in a reasonable amount of time.
 *
 * @param message - The message that will be shown in the error.
 */
export class PasteTimeoutError extends Error {
    route: Route
    reset: Date

    constructor(route: Route, reset: Date) {
        super(
            `The rate limit for ${route} will reset at ${reset} (${reset.valueOf()})`,
        )
        this.route = route
        this.reset = reset
        this.name = "PasteTimeoutError"
        Object.setPrototypeOf(this, PasteTimeoutError.prototype)
    }
}

/**
 * Paste CDN Error
 *
 * @remarks
 * This is a response from the backend when the CDN sends an error.
 *
 * @param message - The message that will be shown in the error.
 */
export class PasteCDNError extends PasteError {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.name = "PasteCDNError"
        Object.setPrototypeOf(this, PasteCDNError.prototype)
    }
}

/**
 * Paste HTTP Error
 *
 * @remarks
 * This is a response when a HTTP request fails.
 *
 * @param status - The status code of the HTTP Error.
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteHTTPError extends PasteError {
    status: number
    reason: string
    trace: string | null
    time?: Date

    constructor(
        status: number,
        reason: string,
        trace: string | null,
        timestamp?: number,
    ) {
        super(`Status Error (${status}): ${reason}`)
        this.status = status
        this.reason = reason
        this.trace = trace
        this.time = undefined
        if (timestamp != undefined) {
            this.time = new Date(timestamp)
        }
        this.name = "PasteHTTPError"
        Object.setPrototypeOf(this, PasteHTTPError.prototype)
    }

    /**
     * from Unknown HTTP Error.
     *
     * @remarks
     * Create a `PasteHTTPError` from an unknown `APIError`
     *
     * @param status - The status code for the HTTP error.
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteResponseError` built.
     */
    static fromUnknownHTTPError(
        status: number,
        api_error: APIError,
    ): PasteHTTPError {
        return new PasteHTTPError(
            status,
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Bad Request Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 400, bad request response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteBadRequestError extends PasteHTTPError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(400, reason, trace, timestamp)
        this.name = "PasteBadRequestError"
        Object.setPrototypeOf(this, PasteBadRequestError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteBadRequestError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteBadRequestError` built.
     */
    static fromHTTPError(api_error: APIError): PasteBadRequestError {
        return new PasteBadRequestError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Authentication Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 401 or 403, unauthorized or forbidden response.
 *
 * @param status - The status code of the HTTP Error.
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteAuthenticationError extends PasteHTTPError {
    constructor(
        status: number,
        reason: string,
        trace: string | null,
        timestamp?: number,
    ) {
        super(status, reason, trace, timestamp)
        this.name = "PasteAuthenticationError"
        Object.setPrototypeOf(this, PasteAuthenticationError.prototype)
    }

    /**
     * from Unknown HTTP Authentication Error.
     *
     * @remarks
     * Create a `PasteAuthenticationError` from a `APIError`
     *
     * @param status - The status code for the HTTP error.
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteAuthenticationError` built.
     */
    static fromUnknownHTTPAuthenticationError(
        status: number,
        api_error: APIError,
    ): PasteAuthenticationError {
        return new PasteAuthenticationError(
            status,
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Unauthorized Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 401, unauthorized response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteUnauthorizedError extends PasteAuthenticationError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(401, reason, trace, timestamp)
        this.name = "PasteUnauthorizedError"
        Object.setPrototypeOf(this, PasteUnauthorizedError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteUnauthorizedError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteUnauthorizedError` built.
     */
    static fromHTTPError(api_error: APIError): PasteUnauthorizedError {
        return new PasteUnauthorizedError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Forbidden Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 403, forbidden response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteForbiddenError extends PasteAuthenticationError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(403, reason, trace, timestamp)
        this.name = "PasteForbiddenError"
        Object.setPrototypeOf(this, PasteForbiddenError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteForbiddenError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteForbiddenError` built.
     */
    static fromHTTPError(api_error: APIError): PasteForbiddenError {
        return new PasteForbiddenError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Not Found Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 404, not found response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteNotFoundError extends PasteHTTPError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(404, reason, trace, timestamp)
        this.name = "PasteNotFoundError"
        Object.setPrototypeOf(this, PasteNotFoundError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteNotFoundError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteNotFoundError` built.
     */
    static fromHTTPError(api_error: APIError): PasteNotFoundError {
        return new PasteNotFoundError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Too Large Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 413, too large response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteTooLargeError extends PasteHTTPError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(413, reason, trace, timestamp)
        this.name = "PasteTooLargeError"
        Object.setPrototypeOf(this, PasteTooLargeError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteTooLargeError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteTooLargeError` built.
     */
    static fromHTTPError(api_error: APIError): PasteTooLargeError {
        return new PasteTooLargeError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Unsupported Media Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 415, unsupported media response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteUnsupportedMediaError extends PasteHTTPError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(415, reason, trace, timestamp)
        this.name = "PasteUnsupportedMediaError"
        Object.setPrototypeOf(this, PasteUnsupportedMediaError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteUnsupportedMediaError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteUnsupportedMediaError` built.
     */
    static fromHTTPError(api_error: APIError): PasteUnsupportedMediaError {
        return new PasteUnsupportedMediaError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Rate Limit Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 429, rate limit response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteRateLimitError extends PasteHTTPError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(429, reason, trace, timestamp)
        this.name = "PasteRateLimitError"
        Object.setPrototypeOf(this, PasteRateLimitError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteRateLimitError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteRateLimitError` built.
     */
    static fromHTTPError(api_error: APIError): PasteRateLimitError {
        return new PasteRateLimitError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

/**
 * Paste Internal Server Error
 *
 * @remarks
 * This is a response when a HTTP request returns a 500, internal server response.
 *
 * @param message - The message that will be shown in the error.
 * @param trace - If provided, the trace message of the HTTP request.
 * @param timestamp - If provided, the timestamp this error occurred.
 */
export class PasteInternalServerError extends PasteHTTPError {
    constructor(reason: string, trace: string | null, timestamp?: number) {
        super(500, reason, trace, timestamp)
        this.name = "PasteInternalServerError"
        Object.setPrototypeOf(this, PasteInternalServerError.prototype)
    }

    /**
     * from HTTP Error.
     *
     * @remarks
     * Create a `PasteInternalServerError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteInternalServerError` built.
     */
    static fromHTTPError(api_error: APIError): PasteInternalServerError {
        return new PasteInternalServerError(
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }
}

// TODO: Remove or replace this.
export class PasteUploadError extends PasteError {
    constructor(reason: string) {
        super(`Upload Failed: ${reason}`)
        this.name = "PasteUploadError"
        Object.setPrototypeOf(this, PasteUploadError.prototype)
    }
}
