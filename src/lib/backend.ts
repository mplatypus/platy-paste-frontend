import { PUBLIC_API_URL } from "$env/static/public"
import type { Paste } from "./models/paste"
import { PasteResponseError, type APIError, PasteError } from "./errors"
import type { NewDocument } from "./models/new"
import { DEFAULT_MIME, getType } from "./types"

const VERSION = 1

const BASE_API_URL = `${PUBLIC_API_URL.trim().replace(/\/$/, "")}/v${VERSION}`

/* /paste endpoints */

export async function fetchPaste(
    svelteFetch: typeof fetch,
    id: string,
    content: boolean,
): Promise<Paste | null> {
    let response = await svelteFetch(
        `${BASE_API_URL}/pastes/${id}?content=${content}`,
    )

    let payload = await response.json()

    if (response.ok) {
        return payload
    } else if (response.status == 404) {
        return null
    } else {
        throw PasteResponseError.fromAPIError(response.status, payload)
    }
}

interface UploadPasteSettings {
    content?: boolean
    expiry?: number
}

export async function uploadPaste(
    documents: NewDocument[],
    settings: UploadPasteSettings = {},
): Promise<Paste> {
    try {
        const formData = new FormData()

        let payload = {
            expiry: settings.expiry,
        }

        formData.append(
            "payload",
            new Blob([JSON.stringify(payload)], { type: "application/json" }),
        )

        documents.forEach((doc) => {
            let mime = getType(doc.type)?.mime || DEFAULT_MIME

            formData.append(doc.name, new Blob([doc.content], { type: mime }))
        })

        let query = ""

        if (settings.content != undefined) {
            query = `?content=${settings.content}`
        }

        const response = await fetch(`${BASE_API_URL}/pastes${query}`, {
            method: "POST",
            mode: "cors",
            body: formData,
        })

        if (response.ok) {
            return await response.json()
        }

        let error: APIError = await response.json()

        throw PasteResponseError.fromAPIError(response.status, error)
    } catch (err) {
        if (err instanceof PasteResponseError) throw err

        let message = "Unknown Error"
        if (err instanceof Error) message = err.message

        throw new PasteError(message)
    }
}
