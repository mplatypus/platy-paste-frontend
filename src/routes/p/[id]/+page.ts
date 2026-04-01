import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { fetchDocumentContent, fetchPaste } from "$lib/backend"
import { PasteError, PasteHTTPError, PasteTimeoutError } from "$lib/errors"

const SUPPORTED_SNOWFLAKE = RegExp("^\\d{10,}$")

export const load: PageLoad = async ({ params, fetch }) => {
    if (!SUPPORTED_SNOWFLAKE.test(params.id)) {
        error(400, {
            name: "Invalid Snowflake",
            message: "The snowflake provided was invalid.",
            trace: null,
            paste_id: params.id,
        })
    }

    let paste
    try {
        paste = await fetchPaste(fetch, params.id)
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

    if (paste == null) {
        return error(404, {
            name: "Not Found",
            message: "Paste not found.",
            trace: `The paste with the ID of \"${params.id}\" was not found.`,
            paste_id: params.id,
        })
    }

    let doc_contents: Record<string, string> = {}
    for (const doc of paste.documents) {
        let document
        try {
            document = await fetchDocumentContent(fetch, doc)
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

        if (document == null) {
            return error(404, {
                name: "Not Found",
                message: `The document with the ID: ${doc.id} was not found.`,
                trace: null,
                paste_id: params.id,
            })
        }

        doc_contents[doc.id] = document
    }

    return { paste: paste, contents: doc_contents }
}
