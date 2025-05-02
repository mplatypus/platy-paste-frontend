import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { fetchConfig } from "$lib/backend"
import { PasteError, PasteResponseError } from "$lib/errors"

export const load: PageLoad = async ({ fetch }) => {
    let config
    try {
        config = await fetchConfig(fetch)
    } catch (err) {
        if (err instanceof PasteError) {
            if (err instanceof PasteResponseError) {
                return error(err.status, {
                    message: err.message,
                    trace: err.trace,
                    timestamp: err.timestamp,
                    paste_id: null,
                })
            }
            return error(501, {
                message: err.message,
                trace: null,
                timestamp: null,
                paste_id: null,
            })
        }

        let message = "Unknown Error"
        if (err instanceof Error) message = err.message

        return error(501, {
            message: message,
            trace: null,
            timestamp: null,
            paste_id: null,
        })
    }

    if (config == null) {
        return error(404, {
            message: "Paste Not Found.",
            trace: "The paste provided could not be found.",
            timestamp: null,
            paste_id: null,
        })
    }

    return { config: config }
}
