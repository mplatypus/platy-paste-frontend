import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { fetchPaste } from "$lib/backend"
import { PasteError, PasteResponseError } from "$lib/errors"

const SUPPORTED_SNOWFLAKE = RegExp("^\\d{10,}$")

export const load: PageLoad = async ({ params, fetch }) => {
    const boundFetch = fetch.bind(globalThis);
    if (!SUPPORTED_SNOWFLAKE.test(params.id)) {
        error(400, {
            message: "Invalid snowflake recieved.",
            trace: "The snowflake provided contains invalid characters or is too short.",
            timestamp: null,
            paste_id: params.id,
        })
    }

    let paste
    try {
        paste = await fetchPaste(boundFetch, params.id, true)
    } catch (err) {
        if (err instanceof PasteError) {
            if (err instanceof PasteResponseError) {
                return error(err.status, {
                    message: err.message,
                    trace: err.trace,
                    timestamp: err.timestamp,
                    paste_id: params.id,
                })
            }
            return error(501, {
                message: err.message,
                trace: null,
                timestamp: null,
                paste_id: params.id,
            })
        }

        let message = "Unknown Error"
        if (err instanceof Error) message = err.message

        return error(501, {
            message: message,
            trace: null,
            timestamp: null,
            paste_id: params.id,
        })
    }

    if (paste == null) {
        return error(404, {
            message: "Paste Not Found.",
            trace: "The paste provided could not be found.",
            timestamp: null,
            paste_id: params.id,
        })
    }

    return { paste: paste }
}
