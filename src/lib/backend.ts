import { PUBLIC_API_URL, PUBLIC_CDN_URL } from "$env/static/public"
import type { Paste } from "./models/paste"
import {
    PasteResponseError,
    type APIError,
    PasteError,
    PasteCDNError,
} from "./errors"
import type { NewDocument } from "./models/new"
import { DEFAULT_MIME, getType } from "./types"
import type { Config } from "./models/config"
import type { Document } from "./models/document"

const VERSION = 1

const BASE_API_URL = `${PUBLIC_API_URL.trim().replace(/\/$/, "")}/v${VERSION}`

const BASE_CDN_URL = `${PUBLIC_CDN_URL.trim().replace(/\/$/, "")}`

/* /paste endpoints */

export async function fetchPaste(
    svelteFetch: typeof fetch,
    id: string,
): Promise<Paste | null> {
    let response = await svelteFetch(`${BASE_API_URL}/pastes/${id}`)

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
    expiry?: Date | null
}

export async function uploadPaste(
    documents: NewDocument[],
    settings: UploadPasteSettings = {},
): Promise<Paste> {
    try {
        const formData = new FormData()

        let payload = {
            expiry_timestamp: settings.expiry,
        }

        formData.append(
            "payload",
            new Blob([JSON.stringify(payload)], { type: "application/json" }),
        )

        documents.forEach((doc) => {
            let mime = getType(doc.type)?.mime || DEFAULT_MIME

            formData.append(
                String(doc.id),
                new Blob([doc.content], { type: mime }),
                doc.name,
            )
        })

        const response = await fetch(`${BASE_API_URL}/pastes`, {
            method: "POST",
            mode: "cors",
            body: formData,
        })

        if (response.ok) {
            return await response.json()
        }

        let error: APIError
        try {
            error = await response.json()
        } catch {
            throw new PasteError(response.statusText)
        }

        throw PasteResponseError.fromAPIError(response.status, error)
    } catch (err) {
        if (err instanceof PasteResponseError) throw err

        let message = "Unknown Error"
        if (err instanceof Error) message = err.message

        throw new PasteError(message)
    }
}

/* /config endpoints */

export async function fetchConfig(svelteFetch: typeof fetch): Promise<Config> {
    let response = await svelteFetch(`${BASE_API_URL}/config`)

    let payload = await response.json()

    if (response.ok) {
        return payload
    } else {
        throw PasteResponseError.fromAPIError(response.status, payload)
    }
}

/* CDN endpoints */

export async function fetchDocumentContent(
    svelteFetch: typeof fetch,
    document: Document,
): Promise<string> {
    let response = await svelteFetch(
        `${BASE_CDN_URL}/documents/${document.paste_id}/${document.id}/${document.name}`,
    )

    let content = await response.text()

    if (response.ok) {
        return content
    } else {
        throw new PasteCDNError(response.status, content)
    }
}
