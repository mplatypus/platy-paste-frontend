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
        let invalidSnowflakeError = new PasteError(
            "The snowflake provided is invalid.",
        )
        error(400, {
            message: invalidSnowflakeError.message,
            error: invalidSnowflakeError,
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
                    error: err,
                    paste_id: undefined,
                })
            }
            if (err instanceof PasteHTTPError) {
                return error(err.status, {
                    message: err.message,
                    error: err,
                    paste_id: undefined,
                })
            }
            return error(500, {
                message: err.message,
                error: err,
                paste_id: undefined,
            })
        }

        let unknownError = new PasteUnknownError("Unknown Error")

        return error(500, {
            message: unknownError.message,
            error: unknownError,
            paste_id: undefined,
        })
    }

    if (paste == null) {
        let notFoundError = new PasteNotFoundError(
            "Paste not found.",
            `The paste with the ID: ${params.id} was not found.`,
        )
        return error(404, {
            message: notFoundError.message,
            error: notFoundError,
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
                        error: err,
                        paste_id: undefined,
                    })
                }
                if (err instanceof PasteHTTPError) {
                    return error(err.status, {
                        message: err.message,
                        error: err,
                        paste_id: undefined,
                    })
                }
                return error(500, {
                    message: err.message,
                    error: err,
                    paste_id: undefined,
                })
            }

            let unknownError = new PasteUnknownError("Unknown Error")

            return error(500, {
                message: unknownError.message,
                error: unknownError,
                paste_id: undefined,
            })
        }

        if (document == null) {
            let notFoundError = new PasteNotFoundError(
                "Document not found.",
                `The document with the ID: ${doc.id} was not found.`,
            )
            return error(404, {
                message: notFoundError.message,
                error: notFoundError,
                paste_id: params.id,
            })
        }

        doc_contents[doc.id] = document
    }

    return { paste: paste, contents: doc_contents }
}
