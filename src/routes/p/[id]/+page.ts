import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { fetchDocumentContent, fetchPaste } from "$lib/backend"
import {
    PasteError,
    PasteHTTPError,
    PasteNotFoundError,
    PasteTimeoutError,
    PasteUnknownError,
} from "$lib/errors"

const SUPPORTED_SNOWFLAKE = RegExp("^\\d{10,}$")

export const load: PageLoad = async ({ params, fetch }) => {
    if (!SUPPORTED_SNOWFLAKE.test(params.id)) {
        error(400, {
            message: "Invalid Snowflake",
            trace: "The snowflake provided is invalid.",
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

    if (paste == null) {
        return error(404, {
            message: "Paste not found.",
            trace: `The paste with the ID: ${params.id} was not found.`,
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

        if (document == null) {
            let notFoundError = new PasteNotFoundError(
                "Document not found.",
                `The document with the ID: ${doc.id} was not found.`,
            )
            return error(404, {
                message: "Document not found.",
                trace: `The document with the ID: ${doc.id} was not found.`,
                paste_id: params.id,
            })
        }

        doc_contents[doc.id] = document
    }

    return { paste: paste, contents: doc_contents }
}
