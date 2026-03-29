import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { fetchConfig } from "$lib/backend"
import {
    PasteError,
    PasteHTTPError,
    PasteTimeoutError,
    PasteUnknownError,
} from "$lib/errors"

export const load: PageLoad = async ({ fetch }) => {
    let config
    try {
        config = await fetchConfig(fetch)
    } catch (err) {
        if (err instanceof PasteError) {
            if (err instanceof PasteTimeoutError) {
                return error(429, {
                    message: err.message,
                    trace: null,
                    paste_id: undefined,
                })
            }
            if (err instanceof PasteHTTPError) {
                return error(err.status, {
                    message: err.message,
                    trace: err.trace,
                    time: err.time,
                    paste_id: undefined,
                })
            }
            return error(500, {
                message: err.message,
                trace: null,
                paste_id: undefined,
            })
        }

        let unknownError = new PasteUnknownError("Unknown Error")

        return error(500, {
            message: unknownError.message,
            trace: null,
            paste_id: undefined,
        })
    }

    return { config: config }
}
