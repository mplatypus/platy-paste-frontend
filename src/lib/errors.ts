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
 * Paste Response Error.
 *
 * @remarks
 * This is sent when a response from the backend server fails.
 *
 * @param status - The status code for the response.
 * @param reason - The reason the response failed.
 * @param trace - More information about the error.
 * @param timestamp - The time at which the error occurred.
 */
export class PasteResponseError extends PasteError {
    status: number
    reason: string
    trace: string | null
    timestamp: number

    constructor(
        status: number,
        reason: string,
        trace: string | null,
        timestamp: number,
    ) {
        let time = Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(timestamp)
        super(`${reason} (${time}): ${trace}`)
        this.status = status
        this.name = "PasteError"
        this.reason = reason
        this.trace = trace
        this.timestamp = timestamp
        Object.setPrototypeOf(this, PasteResponseError.prototype)
    }

    /**
     * from API Error.
     *
     * @remarks
     * Create a `PasteResponseError` from a `APIError`
     *
     * @param api_error - The API Error to extract information from.
     * @returns The `PasteResponseError` built.
     */
    static fromAPIError(
        status: number,
        api_error: APIError,
    ): PasteResponseError {
        return new PasteResponseError(
            status,
            api_error.reason,
            api_error.trace,
            api_error.timestamp,
        )
    }

    toAPIError(): APIError {
        return {
            reason: this.reason,
            trace: this.trace,
            timestamp: this.timestamp,
        }
    }
}

export class PasteUploadError extends PasteError {
    constructor(reason: string) {
        super(`Upload Failed: ${reason}`)
        this.name = "PasteUploadError"
        Object.setPrototypeOf(this, PasteUploadError.prototype)
    }
}
