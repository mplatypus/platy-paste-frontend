import { PUBLIC_API_URL } from "$env/static/public"
import { toISO8601Timestamp } from "./common"
import * as errors from "./errors"
import type { BuiltRoute } from "./routes"

const VERSION = 1

const BASE_API_URL = `${PUBLIC_API_URL.trim().replace(/\/$/, "")}/v${VERSION}`

export type Method = "GET" | "POST" | "PATCH" | "DELETE"

interface RequestParameters {
    query?: Record<string, any>
    headers?: Record<string, any>
    body?: BodyInit
    optional: boolean
}

interface RateLimitHeaders {
    limit?: number
    remaining?: number
    reset?: Date
    resetAfter?: number
    bucketType: BucketType
    bucketName?: string
    bucket?: string
    global: boolean
}

enum BucketType {
    Basic,
    Leaky,
    Sliding,
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseRateLimitHeaders(headers: Headers): RateLimitHeaders {
    let limitHeader = headers.get("X-RateLimit-Limit")
    let limit = undefined
    if (limitHeader != null) {
        limit = Number(limitHeader)
    }

    let remainingHeader = headers.get("X-RateLimit-Remaining")
    let remaining = undefined
    if (remainingHeader != null) {
        remaining = Number(remainingHeader)
    }

    let resetHeader = headers.get("X-RateLimit-Reset")
    let reset = undefined
    if (resetHeader != null) {
        reset = new Date(Number(resetHeader))
    }

    let resetAfterHeader = headers.get("X-RateLimit-Reset-After")
    let resetAfter = undefined
    if (resetAfterHeader != null) {
        resetAfter = Number(resetAfterHeader)
    }

    let bucketTypeHeader = headers.get("X-RateLimit-Bucket-Type")
    let bucketType = BucketType.Basic
    if (bucketTypeHeader != null) {
        switch (bucketTypeHeader) {
            default:
                bucketType = BucketType.Basic
                break
            case "LEAKY":
                bucketType = BucketType.Leaky
                break
            case "SLIDING":
                bucketType = BucketType.Sliding
                break
        }
    }

    let bucketNameHeader = headers.get("X-RateLimit-Bucket-Name")
    let bucketName = undefined
    if (bucketNameHeader != null) {
        bucketName = bucketNameHeader
    }

    let bucketHeader = headers.get("X-RateLimit-Bucket-Name")
    let bucket = undefined
    if (bucketHeader != null) {
        bucket = bucketHeader
    }

    let global = headers.has("X-RateLimit-Global")

    return {
        limit,
        remaining,
        reset,
        resetAfter,
        bucketType,
        bucketName,
        bucket,
        global,
    }
}

function queryParamBuilder(params: { [key: string]: any }): string {
    var isFirst = true
    var isMultiple = false

    var finalParams = ""
    for (const key in params) {
        const value = params[key]

        if (value == undefined) {
            continue
        }

        if (isFirst) {
            finalParams += "?"
            isFirst = false
        }

        if (isMultiple) {
            finalParams += `&${key}=${value}`
        } else {
            finalParams += `${key}=${value}`
            isMultiple = true
        }
    }

    return finalParams
}

export async function requestHandler<T>(
    svelteFetch: typeof fetch,
    route: BuiltRoute,
    parameters?: RequestParameters & { optional: true },
): Promise<string | null>
export async function requestHandler<T>(
    svelteFetch: typeof fetch,
    route: BuiltRoute,
    parameters: RequestParameters & { optional: false },
): Promise<string>
export async function requestHandler(
    svelteFetch: typeof fetch,
    route: BuiltRoute,
    parameters: RequestParameters = { optional: true },
): Promise<string | null> {
    let remaining: number | undefined = undefined
    let reset: Date | undefined = undefined
    if (localStorage != null && localStorage.getItem != null) {
        let limit = localStorage.getItem(route.route.toString())
        if (limit != null) {
            let limitParser =
                /^(?<remaining>[0-9]+)#(?<reset>[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2})$/

            let regex = limitParser.exec(limit)

            if (regex != null && regex.groups != undefined) {
                remaining = Number(regex.groups.remaining)
                reset = new Date(regex.groups.reset)
            }
        }
    }

    let current = new Date()
    if (
        remaining != undefined &&
        remaining <= 0 &&
        reset != undefined &&
        reset.valueOf() < current.valueOf()
    ) {
        let resets_at = reset.valueOf() - current.valueOf()

        if (resets_at > 10) {
            throw new errors.PasteTimeoutError(route.route, reset)
        } else {
            await sleep(resets_at)
        }
    }

    let requestParams: RequestInit = {
        method: route.route.method,
    }

    let queryParams = ""
    if (parameters != undefined) {
        if (parameters.query != undefined) {
            queryParams = queryParamBuilder(parameters.query)
        }

        requestParams.headers = parameters.headers
        requestParams.body = parameters.body
    }

    let headers: Record<string, any> = {}
    if (parameters.headers != undefined) {
        headers = parameters.headers
    }

    requestParams.headers = headers

    let response = await svelteFetch(
        BASE_API_URL + route.built_path + queryParams,
        requestParams,
    )

    let rateLimitHeaders = parseRateLimitHeaders(response.headers)

    if (
        localStorage != null &&
        rateLimitHeaders.remaining != undefined &&
        rateLimitHeaders.reset != undefined
    ) {
        localStorage.setItem(
            route.route.toString(),
            `${rateLimitHeaders.remaining}#${toISO8601Timestamp(rateLimitHeaders.reset)}`,
        )
    }

    switch (response.status) {
        case 200:
            return await response.text()
        case 204:
            let optional = parameters?.optional ?? true

            if (optional) return null as any
            if (!optional)
                throw new errors.PasteError(
                    "Expected a response, but received nothing.",
                ) // FIXME: This should really be set to true.
        case 400:
            throw errors.PasteBadRequestError.fromHTTPError(
                await response.json(),
            )
        case 401:
            throw errors.PasteUnauthorizedError.fromHTTPError(
                await response.json(),
            )
        case 403:
            throw errors.PasteForbiddenError.fromHTTPError(
                await response.json(),
            )
        case 404:
            throw errors.PasteNotFoundError.fromHTTPError(await response.json())
        case 413:
            throw errors.PasteTooLargeError.fromHTTPError(await response.json())
        case 415:
            throw errors.PasteUnsupportedMediaError.fromHTTPError(
                await response.json(),
            )
        case 429:
            throw errors.PasteRateLimitError.fromHTTPError(
                await response.json(),
            )
        case 500:
            throw errors.PasteInternalServerError.fromHTTPError(
                await response.json(),
            )
        default:
            console.warn(response.status, await response.text())

            if (response.headers.get("Content-Type") === "application/json") {
                throw errors.PasteHTTPError.fromUnknownHTTPError(
                    response.status,
                    await response.json(),
                )
            }
            throw new errors.PasteHTTPError(
                response.status,
                "An unhandled response type was received.",
                null,
                undefined,
            )
    }
}
