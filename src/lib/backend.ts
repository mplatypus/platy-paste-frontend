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
    name?: string | null
    expiry?: Date | null
    max_views?: number | null
}

interface UploadPasteBody {
    name?: string | null
    expiry_timestamp?: Date | null
    max_views?: number | null
    documents: UploadPasteDocumentBody[]
}

interface UploadPasteDocumentBody {
    id: number
    name: string
}

export async function uploadPaste(
    documents: NewDocument[],
    settings: UploadPasteSettings = {},
): Promise<Paste> {
    try {
        const formData = new FormData()

        let payload: UploadPasteBody = {
            name: settings.name,
            expiry_timestamp: settings.expiry,
            max_views: settings.max_views,
            documents: [],
        }

        let formDocuments: Record<number, Blob> = {}
        documents.forEach((document, index) => {
            let mime = getType(document.type)?.mime || DEFAULT_MIME

            payload.documents.push({
                id: index,
                name: document.name,
            })

            formDocuments[index] = new Blob([document.content], { type: mime })
        })

        formData.append(
            "payload",
            new Blob([JSON.stringify(payload)], { type: "application/json" }),
        )

        for (const [id, content] of Object.entries(formDocuments)) {
            formData.append(`files[${id}]`, content)
        }

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
