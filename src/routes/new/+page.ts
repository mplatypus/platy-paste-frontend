import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { fetchConfig } from "$lib/backend"
import { PasteError, PasteHTTPError, PasteTimeoutError } from "$lib/errors"

export const load: PageLoad = async ({ fetch }) => {
    let config
    try {
        config = await fetchConfig(fetch)
    } catch (err) {
        if (err instanceof PasteError) {
            if (err instanceof PasteTimeoutError) {
                return error(429, {
                    name: err.name,
                    message: err.message,
                    trace: err.stack ?? null,
                    paste_id: undefined,
                })
            }
            if (err instanceof PasteHTTPError) {
                return error(err.status, {
                    name: err.name,
                    message: err.message,
                    trace: err.trace,
                    time: err.time,
                    paste_id: undefined,
                })
            }

            return error(500, {
                name: err.name,
                message: err.message,
                trace: err.stack ?? null,
                paste_id: undefined,
            })
        }

        if (err instanceof Error) {
            return error(500, {
                name: err.name,
                message: err.message,
                trace: err.stack ?? null,
                paste_id: undefined,
            })
        }

        return error(500, {
            name: "Unknown Error",
            message: String(err),
            trace: null,
            paste_id: undefined,
        })
    }

    return { config: config }
}
